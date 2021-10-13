import axios from 'axios';
import firebase from 'firebase';
import { SERVER_URL } from '../utils/constants';

export interface IUser {
  name: string | null;
  photoURL: string | null;
  userFirebaseId: string;
  email: string | null;
}

export interface IPatient {
  name: string;
  birthdayDate: string;
  gender: string;
  schooling: string;
  diagnosis: string;
}

export interface IEvaluation {
  dateStart: number;
  questions: string[];
  currentQuestionIndex: number;
  areFinished: boolean;
  responses?: number[];
  id?: string;
}

export interface IUserFirebase {
  name?: string | undefined;
  photoURL?: string | undefined;
  birthdayDate?: string | undefined;
  gender?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  profession?: string | undefined;
}

/**
 * Class that handles with backend server.
 */
class UserService {
  private user: firebase.User | null = null;
  private idToken = '';
  constructor(currentUser: firebase.User | null) {
    this.user = currentUser;
  }

  registerNewEvaluation = async (
    userFirebaseId: string,
    targetUserId: string
  ) => {
    if (this.user !== null) {
      this.idToken = await this.user.getIdToken(true);
    }

    return await axios.post(
      `${SERVER_URL}/evaluations`,
      {
        userFirebaseId,
        targetUserId,
      },
      {
        headers: { Authorization: `Bearer ${this.idToken}` },
      }
    );
  };

  updateEvaluation = async (
    userId: string,
    targetUserId: string,
    dateStart: number,
    responses: any,
    currentQuestionIndex: number,
    isResponsesFilled: boolean
  ) => {
    if (this.user !== null) {
      this.idToken = await this.user.getIdToken(true);
    }

    return await axios.put(
      `${SERVER_URL}/evaluations`,
      {
        userId,
        targetUserId,
        dateStart,
        responses,
        currentQuestionIndex,
        isResponsesFilled,
      },
      {
        headers: { Authorization: `Bearer ${this.idToken}` },
      }
    );
  };

  getAllEvaluationsByPatient = async (
    userId: string,
    targetUserId: string,
    finishedEvaluationsOnly: boolean
  ) => {
    if (this.user !== null) {
      this.idToken = await this.user.getIdToken(true);
    }

    return await axios.get(
      `${SERVER_URL}/evaluations/${userId}/${targetUserId}/all/${finishedEvaluationsOnly}`,
      {
        headers: { Authorization: `Bearer ${this.idToken}` },
      }
    );
  };

  registerNewUser = async (userFirebaseObjInfo: IUser) => {
    if (this.user !== null) {
      this.idToken = await this.user.getIdToken(true);
    }

    return await axios.post(`${SERVER_URL}/users`, userFirebaseObjInfo, {
      headers: { Authorization: `Bearer ${this.idToken}` },
    });
  };

  updateUser = async (
    userFirebaseObjInfo: IUserFirebase & { userFirebaseId: string }
  ) => {
    if (this.user !== null) {
      this.idToken = await this.user.getIdToken(true);
    }

    return await axios.put(`${SERVER_URL}/users`, userFirebaseObjInfo, {
      headers: { Authorization: `Bearer ${this.idToken}` },
    });
  };

  getUserInfo = async (userFirebaseId: string) => {
    if (this.user !== null) {
      this.idToken = await this.user.getIdToken(true);
    }

    return await axios.get(`${SERVER_URL}/users/${userFirebaseId}/info`, {
      headers: { Authorization: `Bearer ${this.idToken}` },
    });
  };

  getQuestions = async () => {
    if (this.user !== null) {
      this.idToken = await this.user.getIdToken(true);
    }

    return await axios.get(`${SERVER_URL}/users/questions`);
  };

  sendEmail = async (contactInfo: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    return await axios.post(`${SERVER_URL}/users/contact`, contactInfo);
  };

  registerNewPatient = async (
    userFirebaseObjInfo: IPatient & { userFirebaseId: string }
  ) => {
    if (this.user !== null) {
      this.idToken = await this.user.getIdToken(true);
    }

    return await axios.post(`${SERVER_URL}/patients`, userFirebaseObjInfo, {
      headers: { Authorization: `Bearer ${this.idToken}` },
    });
  };

  updatePatient = async (
    userFirebaseObjInfo: IPatient & {
      patientId: string;
      userFirebaseId: string;
    }
  ) => {
    if (this.user !== null) {
      this.idToken = await this.user.getIdToken(true);
    }

    return await axios.put(`${SERVER_URL}/patients`, userFirebaseObjInfo, {
      headers: { Authorization: `Bearer ${this.idToken}` },
    });
  };

  deletePatient = async (patientId: string, userFirebaseId: string) => {
    if (this.user !== null) {
      this.idToken = await this.user.getIdToken(true);
    }

    return await axios.delete(
      `${SERVER_URL}/patients/${patientId}/${userFirebaseId}`,
      {
        headers: { Authorization: `Bearer ${this.idToken}` },
      }
    );
  };

  getPatientInfo = async (userFirebaseId: string, patientId: string) => {
    if (this.user !== null) {
      this.idToken = await this.user.getIdToken(true);
    }

    return await axios.get(
      `${SERVER_URL}/patients/${patientId}/info/${userFirebaseId}`,
      {
        headers: { Authorization: `Bearer ${this.idToken}` },
      }
    );
  };

  getAllPatients = async (userFirebaseId: string) => {
    if (this.user !== null) {
      this.idToken = await this.user.getIdToken(true);
    }

    return await axios.get(`${SERVER_URL}/patients/all/${userFirebaseId}`, {
      headers: { Authorization: `Bearer ${this.idToken}` },
    });
  };
}

export default UserService;
