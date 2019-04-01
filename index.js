const Command = require('./lib/command');
const { easyMockMiddleware, start } = require('./lib/middleware');

module.exports = {
  start,
  Command,
  easyMockMiddleware,
  easyMockMiddle: easyMockMiddleware,
};
