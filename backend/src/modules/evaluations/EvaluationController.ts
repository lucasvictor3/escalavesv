import * as express from "express";
import { initializedFirebase } from "../../firebase/firebase";
import { logger } from "../../../serverNode";
import EvaluationService from "./EvaluationService";
import { validateToken } from "../middlewares/firebaseAuth";

const db = initializedFirebase.database();
const evaluationRouter = express.Router();
const evaluationService = new EvaluationService(db);

evaluationRouter.post("/", validateToken, async (req, res) => {
  const userFirebaseId: string = String(req.body.userFirebaseId);
  const targetUserId: string = String(req.body.targetUserId);

  const response = await evaluationService.registerEvaluation(
    userFirebaseId,
    targetUserId
  );

  logger.info({ "REGISTER EVALUATION:": response });

  res.status(200).send(response);
});

evaluationRouter.put("/", validateToken, async (req, res) => {
  const userId: string = String(req.body.userId);
  const targetUserId: string = String(req.body.targetUserId);
  const dateStart: string = String(req.body.dateStart);
  const responses: number[] = req.body.responses;
  const isResponsesFilled: boolean = req.body.isResponsesFilled;
  const currentQuestionIndex: number = req.body.currentQuestionIndex;

  const response = await evaluationService.updateEvaluation(
    userId,
    targetUserId,
    dateStart,
    responses,
    currentQuestionIndex,
    isResponsesFilled
  );

  logger.info({ "UPDATE EVALUATION:": response });

  res.status(200).send(response);
});

evaluationRouter.get(
  "/:userId/:targetUserId/:dateState/info",
  validateToken,
  async (req, res) => {
    const userId: string = String(req.params.userId);
    const targetUserId: string = String(req.params.targetUserId);
    const dateState: string = String(req.params.dateState);

    const response = await evaluationService.getUserEvaluationInfo(
      userId,
      targetUserId,
      dateState
    );

    logger.info({ "GET EVALUATION:": response });

    if (response === null) {
      res.sendStatus(404);
      return;
    }

    res.status(200).send(response);
  }
);

evaluationRouter.get(
  "/:userId/:targetUserId/all/:finishedEvaluationsOnly",
  validateToken,
  async (req, res) => {
    const userId: string = String(req.params.userId);
    const targetUserId: string = String(req.params.targetUserId);
    const finishedEvaluationsOnly: boolean =
      req.params.finishedEvaluationsOnly === "false" ? false : true;

    const response = await evaluationService.getAllSpecificUserEvaluations(
      userId,
      targetUserId,
      finishedEvaluationsOnly
    );

    logger.info({ "ALL EVALUATION:": response });

    if (response === null) {
      res.sendStatus(404);
      return;
    }

    res.status(200).send(response);
  }
);

export default evaluationRouter;
