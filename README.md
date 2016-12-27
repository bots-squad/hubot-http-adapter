# Hubot http adapter

An adapter (not a plugin) for [Hubot](https://github.com/github/hubot) to work via HTTP using Json as data format.

Useful for headless chat.

## Setup

Set environment variable:

- `HUBOT_POST_RESPONSES_URL` this is the url to send (`POST` method) Hubot responses.

> you need a webapp "listening" on this url, eg:
```javascript
// This is an Express application
app.post(`${process.env.HUBOT_POST_RESPONSES_URL}/:room`, (req, res) => {
  console.log(req.body, req.params);
  res.status(201).end();
});
```

Hubot response is sent in json format, with the following structure:

```javascript
{
  from: 'bot name',
  message: 'Hello 🌍'
}
```

## Send message to Hubot

Typically messages to Hubot have three parameters: Message, User and Room:

```javascript
// post: /receive/:room
{
  from: 'user name',
  message: 'Hello 🤖'
}
```

You can use `fetch` (https://www.npmjs.com/package/node-fetch):

```javascript
// POST message to the `general` room
fetch(`${hubot_protocol}://${hubot_server_name}:${hubot_port}/receive/general`, {
  method: 'POST',
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    from: "@k33g_org",
    message: "bob help me with java"
  })
})
```
