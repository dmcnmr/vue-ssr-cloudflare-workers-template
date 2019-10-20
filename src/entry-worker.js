import clientManifest from '../dist/client/vue-ssr-client-manifest.json'
import createApp from './entry-server.js'
import { createRenderer } from '../vendor/vue-server-renderer/basic.js'

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
    <link rel="icon" href="{{ test }}favicon.ico">
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

  return renderer.renderToString(app, {})
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  const init = {
    status: 200,
    headers: {
      'content-type': 'text/html;charset=UTF-8'
    }
  }

  const response = await render({ url: url.pathname })

  return new Response(response, init)
}

// render({ url: '/about' }).then(console.log)
