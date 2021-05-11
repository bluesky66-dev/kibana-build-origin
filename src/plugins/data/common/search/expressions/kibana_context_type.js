"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kibanaContext = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
// TODO: These two are exported for legacy reasons - remove them eventually.
const kibanaContext = {
  name: 'kibana_context',
  from: {
    null: () => {
      return {
        type: 'kibana_context'
      };
    }
  },
  to: {
    null: () => {
      return {
        type: 'null'
      };
    }
  }
};
exports.kibanaContext = kibanaContext;