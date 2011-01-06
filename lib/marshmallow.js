var Campfire = require('../vendor/campfire/lib/campfire').Campfire
var Yaml = require("../vendor/yaml/lib/yaml")
var Fs = require("fs")

var marshmallow = {
  // Use to create a new marshmallow
  // config can be a string or object, string is a yaml file that gets read in, object is used directly
  new: function(config, definition) {
    if (typeof(config) == "string") {
      // Assume it's a path to a YAML file, lets read that bitch in
      Fs.readFile(config, "utf8", function(err, data) {
        if (err) throw err
        try {
          options = Yaml.eval(data)
        } catch (err) {
          console.log("Failed to load " + config + "!")
          throw err
        }
        marshmallow.boot(options, definition)
      })
    } else {
      // Just fucking boot!
      marshmallow.boot(config, definition)
    }
  },

  // Wherein we actually boot & connect
  boot: function(config, definition) {
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
    })
  }

}

exports.marshmallow = marshmallow;
