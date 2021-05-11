"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fieldsService = fieldsService;

var _error_wrapper = require("../client/error_wrapper");

var _fields_service_schema = require("./schemas/fields_service_schema");

var _fields_service = require("../models/fields_service");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getCardinalityOfFields(client, payload) {
  const fs = (0, _fields_service.fieldsServiceProvider)(client);
  const {
    index,
    fieldNames,
    query,
    timeFieldName,
    earliestMs,
    latestMs
  } = payload;
  return fs.getCardinalityOfFields(index, fieldNames, query, timeFieldName, earliestMs, latestMs);
}

function getTimeFieldRange(client, payload) {
  const fs = (0, _fields_service.fieldsServiceProvider)(client);
  const {
    index,
    timeFieldName,
    query
  } = payload;
  return fs.getTimeFieldRange(index, timeFieldName, query);
}
/**
 * Routes for fields service
 */


function fieldsService({
  router,
  routeGuard
}) {
  /**
   * @apiGroup FieldsService
   *
   * @api {post} /api/ml/fields_service/field_cardinality Get cardinality of fields
   * @apiName GetCardinalityOfFields
   * @apiDescription Returns the cardinality of one or more fields. Returns an Object whose keys are the names of the fields, with values equal to the cardinality of the field
   *
   * @apiSchema (body) getCardinalityOfFieldsSchema
   *
   * @apiSuccess {number} fieldName cardinality of the field.
   */
  router.post({
    path: '/api/ml/fields_service/field_cardinality',
    validate: {
      body: _fields_service_schema.getCardinalityOfFieldsSchema
    },
    options: {
      tags: ['access:ml:canAccessML']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    request,
    response
  }) => {
    try {
      const resp = await getCardinalityOfFields(client, request.body);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup FieldsService
   *
   * @api {post} /api/ml/fields_service/time_field_range Get time field range
   * @apiName GetTimeFieldRange
   * @apiDescription Returns the time range for the given index and query using the specified time range.
   *
   * @apiSchema (body) getTimeFieldRangeSchema
   *
   * @apiSuccess {Object} start start of time range with epoch and string properties.
   * @apiSuccess {Object} end end of time range with epoch and string properties.
   */

  router.post({
    path: '/api/ml/fields_service/time_field_range',
    validate: {
      body: _fields_service_schema.getTimeFieldRangeSchema
    },
    options: {
      tags: ['access:ml:canAccessML']
    }
  }, routeGuard.basicLicenseAPIGuard(async ({
    client,
    request,
    response
  }) => {
    try {
      const resp = await getTimeFieldRange(client, request.body);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
}