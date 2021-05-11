"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApmCustomLinkIndex = void 0;

var _server = require("../../../../../observability/server");

var _get_apm_indices = require("../apm_indices/get_apm_indices");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createApmCustomLinkIndex = async ({
  client,
  config,
  logger
}) => {
  const index = (0, _get_apm_indices.getApmIndicesConfig)(config).apmCustomLinkIndex;
  return (0, _server.createOrUpdateIndex)({
    index,
    client,
    logger,
    mappings
  });
};

exports.createApmCustomLinkIndex = createApmCustomLinkIndex;
const mappings = {
  dynamic: 'strict',
  properties: {
    '@timestamp': {
      type: 'date'
    },
    label: {
      type: 'text',
      fields: {
        // Adding keyword type to be able to sort by label alphabetically
        keyword: {
          type: 'keyword'
        }
      }
    },
    url: {
      type: 'keyword'
    },
    service: {
      properties: {
        name: {
          type: 'keyword'
        },
        environment: {
          type: 'keyword'
        }
      }
    },
    transaction: {
      properties: {
        name: {
          type: 'keyword'
        },
        type: {
          type: 'keyword'
        }
      }
    }
  }
};