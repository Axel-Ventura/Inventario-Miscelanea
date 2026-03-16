import bcrypt from "bcrypt";
import { users } from "../data/usersMock.js";
import { generateToken } from "../utils/jwt.js";

export const login = async (req, res) => {

  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email requerido"
    });
  }

  if (!password) {
    return res.status(400).json({
      message: "Password requerido"
    });
  }

  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({
      message: "Credenciales incorrectas"
    });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(401).json({
      message: "Credenciales incorrectas"
    });
  }

  const token = generateToken(user);

  res.status(200).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      rol: user.rol
    }
  });

};