import { Button, Divider, Input, Select, message } from 'antd';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';
import './EditProfile.scss';
import HeaderBar from '../headerBar/HeaderBar';
import UserService from '../../../lib/UserService';
import { AuthContext } from '../../auth/AuthProvider';
import { brazilStates } from '../../../utils/constants';

const { Option } = Select;

const dateFormatRegex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;

const EditProfile: React.FunctionComponent = (): JSX.Element => {
  const [userName, setUserName] = React.useState('');
  const [birthdayDate, setBirthdayDate] = React.useState('');
  const [birthdayDateMsg, setBirthdayDateMsg] = React.useState(false);
  const [gender, setGender] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [profession, setProfession] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const history = useHistory();
  const { currentUser } = React.useContext(AuthContext);

  if (currentUser === null) {
    history.push('/login');
  }

  useEffect(() => {
    if (!currentUser) {
      history.push('/');
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const saveInfo = (): void => {
    if (
      !userName.trim() &&
      !birthdayDate.trim() &&
      !gender.trim() &&
      !profession.trim() &&
      !state.trim() &&
      !city.trim()
    ) {
      message.warn('Nenhum dado foi inserido para realizar uma alteração.', 4);
      return;
    }

    setIsLoading(true);
    new UserService(currentUser)
      .updateUser({
        userFirebaseId: currentUser.uid,
        name: userName ? userName : undefined,
        birthdayDate: birthdayDate ? birthdayDate : undefined,
        gender: gender ? gender : undefined,
        profession: profession ? profession : undefined,
        state: state ? state : undefined,
        city: city ? city : undefined,
      })
      .then((res) => {
        message.success('Dados salvos com sucesso!', 4);
        setTimeout(() => {
          history.push('/welcome');
        }, 3000);
      })
      .catch((err) => {
        setIsLoading(false);
        message.error(
          'Houve um erro ao realizar a alteração dos dados, tente novamente em breve!',
          4
        );
      });
  };

  const generateUFs = (): JSX.Element[] => {
    const statesElementsForSelect: JSX.Element[] = [];
    brazilStates.forEach((state) => {
      statesElementsForSelect.push(<Option value={state}>{state}</Option>);
    });

    return statesElementsForSelect;
  };

  return (
    <div className="editprofile-main">
      <HeaderBar />
      <h1 className="editprofile-logo">Editar perfil</h1>
      <div className="inner-form-edit">
        <h2 className="subtitle-form">Dados</h2>
        <Input
          style={{ marginTop: '0.4rem' }}
          placeholder="Nome"
          value={userName}
          size="large"
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
            Data está no formato incorreto, insira no formato: 31/12/2020
          </p>
        ) : (
          <div></div>
        )}
        <Select
          allowClear
          className="select-input"
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

        <Select
          allowClear
          className="select-input select-uf"
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
          placeholder="Cidade"
          value={city}
          size="large"
          onChange={(e) => setCity(e.currentTarget.value)}
        />
        <Input
          style={{ marginTop: '0.4rem' }}
          placeholder="Profissão"
          size="large"
          value={profession}
          onChange={(e) => setProfession(e.currentTarget.value)}
        />
      </div>
      <Divider />

      <div className="edit-wrapper-button">
        <Button
          onClick={(e) => history.push('/welcome')}
          className="start-instrument-button"
          type="primary"
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          onClick={saveInfo}
          className="start-instrument-button"
          type="primary"
          disabled={isLoading}
        >
          Salvar
        </Button>
      </div>
    </div>
  );
};

export default EditProfile;
