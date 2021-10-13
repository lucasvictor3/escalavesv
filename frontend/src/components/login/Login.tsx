import { Button, Divider, Input, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import psicologiaLogo from '../assets/logopsicologia.png';
import React from 'react';
import firebase from 'firebase';
import { firebaseApp } from '../firebase/firebase';
import './Login.scss';
import { useHistory, RouteComponentProps } from 'react-router-dom';
import { AuthContext } from '../auth/AuthProvider';
import UserService from '../../lib/UserService';
import { LoggedUserInfoContext } from '../../App';
import RegisterForm from './registerForm/RegisterForm';
import { AxiosResponse } from 'axios';

interface IRouteProps {
  previousLink: string;
}

const Login: React.FunctionComponent<
  RouteComponentProps<any, any, IRouteProps>
> = ({ location }): JSX.Element => {
  const history = useHistory();
  const { currentUser } = React.useContext(AuthContext);
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [isDisabledLogin, setIsDisabledLogin] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { setLoggedUserInfo } = React.useContext(LoggedUserInfoContext);

  const loginWithEmailAndPassword = async (event: any): Promise<void> => {
    setIsDisabledLogin(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(userEmail, password)
      .then((response) => {
        const user = response.user;
        if (user !== null && user.emailVerified) {
          console.log(user);
          new UserService(user)
            .getUserInfo(user.uid)
            .then((response: AxiosResponse) => {
              const userInfo = response.data;
              new UserService(user)
                .registerNewUser({
                  name: userInfo !== null ? userInfo.name : user.displayName,
                  email: userInfo !== null ? userInfo.email : user.email,
                  photoURL:
                    userInfo !== null ? userInfo.photoURL : user.photoURL,
                  userFirebaseId: user.uid,
                })
                .then((response: AxiosResponse) => {
                  // location.state !== undefined &&
                  // location.state.previousLink !== undefined
                  //   ? history.push(`/${location.state.previousLink}`)
                  //   :
                  history.push('/welcome');
                })
                .catch((error: any) => {});
            });
        } else {
          message.error(
            'Erro ao entrar com esse e-mail, confirme o e-mail de verificação enviado.',
            7
          );

          setTimeout(() => {
            setIsDisabledLogin(false);
          }, 2000);
        }
      })
      .catch(function (error) {
        setIsDisabledLogin(false);
        if (error.code === 'auth/wrong-password') {
          message.error('Senha incorreta', 5);
        } else message.error('Erro ao entrar com esse e-mail, verifique as informações inseridas', 7);

        setTimeout(() => {
          setIsDisabledLogin(false);
        }, 2000);
      });
  };

  const setIfFormIsRegisterType = (
    event?: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    setIsRegistering(!isRegistering);
  };

  const loginWithGoogle = async (event) => {
    event.preventDefault();
    var provider = new firebase.auth.GoogleAuthProvider();
    try {
      await firebaseApp.auth().signInWithPopup(provider);
      firebaseApp.auth().onAuthStateChanged((user) => {
        if (user !== null) {
          new UserService(user)
            .registerNewUser({
              email: user.email,
              name: user.displayName,
              photoURL: user.photoURL,
              userFirebaseId: user.uid,
            })
            .then((response) => {
              setLoggedUserInfo(response.data);
              console.log(response.data);
              history.push('/welcome');
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    } catch (error) {
      alert(error);
    }
  };

  if (currentUser !== null && currentUser.emailVerified) {
    history.push('/welcome');
  }

  return (
    <div className="login-main">
      <div className="login-fields-box">
        <div className="login-logo-wrapper">
          <img
            className="login-logo"
            alt="psicologia"
            src={psicologiaLogo}
            width={240}
          ></img>
        </div>
        {!isRegistering ? (
          <div>
            <h1 className="login-header">Login</h1>
            <Input
              style={{ marginTop: '0.4rem' }}
              placeholder="Email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.currentTarget.value)}
              prefix={<MailOutlined />}
            />
            <Input.Password
              style={{ marginTop: '0.4rem' }}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
            <p className="forgot-password-phrase">Esqueceu a senha?</p>
            <div className="login-button-wrapper">
              <Button
                className="login-button"
                type="primary"
                onClick={(e) => {
                  setIsRegistering(true);
                }}
              >
                Cadastrar
              </Button>
              <Button
                onClick={loginWithEmailAndPassword}
                className="login-button"
                type="primary"
                disabled={isDisabledLogin}
              >
                Entrar
              </Button>
            </div>
            <Divider plain>OU</Divider>
            <div className="google-login-button-wrapper">
              <Button
                onClick={loginWithGoogle}
                className="google-login-button"
                type="primary"
              >
                <img
                  src="https://static.cdn.onlyfans.com/theme/onlyfans/spa/img/btn_google_light.svg"
                  alt=""
                  width={24}
                  style={{ marginLeft: '0.2rem', marginRight: '0.4rem' }}
                />
                {' ENTRAR COM O GOOGLE'}
              </Button>
            </div>
          </div>
        ) : (
          <RegisterForm setIsRegistering={setIfFormIsRegisterType} />
        )}
      </div>
    </div>
  );
};

export default Login;
