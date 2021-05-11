"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrations = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _constants = require("../../common/constants");

var _schemas = require("../../common/schemas");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const entryType = t.union([_schemas.entry, _schemas.entriesNested]);

const migrateEntry = entryToMigrate => {
  const newEntry = entryToMigrate;

  if (_schemas.entriesNested.is(entryToMigrate) && _schemas.entriesNested.is(newEntry)) {
    newEntry.entries = entryToMigrate.entries.map(nestedEntry => migrateEntry(nestedEntry));
  }

  newEntry.field = entryToMigrate.field.replace('.text', '.caseless');
  return newEntry;
};

const reduceOsTypes = (acc, tag) => {
  if (tag.startsWith('os:')) {
    // TODO: check OS against type
    return [...acc, tag.replace('os:', '')];
  }

  return [...acc];
};

const containsPolicyTags = tags => tags.some(tag => tag.startsWith('policy:'));

const migrations = {
  '7.10.0': doc => ({ ...doc,
    ...{
      attributes: { ...doc.attributes,
        ...(doc.attributes.entries && [_constants.ENDPOINT_LIST_ID, _constants.ENDPOINT_TRUSTED_APPS_LIST_ID].includes(doc.attributes.list_id) && {
          entries: doc.attributes.entries.map(migrateEntry)
        }),
        ...(doc.attributes._tags && doc.attributes._tags.reduce(reduceOsTypes, []).length > 0 && {
          os_types: doc.attributes._tags.reduce(reduceOsTypes, [])
        })
      }
    },
    references: doc.references || []
  }),
  '7.12.0': doc => {
    if (doc.attributes.list_id === _constants.ENDPOINT_TRUSTED_APPS_LIST_ID) {
      return { ...doc,
        ...{
          attributes: { ...doc.attributes,
            tags: [...(doc.attributes.tags || []), ...(containsPolicyTags(doc.attributes.tags) ? [] : ['policy:all'])]
          }
        },
        references: doc.references || []
      };
    } else {
      return { ...doc,
        references: doc.references || []
      };
    }
  }
};
exports.migrations = migrations;