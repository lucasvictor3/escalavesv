import { response } from 'express';
import firebase from 'firebase/app';
import { logger } from '../../../serverNode';

interface IEvaluation {
  dateStart: number;
  questions: string[];
  currentQuestionIndex: number;
  areFinished: boolean;
  responses?: number[];
  id?: string;
}

class EvaluationService {
  private db: firebase.database.Database;
  constructor(initializedDb: firebase.database.Database) {
    this.db = initializedDb;
    this.teste();
  }

  teste = async () => {
    let res;

    await this.db
      .ref(`evaluations/XoSbhdhZeHMd1UPmp8ak6D08Tw82/teste`)
      .once('value', (value) => {
        res = value.val();
      });

    console.log(res);
  };

  registerEvaluation = async (userFirebaseId: string, targetUserId: string) => {
    let timeStamp = await this.checkOngoingEvaluation(
      userFirebaseId,
      targetUserId
    );

    if (timeStamp !== null) {
      let response: IEvaluation;
      await this.db
        .ref(`evaluations/${userFirebaseId}/${targetUserId}/${timeStamp}`)
        .once('value', (value) => {
          response = value.val();
        });
      console.log('ALREADY CREATED/ON GOING: ', response, timeStamp);
      return response;
    }

    let questions = await this.getQuestions();

    let currentDate = new Date().getTime();
    const evaluationInfo: IEvaluation = {
      dateStart: currentDate,
      questions: questions,
      areFinished: false,
      currentQuestionIndex: 0,
    };

    await this.db
      .ref(`ongoing_evaluations/${userFirebaseId}/${targetUserId}`)
      .set(currentDate);

    await this.db
      .ref(`evaluations/${userFirebaseId}/${targetUserId}/${currentDate}`)
      .set(evaluationInfo);

    return evaluationInfo;
  };

  updateEvaluation = async (
    userId: string,
    targetUserId: string,
    dateStart: string,
    responses: number[],
    currentQuestionIndex: number,
    isResponsesFilled?: boolean
  ) => {
    let evaluation = await this.getUserEvaluationInfo(
      userId,
      targetUserId,
      dateStart
    );

    evaluation = {
      ...evaluation,
      responses,
      currentQuestionIndex,
      areFinished: isResponsesFilled ? true : false,
    };

    if (isResponsesFilled) {
      await this.db
        .ref(`ongoing_evaluations/${userId}/${targetUserId}`)
        .set(null);
    }

    console.log(`UPDATED EVALUATION: `, evaluation);
    await this.db
      .ref(`evaluations/${userId}/${targetUserId}/${dateStart}`)
      .update(evaluation);

    return evaluation;
  };

  getUserEvaluationInfo = async (
    userId: string,
    targetUserId: string,
    dateStart: string
  ) => {
    let response;
    await this.db
      .ref(`evaluations/${userId}/${targetUserId}/${dateStart}`)
      .once('value', (value) => {
        response = value.val();
      });

    return response;
  };

  getAllSpecificUserEvaluations = async (
    userId: string,
    targetUserId: string,
    finishedEvaluationsOnly?: boolean
  ) => {
    let response;
    let evaluationList: IEvaluation[] = [];
    await this.db
      .ref(`evaluations/${userId}/${targetUserId}`)
      .once('value', (value) => {
        response = value.val();
      });

    if (response === null) return evaluationList;

    Object.entries(response).forEach(
      (evaluationTuple: [string, IEvaluation]) => {
        let evaluationId: string = evaluationTuple[0];
        let evaluationInfo: IEvaluation = evaluationTuple[1];

        if (finishedEvaluationsOnly && !evaluationInfo.areFinished) {
          return;
        }
        evaluationList.push({
          ...evaluationInfo,
          id: evaluationId,
        });
      }
    );

    return evaluationList;
  };

  checkOngoingEvaluation = async (userId: string, targetUserId: string) => {
    let response;

    await this.db
      .ref(`ongoing_evaluations/${userId}/${targetUserId}`)
      .once('value', (value) => {
        response = value.val();
      });

    return response;
  };

  getQuestions = async () => {
    let response;
    await this.db.ref('questions/').once('value', (value) => {
      response = value.val();
    });

    return response;
  };
}

export default EvaluationService;
