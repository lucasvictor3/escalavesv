import * as express from "express";
import { initializedFirebase } from "../../firebase/firebase";
import { logger } from "../../../serverNode";
import PatientService from "./PatientService";
import { validateToken } from "../middlewares/firebaseAuth";

const db = initializedFirebase.database();
const patientRouter = express.Router();
const patientService = new PatientService(db);

patientRouter.post("/", validateToken, async (req, res) => {
  const userFirebaseId: string = String(req.body.userFirebaseId);
  const name: string = String(req.body.name);
  const birthdayDate: string = String(req.body.birthdayDate);
  const gender: string = String(req.body.gender);
  const schooling: string = String(req.body.schooling);
  const diagnosis: string = String(req.body.diagnosis);

  const response = await patientService.registerPatient(
    userFirebaseId,
    name,
    birthdayDate,
    gender,
    schooling,
    diagnosis
  );

  logger.info({ REGISTER_PATIENT: response });

  res.status(201).send(response);
});

patientRouter.put("/", validateToken, async (req, res) => {
  const userFirebaseId: string = String(req.body.userFirebaseId);
  const patientId: string = req.body.patientId;
  const name: string | undefined = req.body.name;
  const birthdayDate: string | undefined = req.body.birthdayDate;
  const gender: string | undefined = req.body.gender;
  const schooling: string | undefined = req.body.schooling;
  const diagnosis: string | undefined = req.body.diagnosis;

  const response = await patientService.updatePatient(
    userFirebaseId,
    patientId,
    name,
    birthdayDate,
    gender,
    schooling,
    diagnosis
  );
  logger.info({ UPDATE_PATIENT: response });

  res.status(200).send(response);
});

patientRouter.delete(
  "/:patientId/:userFirebaseId",
  validateToken,
  async (req, res) => {
    const userFirebaseId: string = String(req.params.userFirebaseId);
    const patientId: string = String(req.params.patientId);
    const response = await patientService.deletePatient(
      userFirebaseId,
      patientId
    );
    if (response) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
);

patientRouter.get(
  "/:patientId/info/:userFirebaseId",
  validateToken,
  async (req, res) => {
    const userFirebaseId: string = String(req.params.userFirebaseId);
    const patientId: string = String(req.params.patientId);
    const response = await patientService.getPatientInfo(
      userFirebaseId,
      patientId
    );
    logger.info({ GET_PATIENT: response });

    res.status(200).send(response);
  }
);

patientRouter.get("/all/:userFirebaseId", validateToken, async (req, res) => {
  const userFirebaseId: string = String(req.params.userFirebaseId);
  const response = await patientService.getAllPatients(userFirebaseId);
  logger.info({ ALL_PATIENTS: response });

  res.status(200).send(response);
});

export default patientRouter;
