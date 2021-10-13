import React, { useEffect } from 'react';
import { Button, Divider, Input, message, Select } from 'antd';
import {
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
} from '@ant-design/icons';
import UserService from '../../../lib/UserService';
import firebase from 'firebase';
import { firebaseApp } from '../../firebase/firebase';
import './RegisterForm.scss';
import { brazilStates } from '../../../utils/constants';
import { CalendarOutlined } from '@ant-design/icons';

let { Option } = Select;

interface IProps {
  setIsRegistering: () => void;
}

const dateFormatRegex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;

const RegisterForm: React.FunctionComponent<IProps> = ({
  setIsRegistering,
}): JSX.Element => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [birthdayDateMsg, setBirthdayDateMsg] = React.useState(false);
  const [userName, setUserName] = React.useState('');
  const [userEmail, setUserEmail] = React.useState('');
  const [birthdayDate, setBirthdayDate] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [profession, setProfession] = React.useState('');
  const [confirmUserEmail, setConfirmUserEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [userConfirmationOfTerms] = React.useState(true);
  const [haveErrors, setHaveErrors] = React.useState({
    error: false,
    errorMessage: '',
  });

  const generateUFs = (): JSX.Element[] => {
    const statesElementsForSelect: JSX.Element[] = [];
    brazilStates.forEach((state) => {
      statesElementsForSelect.push(<Option value={state}>{state}</Option>);
    });

    return statesElementsForSelect;
  };

  //"auth/email-already-in-use" code error email in use
  const register = async (event: any): Promise<void> => {
    if (!userConfirmationOfTerms) {
      setHaveErrors({
        error: true,
        errorMessage: 'Você precisa aceitar os termos',
      });
      return;
    } else {
      setHaveErrors({
        error: false,
        errorMessage: '',
      });
    }

    checkEmailAndPasswordMatches();

    if (
      !userName ||
      !userEmail ||
      !birthdayDate ||
      !gender ||
      !city ||
      !state ||
      !profession
    ) {
      message.warn('Por favor, preencher todos os campos.', 4000);
      return;
    }
    if (haveErrors.error) {
      return;
    }

    setIsLoading(true);

    firebase
      .auth()
      .createUserWithEmailAndPassword(userEmail, password)
      .then((response) => {
        firebaseApp.auth().onAuthStateChanged((user) => {
          if (user) {
            user.sendEmailVerification();
            new UserService(user).registerNewUser({
              name: userName,
              email: userEmail,
              photoURL: '',
              userFirebaseId: user.uid,
              birthdayDate: birthdayDate,
              gender: gender,
              city: city,
              state: state,
              profession: profession,
            } as any);
            setIsLoading(false);
            setTimeout(() => {
              setIsRegistering();
            }, 4000);
          }
        });
      })
      .catch(function (error) {
        console.log(error);
        setIsLoading(false);
        setHaveErrors({
          error: true,
          errorMessage: 'Ocorreu um erro inesperado... tente novamente.',
        });
      });
  };

  const checkEmailAndPasswordMatches = (): void => {
    if (userEmail !== confirmUserEmail) {
      setHaveErrors({
        error: true,
        errorMessage: 'E-mails digitados não coincidem',
      });
    } else if (password !== confirmPassword) {
      setHaveErrors({
        error: true,
        errorMessage: 'Senhas digitadas não coincidem',
      });
    } else {
      setHaveErrors({
        error: false,
        errorMessage: '',
      });
    }
  };

  useEffect(() => {
    checkEmailAndPasswordMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmPassword, confirmUserEmail, password, userEmail]);

  return (
    <div className="main-form-registration">
      <div className="inner-form-registration">
        <h2 className="subtitle-form">Dados</h2>
        <Input
          style={{ marginTop: '0.4rem' }}
          placeholder="Nome"
          size="large"
          value={userName}
          onChange={(e) => setUserName(e.currentTarget.value)}
          prefix={<UserOutlined />}
        />
        <Input
          style={{ marginTop: '0.4rem' }}
          placeholder="Data de nascimento"
          value={birthdayDate}
          size="large"
          onChange={(e) => {
            setBirthdayDate(e.currentTarget.value);
            console.log(dateFormatRegex.test(e.currentTarget.value));
          }}
          onBlur={(e) => {
            if (!dateFormatRegex.test(e.currentTarget.value)) {
              setBirthdayDateMsg(true);
            } else {
              setBirthdayDateMsg(false);
            }
          }}
          prefix={<CalendarOutlined />}
        />
        {birthdayDateMsg ? (
          <p style={{ color: 'red' }}>
            Data está no formato incorreto, insira no formato: 31/12/2020, e uma
            data válida.
          </p>
        ) : (
          <div></div>
        )}
        <Select
          allowClear
          className="select-input-register-form"
          placeholder="Gênero"
          optionFilterProp="children"
          size="large"
          onChange={(e) => {
            if (e) setGender(e.toString());
            else setGender('');
          }}
        >
          <Option value="Masculino">Masculino</Option>
          <Option value="Feminino">Feminino</Option>
        </Select>
        <Input
          style={{ marginTop: '0.4rem' }}
          placeholder="Cidade"
          value={city}
          size="large"
          onChange={(e) => setCity(e.currentTarget.value)}
        />
        <Select
          allowClear
          className="select-input-register-form"
          placeholder="UF"
          optionFilterProp="children"
          size="large"
          onChange={(e) => {
            if (e) setState(e.toString());
            else setState('');
          }}
        >
          {generateUFs()}
        </Select>
        <Input
          style={{ marginTop: '0.4rem' }}
          placeholder="Profissão"
          size="large"
          value={profession}
          onChange={(e) => setProfession(e.currentTarget.value)}
        />

        <Divider />
        <h2 className="subtitle-form">Acesso</h2>
        <Input
          style={{ marginTop: '0.4rem' }}
          placeholder="E-mail"
          size="large"
          value={userEmail}
          onChange={(e) => setUserEmail(e.currentTarget.value)}
          prefix={<MailOutlined />}
        />
        <Input
          style={{ marginTop: '0.4rem' }}
          placeholder="Confirmar e-mail"
          size="large"
          value={confirmUserEmail}
          onChange={(e) => setConfirmUserEmail(e.currentTarget.value)}
          prefix={<MailOutlined />}
        />

        <Input.Password
          style={{ marginTop: '0.4rem' }}
          placeholder="Senha"
          size="large"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />

        <Input.Password
          style={{ marginTop: '0.4rem' }}
          placeholder="Confirmar senha"
          size="large"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.currentTarget.value)}
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
      </div>
      <Divider />
      {haveErrors.error ? <h3>{haveErrors.errorMessage} </h3> : ''}
      <div className="register-button-wrapper">
        <Button
          className="register-button"
          type="primary"
          disabled={isLoading}
          onClick={(e) => {
            setIsRegistering();
          }}
        >
          Voltar
        </Button>
        <Button
          className="register-button"
          type="primary"
          onClick={(e) => {
            register(e);
          }}
          disabled={isLoading}
        >
          Cadastrar
        </Button>
      </div>
    </div>
  );
};

export default RegisterForm;
