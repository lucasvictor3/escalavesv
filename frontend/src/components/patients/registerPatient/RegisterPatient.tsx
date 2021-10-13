import React, { useEffect } from 'react';
import { Button, Input, Select, Divider, message } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

import './RegisterPatient.scss';
import UserService from '../../../lib/UserService';
import { AuthContext } from '../../auth/AuthProvider';

const { Option } = Select;

const { TextArea } = Input;

const dateFormatRegex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;

const RegisterPatient: React.FunctionComponent = (): JSX.Element => {
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [birthdayDateMsg, setBirthdayDateMsg] = React.useState(false);
  const [patientName, setPatientName] = React.useState('');
  const [birthdayDate, setBirthdayDate] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [schooling, setSchooling] = React.useState('');
  const [diagnosis, setDiagnosis] = React.useState('');
  const { currentUser } = React.useContext(AuthContext);
  const [haveErrors, setHaveErrors] = React.useState({
    error: false,
    errorMessage: '',
  });
  const history = useHistory();

  useEffect(() => {
    if (!currentUser) {
      history.push('/');
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const savePatientData = () => {
    if (!patientName || !birthdayDate || !gender || !schooling || !diagnosis) {
      message.warn('Por favor, preencher todos os campos.', 4);
      return;
    }
    if (haveErrors.error) {
      return;
    }

    setIsDisabled(true);
    new UserService(currentUser)
      .registerNewPatient({
        userFirebaseId: currentUser.uid,
        name: patientName,
        birthdayDate,
        diagnosis,
        gender,
        schooling,
      })
      .then((response) => {
        setIsDisabled(false);
        message.success('Paciente salvo com sucesso.', 5);
        setTimeout(() => {
          history.push('/welcome');
        }, 3000);
      })
      .catch((err) => {
        setIsDisabled(false);
        message.error('Paciente salvo com sucesso.', 5);
      });
  };

  return (
    <div>
      <div className="register-patient-header-wrapper">
        <p className="register-patient-header">Cadastro do paciente</p>
        <p className="register-patient-subheader">Dados cadastrais </p>
      </div>
      <nav className="register-patient-body-wrapper">
        <Input
          style={{ marginTop: '0.4rem' }}
          placeholder="Nome"
          size="large"
          value={patientName}
          onChange={(e) => setPatientName(e.currentTarget.value)}
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
              setHaveErrors({
                error: true,
                errorMessage: 'Erro no formato da data de nascimento',
              });
            } else {
              setBirthdayDateMsg(false);
              setHaveErrors({ error: false, errorMessage: '' });
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
          placeholder="Escolaridade"
          size="large"
          value={schooling}
          onChange={(e) => setSchooling(e.currentTarget.value)}
          prefix={<ReadOutlined />}
        />

        <Divider />
        <TextArea
          rows={4}
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.currentTarget.value)}
          placeholder="Diagnóstico"
        />

        <div className="buttons-register-patient-wrapper">
          <Button
            className="back-instrument-button"
            type="primary"
            disabled={isDisabled}
            onClick={(e) => {
              history.push('/welcome');
            }}
          >
            Voltar
          </Button>

          <Button
            onClick={savePatientData}
            className="start-instrument-button"
            type="primary"
            disabled={isDisabled}
          >
            Salvar
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default RegisterPatient;
