import { Request, NextFunction, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { decodeJWT } from "../utils/jwt.js";

export const verifyJWT = asyncHandler(
  async (req: Request, _, next: NextFunction) => {
    try {
      const accessToken =
        req.cookies["infy-space-token"] ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!accessToken) {
        throw new ApiError(401, "Unauthorized Access!!!");
      }

      const data = decodeJWT(accessToken);

      if (!data) {
        throw new ApiError(400, "Invalid Request");
      }

      req.user = data;
      next();
    } catch (error: any) {
      throw new ApiError(401, error?.message || "Invalid Access Token");
    }
  }
);

export const ensureGuest = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    try {
      // jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as Secret);

      // User is authenticated, redirect to another route (e.g., home page)
      return res.redirect(process.env.CLIENT_URL as string);
    } catch (error) {
      return next();
    }
  }
);
