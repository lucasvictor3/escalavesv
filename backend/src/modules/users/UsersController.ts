import * as express from "express";
import { initializedFirebase } from "../../firebase/firebase";
import { logger } from "../../../serverNode";
import UsersService from "./UsersService";
import { validateToken } from "../middlewares/firebaseAuth";

const db = initializedFirebase.database();
const usersRouter = express.Router();
const usersService = new UsersService(db);

usersRouter.post("/", validateToken, async (req, res) => {
  const name: string = String(req.body.name);
  const photoURL: string = String(req.body.photoURL);
  const userFirebaseId: string = String(req.body.userFirebaseId);
  const email: string = String(req.body.email);
  const birthdayDate: string = String(req.body.birthdayDate);
  const gender: string = String(req.body.gender);
  const city: string = String(req.body.city);
  const state: string = String(req.body.state);
  const profession: string = String(req.body.profession);
  const response = await usersService.registerUser(
    name,
    photoURL,
    userFirebaseId,
    email,
    birthdayDate,
    gender,
    city,
    state,
    profession
  );

  logger.info({ REGISTER: response });

  res.status(201).send(response);
});

usersRouter.post("/contact", async (req, res) => {
  const name: string = String(req.body.name);
  const email: string = String(req.body.email);
  const subject: string = String(req.body.subject);
  const message: string = String(req.body.message);
  const response = await usersService.sendEmailContact(
    name,
    email,
    subject,
    message
  );

  if (response) {
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

usersRouter.put("/", validateToken, async (req, res) => {
  const name: string | undefined = req.body.name;
  const photoURL: string | undefined = req.body.photoURL;
  const userFirebaseId: string = req.body.userFirebaseId;
  const birthdayDate: string | undefined = req.body.birthdayDate;
  const gender: string | undefined = req.body.gender;
  const city: string | undefined = req.body.city;
  const state: string | undefined = req.body.state;
  const profession: string | undefined = req.body.profession;
  const response = await usersService.updateUser(
    userFirebaseId,
    name,
    photoURL,
    birthdayDate,
    gender,
    city,
    state,
    profession
  );
  logger.info({ UPDATE: response });

  res.status(200).send(response);
});

usersRouter.get("/:userId/info", validateToken, async (req, res) => {
  const userId: string = String(req.params.userId);
  const response = await usersService.getUserInfo(userId);
  logger.info(response);

  res.status(200).send(response);
});

usersRouter.get("/questions", validateToken, async (req, res) => {
  const response = await usersService.getQuestions();

  res.status(200).send(response);
});

export default usersRouter;
