# Logdog

A simple module for logging and alerting about spesific critical events inside your app for further inspection by a developer.

Writes log messages to std.out or std.err.

Supports notifying a Slack channel (fully optional).

## Disclaimer

Logdog is not meant to be your application logger or debugger!
It's a tool for logging spesific events in your app, and let someone know about it (it may not even be a developer).
Logdog's barks let you know something is wrong without looking at exceptions, stacktraces and stuff like that.
It's a call to actions for further debugging / log file inspection by a developer.

## Usage

### Install

`npm install logdog`

### Initialization and configuration

Logdog is first initialized in your app by requiring it and passing configuration options for it:

```
  var logDog = require('logdog')(...config);
```

Next time you require it, you will get the singleton instance of the first require, so you don't need to
configure Logdog all over the place.

Another place in the code (call without any options):

```
var logDog = require('logdog')();

```
Logdog is now configured with options from the first initial require statement.

### Log something

```
  logDog('myApp.myFeature').bark('Winter is coming!');

```
The function parameter to logDog is the prefix for the log line, indicating where in the application/script the event occurred.

Then we call `.bark(message)` to assign the actual log message.

If we want, we may put it on Slack too:

```
  logDog('myApp.myFeature').bark('Winter is coming!').toSlack({notify: '@jon'});

```


### Configuration options

  * `bindToStdOut`
    By default Logdog.bark goes to sdt.err. This will route messages to std.out instead.

  * `slack`

    The `slack` property is a hash of the following keys:

      * `url`: Required. I.e. 'https://hooks.slack.com/services/XXX/YYY/abc'
      * `channel`: Required. I.e. '#appNotifications'
      * `username`: Optional. Defaults to 'LogDog'.
      * `emoji`: Optional. An emoticon associated with the message. Defaults to ':dog:',
      * `notify`: Optional. Slack username(s) to notify. I.e. '@jon' or ['@jon', '@samwell'].


### Examples:

#### Simple log to std.err

```
  var logDog = require('logdog')();
  logDog('myapp.myfeature').bark("Something went so wrong!");
```

#### Simple log to std.out
```
  var logDog = require('logdog')({bindToStdOut: true});
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
