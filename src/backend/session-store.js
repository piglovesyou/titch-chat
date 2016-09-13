import ConnectRedis from 'connect-redis';
import session from 'express-session';
const RedisStore = ConnectRedis(session);
export default new RedisStore({});
