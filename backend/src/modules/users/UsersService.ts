import { response } from "express";
import firebase from "firebase/app";
import { logger } from "../../../serverNode";

export interface IUser {
  name: string;
  photoURL: string;
  email: string;
  birthdayDate?: string;
  gender?: string;
  city?: string;
  state?: string;
  profession?: string;
}

class UsersService {
  private db: firebase.database.Database;
  constructor(initializedDb: firebase.database.Database) {
    this.db = initializedDb;
  }

  registerUser = async (
    name: string,
    photoURL: string,
    userFirebaseId: string,
    email: string,
    birthdayDate?: string,
    gender?: string,
    city?: string,
    state?: string,
    profession?: string
  ) => {
    const userInfo: IUser = {
      name,
      photoURL,
      email,
      birthdayDate,
      gender,
      city,
      state,
      profession,
    };

    let existingUser = await this.getUserInfo(userFirebaseId);

    if (existingUser !== null) {
      return existingUser;
    }

    await this.db.ref("users/" + userFirebaseId).set(userInfo);

    return userInfo;
  };

  sendEmailContact = async (
    name: string,
    email: string,
    subject: string,
    message: string
  ) => {
    const emailMessage = {
      name,
      email,
      subject,
      message,
    };

    const id = `${email} - ${subject} - ${new Date().getTime()}`;
    let flag = false;
    try {
      await this.db.ref("contact/" + id).set(emailMessage);
      flag = true;
    } catch (error) {
      flag = false;
    }
    return flag;
  };

  updateUser = async (
    userFirebaseId: string,
    name?: string,
    photoURL?: string,
    birthdayDate?: string,
    gender?: string,
    city?: string,
    state?: string,
    profession?: string
  ) => {
    const userInfo: Partial<IUser> = {};

    if (name) userInfo["name"] = name;
    if (photoURL) userInfo["photoURL"] = photoURL;
    if (birthdayDate) userInfo["birthdayDate"] = birthdayDate;
    if (gender) userInfo["gender"] = gender;
    if (city) userInfo["city"] = city;
    if (state) userInfo["state"] = state;
    if (profession) userInfo["profession"] = profession;

    await this.db.ref("users/" + userFirebaseId).update(userInfo);

    const newUserInfo = await this.getUserInfo(userFirebaseId);

    return newUserInfo;
  };

  getUserInfo = async (userId: string) => {
    let response: IUser | null;
    await this.db.ref("users/" + userId).once("value", (value) => {
      response = value.val();
    });

    return response;
  };

  getQuestions = async () => {
    let response;
    await this.db.ref("questions/").once("value", (value) => {
      response = value.val();
    });

    return response;
  };
}

export default UsersService;
