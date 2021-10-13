import { Button, Slider, Spin, message } from 'antd';
import { AxiosResponse } from 'axios';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { RouteComponentProps } from 'react-router-dom';
import UserService from '../../../lib/UserService';
import { AuthContext } from '../../auth/AuthProvider';
import concordoTotalImg from '../../assets/concordototal.jpeg';
import concordoImg from '../../assets/concordo.jpeg';
import neutroImg from '../../assets/neutro.jpeg';
import discordoImg from '../../assets/discordo.jpeg';
import discordoTotalImg from '../../assets/discordototal.jpeg';
import QueueAnim from 'rc-queue-anim';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { translateEmojiMap } from '../../../utils/constants';
import logopsicologia from '../../assets/logopsicologia.png';

import './Quiz.scss';

interface IEvaluation {
  dateStart: number;
  questions: string[];
  currentQuestionIndex: number;
  areFinished: boolean;
  responses?: number[];
  id?: string;
}

const translateEmojiMapImageReaction = {
  0: discordoTotalImg,
  1: discordoImg,
  2: neutroImg,
  3: concordoImg,
  4: concordoTotalImg,
};

const Quiz: React.FunctionComponent<
  RouteComponentProps<{}, {}, { patientId: string }>
> = ({ match, location }): JSX.Element => {
  const [
    currenEvaluation,
    setCurrenEvaluation,
  ] = React.useState<IEvaluation | null>(null);
  const [questionIndex, setQuestionIndex] = React.useState(-2);
  const [sliderStep, setSliderStep] = React.useState(0);
  const [sliderStepAnimFlag, setSliderStepAnimFlag] = React.useState(true);
  const [isLoadingFlag, setIsLoadingFlag] = React.useState(false);
  const [isFinishingTrainingQuiz, setIsFinishingTrainingQuiz] = React.useState(
    false
  );
  const [selectedPatientId, setSelectedPatientId] = React.useState('');
  const [imageSubtitle, setImageSubtitle] = React.useState(
    translateEmojiMap[sliderStep]
  );
  const [imageReaction, setImageReaction] = React.useState(
    translateEmojiMapImageReaction[sliderStep]
  );
  const [responses, setResponses] = React.useState({});
  const { currentUser } = React.useContext(AuthContext);
  const history = useHistory();

  const handleSlider = (value: number) => {
    setSliderStep(value);
  };

  const registerResponse = async () => {
    if (!currenEvaluation || isLoadingFlag) return;

    setIsLoadingFlag(true);

    if (questionIndex === -2) {
      setIsFinishingTrainingQuiz(true);
      setIsLoadingFlag(true);
      setTimeout(() => {
        setIsFinishingTrainingQuiz(false);
        setQuestionIndex(0);
        setIsLoadingFlag(false);
      }, 2000);
      return;
    }

    let updatedResponses = { ...responses };
    updatedResponses[questionIndex] = sliderStep;
    setResponses(updatedResponses);

    new UserService(currentUser)
      .updateEvaluation(
        currentUser.uid,
        selectedPatientId,
        currenEvaluation.dateStart,
        updatedResponses,
        questionIndex,
        questionIndex === currenEvaluation.questions.length - 1
      )
      .then((res) => {
        let newQuestionIndex = questionIndex + 1;
        setQuestionIndex(newQuestionIndex);
        setIsLoadingFlag(false);
      })
      .catch((err) => {
        message.error('Erro ao registrar a resposta. Tente novamente!', 4999);
        setIsLoadingFlag(false);
      });
  };

  useEffect(() => {
    if (typeof responses[questionIndex] === 'number') {
      setSliderStep(responses[questionIndex]);
    } else {
      setSliderStep(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex]);

  useEffect(() => {
    if (!currentUser) {
      history.push('/');
      return;
    }

    if (!location.state.patientId) {
      message.error('Nenhum paciente foi selecionado!', 4);
      history.push('/quiz-preparation');
    }

    setSelectedPatientId(location.state.patientId);
    new UserService(currentUser)
      .registerNewEvaluation(currentUser.uid, location.state.patientId)
      .then((response: AxiosResponse<IEvaluation>) => {
        setCurrenEvaluation(response.data);
        setResponses(response.data.responses ? response.data.responses : {});
        setQuestionIndex(
          response.data.currentQuestionIndex === 0
            ? -2
            : response.data.currentQuestionIndex
        );

        let questionsResponses = response.data.responses;
        if (questionsResponses) {
          let newResponseObj = {};
          questionsResponses.forEach((response, index) => {
            newResponseObj[index] = response;
          });
          setResponses(newResponseObj);
        }
      })
      .catch((err) => {
        message.error(
          'Erro ao registrar o Quiz, volte à pagina anterior e tente novamente!',
          4
        );
        history.push('/quiz-preparation');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    window.addEventListener('keydown', handlePressKey);
    setSliderStepAnimFlag(false);
    setTimeout(() => {
      let imageSrc;
      if (sliderStep === 0) {
        imageSrc = discordoTotalImg;
      } else if (sliderStep === 1) {
        imageSrc = discordoImg;
      } else if (sliderStep === 2) {
        imageSrc = neutroImg;
      } else if (sliderStep === 3) {
        imageSrc = concordoImg;
      } else if (sliderStep === 4) {
        imageSrc = concordoTotalImg;
      }

      setImageReaction(imageSrc);
      setImageSubtitle(translateEmojiMap[sliderStep]);
      setSliderStepAnimFlag(true);
    }, 299);
    // cleanup this component
    return () => {
      window.removeEventListener('keydown', handlePressKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderStep, questionIndex]);

  const handlePressKey = (e) => {

    if (e.keyCode === 13) {
      // enter
      registerResponse();
    } else if (e.keyCode === 8) {
      let newQuestionIndex = questionIndex - 1;
      setQuestionIndex(newQuestionIndex);
      if (newQuestionIndex < 0) {
        history.push('/quiz-preparation');
      }
    } else if (e.keyCode === 37) {
      // left arrow
      if (sliderStep === 0) return;
      setSliderStep(sliderStep - 1);
    } else if (e.keyCode === 39) {
      // right arrow
      if (sliderStep === 4) return;
      setSliderStep(sliderStep + 1);
    }
  };

  if (currenEvaluation === null) {
    return (
      <Spin size="large" style={{ marginLeft: '47vw', marginTop: '24vh' }} />
    );
  } else if (questionIndex === currenEvaluation.questions.length) {
    return (
      <div className="quiz-main">
        <div className="quiz-wrapper-question">
          <div className="ending-header-wrapper">
            <p className="ending-header">FIM</p>
            <CheckCircleTwoTone
              twoToneColor="#52c41a"
              className="ending-header-check"
            />
          </div>
          <div className="ending-header-subtitle-wrapper">
            <p className="ending-header-subtitle">
              Obrigado pela participação e empenho!
            </p>
            <div className="finish-button-wrapper">
              <Button
                onClick={(e) => {
                  history.push('/welcome');
                }}
                className="finish-button"
                type="primary"
              >
                {'Finalizar'}
              </Button>
            </div>
            <div className="finish-logo-wrapper">
              <img src={logopsicologia} alt="logo" className="finish-logo" />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="quiz-main">
        <div className="quiz-wrapper-question">
          {questionIndex === -2 ? (
            <div className="training-header-wrapper">
              <p className="training-header">{'TREINO'}</p>
            </div>
          ) : (
            ''
          )}
          <div className="quiz-question-wrapper">
            <p className="quiz-question">
              {`${
                questionIndex === -2
                  ? 'Você é uma pessoa que gosta de ler?'
                  : currenEvaluation.questions[questionIndex]
              }`}
            </p>
          </div>
          <div style={{ marginTop: '8vh' }}>
            <Slider
              onChange={handleSlider}
              value={sliderStep}
              className="slider-question"
              max={4}
              tooltipVisible={false}
            />
            <QueueAnim>
              {sliderStepAnimFlag ? (
                <div key="reaction-image" className="reaction-image-wrapper">
                  <div style={{ width: 'fit-content', margin: 'auto' }}>
                    <img
                      src={imageReaction}
                      alt="Reaction"
                      className="reaction-image"
                    />
                  </div>
                  <p className="reaction-image-subtitle">{imageSubtitle}</p>
                </div>
              ) : (
                <div></div>
              )}
            </QueueAnim>
            <div>
              <QueueAnim>
                {isFinishingTrainingQuiz ? (
                  <div>
                    <p className="finish-training-label-msg">
                      Agora é pra valer, vamos lá?
                    </p>
                  </div>
                ) : (
                  <div></div>
                )}
              </QueueAnim>
            </div>
          </div>
        </div>
        <div className="quiz-question-nav-buttons-wrapper">
          <Button
            onClick={(e) => {
              let newQuestionIndex = questionIndex - 1;
              setQuestionIndex(newQuestionIndex);
              if (newQuestionIndex < 0) {
                history.push('/quiz-preparation');
              }
            }}
            className="nav-quiz-button"
            type="primary"
          >
            Voltar
          </Button>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isLoadingFlag ? (
              <Spin
                size="default"
                style={{ marginRight: '1rem', marginTop: '0.4rem' }}
              />
            ) : (
              ''
            )}
            <Button
              onClick={(e) => {
                registerResponse();
              }}
              className="nav-quiz-button"
              type="primary"
            >
              {'Próxima'}
            </Button>
          </div>
        </div>
      </div>
    );
  }
};

export default Quiz;
