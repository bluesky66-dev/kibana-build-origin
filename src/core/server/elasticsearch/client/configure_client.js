"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureClient = void 0;

var _buffer = require("buffer");

var _querystring = require("querystring");

var _elasticsearch = require("@elastic/elasticsearch");

var _client_config = require("./client_config");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const configureClient = (config, {
  logger,
  type,
  scoped = false
}) => {
  const clientOptions = (0, _client_config.parseClientOptions)(config, scoped);
  const client = new _elasticsearch.Client(clientOptions);
  addLogging(client, logger.get('query', type));
  return client;
};

exports.configureClient = configureClient;

const convertQueryString = qs => {
  if (qs === undefined || typeof qs === 'string') {
    return qs !== null && qs !== void 0 ? qs : '';
  }

  return (0, _querystring.stringify)(qs);
};

function ensureString(body) {
  if (typeof body === 'string') return body;
  if (_buffer.Buffer.isBuffer(body)) return '[buffer]';
  if ('readable' in body && body.readable && typeof body._read === 'function') return '[stream]';
  return JSON.stringify(body);
}

function getErrorMessage(error, event) {
  if (error instanceof _elasticsearch.errors.ResponseError) {
    var _event$body, _event$body$error, _event$body$error$rea, _event$body2, _event$body2$error;

    return `${getResponseMessage(event)} [${(_event$body = event.body) === null || _event$body === void 0 ? void 0 : (_event$body$error = _event$body.error) === null || _event$body$error === void 0 ? void 0 : _event$body$error.type}]: ${(_event$body$error$rea = (_event$body2 = event.body) === null || _event$body2 === void 0 ? void 0 : (_event$body2$error = _event$body2.error) === null || _event$body2$error === void 0 ? void 0 : _event$body2$error.reason) !== null && _event$body$error$rea !== void 0 ? _event$body$error$rea : error.message}`;
  }

  return `[${error.name}]: ${error.message}`;
}
/**
 * returns a string in format:
 *
 * status code
 * URL
 * request body
 *
 * so it could be copy-pasted into the Dev console
 */


function getResponseMessage(event) {
  const params = event.meta.request.params; // definition is wrong, `params.querystring` can be either a string or an object

  const querystring = convertQueryString(params.querystring);
  const url = `${params.path}${querystring ? `?${querystring}` : ''}`;
  const body = params.body ? `\n${ensureString(params.body)}` : '';
  return `${event.statusCode}\n${params.method} ${url}${body}`;
}

const addLogging = (client, logger) => {
  client.on('response', (error, event) => {
    if (event) {
      if (error) {
        logger.debug(getErrorMessage(error, event));
      } else {
        logger.debug(getResponseMessage(event));
      }
    }
  });
};