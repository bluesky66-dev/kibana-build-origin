"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _utils = require("../core/server/utils");

var _command = _interopRequireDefault(require("../cli/command"));

var _keystore = require("../cli/keystore");

var _create = require("./create");

var _list = require("./list");

var _add = require("./add");

var _remove = require("./remove");

var _get_keystore = require("./get_keystore");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const argv = process.argv.slice();
const program = new _command.default('bin/kibana-keystore');
program.version(_utils.pkg.version).description('A tool for managing settings stored in the Kibana keystore');
const keystore = new _keystore.Keystore((0, _get_keystore.getKeystore)());
(0, _create.createCli)(program, keystore);
(0, _list.listCli)(program, keystore);
(0, _add.addCli)(program, keystore);
(0, _remove.removeCli)(program, keystore);
program.command('help <command>').description('get the help for a specific command').action(function (cmdName) {
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
  program.defaultHelp();
}

program.parse(process.argv);