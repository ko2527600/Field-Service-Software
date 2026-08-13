import type { Request, Response } from "express";
import { registerInputSchema, loginInputSchema } from "@firearmour/shared";
import * as authService from "../services/auth.service.js";
import { SESSION_COOKIE_NAME } from "../lib/auth.js";
import { HttpError } from "../middleware/errorHandler.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function register(req: Request, res: Response) {
  const input = registerInputSchema.parse(req.body);
  const { token, user } = await authService.register(input);
  res.cookie(SESSION_COOKIE_NAME, token, cookieOptions);
  res.status(201).json(user);
}

export async function login(req: Request, res: Response) {
  const input = loginInputSchema.parse(req.body);
  const { token, user } = await authService.login(input);
  res.cookie(SESSION_COOKIE_NAME, token, cookieOptions);
  res.json(user);
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie(SESSION_COOKIE_NAME);
  res.status(204).end();
}

export async function me(req: Request, res: Response) {
  if (!req.userId) throw new HttpError(401, "Not authenticated");
  const user = await authService.getMe(req.userId);
  res.json(user);
}
