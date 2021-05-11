"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerResolverRoutes = registerResolverRoutes;

var _resolver = require("../../../common/endpoint/schema/resolver");

var _handler = require("./resolver/tree/handler");

var _entity = require("./resolver/entity");

var _events = require("./resolver/events");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerResolverRoutes(router, endpointAppContext) {
  const log = endpointAppContext.logFactory.get('resolver');
  router.post({
    path: '/api/endpoint/resolver/tree',
    validate: _resolver.validateTree,
    options: {
      authRequired: true
    }
  }, (0, _handler.handleTree)(log));
  router.post({
    path: '/api/endpoint/resolver/events',
    validate: _resolver.validateEvents,
    options: {
      authRequired: true
    }
  }, (0, _events.handleEvents)(log));
  /**
   * Used to get details about an entity, aka process.
   */

  router.get({
    path: '/api/endpoint/resolver/entity',
    validate: _resolver.validateEntities,
    options: {
      authRequired: true
    }
  }, (0, _entity.handleEntities)());
}