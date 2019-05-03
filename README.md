# streamlabs-redis-bridge
Creates an interface to Streamlabs events via Redis pub/sub.

## What Is This?
This follows from [twitch-redis-bridge](https://github.com/laddspencer/twitch-redis-bridge). The idea is similar in that we are simply forwarding web events (donations and follows in this case) to Redis.

## Configuration
A sample config file ([config_sample.json](https://github.com/laddspencer/streamlabs-redis-bridge/blob/master/config_sample.json)) is include in the source tree; use this as the basis for your own.
```
{
  "redis": {
    "hostname": "localhost",
    "port": 6379,
    "channel_prefix": "laddspencer"
  },
  "streamlabs": {
    "creds_path": "/path/to/creds.json"
  }
}
```
- redis
  - hostname: the hostname or IP address of the Redis server; the default is **localhost** (127.0.0.1).
  - port: the port on which the Redis server is listening. By default, Redis listens on **6379**.
  - channel_prefix: prefixed used when publishing Redis messages. For example, in this configration, chat messages will be published on a channel called **laddspencer.streamlabs.message**.
- streamlabs
  - creds_path: path to the file containing streamlabs credentials.

## Credentials
A sample creds file [creds_example.json](https://github.com/laddspencer/streamlabs-redis-bridge/blob/master/creds_example.json) is included in the source tree; use this as the basis for your own.
```
{
"socket_api_token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
}
```
Get your API Token [here](https://streamlabs.com/dashboard#/apisettings) under "API TOKENS" -> "Your Socket API Token".

## streamlabs-socket-client
**streamlabs-redis-bridge** uses [streamlabs-socket-client](https://www.npmjs.com/package/streamlabs-socket-client) to connect to **Streamlabs**. There might be some information there to help you make the most of this package.
