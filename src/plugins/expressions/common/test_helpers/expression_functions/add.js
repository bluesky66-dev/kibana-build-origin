"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const add = {
  name: 'add',
  help: 'This function adds a number to input',
  inputTypes: ['num'],
  args: {
    val: {
      default: 0,
      aliases: ['_'],
      help: 'Number to add to input',
      types: ['null', 'number', 'string']
    }
  },
  fn: ({
    value: value1
  }, {
    val: input2
  }, context) => {
    const value2 = !input2 ? 0 : typeof input2 === 'object' ? input2.value : Number(input2);
    return {
      type: 'num',
      value: value1 + value2
    };
  }
};
exports.add = add;