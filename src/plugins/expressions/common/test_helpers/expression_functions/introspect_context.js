"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.introspectContext = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const introspectContext = {
  name: 'introspectContext',
  args: {
    key: {
      help: 'Context key to introspect',
      types: ['string']
    }
  },
  help: '',
  fn: (input, args, context) => {
    return {
      type: 'any',
      result: context[args.key]
    };
  }
};
exports.introspectContext = introspectContext;