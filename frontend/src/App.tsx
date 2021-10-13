import './App.scss';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import Login from './components/login/Login';
import Home from './components/home/Home';
import WelcomePage from './components/welcomePage/WelcomePage';
import { AuthProvider } from './components/auth/AuthProvider';
import QuizPreparation from './components/quiz/QuizPreparation';
import Quiz from './components/quiz/Quiz/Quiz';
import EditProfile from './components/welcomePage/editProfile/EditProfile';
import RegisterPatient from './components/patients/registerPatient/RegisterPatient';
import EditPatientInfo from './components/patients/editPatient/EditPatientInfo';
import DisplayPatient from './components/patients/displayPatient/DisplayPatient';

export const LoggedUserInfoContext = React.createContext<any>(null);
export const screenWidthSize = React.createContext(0);

const App: React.FunctionComponent = (): JSX.Element => {
  const [loggedUserInfo, setLoggedUserInfo] = React.useState(null);
  const [screenSize, setScreensize] = React.useState(0);

  const zoomOutMobile = () => {
    const viewport: any = document.querySelector('meta[name="viewport"]');

    if (viewport && window.innerWidth < 900) {
      viewport.content = 'initial-scale=0.1';
      viewport.content = 'minimum-scale=0.1';
      viewport.content = 'maximum-scale=0.1';
      viewport.content = 'user-scalable=0';
      viewport.content = 'width=device-width';
    }
  };

  React.useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setScreensize(window.innerWidth);
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  zoomOutMobile();
  return (
    <LoggedUserInfoContext.Provider
      value={{ loggedUserInfo, setLoggedUserInfo }}
    >
      <AuthProvider>
        <screenWidthSize.Provider value={screenSize}>
          <Router>
            <div>
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/welcome" component={WelcomePage} />
              <Route path="/quiz-start" component={Quiz} />
              <Route path="/edit" component={EditProfile} />
              <Route path="/quiz-preparation" component={QuizPreparation} />
              <Route path="/patient/register" component={RegisterPatient} />
              <Route path="/patient/edit" component={EditPatientInfo} />
              <Route path="/patient/view" component={DisplayPatient} />
            </div>
          </Router>
        </screenWidthSize.Provider>
      </AuthProvider>
    </LoggedUserInfoContext.Provider>
  );
};

export default App;
