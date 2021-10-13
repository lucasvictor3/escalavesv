import React, { useEffect } from 'react';
import { Button, Input, Select, message, Divider } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import UserService, { IPatient } from '../../../lib/UserService';
import { AuthContext } from '../../auth/AuthProvider';

import './EditPatientInfo.scss';

const { Option } = Select;
const { TextArea } = Input;

const dateFormatRegex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;

type Patient = IPatient & { id: string };

const EditPatientInfo: React.FunctionComponent = (): JSX.Element => {
  const history = useHistory();
  const { currentUser } = React.useContext(AuthContext);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [birthdayDateMsg, setBirthdayDateMsg] = React.useState(false);
  const [patientName, setPatientName] = React.useState('');
  const [birthdayDate, setBirthdayDate] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [schooling, setSchooling] = React.useState('');
  const [diagnosis, setDiagnosis] = React.useState('');
  const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(
    null
  );
  const [
    listOfPatients,
    setListOfPatients,
  ] = React.useState<Array<Patient> | null>(null);

  useEffect(() => {
    if (selectedPatient) {
      setBirthdayDate(selectedPatient.birthdayDate);
      setDiagnosis(selectedPatient.diagnosis);
      setGender(selectedPatient.gender);
      setPatientName(selectedPatient.name);
      setSchooling(selectedPatient.schooling);
    } else {
      setBirthdayDate('');
      setDiagnosis('');
      setGender('');
      setPatientName('');
      setSchooling('');
    }
  }, [selectedPatient]);

  useEffect(() => {
    if (!currentUser) {
      history.push('/welcome');
      return;
    }

    new UserService(currentUser)
      .getAllPatients(currentUser.uid)
      .then((response) => {
        setListOfPatients(response.data);
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
        message.error('Erro ao buscar pacientes registrados', 3);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const generatePatientsListOptions = (): JSX.Element[] => {
    const patients: JSX.Element[] = [];

    if (listOfPatients) {
      listOfPatients.forEach((patient) => {
        patients.push(<Option value={patient.id}>{patient.name}</Option>);
      });
    }

    return patients;
  };

  const editAndSavePatientData = () => {
    if (selectedPatient) {
      if (
        !patientName &&
        !birthdayDate &&
        !gender &&
        !schooling &&
        !diagnosis
      ) {
        message.warn(
          'Não houve nenhuma alteração nos campos de dados para serem alterados.',
          4
        );
        return;
      }
      console.log(patientName, selectedPatient.name);
      if (
        patientName === selectedPatient.name &&
        birthdayDate === selectedPatient.birthdayDate &&
        gender === selectedPatient.gender &&
        schooling === selectedPatient.schooling &&
        diagnosis === selectedPatient.diagnosis
      ) {
        message.warn(
          'Não houve nenhuma alteração nos campos de dados para serem alterados.',
          4
        );
        return;
      }

      setIsDisabled(true);

      new UserService(currentUser)
        .updatePatient({
          name: patientName,
          userFirebaseId: currentUser.uid,
          patientId: selectedPatient.id,
          birthdayDate,
          diagnosis,
          gender,
          schooling,
        })
        .then((response) => {
          setSelectedPatient(response.data);
          console.log(response.data);
          message.success('Dados foram salvos com sucesso.', 4);
          setIsDisabled(false);
        })
        .catch((err) => {
          console.log(err);
          setIsDisabled(false);
          message.error(
            'Erro ao salvar os dados, tente novamente em alguns instantes',
            4
          );
        });
    } else {
      message.error('Nenhum paciente selecionado', 4);
    }
  };

  return (
    <div>
      <div className="editpatient-header-wrapper">
        <p className="editpatient-header">Editar cadastro do paciente</p>
      </div>
      <nav className="select-patient-wrapper">
        <div className="select-patient-input">
          <p className="select-patient-label">Selecione o paciente: </p>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Digite para buscar"
            optionFilterProp="children"
            filterOption={(input, option) => {
              console.log(option);
              return (
                option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
            onChange={(e) => {
              if (e) {
                setSelectedPatient(
                  listOfPatients!.find(
                    (patient) => patient.id === e.toString()
                  )!
                );
              } else setSelectedPatient(null);
            }}
          >
            {generatePatientsListOptions()}
          </Select>
        </div>
        ,
      </nav>

      <div className="editpatient-main-inputs">
        <Divider />
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
          value={gender}
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
      </div>
      <nav className="buttons-bottom-wraper-editpat">
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
          onClick={(e) => {
            editAndSavePatientData();
          }}
          className="start-instrument-button"
          type="primary"
          disabled={isDisabled}
        >
          Salvar alterações
        </Button>
      </nav>
    </div>
  );
};

export default EditPatientInfo;
