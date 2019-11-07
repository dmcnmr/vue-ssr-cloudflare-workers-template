import clientManifest from '../dist/client/vue-ssr-client-manifest.json'
import createApp from './entry-server.js'
import { createRenderer } from '../vendor/vue-server-renderer/basic.js'
import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

/**
 * The DEBUG flag will do two things that help during development:
 * 1. Skip caching on the edge, which makes it easier to
 *    debug.
 * 2. Return an error message on exception in your Response.
 */
const DEBUG = false

const renderer = createRenderer({
  clientManifest,
  inject: true,
  template: (content, context) => {
    const head = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="favicon.ico">
    <title>experimental-dev-challenge</title>
    `
    const neck = `
  </head>
  <body>
    <noscript>
      <strong>We're sorry but experimental-dev-challenge doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    `
    const tail = `
  </body>
</html>
    `

    return (
      head +
      (context.head || '') +
      context.renderResourceHints(context) +
      context.renderStyles(context) +
      neck +
      content +
      context.renderState(context) +
      context.renderScripts(context) +
      tail
    )
  }
})

const render = async context => {
  const app = await createApp(context)

  return renderer.renderToString(app, context)
}

addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event))
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500
        })
      )
    }
    event.respondWith(new Response('Internal Error', { status: 500 }))
  }
})

async function handleEvent(event) {
  let options = {}

  if (DEBUG) {
    // customize caching
    options.cacheControl = {
      bypassCache: true
    }
  }

  try {
    return await getAssetFromKV(event, options)
  } catch (e) {
    const url = new URL(event.request.url)

    const init = {
      status: 200,
      headers: {
        'content-type': 'text/html;charset=UTF-8'
      }
    }

    const response = await render({ url: url.pathname })

    return new Response(response, init)
  }
}
