import renderVueComponentToString from 'vue-server-renderer/basic.js'
import createApp from './entry-server.js'

const render = async context => {
  const app = await createApp(context)

  return new Promise((resolve, reject) =>
    renderVueComponentToString(app, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  )
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
