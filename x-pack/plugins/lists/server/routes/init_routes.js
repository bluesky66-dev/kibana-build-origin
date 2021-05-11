"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initRoutes = void 0;

var _ = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const initRoutes = (router, config) => {
  // lists
  (0, _.createListRoute)(router);
  (0, _.readListRoute)(router);
  (0, _.updateListRoute)(router);
  (0, _.deleteListRoute)(router);
  (0, _.patchListRoute)(router);
  (0, _.findListRoute)(router);
  (0, _.readPrivilegesRoute)(router); // list items

  (0, _.createListItemRoute)(router);
  (0, _.readListItemRoute)(router);
  (0, _.updateListItemRoute)(router);
  (0, _.deleteListItemRoute)(router);
  (0, _.patchListItemRoute)(router);
  (0, _.exportListItemRoute)(router);
  (0, _.importListItemRoute)(router, config);
  (0, _.findListItemRoute)(router); // indexes of lists

  (0, _.createListIndexRoute)(router);
  (0, _.readListIndexRoute)(router);
  (0, _.deleteListIndexRoute)(router); // exception lists

  (0, _.createExceptionListRoute)(router);
  (0, _.readExceptionListRoute)(router);
  (0, _.updateExceptionListRoute)(router);
  (0, _.deleteExceptionListRoute)(router);
  (0, _.findExceptionListRoute)(router);
  (0, _.exportExceptionListRoute)(router); // exception list items

  (0, _.createExceptionListItemRoute)(router);
  (0, _.readExceptionListItemRoute)(router);
  (0, _.updateExceptionListItemRoute)(router);
  (0, _.deleteExceptionListItemRoute)(router);
  (0, _.findExceptionListItemRoute)(router); // endpoint list

  (0, _.createEndpointListRoute)(router); // endpoint list items

  (0, _.createEndpointListItemRoute)(router);
  (0, _.readEndpointListItemRoute)(router);
  (0, _.updateEndpointListItemRoute)(router);
  (0, _.deleteEndpointListItemRoute)(router);
  (0, _.findEndpointListItemRoute)(router);
};

exports.initRoutes = initRoutes;