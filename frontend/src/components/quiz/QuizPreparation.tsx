import React, { useEffect } from 'react';
import { Button, message, Select } from 'antd';
import { useHistory } from 'react-router-dom';

import './QuizPreparation.scss';
import { AuthContext } from '../auth/AuthProvider';
import UserService, { IPatient } from '../../lib/UserService';
import instructionsImg from '../assets/instructionsImg.png';
import { screenWidthSize } from '../../App';

const { Option } = Select;

type Patient = IPatient & { id: string };

const QuizPreparation: React.FunctionComponent = (): JSX.Element => {
  const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(
    null
  );
  const [
    listOfPatients,
    setListOfPatients,
  ] = React.useState<Array<Patient> | null>(null);
  const screenWidthSizeValue = React.useContext(screenWidthSize);
  const { currentUser } = React.useContext(AuthContext);
  const history = useHistory();

  const generatePatientsListOptions = (): JSX.Element[] => {
    const patients: JSX.Element[] = [];

    if (listOfPatients) {
      listOfPatients.forEach((patient) => {
        patients.push(<Option value={patient.id}>{patient.name}</Option>);
      });
    }

    return patients;
  };

  useEffect(() => {
    if (!currentUser) {
      history.push('/');
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

  const checkAndStartQuiz = () => {
    if (selectedPatient) {
      history.push({
        pathname: '/quiz-start',
        state: { patientId: selectedPatient.id },
      });
    } else {
      message.error('Nenhum paciente selecionado!', 4);
    }
  };

  return (
    <div>
      <div className="instrument-wrapper">
        <p className="instrument-wrapper-header">
          Selecione o paciente para ser iniciado o instrumento
        </p>
        <div className="name-search-box">
          <Select
            showSearch
            style={{ width: 800 }}
            className="select-pacient-instrument-preparation"
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
      </div>
      <div className="instructions-img-wrapper">
        <img
          className="instructions-img"
          alt="instructions"
          src={screenWidthSizeValue <= 800 ? instructionsImg : instructionsImg}
        />
      </div>
      <nav className="bottom-buttons-wrapper">
        <Button
          className="back-instrument-button"
          type="primary"
          onClick={(e) => {
            history.push('/welcome');
          }}
        >
          Voltar
        </Button>

        <Button
          onClick={(e) => {
            checkAndStartQuiz();
          }}
          className="start-instrument-button"
          type="primary"
        >
          Iniciar
        </Button>
      </nav>
    </div>
  );
};

export default QuizPreparation;
