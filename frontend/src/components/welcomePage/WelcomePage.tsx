import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './WelcomePage.scss';
import { AuthContext } from '../auth/AuthProvider';
import psicologiaLogo from '../assets/logopsicologia.png';
import UserService from '../../lib/UserService';
import { AxiosResponse } from 'axios';
import HeaderBar from './headerBar/HeaderBar';

const WelcomePage: React.FunctionComponent = (): JSX.Element => {
  const history = useHistory();
  const { currentUser } = React.useContext(AuthContext);
  const [loggedUserInfo, setLoggedUserInfo] = React.useState({
    email: '',
    name: '',
    photoURL: '',
  });

  if (currentUser === null) {
    history.push('/login');
  }

  useEffect(() => {
    if (currentUser === null) return;

    new UserService(currentUser)
      .getUserInfo(currentUser.uid)
      .then((response: AxiosResponse) => {
        setLoggedUserInfo(response.data);
        console.log(response.data);
      })
      .catch((err) => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatEmailToDisplay = (email: string) => {
    if (!email) {
      return '';
    }
    let emailSplitted = email.split('@');
    const first = emailSplitted[0];
    const last = emailSplitted[1];
    return (
      first.slice(0, first.length <= 4 ? first.length : 4) +
      '...@...' +
      last.slice(last.length <= 7 ? 0 : last.length - 7, last.length)
    );
  };

  return (
    <div className="welcome-main">
      <HeaderBar />
      <div className="welcome-img-logo-wrapper">
        <img
          className="welcome-img-logo"
          alt="psicologia"
          src={psicologiaLogo}
        ></img>
      </div>
      <h1 className="welcome-logo">Seja bem-vindo(a)!</h1>

      <div className="welcome-options-wrapper">
        <div className="profile-wrapper">
          <div
            className="profile-wrapper-header-h"
            style={{ backgroundColor: '#5EABB3' }}
          >
            <p className="profile-wrapper-header">Perfil</p>
          </div>
          <div>
            <div className="profile-wrapper-info">
              <span title={loggedUserInfo.email}>
                {formatEmailToDisplay(loggedUserInfo.email)}
              </span>
            </div>
          </div>
          <div>
            <p className="profile-wrapper-info">{loggedUserInfo.name}</p>
          </div>
          <div
            onClick={(e) => {
              history.push('/edit');
            }}
            className="patient-option-div"
          >
            <p className="patient-option-larger-info">Editar informações</p>
          </div>
          <div
            className="patient-option-div"
            onClick={(e) => {
              history.push('/quiz-preparation');
            }}
          >
            <p className="patient-option-larger-info">Iniciar instrumento</p>
          </div>
        </div>
        <div className="patient-wrapper">
          <div
            className="patient-wrapper-header-h"
            style={{ backgroundColor: '#5EABB3' }}
          >
            <p className="patient-wrapper-header">Paciente</p>
          </div>
          <div
            className="patient-option-div"
            onClick={(e) => {
              history.push('/patient/register');
            }}
          >
            <p className="patient-option">Cadastrar</p>
          </div>
          <div
            className="patient-option-div"
            onClick={(e) => {
              history.push('/patient/edit');
            }}
          >
            <p className="patient-option">Editar</p>
          </div>
          <div
            className="patient-option-div"
            onClick={(e) => {
              history.push('/patient/view');
            }}
          >
            <p className="patient-option">Pesquisar</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
