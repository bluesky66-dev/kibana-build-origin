"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.httpServerMock = void 0;

var _url = require("url");

var _lodash = require("lodash");

var _net = require("net");

var _queryString = require("query-string");

var _configSchema = require("@kbn/config-schema");

var _router = require("./router");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function createKibanaRequestMock({
  path = '/path',
  headers = {
    accept: 'something/html'
  },
  params = {},
  body = {},
  query = {},
  method = 'get',
  socket = new _net.Socket(),
  routeTags,
  routeAuthRequired,
  validation = {},
  kibanaRouteOptions = {
    xsrfRequired: true
  },
  kibanaRequestState = {
    requestId: '123',
    requestUuid: '123e4567-e89b-12d3-a456-426614174000'
  },
  auth = {
    isAuthenticated: true
  }
} = {}) {
  const queryString = (0, _queryString.stringify)(query, {
    sort: false
  });
  const url = new _url.URL(`${path}${queryString ? `?${queryString}` : ''}`, 'http://localhost');
  return _router.KibanaRequest.from(createRawRequestMock({
    app: kibanaRequestState,
    auth,
    headers,
    params,
    query,
    payload: body,
    path,
    method,
    url,
    route: {
      // @ts-expect-error According to types/hapi__hapi the following settings-fields have problems:
      // - `auth` can't be a boolean, but it can according to the @hapi/hapi source (https://github.com/hapijs/hapi/blob/v18.4.2/lib/route.js#L139)
      // - `app` isn't a valid property, but it is and this was fixed in the types in v19.0.1 (https://github.com/DefinitelyTyped/DefinitelyTyped/pull/41968)
      settings: {
        tags: routeTags,
        auth: routeAuthRequired,
        app: kibanaRouteOptions
      }
    },
    raw: {
      req: {
        socket,
        // these are needed to avoid an error when consuming KibanaRequest.events
        on: jest.fn(),
        off: jest.fn()
      }
    }
  }), {
    params: validation.params || _configSchema.schema.any(),
    body: validation.body || _configSchema.schema.any(),
    query: validation.query || _configSchema.schema.any()
  });
}

function createRawRequestMock(customization = {}) {
  var _customization$url, _customization$url2;

  const pathname = ((_customization$url = customization.url) === null || _customization$url === void 0 ? void 0 : _customization$url.pathname) || '/';
  const path = `${pathname}${((_customization$url2 = customization.url) === null || _customization$url2 === void 0 ? void 0 : _customization$url2.search) || ''}`;
  const url = new _url.URL((0, _url.format)(Object.assign({
    pathname,
    path,
    href: path
  }, customization.url)), 'http://localhost');
  return (0, _lodash.merge)({}, {
    app: {
      xsrfRequired: true
    },
    auth: {
      isAuthenticated: true
    },
    headers: {},
    path,
    route: {
      settings: {}
    },
    url,
    raw: {
      req: {
        url: path,
        socket: {}
      }
    }
  }, customization);
}

const createResponseFactoryMock = () => ({
  ok: jest.fn(),
  accepted: jest.fn(),
  noContent: jest.fn(),
  custom: jest.fn(),
  redirected: jest.fn(),
  badRequest: jest.fn(),
  unauthorized: jest.fn(),
  forbidden: jest.fn(),
  notFound: jest.fn(),
  conflict: jest.fn(),
  internalError: jest.fn(),
  customError: jest.fn()
});

const createLifecycleResponseFactoryMock = () => ({
  redirected: jest.fn(),
  badRequest: jest.fn(),
  unauthorized: jest.fn(),
  forbidden: jest.fn(),
  notFound: jest.fn(),
  conflict: jest.fn(),
  internalError: jest.fn(),
  customError: jest.fn()
});

const createToolkitMock = () => {
  return {
    render: jest.fn(),
    next: jest.fn(),
    rewriteUrl: jest.fn()
  };
};

const httpServerMock = {
  createKibanaRequest: createKibanaRequestMock,
  createRawRequest: createRawRequestMock,
  createResponseFactory: createResponseFactoryMock,
  createLifecycleResponseFactory: createLifecycleResponseFactoryMock,
  createToolkit: createToolkitMock
};
exports.httpServerMock = httpServerMock;