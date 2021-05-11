"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.error = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const error = {
  name: 'error',
  help: 'This function always throws an error',
  args: {
    message: {
      default: 'Unknown',
      aliases: ['_'],
      help: 'Number to add to input',
      types: ['string']
    }
  },
  fn: (input, args, context) => {
    throw new Error(args.message);
  }
};
exports.error = error;