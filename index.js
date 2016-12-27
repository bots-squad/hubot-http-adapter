const Robot = require('hubot').Robot
const Adapter = require('hubot').Adapter
const TextMessage = require('hubot').TextMessage
const fetch = require('node-fetch')
const string = require("string")

// sendmessageURL ${hubot_protocol}://${hubot_server_name}:${hubot_port}/${listening_route}
let sendMessageUrl = process.env.HUBOT_POST_RESPONSES_URL;

class WebAdapter extends Adapter {
  createUser(username, room) {
    let user = this.robot.brain.userForName(username);
    if (user == null) {
      let id = new Date().getTime().toString();
      user = this.robot.brain.userForId(id);
      user.name = username;
    }
    user.room = room;
    return user;
  }

  send(user, ...strings) {
    if (strings.length > 0) {
      let data = JSON.stringify({
        message: strings.shift(),
        from: `${this.robot.name}`
      });
      let url = `${sendMessageUrl}/${user.room}`;
      let options = {
        url,
        method: 'POST',
        body: data,
        headers: {
          "Content-Type": "application/json"
        }
      };
      fetch(url, options)
        .then(response => {
          return response;
        }).catch(err => {
          console.error("😡 error:", err)
        });
    }
  }

  reply(user, ...strings) {
    return this.send(user, ...strings.map(str => `${user.user.name}: ${str}`));
  }

  run() {
    this.robot.router.post('/receive/:room', (req, res) => {
      let user = this.createUser(req.body.from, req.params.room);
      console.log(`[${req.params.room}] ${user.name} => ${req.body.message}`);
      res.setHeader('content-type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      this.receive(new TextMessage(user, req.body.message));
      res.send(JSON.stringify({status: 'received'}));
    });

    this.emit("connected");
  }
}

module.exports = {
  use: (robot) => {
    return new WebAdapter(robot);
  }
}
