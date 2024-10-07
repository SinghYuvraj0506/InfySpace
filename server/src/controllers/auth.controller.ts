import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import axios from "axios";
import prisma from "../utils/db";
import { ApiError } from "../utils/ApiError";
import { getJWTFromPayload } from "../utils/jwt";
import { ApiResponse } from "../utils/ApiResponse";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REDIRECT_URI2 = process.env.REDIRECT_URI2;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const authGoogle = asyncHandler((req: Request, res: Response) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
  return res.redirect(url);
});

export const authDriveGoogle = asyncHandler((req: Request, res: Response) => {
  const { userId } = req.query;
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI2}&response_type=code&scope=https://www.googleapis.com/auth/drive profile email&state=${userId}`;
  return res.redirect(url);
});

export const googleCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const { code } = req.query;

    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const { access_token, id_token } = data;

    const { data: profile } = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
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
  }
);

export const googleDriveCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const { code, state } = req.query;

    try {
      if (!state) {
        throw new ApiError(401, "User not found, Some Error Occured");
      }

      const { data } = await axios.post("https://oauth2.googleapis.com/token", {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI2,
        grant_type: "authorization_code",
      });

      const { access_token, id_token } = data;

      const { data: profile } = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: { Authorization: `Bearer ${access_token}` },
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
          accessToken: access_token,
          refreshToken: code as string,
          avatar: profile?.picture,
          accountEmail: profile?.email,
          provider: "Google",
          userId: state as string,
        },
      });

      res.redirect(`${process.env.ClIENT_URI}/dashboard/accounts?success=${"Account Linked Successfully"}`);
    } catch (error:any) {
      res.redirect(`${process.env.ClIENT_URI}/dashboard/accounts?error=${error?.message || "Something Went Wrong"}`);
    }
  }
);

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("infy-space-token");
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Logged Out Successfully"));
});
