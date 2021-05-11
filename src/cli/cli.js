"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _utils = require("../core/server/utils");

var _command = _interopRequireDefault(require("./command"));

var _serve = _interopRequireDefault(require("./serve/serve"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const argv = process.argv.slice();
const program = new _command.default('bin/kibana');
program.version(_utils.pkg.version).description('Kibana is an open and free, browser ' + 'based analytics and search dashboard for Elasticsearch.'); // attach commands

(0, _serve.default)(program);
program.command('help <command>').description('Get the help for a specific command').action(function (cmdName) {
  const cmd = _lodash.default.find(program.commands, {
    _name: cmdName
  });

  if (!cmd) return program.error(`unknown command ${cmdName}`);
  cmd.help();
});
program.command('*', null, {
  noHelp: true
}).action(function (cmd) {
  program.error(`unknown command ${cmd}`);
}); // check for no command name

const subCommand = argv[2] && !String(argv[2][0]).match(/^-|^\.|\//);

if (!subCommand) {
  if (_lodash.default.intersection(argv.slice(2), ['-h', '--help']).length) {
    program.defaultHelp();
  } else {
    argv.splice(2, 0, ['serve']);
  }
}

program.parse(argv);