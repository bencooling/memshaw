'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _bytes = require('bytes');

var _bytes2 = _interopRequireDefault(_bytes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getMemory = function getMemory() {
  var m = process.memoryUsage();
  var data = Object.keys(m).reduce(function (o, key) {
    o[key] = Number((0, _bytes2.default)(m[key]).replace('MB', ''));
    return o;
  }, {});
  data.time = Date.now() / 1000;
  return data;
};
var compileTpl = function compileTpl(s, d) {
  return s.replace(/{{(.+?)}}/g, function (match, p1) {
    return d[p1] ? d[p1] : '';
  });
};

exports.register = function (server, options, next) {
  server.route({
    method: 'GET',
    path: '/memshaw',
    handler: function handler(request, reply) {
      var io = (0, _socket2.default)(server.listener);
      io.on('connection', function (socket) {
        server.log(['socket'], 'user connected');
        socket.on('disconnect', function () {
          server.log(['socket'], 'user disconnected');
        });
        setInterval(function () {
          io.emit('memory usage', getMemory());
        }, 1000);
      });
      // Simple string replace templating
      reply(compileTpl(_fs2.default.readFileSync(_path2.default.join(__dirname, './index.html'), 'utf8'), getMemory()));
    }
  });

  next();
};

exports.register.attributes = {
  name: 'memshaw',
  version: '0.1.3'
};
