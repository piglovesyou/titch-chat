import ConnectRedis from 'connect-redis';
import session from 'express-session';
// export default new session.MemoryStore();
const RedisStore = ConnectRedis(session);
export default new RedisStore({
  url: process.env.REDISTOGO_URL || undefined/* localhost */
});
