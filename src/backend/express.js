import Path from 'path';
import express from 'express';
import session from 'express-session';
import compression from 'compression';
import logger from 'morgan';
import webpackDevMiddleware from "webpack-dev-middleware";
import webpack from "webpack";
import glob from 'glob';
import webpackConfig from '../../webpack-config/client';
import router, {loadModules, unloadModules} from './router';
import passport from './passport';
import sessionStore from './session-store';

const isProduction = process.env.NODE_ENV === 'production';
const app = express();

app.set('port', normalizePort(process.env.PORT || '3000'));

app.use(logger('dev'));
app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'baa',
}));
app.use(passport.initialize());
app.use(passport.session());

if (isProduction) {
  app.use(compression());
} else {
  Object.assign(webpackConfig.output, { path: '/' });
  app.use(webpackDevMiddleware(webpack(webpackConfig), {}));
}

app.use(express.static(Path.join(__dirname, '../../public')));

app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.email'] }));
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => res.redirect('/'));

// Handle browser GET accesses
app.get('*', isProduction
    ? router
    : [unloadModules, loadModules, router]);

// app.use(favicon());

// Handle 404
app.use((req, res, next) => {
  const err = new Error(`"${req.url}" Not Found`);
  err.status = 404;
  next(err);
});

// Handle errors
app.use(isProduction ? (err, req, res, next) => {
  res.status(err.status || 500);
  res.send('error;)');
} : (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  res.send(`${err.message}

${err.stack}`);
});

export default app;

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
