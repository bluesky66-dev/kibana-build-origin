"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTrustedAppsSummaryRouteHandler = exports.getTrustedAppsCreateRouteHandler = exports.getTrustedAppsListRouteHandler = exports.getTrustedAppsDeleteRouteHandler = void 0;

var _service = require("./service");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const exceptionListClientFromContext = context => {
  var _context$lists;

  const exceptionLists = (_context$lists = context.lists) === null || _context$lists === void 0 ? void 0 : _context$lists.getExceptionListClient();

  if (!exceptionLists) {
    throw new Error('Exception List client not found');
  }

  return exceptionLists;
};

const getTrustedAppsDeleteRouteHandler = endpointAppContext => {
  const logger = endpointAppContext.logFactory.get('trusted_apps');
  return async (context, req, res) => {
    try {
      await (0, _service.deleteTrustedApp)(exceptionListClientFromContext(context), req.params);
      return res.ok();
    } catch (error) {
      if (error instanceof _service.MissingTrustedAppException) {
        return res.notFound({
          body: `trusted app id [${req.params.id}] not found`
        });
      } else {
        logger.error(error);
        return res.internalError({
          body: error
        });
      }
    }
  };
};

exports.getTrustedAppsDeleteRouteHandler = getTrustedAppsDeleteRouteHandler;

const getTrustedAppsListRouteHandler = endpointAppContext => {
  const logger = endpointAppContext.logFactory.get('trusted_apps');
  return async (context, req, res) => {
    try {
      return res.ok({
        body: await (0, _service.getTrustedAppsList)(exceptionListClientFromContext(context), req.query)
      });
    } catch (error) {
      logger.error(error);
      return res.internalError({
        body: error
      });
    }
  };
};

exports.getTrustedAppsListRouteHandler = getTrustedAppsListRouteHandler;

const getTrustedAppsCreateRouteHandler = endpointAppContext => {
  const logger = endpointAppContext.logFactory.get('trusted_apps');
  return async (context, req, res) => {
    try {
      return res.ok({
        body: await (0, _service.createTrustedApp)(exceptionListClientFromContext(context), req.body)
      });
    } catch (error) {
      logger.error(error);
      return res.internalError({
        body: error
      });
    }
  };
};

exports.getTrustedAppsCreateRouteHandler = getTrustedAppsCreateRouteHandler;

const getTrustedAppsSummaryRouteHandler = endpointAppContext => {
  const logger = endpointAppContext.logFactory.get('trusted_apps');
  return async (context, req, res) => {
    try {
      return res.ok({
        body: await (0, _service.getTrustedAppsSummary)(exceptionListClientFromContext(context))
      });
    } catch (error) {
      logger.error(error);
      return res.internalError({
        body: error
      });
    }
  };
};

exports.getTrustedAppsSummaryRouteHandler = getTrustedAppsSummaryRouteHandler;