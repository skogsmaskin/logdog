# Logdog

A simple module for logging and alerting about spesific critical events inside your app for further inspection by a developer.

## Disclaimer

Logdog is not meant to be your application logger or debugger!
It's a tool for logging spesific events in your app, and let someone know about it (it may not even be a developer).
Logdog's barks let you know something is wrong without looking at exceptions, stacktraces and stuff like that.
It's a call to actions for further debugging / log file inspection by a developer.

## Usage

``npm install logdog``

Logdog is first initialized in your app by requiring it and passing configuration options for it:

```
  var logDog = require('logdog')({
    slack: {
      url: 'https://hooks.slack.com/services/XXX/YYY/abc',
      channel: '#appNotifications'
    }
  });
```

Next time you require it, you will get the singleton instance of the first require, so you don't need to
configure Logdog all over the place.

Another place in the code:

```
var logDog = require('logdog')();

```
Logdog is not configured with options from the first require statement.


```
  logDog('myApp.myFeature').bark('Winter is coming!');

```
The function parameter to logDog is the prefix for the log line, indicating where in the application/script the event occurred.

Then we call `.bark(message)` to assign the actual log message.

If we want, we may put it on Slack too:

```
  logDog('myApp.myFeature').bark('Winter is coming!').toSlack({notify: '@john'});

```


### Configuration options

  * `bindToStdOut`
    By default Logdog.bark goes to sdt.err. This will route messages to std.out instead.

  * `slack`

    The `slack` property is a hash of the following keys:

      * `url`: Required. I.e. 'https://hooks.slack.com/services/XXX/YYY/abc'
      * `channel`: Required. I.e. '#appNotifications'
      * `username`: Optinal. Defaults to 'LogDog'.
      * `emoji`: Optional. An emoticon associated with the message. Defaults to ':dog:',
      * `notify`: Optional. Slack username(s) to notify. I.e. '@jon' or ['@jon', '@samwell'].


### Examples:

#### Simple log

```
  var logDog = require('logdog')();
  logDog('myapp.myfeature').bark("Did something of importance!");
```

#### Log and send to Slack

```
  var logDog = require('logdog')({
    slack: {
      url: 'https://hooks.slack.com/services/XXX/YYY/abc',
      channel: '#appNotifications'
    }
  });

  logDog('myapp.myfeature')
    .bark("Did something of importance!")
    .toSlack()
```

#### Log, send to Slack and override previously configured Slack options:

```
  logDog('myapp.myfeature')
    .bark("Something went horribly wrong!")
    .toSlack({emoji: ':heavy_exclamation_mark:', notify: '@myusername'})
```
