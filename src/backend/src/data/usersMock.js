import bcrypt from "bcrypt";

const password = await bcrypt.hash("123456", 10);

export const users = [
  {
    id: 1,
    email: "admin@test.com",
    password: password,
    rol: "admin"
  },
  {
    id: 2,
    email: "vendedor@test.com",
    password: password,
    rol: "vendedor"
  },
  {
    id: 3,
    email: "almacen@test.com",
    password: password,
    rol: "almacenista"
  }
];