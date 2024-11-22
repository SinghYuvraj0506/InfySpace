import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import axios from "axios";
import prisma from "../utils/db";
import { ApiError } from "../utils/ApiError";
import { getJWTFromPayload } from "../utils/jwt";
import { ApiResponse } from "../utils/ApiResponse";
import { google } from "googleapis";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REDIRECT_URI2 = process.env.REDIRECT_URI2;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const oauth2ClientDrive = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI2
);

const oauth2ClientLogin = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

export const authGoogle = asyncHandler((req: Request, res: Response) => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  const authorizationUrl = oauth2ClientLogin.generateAuthUrl({
    access_type: "online",
    scope: scopes,
  });

  return res.redirect(authorizationUrl);
});

export const authDriveGoogle = asyncHandler((req: Request, res: Response) => {
  const { userId } = req.query;
  const scopes = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  const authorizationUrl = oauth2ClientDrive.generateAuthUrl({
    access_type: "offline", // gives me refresh token to use it later
    scope: scopes,
    state: userId as string, // returns the userid in the callback
    prompt: "consent",
  });

  return res.redirect(authorizationUrl);
});

export const googleCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const { code } = req.query;

    try {
      if (!code) {
        throw new ApiError(401, "Code not found, Some Error Occured");
      }

      let { tokens } = await oauth2ClientDrive.getToken(code as string);

      const { data: profile } = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        }
      );

      let accounts = await prisma.accounts.findFirst({
        where: { accountEmail: profile?.email, provider: "Google" },
      });

      if (accounts) {
        throw new ApiError(400, "Account already linked");
      }

      const user = await prisma.user.upsert({
        where: { email: profile?.email },
        create: {
          email: profile?.email,
          name: profile?.name,
          avatar: profile?.picture,
        },
        update: {
          name: profile?.name,
          avatar: profile?.picture,
        },
      });

      const jwt = getJWTFromPayload({
        id: user?.id,
        name: user?.name,
        email: user?.email,
      });

      if (!jwt) {
        throw new ApiError(400, "Could not login");
      }

      res.cookie("infy-space-token", jwt.token, {
        maxAge: jwt?.expiry,
        httpOnly: true,
      });

      res.redirect(`${process.env.ClIENT_URI}/dashboard`);
    } catch (error) {
      res.redirect(`${process.env.ClIENT_URI}`);
    }
  }
);

export const googleDriveCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const { code, state } = req.query;

    try {
      if (!state || !code) {
        throw new ApiError(401, "User/Code not found, Some Error Occured");
      }

      let { tokens } = await oauth2ClientDrive.getToken(code as string);

      const { data: profile } = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        }
      );

      let accounts = await prisma.accounts.findFirst({
        where: { accountEmail: profile?.email, provider: "Google" },
      });

      if (accounts) {
        throw new ApiError(400, "Account is already linked");
      }

      await prisma.accounts.create({
        data: {
          accessToken: tokens?.access_token,
          refreshToken: tokens?.refresh_token as string,
          tokenExpiresAt: new Date(tokens?.expiry_date as number),
          avatar: profile?.picture,
          accountEmail: profile?.email,
          provider: "Google",
          userId: state as string,
        },
      });

      res.redirect(
        `${
          process.env.ClIENT_URI
        }/dashboard/accounts?success=${"Account Linked Successfully"}`
      );
    } catch (error: any) {
      res.redirect(
        `${process.env.ClIENT_URI}/dashboard/accounts?error=${
          error?.message || "Something Went Wrong"
        }`
      );
    }
  }
);

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("infy-space-token");
  res
    .status(200)
    .json(new ApiResponse(200, {}, "Logged Out Successfully"));
});
