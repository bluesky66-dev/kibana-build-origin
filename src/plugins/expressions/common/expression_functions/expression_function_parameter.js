"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionFunctionParameter = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class ExpressionFunctionParameter {
  constructor(name, arg) {
    _defineProperty(this, "name", void 0);

    _defineProperty(this, "required", void 0);

    _defineProperty(this, "help", void 0);

    _defineProperty(this, "types", void 0);

    _defineProperty(this, "default", void 0);

    _defineProperty(this, "aliases", void 0);

    _defineProperty(this, "multi", void 0);

    _defineProperty(this, "resolve", void 0);

    _defineProperty(this, "options", void 0);

    const {
      required,
      help,
      types,
      aliases,
      multi,
      resolve,
      options
    } = arg;

    if (name === '_') {
      throw Error('Arg names must not be _. Use it in aliases instead.');
    }

    this.name = name;
    this.required = !!required;
    this.help = help || '';
    this.types = types || [];
    this.default = arg.default;
    this.aliases = aliases || [];
    this.multi = !!multi;
    this.resolve = resolve == null ? true : resolve;
    this.options = options || [];
  }

  accepts(type) {
    if (!this.types.length) return true;
    return this.types.indexOf(type) > -1;
  }

}

exports.ExpressionFunctionParameter = ExpressionFunctionParameter;