import Path from 'path';
import express from 'express';
import favicon from 'serve-favicon';
import logger from 'morgan';
// import bodyParser from 'body-parser';
// import cookieParser from 'cookie-parser';
import webpackDevMiddleware from "webpack-dev-middleware";
import webpack from "webpack";
import webpackConfig from '../webpack-config/client';
import compression from 'compression';
import layout from './layout';
import glob from 'glob';
import session from 'express-session';
import ConnectRedis from 'connect-redis';
import passport from './passport';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router'
import routes from './router';
import Store from './stores/application';

const RedisStore = ConnectRedis(session);
const isProduction = process.env.NODE_ENV === 'production';
const app = express();

app.set('port', normalizePort(process.env.PORT || '3000'));

app.use(logger('dev'));
app.use(session({
  store: new RedisStore({}),
  secret: process.env.SESSION_SECRET || 'baaa',
}));
app.use(passport.initialize());
app.use(passport.session());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());

if (!isProduction) {
  Object.assign(webpackConfig.output, { path: '/' });
  app.use(webpackDevMiddleware(webpack(webpackConfig), {}));
} else {
  app.use(compression());
}

app.use(express.static(Path.join(__dirname, '../public')));

app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.email'] }));
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => res.redirect('/'));

app.get('*', (req, res) => {
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      const data = {
        title: 'Express',
        messages: ['yeah!', 'baam!', 'baaa!'],
        user: req.user,
      };
      // Injection point of initial data in server-side.
      // XXX: Other way?
      Store._state = data;
      const html = renderToString(<RouterContext {...renderProps} />);
      Store._state = null;
      res.status(200).send(layout([data, html]));
      // if (!isProduction) {
      //   console.log('=========== enterig');
      //   const componentModules = new RegExp('^' + Path.join(__dirname, 'components'));
      //   for (let m of Object.keys(require.cache)) {
      //     if (!/node_modules/.test(m)) console.log(m);
      //     if (!/node_modules/.test(require.cache[m].filename)) {
      //       console.log('[delete] ' + m);
      //       delete require.cache[m];
      //     }
      //   }
      // }
    } else {
      res.status(404).send('Not found')
    }
  })
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500);
    res.send(`${err.message}

${err.stack}`);
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send('error;)');
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
