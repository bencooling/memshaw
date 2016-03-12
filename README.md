# Memshaw
> Monitor your hapi application's memory footprint.

![Screenshot](https://raw.githubusercontent.com/bencooling/memshaw/master/memshaw.gif)

Inspired by
[PubNub-Rickshaw-Memory](https://github.com/pubnub/pubnub-rickshaw-memory), this plugin displays a realtime graph of your NodeJS memory profile over time. It uses socket.io for pushing data to the browser and Shutterstock's [Rickshaw](https://github.com/shutterstock/rickshaw) library for graphing.

## usage

1. Add the memshaw plugin to your hapi installation, here I am using a manifest file with the [glue](https://github.com/hapijs/glue) plugin:
```javascript
{
  ...
  registrations: [
    { plugin: { register: 'memshaw' } },
    ...
  ]
}
```

1. Visit your application in the browser using the `/memshaw` path i.e. `localhost:3000/memshaw`

1. Get your app to chew on some memory! For example you could have a terrible route that you `curl http://localhost:3000/stress` like this:
```javascript
server.route({
  method: 'GET',
  path: '/stress',
  handler: (request, reply) => {
    const stupidBigArray = [];
    fs.createReadStream('/path/to/big/file', 'utf8')
      .on('data', (chunk) => {
        console.log('got %d bytes of data', chunk.length);
        stupidBigArray.push(chunk);
      });
    reply('Why are you pushing all these chunks to an array?');
  },
});
```

## resources
[Rickshaw example](http://code.shutterstock.com/rickshaw/examples/extensions.html)
