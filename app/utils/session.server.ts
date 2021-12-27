import bcrypt from "bcrypt";
import { db } from "./db.server";
import { createCookieSessionStorage, redirect } from "remix";

export type UserCredentials = {
  username: string;
  password: string;
};
////////////////////////////////////////
// Login user
export async function login({ username, password }: UserCredentials) {
  const user = await db.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) return null;

  // Check password
  const isCorrectPassword = await bcrypt.compare(password, user.password);

  if (!isCorrectPassword) return null;

  return user;
}
/////////////////////////////////////
// Register new user
export async function register({ username, password }: UserCredentials) {
  const passwordHash = await bcrypt.hash(password, 10);
  return db.user.create({
    data: {
      username,
      password: passwordHash,
    },
  });
}

/////////////////////////////////
//// USER SESSION
/////////////////////////////////////
// Get session secret
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("No session secret");
}
///////////////////////////////
// Create session storage
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "remixblog_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 60, //60 days
    httpOnly: true,
  },
});
//////////////////////////////////////
// Create  user session for current user
export async function createUserSession(userId: string, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}
///////////////////////////////////////////
//get current User Session
export function getUserSession(request: Request) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}
//get logged in user's ID from user's session
export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

/////////////////////////////////////////
// Get logged in user
export async function getUser(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    return null;
  }
  try {
    const user = await db.user.findUnique({ where: { id: parseInt(userId) } });
    return user;
  } catch (error) {
    return null;
  }
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

//////////////////////////////////\
//LOGOUT user and destroy session
export async function logout(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  return redirect("/auth/logout", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
