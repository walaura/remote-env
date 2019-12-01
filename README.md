# remote-env

set `REMOTE_ENV_URL` to be some random json and have it download whe running `remote-env`

basically, install and set your app like this

## package.json

```json
{
  "name": "butts",
  "scripts": {
    "postinstall": "remote-env"
  }
}
```

## .env

```dotenv
REMOTE_ENV_URL=asdf://butts.lol/config.json
```

## asdf://butts.lol/config.json

```json
{
  "token": "banana"
}
```

## index.js

```js
const config = require("remote-env");

config.token === "banana";
```
