"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filtersRoutes = filtersRoutes;

var _error_wrapper = require("../client/error_wrapper");

var _filters_schema = require("./schemas/filters_schema");

var _filter = require("../models/filter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// TODO - add function for returning a list of just the filter IDs.
// TODO - add function for returning a list of filter IDs plus item count.


function getAllFilters(mlClient) {
  const mgr = new _filter.FilterManager(mlClient);
  return mgr.getAllFilters();
}

function getAllFilterStats(mlClient) {
  const mgr = new _filter.FilterManager(mlClient);
  return mgr.getAllFilterStats();
}

function getFilter(mlClient, filterId) {
  const mgr = new _filter.FilterManager(mlClient);
  return mgr.getFilter(filterId);
}

function newFilter(mlClient, filter) {
  const mgr = new _filter.FilterManager(mlClient);
  return mgr.newFilter(filter);
}

function updateFilter(mlClient, filterId, filter) {
  const mgr = new _filter.FilterManager(mlClient);
  return mgr.updateFilter(filterId, filter);
}

function deleteFilter(mlClient, filterId) {
  const mgr = new _filter.FilterManager(mlClient);
  return mgr.deleteFilter(filterId);
}

function filtersRoutes({
  router,
  routeGuard
}) {
  /**
   * @apiGroup Filters
   *
   * @api {get} /api/ml/filters Gets filters - size limit has been explicitly set to 1000
   * @apiName GetFilters
   * @apiDescription Retrieves the list of filters which are used for custom rules in anomaly detection.
   *
   * @apiSuccess {Boolean} success
   * @apiSuccess {Object[]} filters list of filters
   */
  router.get({
    path: '/api/ml/filters',
    validate: false,
    options: {
      tags: ['access:ml:canGetFilters']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    response
  }) => {
    try {
      const resp = await getAllFilters(mlClient);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup Filters
   *
   * @api {get} /api/ml/filters/:filterId Gets filter by ID
   * @apiName GetFilterById
   * @apiDescription Retrieves the filter with the specified ID.
   *
   * @apiSchema (params) filterIdSchema
   *
   * @apiSuccess {Boolean} success
   * @apiSuccess {Object} filter the filter with the specified ID
   */

  router.get({
    path: '/api/ml/filters/{filterId}',
    validate: {
      params: _filters_schema.filterIdSchema
    },
    options: {
      tags: ['access:ml:canGetFilters']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const resp = await getFilter(mlClient, request.params.filterId);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup Filters
   *
   * @api {put} /api/ml/filters Creates a filter
   * @apiName CreateFilter
   * @apiDescription Instantiates a filter, for use by custom rules in anomaly detection.
   *
   * @apiSchema (body) createFilterSchema
   *
   * @apiSuccess {Boolean} success
   * @apiSuccess {Object} filter created filter
   */

  router.put({
    path: '/api/ml/filters',
    validate: {
      body: _filters_schema.createFilterSchema
    },
    options: {
      tags: ['access:ml:canCreateFilter']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const body = request.body;
      const resp = await newFilter(mlClient, body);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup Filters
   *
   * @api {put} /api/ml/filters/:filterId Updates a filter
   * @apiName UpdateFilter
   * @apiDescription Updates the  description of a filter, adds items or removes items.
   *
   * @apiSchema (params) filterIdSchema
   * @apiSchema (body) updateFilterSchema
   *
   * @apiSuccess {Boolean} success
   * @apiSuccess {Object} filter updated filter
   */

  router.put({
    path: '/api/ml/filters/{filterId}',
    validate: {
      params: _filters_schema.filterIdSchema,
      body: _filters_schema.updateFilterSchema
    },
    options: {
      tags: ['access:ml:canCreateFilter']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        filterId
      } = request.params;
      const body = request.body;
      const resp = await updateFilter(mlClient, filterId, body);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup Filters
   *
   * @api {delete} /api/ml/filters/:filterId Delete filter
   * @apiName DeleteFilter
   * @apiDescription Deletes the filter with the specified ID.
   *
   * @apiSchema (params) filterIdSchema
   */

  router.delete({
    path: '/api/ml/filters/{filterId}',
    validate: {
      params: _filters_schema.filterIdSchema
    },
    options: {
      tags: ['access:ml:canDeleteFilter']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        filterId
      } = request.params;
      const resp = await deleteFilter(mlClient, filterId);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup Filters
   *
   * @api {get} /api/ml/filters/_stats Gets filters stats
   * @apiName GetFiltersStats
   * @apiDescription Retrieves the list of filters which are used for custom rules in anomaly detection,
   *          with stats on the list of jobs and detectors which are using each filter.
   *
   * @apiSuccess {Boolean} success
   * @apiSuccess {Object[]} filters list of filters with stats on usage
   */

  router.get({
    path: '/api/ml/filters/_stats',
    validate: false,
    options: {
      tags: ['access:ml:canGetFilters']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    response
  }) => {
    try {
      const resp = await getAllFilterStats(mlClient);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
}