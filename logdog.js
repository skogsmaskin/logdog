var debugz = require("debug");

debugz.disable();
debugz.enable("logdog.*");

var slackNotify = require('slack-notify');

module.exports = (function () {

  var instance;

  function createInstance(options) {

    options = options || {};

    var slack = {
      send: function() {
        throw new Error("Logdog is not properly configured for Slack notifications. See logdog README.md");
      }
    };

    if (options.slack && options.slack.url && options.slack.channel) {
      slack = slackNotify(options.slack.url);
    }

    return function(prefix) {

      var debug = debugz("logdog." + prefix);

      if (options.bindToStdOut) {
        debug.log = console.log.bind(console);
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
        slack.send({
          channel: slackOverrideOptions.channel || options.slack.channel,
          username: slackOverrideOptions.username || options.slack.username || 'LogDog',
          icon_emoji: slackOverrideOptions.emoji || options.slack.emoji || ':dog:', // eslint-disable-line camelcase
          text: text,
          link_names: 1 // eslint-disable-line camelcase
        });
      }

      var debugWrapper = function(message) {
        debug(message);
        return {
          toSlack: function(slackOverrideOptions) {
            postToSlack(message, slackOverrideOptions);
          }
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
