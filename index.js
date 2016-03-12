const fs = require('fs');
const path = require('path');
const sio = require('socket.io');
const bytes = require('bytes');

// Get Object literal of time, rss, heap total & heap used.
const getMemory = () => {
  const m = process.memoryUsage();
  const data = Object.keys(m).reduce((o, key) => {
    o[key] = Number(bytes(m[key]).replace('MB', ''));
    return o;
  }, {});
  data.time = (Date.now() / 1000);
  return data;
};

// Replace {{variable}} in string with equivalent property of data object
const compileTpl = (s, d) =>
  s.replace(/{{(.+?)}}/g, (match, p1) => (d[p1]) ? d[p1] : '');

// memshaw plugin adds the /memshaw route to the application
exports.register = (server, options, next) => {
  server.route({
    method: 'GET',
    path: '/memshaw',
    handler: (request, reply) => {
      const io = sio(server.listener);
      io.on('connection', (socket) => {
        server.log(['socket'], 'user connected');
        socket.on('disconnect', () => {
          server.log(['socket'], 'user disconnected');
        });
        setInterval(() => {
          io.emit('memory usage', getMemory());
        }, 1000);
      });
      // Simple string replacement, no view template engines needed
      reply(compileTpl(
        fs.readFileSync(path.join(__dirname, './index.html'), 'utf8'),
        getMemory()));
    },
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json'),
};
