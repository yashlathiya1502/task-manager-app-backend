import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth2';
import { User } from './models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const OAuth2Strategy = Strategy;

app.use(cors());
app.use(express.json());

// setup for google login =======================================
app.use(
  session({
    secret: 'asdasdasdaerWWasirunffr',
    resave: false,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      passReqToCallback: true,
      scope: ['profile', 'email']
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            googleId: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value
          });

          await user.save();
        }
        const userData = {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        };
        const accessToken = generateAccessToken(userData);
        const refreshToken = generateRefreshToken({ _id: user._id });

        req.accessToken = accessToken;
        req.refreshToken = refreshToken;
        
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// inital google auth login
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect(
        `http://localhost:3000/auth/success?accessToken=${req.accessToken}&refreshToken=${req.refreshToken}`
      );
    }
  );

//   =========================================================================

import userRoute from './routes/user.route.js';
import taskRoute from './routes/task.route.js';
import { generateAccessToken, generateRefreshToken } from './controllers/user.controller.js';

app.use('/api/user', userRoute);
app.use('/api/tasks', taskRoute);

export default app;
