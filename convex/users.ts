import { query } from './_generated/server';
import { isAuth } from './helpers';

export const getUser = query({
  args: {},
  handler: async ctx => {
    const user = await isAuth(ctx);

    if (!user) return null;
    else return user;
  },
});
