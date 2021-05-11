"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _saferLodashSet = require("@elastic/safer-lodash-set");

var _lodash = _interopRequireDefault(require("lodash"));

var _chalk = _interopRequireDefault(require("chalk"));

var _help = _interopRequireDefault(require("./help"));

var _commander = require("commander");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
_commander.Command.prototype.error = function (err) {
  if (err && err.message) err = err.message;
  console.log(`
${_chalk.default.white.bgRed(' ERROR ')} ${err}

${(0, _help.default)(this, '  ')}
`);
  process.exit(64); // eslint-disable-line no-process-exit
};

_commander.Command.prototype.defaultHelp = function () {
  console.log(`
${(0, _help.default)(this, '  ')}

`);
  process.exit(64); // eslint-disable-line no-process-exit
};

_commander.Command.prototype.unknownArgv = function (argv) {
  if (argv) this.__unknownArgv = argv;
  return this.__unknownArgv ? this.__unknownArgv.slice(0) : [];
};
/**
 * setup the command to accept arbitrary configuration via the cli
 * @return {[type]} [description]
 */


_commander.Command.prototype.collectUnknownOptions = function () {
  const title = `Extra ${this._name} options`;
  this.allowUnknownOption();

  this.getUnknownOptions = function () {
    const opts = {};
    const unknowns = this.unknownArgv();

    while (unknowns.length) {
      const opt = unknowns.shift().split('=');

      if (opt[0].slice(0, 2) !== '--') {
        this.error(`${title} "${opt[0]}" must start with "--"`);
      }

      if (opt.length === 1) {
        if (!unknowns.length || unknowns[0][0] === '-') {
          this.error(`${title} "${opt[0]}" must have a value`);
        }

        opt.push(unknowns.shift());
      }

      let val = opt[1];

      try {
        val = JSON.parse(opt[1]);
      } catch (e) {
        val = opt[1];
      }

      (0, _saferLodashSet.set)(opts, opt[0].slice(2), val);
    }

    return opts;
  };

  return this;
};

_commander.Command.prototype.parseOptions = _lodash.default.wrap(_commander.Command.prototype.parseOptions, function (parse, argv) {
  const opts = parse.call(this, argv);
  this.unknownArgv(opts.unknown);
  return opts;
});
_commander.Command.prototype.action = _lodash.default.wrap(_commander.Command.prototype.action, function (action, fn) {
  return action.call(this, function (...args) {
    const ret = fn.apply(this, args);

    if (ret && typeof ret.then === 'function') {
      ret.then(null, function (e) {
        console.log('FATAL CLI ERROR', e.stack);
        process.exit(1);
      });
    }
  });
});
var _default = _commander.Command;
exports.default = _default;
module.exports = exports.default;