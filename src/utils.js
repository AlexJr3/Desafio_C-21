import path from "path";
import bcrypt from "bcrypt";

import { fileURLToPath } from "url";

// Debemos crear nuestra propia variable __dirname a travÃ©s de este mÃ©todo si usamos ESM

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export default __dirname;

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

export const isValidPassword = (user, loginPassword) => {
  return bcrypt.compareSync(loginPassword, user.password);
};
