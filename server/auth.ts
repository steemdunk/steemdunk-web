import { Context } from 'koa';
import axios from 'axios';

export const callback = async function(ctx: Context) {
  const code = ctx.query.code;
  if (!code) {
    ctx.status = 401;
    return;
  }

  try {
    const res = await axios.post('/signin', {
      code
    });

    ctx.cookies.set('session', res.data.token, {
      expires: new Date(res.data.expiry),
      httpOnly: true
    });

    return ctx.redirect('/');
  } catch (e) {
    if (e.response && e.response.status === 401) {
      ctx.status = 401;
      ctx.body = 'Authentication failed';
    } else {
      console.error('Authentication error:', e);
      ctx.status = 500;
      ctx.body = 'Internal server error';
    }
  }
}
