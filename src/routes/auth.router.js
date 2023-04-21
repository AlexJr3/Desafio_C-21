import { Router } from "express";
import userModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router();

router.post(
  "/singup",
  passport.authenticate("singUpStrategy", {
    failureRedirect: "/api/sessions/failure-singup",
  }),
  (req, res) => {
    res.send(`Usuario registrado ir a <a href="/products">Productos</a>`);
  }
);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });

    if (user) {
      if (isValidPassword(user, password)) {
        req.session.user = user.email;
        return res.redirect("/products");
      }
    } else {
      res.send("Credenciales invalidas");
    }

    res.send(`Usuario no encontrado <a href="/register">Registrate</a>`);
  } catch (error) {
    res.status(401).send({ status: "error", payload: error.message });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.send("No se puede cerrar la sesion");
    } else {
      return res.redirect("/login");
    }
  });
});

//GitUpPassport

router.get("/github", passport.authenticate("github-singup"));

router.get(
  "/github-callback",
  passport.authenticate("github-singup", {
    failureRedirect: "/api/sessions/failure-singup",
  }),
  (req, res) => {
    res.send(`Usuario autenticado, puedes ir a ver home <a href="/">Home</a>`);
  }
);

router.get("/faiulure-singup", (req, res) => {
  res.send(
    `No fue posible registrar al usuario, prube otra vez <a href="/register">Registrarse</a>`
  );
});
export default router;
