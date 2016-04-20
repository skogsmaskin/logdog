var debugz = require("debug");

debugz.disable();

var slackNotify = require('slack-notify');

module.exports = (function () {

  var instance;

  function createInstance(options) {

    options = options || {};

    var slack;

    if (options.slack && options.slack.url && options.slack.channel) {
      slack = slackNotify(options.slack.url);
    }

    return function(prefix) {

      var debug = debugz((options.prefix || "logdog.") + prefix);
      debugz.enable(options.prefix || "logdog." + "*");

      if (options.bindTo === 'stdout') {
        debug.log = console.log.bind(console);
      }

      if (options.bindTo === null) {
        debug.log = function() {}
      }

      var postToSlack = function(message, slackOverrideOptions) {
        slackOverrideOptions = slackOverrideOptions || {};
        var text = ('*' + prefix + '*: ' + message);
        var notify = slackOverrideOptions.notify || (options.slack && options.slack.notify);
        if (notify) {
          if (Array.isArray(notify)) {
            text += " > " + notify.join(", ");
          } else {
            text += " > " + notify;
          }
        }
        var channel = slackOverrideOptions.channel || (options.slack && options.slack.channel);
        if (channel) {
          slack.send({
            channel: channel,
            username: slackOverrideOptions.username || options.slack.username || 'LogDog',
            icon_emoji: slackOverrideOptions.emoji || options.slack.emoji || ':dog:', // eslint-disable-line camelcase
            text: text,
            link_names: 1 // eslint-disable-line camelcase
          });
        } else {
          throw new Error("Logdog is not properly configured for Slack notifications. See logdog README.md");
        }
      }

      var debugWrapper = function(message) {
        debug(message);
        if (slack) {
          return {
            toSlack: function(slackOverrideOptions) {
              postToSlack(message, slackOverrideOptions);
            }
          };
        } else {
          return {
            toSlack: function() {}
          };
        }
      }

      return {
        bark: debugWrapper
      };

    };
  }

  return function(options) {
    if (!instance) {
      instance = createInstance(options);
    }
    return instance;
  };
})();
