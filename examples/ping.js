var marshmallow = require("../lib/marshmallow").marshmallow

var config = {
  token:   process.env["CAMPFIRE_TOKEN"],
  account: process.env["CAMPFIRE_ACCOUNT"],
  ssl:     process.env["CAMPFIRE_SSL"] == "true",
  room_id: process.env["CAMPFIRE_ROOM"] // Casual
}

marshmallow(config, function(bot) {
  bot.on(/^(!?ping)/, function() {
    this.speak("pong!")
  })
})
