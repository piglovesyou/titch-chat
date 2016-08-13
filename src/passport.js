import passport from 'passport';
import {OAuth2Strategy} from 'passport-google-oauth';

passport.serializeUser((user, done) => {
  const id = [user.name, user.photo].map(encodeURIComponent).join(';');
  done(null, id);
});

passport.deserializeUser((id, done) => {
  const [name, photo] = id.split(';').map(decodeURIComponent);
  done(null, {name, photo});
});

passport.use(new OAuth2Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CLIENT_CALLBACK,
  }, (accessToken, refreshToken, {displayName, photos}, done) => {
    const user = {name: displayName, photo: photos[0].value};
    done(null, user);
  }
));

export default passport;
