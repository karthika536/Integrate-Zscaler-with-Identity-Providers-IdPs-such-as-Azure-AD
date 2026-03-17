import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "nimbus-zscaler-idp-super-secret-key-2026";

export const generateToken = (payload) =>
  jwt.sign(payload, SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "8h"
  });

export const verifyToken = (token) => jwt.verify(token, SECRET);

