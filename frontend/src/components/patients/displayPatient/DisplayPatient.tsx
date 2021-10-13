import React, { useEffect } from 'react';
import {
  Button,
  Input,
  Select,
  Modal,
  message,
  Divider,
  Collapse,
  Popover,
} from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  ReadOutlined,
  DeleteFilled,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import UserService, { IPatient, IEvaluation } from '../../../lib/UserService';
import { AuthContext } from '../../auth/AuthProvider';

import './DisplayPatient.scss';
import ResultModal from './ResultModal';

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

type Patient = IPatient & { id: string };

const DisplayPatient: React.FunctionComponent = (): JSX.Element => {
  const history = useHistory();
  const { currentUser } = React.useContext(AuthContext);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(
    null
  );
  const [
    selectedResult,
    setSelectedResult,
  ] = React.useState<IEvaluation | null>(null);
  const [selectedPatientResults, setSelectedPatientResults] = React.useState<
    IEvaluation[] | null
  >(null);
  const [
    listOfPatients,
    setListOfPatients,
  ] = React.useState<Array<Patient> | null>(null);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isPopoverVisible, setIsPopoverVisible] = React.useState(false);

  useEffect(() => {
    if (selectedPatient) {
      new UserService(currentUser)
        .getAllEvaluationsByPatient(currentUser.uid, selectedPatient.id, false)
        .then((response) => {
          setSelectedPatientResults(response.data);
        })
        .catch((err) => {
          console.log(err);
          message.error(
            'Erro ao buscar resultados das avaliações registrados',
            3
          );
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPatient]);

  const getListOfPatients = () => {
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
  };

  useEffect(() => {
    if (!currentUser) {
      history.push('/');
      return;
    }

    getListOfPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      history.push('/');
      return;
    }

    if (isPopoverVisible) {
      setIsDisabled(true);
      setTimeout(() => {
        setIsDisabled(false);
      }, 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPopoverVisible]);

  const generateResultList = (): JSX.Element => {
    if (selectedPatientResults) {
      const resultsList: JSX.Element[] = [];
      selectedPatientResults.forEach((result) => {
        const time = new Date(result.dateStart);
        resultsList.push(
          <p
            className="result-evaluation-item"
            onClick={(e) => {
              setSelectedResult(result);
              setIsModalVisible(true);
            }}
          >{`Data: ${time.getDate()}/${
            time.getMonth() + 1
          }/${time.getFullYear()} - ${time.getHours()}:${time.getMinutes()}`}</p>
        );
      });

      return <div>{resultsList}</div>;
    }

    return <p>Nenhum resultado encontrado para este paciente!</p>;
  };

  const generatePatientsListOptions = (): JSX.Element[] => {
    const patients: JSX.Element[] = [];

    if (listOfPatients) {
      listOfPatients.forEach((patient) => {
        patients.push(<Option value={patient.id}>{patient.name}</Option>);
      });
    }

    return patients;
  };

  return (
    <div>
      <div className="editpatient-header-wrapper">
        <p className="viewpatient-header">Visualizar cadastro do paciente</p>
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
          {selectedPatient ? (
            <Popover
              content={
                <div className="popoverdelete-wrapper">
                  <p className="text-popoverdelete">
                    Você realmente deseja DELETAR esse paciente?
                  </p>
                  <div className="buttons-popoverdelete-wrapper">
                    <Button
                      className="back-instrument-button"
                      type="primary"
                      onClick={(e) => {
                        setIsPopoverVisible(false);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="back-instrument-button"
                      type="primary"
                      disabled={isDisabled}
                      onClick={(e) => {
                        new UserService(currentUser)
                          .deletePatient(selectedPatient.id, currentUser.uid)
                          .then((res) => {
                            setSelectedPatientResults(null);
                            setSelectedResult(null);
                            setIsPopoverVisible(false);
                            setSelectedPatient(null);
                            getListOfPatients();
                          })
                          .catch((err) => {
                            console.log(err);
                            message.error(
                              'Ocorreu um erro ao deletar esse paciente. Tente novamente em alguns instantes.'
                            );
                          });
                      }}
                    >
                      SIM
                    </Button>
                  </div>
                </div>
              }
              title={null}
              trigger="click"
              visible={isPopoverVisible}
              onVisibleChange={setIsPopoverVisible}
            >
              <DeleteFilled className="delete-patient-icon" />
            </Popover>
          ) : (
            ''
          )}
        </div>
      </nav>

      <div className="editpatient-main-inputs">
        <Divider />
        <Input
          style={{ marginTop: '0.4rem' }}
          placeholder="Nome"
          size="large"
          value={selectedPatient ? selectedPatient.name : ''}
          prefix={<UserOutlined />}
        />
        <Input
          style={{ marginTop: '0.4rem' }}
          placeholder="Data de nascimento"
          value={selectedPatient ? selectedPatient.birthdayDate : ''}
          size="large"
          prefix={<CalendarOutlined />}
        />
        <Select
          allowClear
          className="select-input-register-form"
          placeholder="Gênero"
          optionFilterProp="children"
          size="large"
          value={selectedPatient ? selectedPatient.gender : ''}
        >
          <Option value="Masculino">Masculino</Option>
          <Option value="Feminino">Feminino</Option>
        </Select>
        <Input
          style={{ marginTop: '0.4rem' }}
          placeholder="Escolaridade"
          size="large"
          value={selectedPatient ? selectedPatient.schooling : ''}
          prefix={<ReadOutlined />}
        />

        <Divider />
        <TextArea
          rows={4}
          value={selectedPatient ? selectedPatient.diagnosis : ''}
          placeholder="Diagnóstico"
        />
        <Collapse defaultActiveKey={['1']}>
          <Panel header="Resultados" key="1">
            {generateResultList()}
          </Panel>
        </Collapse>
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
      </nav>
      <Modal
        title="Resultado"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        footer={null}
        className="result-modal"
      >
        <ResultModal result={selectedResult!} />
      </Modal>
    </div>
  );
};

export default DisplayPatient;
