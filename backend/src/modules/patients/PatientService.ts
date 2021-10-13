import firebase from "firebase/app";

export interface IPatient {
  name: string;
  birthdayDate: string;
  gender: string;
  schooling: string;
  diagnosis: string;
}

class PatientService {
  private db: firebase.database.Database;
  constructor(initializedDb: firebase.database.Database) {
    this.db = initializedDb;
    this.test();
  }

  test = async () => {
    let teste = await this.getAllPatients("5z79WBkhMBV89ZNbkyauUKtnC5J3");
    console.log(teste);
  };

  registerPatient = async (
    userFirebaseId: string,
    name: string,
    birthdayDate: string,
    gender: string,
    schooling: string,
    diagnosis: string
  ) => {
    const patientInfo: IPatient = {
      name,
      birthdayDate,
      gender,
      schooling,
      diagnosis,
    };

    let patientId = (
      await this.db.ref("patients/" + userFirebaseId).push(patientInfo)
    ).key;

    return { ...patientInfo, id: patientId };
  };

  updatePatient = async (
    userFirebaseId: string,
    patientId: string,
    name: string,
    birthdayDate: string,
    gender: string,
    schooling: string,
    diagnosis: string
  ) => {
    const patientInfo: Partial<IPatient> = {};

    if (name) patientInfo["name"] = name;
    if (birthdayDate) patientInfo["birthdayDate"] = birthdayDate;
    if (gender) patientInfo["gender"] = gender;
    if (schooling) patientInfo["schooling"] = schooling;
    if (diagnosis) patientInfo["diagnosis"] = diagnosis;

    await this.db
      .ref("patients/" + userFirebaseId + "/" + patientId)
      .update(patientInfo);

    const newUserInfo = await this.getPatientInfo(userFirebaseId, patientId);

    return newUserInfo;
  };

  getPatientInfo = async (userFirebaseId: string, patientId: string) => {
    let response: IPatient | null;
    await this.db
      .ref("patients/" + userFirebaseId + "/" + patientId)
      .once("value", (value) => {
        response = value.val();
      });

    return response;
  };

  deletePatient = async (userFirebaseId: string, patientId: string) => {
    try {
      await this.db
        .ref("patients/" + userFirebaseId + "/" + patientId)
        .set(null);
      await this.db
        .ref("evaluations/" + userFirebaseId + "/" + patientId)
        .set(null);
      await this.db
        .ref("ongoing_evaluations/" + userFirebaseId + "/" + patientId)
        .set(null);
      return true;
    } catch (error) {
      return false;
    }
  };

  getAllPatients = async (userFirebaseId: string) => {
    let allPatients: Array<IPatient & { id: string }> = [];
    let response: Record<string, IPatient>;

    await this.db.ref("patients/" + userFirebaseId).once("value", (value) => {
      response = value.val();
    });

    Object.entries(response).forEach((patientTuple) => {
      let patientId = patientTuple[0];
      let patientInfo = patientTuple[1];

      allPatients.push({
        ...patientInfo,
        id: patientId,
      });
    });

    return allPatients;
  };
}

export default PatientService;
