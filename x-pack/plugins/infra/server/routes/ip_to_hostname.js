"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initIpToHostName = void 0;

var _lodash = require("lodash");

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ipToHostSchema = _configSchema.schema.object({
  ip: _configSchema.schema.string(),
  index_pattern: _configSchema.schema.string()
});

const initIpToHostName = ({
  framework
}) => {
  const {
    callWithRequest
  } = framework;
  framework.registerRoute({
    method: 'post',
    path: '/api/infra/ip_to_host',
    validate: {
      body: ipToHostSchema
    }
  }, async (requestContext, {
    body
  }, response) => {
    try {
      const params = {
        index: body.index_pattern,
        body: {
          size: 1,
          query: {
            match: {
              'host.ip': body.ip
            }
          },
          _source: ['host.name']
        }
      };
      const {
        hits
      } = await callWithRequest(requestContext, 'search', params);

      if (hits.total.value === 0) {
        return response.notFound({
          body: {
            message: 'Host with matching IP address not found.'
          }
        });
      }

      const hostDoc = (0, _lodash.first)(hits.hits);
      return response.ok({
        body: {
          host: hostDoc._source.host.name
        }
      });
    } catch ({
      statusCode = 500,
      message = 'Unknown error occurred'
    }) {
      return response.customError({
        statusCode,
        body: {
          message
        }
      });
    }
  });
};

exports.initIpToHostName = initIpToHostName;