import React from 'react';
import { useHistory } from 'react-router-dom';
import './ResultModal.scss';
import { AuthContext } from '../../auth/AuthProvider';
import { IEvaluation } from '../../../lib/UserService';
import { translateEmojiMap } from '../../../utils/constants';

interface IProps {
  result: IEvaluation;
}

const ResultModal: React.FunctionComponent<IProps> = ({
  result,
}): JSX.Element => {
  const history = useHistory();
  const { currentUser } = React.useContext(AuthContext);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = React.useState(0);

  if (currentUser === null) {
    history.push('/login');
  }

  const generateQuestionsOrResponseDivList = (numbersList: number[]) => {
    let finalListElement: JSX.Element;
    let teste: any[] = [];
    numbersList.forEach((number, index) => {
      let element = (
        <div
          className={`list-questions-and-number-wrapper ${
            index === selectedQuestionIndex ? 'selected' : ''
          }`}
          onClick={() => {
            setSelectedQuestionIndex(index);
          }}
        >
          <div className="list-questions-and-number upper">
            <p style={{ margin: 'auto', width: 'fit-content' }}>{index + 1}</p>
          </div>
          <div className="list-questions-and-number lower">
            <p style={{ margin: 'auto', width: 'fit-content' }}>{number + 1}</p>
          </div>
        </div>
      );
      teste.push(element);
    });

    finalListElement = <div className="list-results-display">{teste}</div>;

    return finalListElement;
  };

  return (
    <div className="result-modal-main">
      <p className="result-upper-label">
        Questões: {result.questions[selectedQuestionIndex]}
      </p>
      {generateQuestionsOrResponseDivList(result.responses!)}
      <p className="result-bottom-label">
        Respostas: {translateEmojiMap[result.responses![selectedQuestionIndex]]}
      </p>
    </div>
  );
};

export default ResultModal;
