var Campfire = require('../vendor/campfire/lib/campfire').Campfire;

var marshmallow = function(config, definition) {
  var messages = [];

  definition({
    on: function(re, callback) {
      messages.push({"match": re, "callback": callback});
    }
  })

  Campfire.initialize(config);
  var room = Campfire.Room(config.room_id);

  room.join(function() {
    room.listen(function(message) {
      if (message.type != "TextMessage")
        return;

      var match
      var element
      for (re in messages) {
        element = messages[re]
        if (match = message.body.match(element.match)) {
          match.shift()
          element.callback.apply(room, match)
        }
      }
    })
  });
}

exports.marshmallow = marshmallow;
