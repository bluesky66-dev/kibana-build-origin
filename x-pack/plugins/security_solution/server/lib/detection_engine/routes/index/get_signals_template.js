"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSignalsTemplate = exports.MIN_EQL_RULE_INDEX_VERSION = exports.SIGNALS_TEMPLATE_VERSION = void 0;

var _signals_mapping = _interopRequireDefault(require("./signals_mapping.json"));

var _ecs_mapping = _interopRequireDefault(require("./ecs_mapping.json"));

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

/**
  @constant
  @type {number}
  @description This value represents the template version assumed by app code.
  If this number is greater than the user's signals index version, the
  detections UI will attempt to update the signals template and roll over to
  a new signals index.

  If making mappings changes in a patch release, this number should be incremented by 1.
  If making mappings changes in a minor release, this number should be
  incremented by 10 in order to add "room" for the aforementioned patch
  release
*/


const SIGNALS_TEMPLATE_VERSION = 25;
exports.SIGNALS_TEMPLATE_VERSION = SIGNALS_TEMPLATE_VERSION;
const MIN_EQL_RULE_INDEX_VERSION = 2;
exports.MIN_EQL_RULE_INDEX_VERSION = MIN_EQL_RULE_INDEX_VERSION;

const getSignalsTemplate = index => {
  const template = {
    settings: {
      index: {
        lifecycle: {
          name: index,
          rollover_alias: index
        }
      },
      mapping: {
        total_fields: {
          limit: 10000
        }
      }
    },
    index_patterns: [`${index}-*`],
    mappings: { ..._ecs_mapping.default.mappings,
      properties: { ..._ecs_mapping.default.mappings.properties,
        signal: _signals_mapping.default.mappings.properties.signal
      },
      _meta: {
        version: SIGNALS_TEMPLATE_VERSION
      }
    },
    version: SIGNALS_TEMPLATE_VERSION
  };
  return template;
};

exports.getSignalsTemplate = getSignalsTemplate;