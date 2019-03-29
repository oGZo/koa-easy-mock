'use strict';
const { start } = require('./middleware')
const BaseCommand = require('common-bin');

class Command extends BaseCommand {
  constructor(rawArgv) {
    super(rawArgv);
    this.parserOptions = {
      execArgv: true,
      removeAlias: true,
    };

    // common-bin setter, don't care about override at sub class
    // https://github.com/node-modules/common-bin/blob/master/lib/command.js#L158
    this.options = {
      port: {
        description: 'easy-mock server port ',
        type: 'number',
        default: 3001,
      },
      apiFilePath: {
        description: 'easy-mock server api file path ',
        type: 'string',
        default: 'mock/api',
      },
      apiPath: {
        description: 'easy-mock server mock api address ',
        type: '/api',
        default: 3001,
      },
    };
  }

  get context() {
    const context = super.context;
    return context;
  }

  * run() {
    start();
  }
}

module.exports = Command;
