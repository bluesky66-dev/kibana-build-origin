"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = void 0;

var _tags = require("./tags");

var _assignments = require("./assignments");

var _internal = require("./internal");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerRoutes = ({
  router
}) => {
  // tags API
  (0, _tags.registerCreateTagRoute)(router);
  (0, _tags.registerUpdateTagRoute)(router);
  (0, _tags.registerDeleteTagRoute)(router);
  (0, _tags.registerGetAllTagsRoute)(router);
  (0, _tags.registerGetTagRoute)(router); // assignment API

  (0, _assignments.registerFindAssignableObjectsRoute)(router);
  (0, _assignments.registerUpdateTagsAssignmentsRoute)(router);
  (0, _assignments.registerGetAssignableTypesRoute)(router); // internal API

  (0, _internal.registerInternalFindTagsRoute)(router);
  (0, _internal.registerInternalBulkDeleteRoute)(router);
};

exports.registerRoutes = registerRoutes;