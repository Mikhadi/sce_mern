import User from "../models/user_model";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

function sendError(res: Response, error: string) {
  res.status(400).send({
    error: error,
  });
}

const register = async (req: Request, res: Response) => {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  let avatar_url = req.body.avatar_url;

  if (avatar_url == ""){
    avatar_url = process.env.BASE_URL + "uploads/default_avatar.png"
  }

  try {
    let user = await User.findOne({ email: email });
    if (user != null) {
      return sendError(res, "User already registered");
    }

    user = await User.findOne({ username: username });
    if (user != null) {
      return sendError(res, "User already registered");
    }
  } catch (err) {
    return sendError(res, "Failed checking user");
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const encryptedPwd = await bcrypt.hash(password, salt);
    let newUser = new User({
      email: email,
      password: encryptedPwd,
      username: username,
      name: name,
      avatar_url: avatar_url,
    });
    newUser = await newUser.save();
    res.status(200).send(newUser);
  } catch (err) {
    return sendError(res, "Failed registration");
  }
};

async function generateTokens(userId: string) {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
  );
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET
  );

  return { accessToken: accessToken, refreshToken: refreshToken };
}

const login = async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username == null || password == null) {
    return sendError(res, "Please provide valid email and password");
  }

  try {
    const user = await User.findOne({ username: username });
    if (user == null) {
      return sendError(res, "Incorrect user or password");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return sendError(res, "Incorrect user or password");

    const tokens = await generateTokens(user._id.toString());

    if (user.refresh_tokens == null)
      user.refresh_tokens = [tokens.refreshToken];
    else user.refresh_tokens.push(tokens.refreshToken);
    await user.save();

    return res.status(200).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      id: user._id,
    });
  } catch (err) {
    return sendError(res, "Failed checking user");
  }
};

const logout = async (req: Request, res: Response) => {
  const refreshToken = getTokenFromRequest(req);
  if (refreshToken == null) return sendError(res, "Authentication missing");
  try {
    const user = (await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )) as JwtPayload;
    const userObj = await User.findById(user.id);
    if (userObj == null) return sendError(res, "Failed validating token");

    if (!userObj.refresh_tokens.includes(refreshToken)) {
      userObj.refresh_tokens = [];
      await userObj.save();
      return sendError(res, "Failed validating token");
    }

    userObj.refresh_tokens.splice(
      userObj.refresh_tokens.indexOf(refreshToken),
      1
    );
    await userObj.save();
    res.status(200).send();
  } catch (err) {
    console.log("cathed error" + err)
    return sendError(res, "Failed validating token");
  }
};

function getTokenFromRequest(req: Request): string {
  const authHeaders = req.headers["authorization"];
  if (authHeaders == null) return null;
  return authHeaders.split(" ")[1];
}

const refresh = async (req: Request, res: Response) => {
  const refreshToken = getTokenFromRequest(req);
  if (refreshToken == null) return sendError(res, "Authentication missing");
  try {
    const user = (await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )) as JwtPayload;
    const userObj = await User.findById(user.id);
    if (userObj == null) return sendError(res, "Failed validating token");

    if (!userObj.refresh_tokens.includes(refreshToken)) {
      userObj.refresh_tokens = [];
      await userObj.save();
      return sendError(res, "Failed validating token");
    }

    const newAccessToken = await jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
    );

    const newRefreshToken = await jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET
    );

    userObj.refresh_tokens[userObj.refresh_tokens.indexOf(refreshToken)];
    await userObj.save();

    return res.status(200).send({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    return sendError(res, "Failed validating token");
  }
};

const authenticateMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = getTokenFromRequest(req);
  if (token == null) return sendError(res, "Authentication missing");
  try {
    const user = (await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    )) as JwtPayload;
    req.body.userId = user.id;
    next();
  } catch (err) {
    return sendError(res, "Failed validating token");
  }
};

export = { login, register, logout, authenticateMiddleware, refresh };
