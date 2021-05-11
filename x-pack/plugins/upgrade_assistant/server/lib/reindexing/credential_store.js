"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.credentialStoreFactory = void 0;

var _crypto = require("crypto");

var _jsonStableStringify = _interopRequireDefault(require("json-stable-stringify"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const credentialStoreFactory = () => {
  const credMap = new Map(); // Generates a stable hash for the reindex operation's current state.

  const getHash = reindexOp => (0, _crypto.createHash)('sha256').update((0, _jsonStableStringify.default)({
    id: reindexOp.id,
    ...reindexOp.attributes
  })).digest('base64');

  return {
    get(reindexOp) {
      return credMap.get(getHash(reindexOp));
    },

    set(reindexOp, credential) {
      credMap.set(getHash(reindexOp), credential);
    },

    clear() {
      for (const k of credMap.keys()) {
        credMap.delete(k);
      }
    }

  };
};

exports.credentialStoreFactory = credentialStoreFactory;