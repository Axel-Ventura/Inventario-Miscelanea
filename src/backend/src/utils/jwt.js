import jwt from "jsonwebtoken";

export const generateToken = (user) => {

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      rol: user.rol
    },
    "secret_key",
    {
      expiresIn: "24h"
    }
  );

};