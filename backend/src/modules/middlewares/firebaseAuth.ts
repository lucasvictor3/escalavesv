import { firebaseAdmin } from "../../firebase/firebase";

export const validateToken = async (req, res, next) => {
  let accessToken = req.headers.authorization;

  console.log("JWT TOKEN: ", accessToken);

  if (accessToken) {
    const bearer = accessToken.split(" ");
    const bearerToken = bearer[1];
    try {
      await firebaseAdmin
        .auth()
        .verifyIdToken(bearerToken)
        .then((decodedToken) => {
          console.log("GRANTED TOKEN ", bearerToken);
          next();
        })
        .catch((err) => {
          throw err;
        });
    } catch (error) {
      console.log("ERROR TOKEN");
      return res.sendStatus(403);
    }
  }

  // //if there is no token stored in cookies, the request is unauthorized
  // if (!accessToken) {
  //     return res.status(403).send();
  // }

  // let payload;
  // try {
  //     //use the jwt.verify method to verify the access token
  //     //throws an error if the token has expired or has a invalid signature
  //     payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  //     next();
  // } catch (e) {
  //     //if an error occured return request unauthorized error
  //     return res.status(401).send();
  // }
};
