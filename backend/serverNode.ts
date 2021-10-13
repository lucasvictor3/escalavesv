import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import usersRouter from './src/modules/users/UsersController';
import evaluationRouter from './src/modules/evaluations/EvaluationController';
import patientRouter from './src/modules/patients/PatientController';
const pino = require('pino');

export const logger = pino({
  prettyPrint: { colorize: true },
});

const app = express();
const port = process.env.PORT || 8001;

dotenv.config({
  path: './env/.env',
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(cors({ credentials: true }));

//Routes
app.use('/users', usersRouter);
app.use('/evaluations', evaluationRouter);
app.use('/patients', patientRouter);

app.listen(process.env.PORT || port, () => {
  console.log('We are live on ' + port);
});

app.get('/', (req, res, next) => {
  res.sendStatus(200);
});
