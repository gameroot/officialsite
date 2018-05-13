const config = require('config');
const Router = require('koa-router');
const router = new Router();

const defaultLocale = config.defaultLocale || config.locales[0];

router.get('/', async (ctx) => {
  await ctx.render(`${defaultLocale}/index`);
});

router.get('/:page', async (ctx, next) => {
  if (ctx.params.page.indexOf('.') === -1) {
    return await ctx.render(`${defaultLocale}/${ctx.params.page}`);
  }

  return next();
});

router.get('/:locale/:page', async (ctx, next) => {
  if (ctx.params.page.indexOf('.') === -1) {
    return await ctx.render(`${ctx.params.locale}/${ctx.params.page}`);
  }

  return next();
});

module.exports = router.routes();
