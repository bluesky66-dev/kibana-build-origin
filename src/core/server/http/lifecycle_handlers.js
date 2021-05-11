"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCoreHandlers = exports.createCustomHeadersPreResponseHandler = exports.createVersionCheckPostAuthHandler = exports.createXsrfPostAuthHandler = void 0;

var _router = require("./router");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const VERSION_HEADER = 'kbn-version';
const XSRF_HEADER = 'kbn-xsrf';
const KIBANA_NAME_HEADER = 'kbn-name';

const createXsrfPostAuthHandler = config => {
  const {
    allowlist,
    disableProtection
  } = config.xsrf;
  return (request, response, toolkit) => {
    if (disableProtection || allowlist.includes(request.route.path) || request.route.options.xsrfRequired === false) {
      return toolkit.next();
    }

    const hasVersionHeader = (VERSION_HEADER in request.headers);
    const hasXsrfHeader = (XSRF_HEADER in request.headers);

    if (!(0, _router.isSafeMethod)(request.route.method) && !hasVersionHeader && !hasXsrfHeader) {
      return response.badRequest({
        body: `Request must contain a ${XSRF_HEADER} header.`
      });
    }

    return toolkit.next();
  };
};

exports.createXsrfPostAuthHandler = createXsrfPostAuthHandler;

const createVersionCheckPostAuthHandler = kibanaVersion => {
  return (request, response, toolkit) => {
    const requestVersion = request.headers[VERSION_HEADER];

    if (requestVersion && requestVersion !== kibanaVersion) {
      return response.badRequest({
        body: {
          message: `Browser client is out of date, please refresh the page ` + `("${VERSION_HEADER}" header was "${requestVersion}" but should be "${kibanaVersion}")`,
          attributes: {
            expected: kibanaVersion,
            got: requestVersion
          }
        }
      });
    }

    return toolkit.next();
  };
};

exports.createVersionCheckPostAuthHandler = createVersionCheckPostAuthHandler;

const createCustomHeadersPreResponseHandler = config => {
  const serverName = config.name;
  const customHeaders = config.customResponseHeaders;
  return (request, response, toolkit) => {
    const additionalHeaders = { ...customHeaders,
      [KIBANA_NAME_HEADER]: serverName
    };
    return toolkit.next({
      headers: additionalHeaders
    });
  };
};

exports.createCustomHeadersPreResponseHandler = createCustomHeadersPreResponseHandler;

const registerCoreHandlers = (registrar, config, env) => {
  registrar.registerOnPreResponse(createCustomHeadersPreResponseHandler(config));
  registrar.registerOnPostAuth(createXsrfPostAuthHandler(config));
  registrar.registerOnPostAuth(createVersionCheckPostAuthHandler(env.packageInfo.version));
};

exports.registerCoreHandlers = registerCoreHandlers;