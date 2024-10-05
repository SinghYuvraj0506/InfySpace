import jwt, { JwtPayload } from "jsonwebtoken";
import moment from "moment";

export const getJWTFromPayload = (payload: JwtPayload) => {
  try {
    const res = jwt.sign(payload, process.env.JWT_SECRET as string,{
        expiresIn: "10 days"
    });
    return {token: res, expiry: moment().add(10, "day").valueOf() };
  } catch (error) {
    console.log("Error in signing jwt")
    return false;
  }
};

export const decodeJWT = (token: string) => {
  try {
    const decodedInfo = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    return decodedInfo as {id:string};
  } catch (error) {
    console.log("Error in signing jwt")
    return false;
  }
};
