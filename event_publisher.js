
'use strict';
//----------------------------------------------------------------

const redis = require("redis");
//----------------------------------------------------------------

const FOLLOW_EVENT = 'follow';
const DONATION_EVENT = 'donation';
const SUBSCRIPTION_EVENT = 'subscription';
const RESUBSCRIPTION_EVENT = 'resubscription';
const HOST_EVENT = 'host';
const BITS_EVENT = 'bits';
//----------------------------------------------------------------

// Maps Streamlabs events to Redis channels.
module.exports = class StreamlabsEventPublisher {
  constructor(redisHost, redisPort, channelPrefix) {
    this.streamlabsChannelPrefix = `${channelPrefix}.streamlabs`;
    this.handlerMap = {
      [FOLLOW_EVENT]: this.onFollowHandler.bind(this),
      [DONATION_EVENT]: this.onDonationHandler.bind(this),
      [SUBSCRIPTION_EVENT]: this.onSubscriptionHandler.bind(this),
      [RESUBSCRIPTION_EVENT]: this.onResubscriptionHandler.bind(this),
      [HOST_EVENT]: this.onHostHandler.bind(this),
      [BITS_EVENT]: this.onBitsHandler.bind(this)
    };
    
    let redisOptions = {
      'host': redisHost,
      'port': redisPort
    };
    
    this.pubClient = redis.createClient(redisOptions);
  }
  
  registerStreamlabsEventHandlers(streamlabsClient) {
    let eventNames = Object.keys(this.handlerMap);
    eventNames.forEach((eventName) => {
      //console.log(`key: ${eventName}, value: ${this.handlerMap[eventName]}`);
      console.log(`StreamlabsEventPublisher will be publishing on ${this.streamlabsChannelPrefix}.${eventName}`);
      streamlabsClient.on(eventName, this.handlerMap[eventName]);
    });
  }
  
  unregisterStreamlabsEventHandlers(streamlabsClient) {
    let eventNames = Object.keys(this.handlerMap);
    eventNames.forEach((eventName) => {
      //console.log(`key: ${eventName}, value: ${this.handlerMap[eventName]}`);
      streamlabsClient.removeListener(eventName, this.handlerMap[eventName]);
    });
  }

//----------------------------------------------------------------
// Event Handlers
//----------------------------------------------------------------
  onFollowHandler(data) {
    //console.log('onFollowHandler', data);
    let payload = JSON.stringify(data);
    this.pubClient.publish(`${this.streamlabsChannelPrefix}.${FOLLOW_EVENT}`, payload);
  }
  
  onDonationHandler(data) {
    //console.log('onDonationHandler', data);
    let payload = JSON.stringify(data);
    this.pubClient.publish(`${this.streamlabsChannelPrefix}.${DONATION_EVENT}`, payload);
  }
  
  onSubscriptionHandler(data) {
    //console.log('onSubscriptionHandler', data);
    let payload = JSON.stringify(data);
    this.pubClient.publish(`${this.streamlabsChannelPrefix}.${SUBSCRIPTION_EVENT}`, payload);
  }
  
  onResubscriptionHandler(data) {
    //console.log('onResubscriptionHandler', data);
    let payload = JSON.stringify(data);
    this.pubClient.publish(`${this.streamlabsChannelPrefix}.${RESUBSCRIPTION_EVENT}`, payload);
  }
  
  onHostHandler(data) {
    //console.log('onHostHandler', data);
    let payload = JSON.stringify(data);
    this.pubClient.publish(`${this.streamlabsChannelPrefix}.${HOST_EVENT}`, payload);
  }
  
  onBitsHandler(data) {
    //console.log('onBitsHandler', data);
    let payload = JSON.stringify(data);
    this.pubClient.publish(`${this.streamlabsChannelPrefix}.${BITS_EVENT}`, payload);
  }
}
//----------------------------------------------------------------
