import firebase from "firebase/app";
import * as dotenv from "dotenv";
import * as admin from "firebase-admin";
const serviceAccount = require("./yqnzj-33ac78e22d");
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";

dotenv.config({
  path: "./env/.env",
});

export const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASEURL,
});

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID,
};

export const initializedFirebase = firebase.initializeApp(firebaseConfig);
