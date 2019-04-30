#!/usr/bin/nodejs --harmony
//----------------------------------------------------------------

'use strict';
//----------------------------------------------------------------
  
// process is always available without using require().
//const process = require('process')
const minimist = require('minimist')
const fs = require('fs')
const StreamlabsSocketClient = require('streamlabs-socket-client');
const redis = require('redis');
const util = require('util')
const log = require('fancy-log')
const StreamlabsEventPublisher = require('./event_publisher');

const defaultConfigPath = 'config.json';
const defaultConfig = {
  credsPath: './creds.json',
  redis: {
    hostname: 'localhost',
    port: '6379'
  }
};
//----------------------------------------------------------------

// Sample data:
//   {"id":116038744,
//    "name":"TheTwoTime",
//    "amount":1,
//    "formatted_amount":"$1.00",
//    "formattedAmount":"$1.00",
//    "message":"million dollar deals",
//    "currency":"USD",
//    "emotes":null,
//    "iconClassName":"fas user",
//    "to":{"name":"LaddSpencer"},
//    "from":"TheTwoTime",
//    "from_user_id":null,
//    "donation_currency":"USD",
//    "_id":"4e81b64aedaf77bb532284125b77a80f",
//    "isTest":false}
//
//   {"name":"LaddSpencer",
//    "isTest":true,
//    "amount":1,
//    "message":"cheer1 this is a test bit alert",
//    "currency":"USD",
//    "_id":"3ee3b1389989d599f46c01bb8c7de9b8",
//    "formattedAmount":"1"}
//----------------------------------------------------------------

function serve(config, creds, publisher) {
  // true if you want alerts triggered by the test buttons on
  // the streamlabs dashboard to be emitted. default false.
  let emitTests = true;
  
  const streamlabsClient = new StreamlabsSocketClient({
    'token': creds['socket_api_token'],
    'emitTests': emitTests,
    'rawEvents': ['connect']
  });
  
  publisher.registerStreamlabsEventHandlers(streamlabsClient);
  
  streamlabsClient.on('connect', () => {
    log('Connected to Streamlabs.');
  });
  
  streamlabsClient.connect();
}
//----------------------------------------------------------------

function printUsage() {
  console.log("Options:");
  console.log("  -F configfile       Configuration file path.");
  console.log("");
}

function parseArgs(argv) {
  let helpString = "help"
  let args = minimist(argv.slice(2), {"boolean":helpString});
  if (args['_'].length > 0) {
    args._.forEach((unknownOption) => {
      console.log(`I don't know what "${unknownOption}" is.`);
    });
    
    printUsage();
    process.exit(1);
  }
  
  if ((helpString in args) &&
      (args[helpString] == true)) {
    printUsage();
    process.exit(0);
  }
  
  return (args);
}

function getConfigPath(args) {
  if ('F' in args) {
    return (args['F']);
  }
  
  return (defaultConfigPath);
}

function getConfig(configPath) {
  let config = defaultConfig;
  try {
    fs.accessSync(configPath, fs.constants.F_OK | fs.constants.R_OK);
    let configString = fs.readFileSync(configPath, 'utf8');
    config = Object.assign(config, JSON.parse(configString));
  }
  catch (err) {
    console.log(err);
  }
  
  return (config);
}

function getCreds(credsPath) {
  let credString = fs.readFileSync(credsPath, 'utf8');
  return (JSON.parse(credString));
}

function cmdLaunch(argv) {
  let args = parseArgs(argv);
  let configPath = getConfigPath(args);
  reqLaunch(configPath);
}

// If specified, launchArg can be a config object or path to config file.
function reqLaunch(launchArg) {
  if (typeof(launchArg) === 'object') {
    launch(launchArg);
    return;
  }
  
  if (typeof(launchArg) === 'string') {
    let config = getConfig(launchArg);
    launch(config);
    return;
  }
  
  launch(defaultConfig);
}

function launch(config) {
  let creds = getCreds(config.credsPath);
  let publisher = new StreamlabsEventPublisher(config.redis.hostname,
                                               config.redis.port,
                                               config.redis.channel_prefix);
  
  serve(config, creds, publisher);
}
//----------------------------------------------------------------

if (require.main === module) {
  // Run from commandline...
  cmdLaunch(process.argv);
}
else {
  // Run from require()...
  exports.launch = reqLaunch;
}
//----------------------------------------------------------------
