"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isESClientError = isESClientError;
exports.ingestErrorToResponseOptions = ingestErrorToResponseOptions;
exports.defaultIngestErrorHandler = exports.isLegacyESClientError = void 0;

var _boom = require("@hapi/boom");

var _elasticsearch = require("elasticsearch");

var _errors = require("@elastic/elasticsearch/lib/errors");

var _services = require("../services");

var _index = require("./index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isLegacyESClientError = error => {
  return error instanceof _elasticsearch.errors._Abstract;
};

exports.isLegacyESClientError = isLegacyESClientError;

function isESClientError(error) {
  return error instanceof _errors.ResponseError;
}

const getHTTPResponseCode = error => {
  if (error instanceof _index.RegistryError) {
    return 502; // Bad Gateway
  }

  if (error instanceof _index.PackageNotFoundError) {
    return 404; // Not Found
  }

  if (error instanceof _index.AgentPolicyNameExistsError) {
    return 409; // Conflict
  }

  if (error instanceof _index.PackageUnsupportedMediaTypeError) {
    return 415; // Unsupported Media Type
  }

  if (error instanceof _index.ConcurrentInstallOperationError) {
    return 409; // Conflict
  }

  return 400; // Bad Request
};

function ingestErrorToResponseOptions(error) {
  const logger = _services.appContextService.getLogger();

  if (isLegacyESClientError(error)) {
    // there was a problem communicating with ES (e.g. via `callCluster`)
    // only log the message
    const message = error !== null && error !== void 0 && error.path && error !== null && error !== void 0 && error.response ? // if possible, return the failing endpoint and its response
    `${error.message} response from ${error.path}: ${error.response}` : error.message;
    logger.error(message);
    return {
      statusCode: (error === null || error === void 0 ? void 0 : error.statusCode) || error.status,
      body: {
        message
      }
    };
  } // our "expected" errors


  if (error instanceof _index.IngestManagerError) {
    // only log the message
    logger.error(error.message);
    return {
      statusCode: getHTTPResponseCode(error),
      body: {
        message: error.message
      }
    };
  } // handle any older Boom-based errors or the few places our app uses them


  if ((0, _boom.isBoom)(error)) {
    // only log the message
    logger.error(error.output.payload.message);
    return {
      statusCode: error.output.statusCode,
      body: {
        message: error.output.payload.message
      }
    };
  } // not sure what type of error this is. log as much as possible


  logger.error(error);
  return {
    statusCode: 500,
    body: {
      message: error.message
    }
  };
}

const defaultIngestErrorHandler = async ({
  error,
  response
}) => {
  const options = ingestErrorToResponseOptions(error);
  return response.customError(options);
};

exports.defaultIngestErrorHandler = defaultIngestErrorHandler;