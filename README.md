# experimental-dev-challenge

Uses a modified `vue-server-renderer/basic.js`, for changes see this [commit](https://github.com/l5x/vue/commit/2a461f7ccd12fe0ee301a8123c6731e5e7ade3fa).

## Project setup

```
npm install -g @cloudflare/wrangler
npm install
```

Add your `account_id` to `wrangler.toml`. You can find your account_id on the
right sidebar of the Workers or Overview Dashboard. Note: You may need to scroll
down! For more details on finding your account_id click [here](https://developers.cloudflare.com/workers/quickstart/#account-id-and-zone-id).

### Preview the project

```
npm run preview
```

### Publish to workers.dev

```
npm run publish
```
