"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shortUrlLookupProvider = shortUrlLookupProvider;

var _crypto = _interopRequireDefault(require("crypto"));

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function shortUrlLookupProvider({
  logger
}) {
  async function updateMetadata(doc, {
    savedObjects
  }) {
    try {
      await savedObjects.update('url', doc.id, {
        accessDate: new Date().valueOf(),
        accessCount: (0, _lodash.get)(doc, 'attributes.accessCount', 0) + 1
      });
    } catch (error) {
      logger.warn('Warning: Error updating url metadata');
      logger.warn(error); // swallow errors. It isn't critical if there is no update.
    }
  }

  return {
    async generateUrlId(url, {
      savedObjects
    }) {
      const id = _crypto.default.createHash('md5').update(url).digest('hex');

      const {
        isConflictError
      } = savedObjects.errors;

      try {
        const doc = await savedObjects.create('url', {
          url,
          accessCount: 0,
          createDate: new Date().valueOf(),
          accessDate: new Date().valueOf()
        }, {
          id
        });
        return doc.id;
      } catch (error) {
        if (isConflictError(error)) {
          return id;
        }

        throw error;
      }
    },

    async getUrl(id, {
      savedObjects
    }) {
      const doc = await savedObjects.get('url', id);
      updateMetadata(doc, {
        savedObjects
      });
      return doc.attributes.url;
    }

  };
}