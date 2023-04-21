import passport from "passport";
import gitStrategy from "passport-github2";
import localStrategy from "passport-local";
import userModel from "../models/user.model.js";
import { createHash } from "../utils.js";

export const localPassport = () => {
  passport.use(
    "singUpStrategy",
    new localStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          const { name, lastName, age } = req.body;
          const user = await userModel.findOne({ email: username });
          if (user) {
            return done(null, false);
          }

          if (
            username === "adminCoder@coder.com" &&
            password === "aadminCod3r123"
          ) {
            const admin = {
              name,
              lastName,
              age,
              email: username,
              password: createHash(password),
              rol: "admin",
            };

            const createdAdmin = await userModel.create(admin);

            return done(null, createdAdmin);
          }

          const newUser = {
            name,
            lastName,
            age,
            email: username,
            password: createHash(password),
          };

          const createdUser = await userModel.create(newUser);

          return done(null, createdUser);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};

const gitUpPassport = passport.use(
  "github-singup",
  new gitStrategy(
    {
      clientID: "Iv1.95094a73e8ffae52",
      clientSecret: "4e566a24645f4e1d153d162c02f408088b6dc6c9",
      callbackURL: "http://localhost:8080/api/sessions/github-callback",
    },
    async (accesToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        const userExist = await userModel.findOne({ email: profile.username });
        if (userExist) {
          return done(null, userExist);
        }

        const newUser = {
          name: profile.displayName,
          age: null,
          email: profile.username,
          password: createHash(profile.id),
        };

        const createdUser = await userModel.create(newUser);

        return done(null, createdUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

//Serializar el passport

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await userModel.findById(id);
  return done(null, user);
});
