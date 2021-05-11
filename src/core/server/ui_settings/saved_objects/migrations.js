"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrations = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const migrations = {
  '7.9.0': doc => ({ ...doc,
    ...(doc.attributes && {
      attributes: Object.keys(doc.attributes).reduce((acc, key) => key.startsWith('siem:') ? { ...acc,
        [key.replace('siem', 'securitySolution')]: doc.attributes[key]
      } : { ...acc,
        [key]: doc.attributes[key]
      }, {})
    }),
    references: doc.references || []
  }),
  '7.12.0': doc => ({ ...doc,
    ...(doc.attributes && {
      attributes: Object.keys(doc.attributes).reduce((acc, key) => {
        var _doc$attributes$key;

        if (key === 'timepicker:quickRanges' && ((_doc$attributes$key = doc.attributes[key]) === null || _doc$attributes$key === void 0 ? void 0 : _doc$attributes$key.indexOf('section')) > -1) {
          const ranges = JSON.parse(doc.attributes[key]).map(({
            from,
            to,
            display
          }) => {
            return {
              from,
              to,
              display
            };
          });
          return { ...acc,
            'timepicker:quickRanges': JSON.stringify(ranges, null, 2)
          };
        } else {
          return { ...acc,
            [key]: doc.attributes[key]
          };
        }
      }, {})
    }),
    references: doc.references || []
  })
};
exports.migrations = migrations;