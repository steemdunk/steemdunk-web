import * as config from '../nuxt.config';
import { Nuxt, Builder } from 'nuxt';
import * as consola from 'consola';
import * as route from 'koa-route';
import { callback } from './auth';
import * as Koa from 'koa';
import axios from 'axios';

const app = new Koa();
const host = process.env.HOST || '127.0.0.1';
const port = Number.parseInt(process.env.PORT || '3000');

config.dev = app.env !== 'production';
axios.defaults.baseURL = process.env.API_URL || config.axios.baseURL;

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config);

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  app.use(route.get('/callback', callback));

  app.use(ctx => {
    ctx.status = 200;

    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve);
      ctx.res.on('finish', resolve);
      nuxt.render(ctx.req, ctx.res, promise => {
        promise.then(resolve).catch(reject);
      });
    });
  });

  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}

start().catch(e => {
  consola.error('Startup error!\n', e);
});
