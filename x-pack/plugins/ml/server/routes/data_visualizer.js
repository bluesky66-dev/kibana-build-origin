"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataVisualizerRoutes = dataVisualizerRoutes;

var _error_wrapper = require("../client/error_wrapper");

var _data_visualizer = require("../models/data_visualizer");

var _data_visualizer_schema = require("./schemas/data_visualizer_schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getOverallStats(client, indexPatternTitle, query, aggregatableFields, nonAggregatableFields, samplerShardSize, timeFieldName, earliestMs, latestMs) {
  const dv = new _data_visualizer.DataVisualizer(client);
  return dv.getOverallStats(indexPatternTitle, query, aggregatableFields, nonAggregatableFields, samplerShardSize, timeFieldName, earliestMs, latestMs);
}

function getStatsForFields(client, indexPatternTitle, query, fields, samplerShardSize, timeFieldName, earliestMs, latestMs, interval, maxExamples) {
  const dv = new _data_visualizer.DataVisualizer(client);
  return dv.getStatsForFields(indexPatternTitle, query, fields, samplerShardSize, timeFieldName, earliestMs, latestMs, interval, maxExamples);
}

function getHistogramsForFields(client, indexPatternTitle, query, fields, samplerShardSize) {
  const dv = new _data_visualizer.DataVisualizer(client);
  return dv.getHistogramsForFields(indexPatternTitle, query, fields, samplerShardSize);
}
/**
 * Routes for the index data visualizer.
 */


function dataVisualizerRoutes({
  router,
  routeGuard
}) {
  /**
   * @apiGroup DataVisualizer
   *
   * @api {post} /api/ml/data_visualizer/get_field_histograms/:indexPatternTitle Get histograms for fields
   * @apiName GetHistogramsForFields
   * @apiDescription Returns the histograms on a list fields in the specified index pattern.
   *
   * @apiSchema (params) indexPatternTitleSchema
   * @apiSchema (body) dataVisualizerFieldHistogramsSchema
   *
   * @apiSuccess {Object} fieldName histograms by field, keyed on the name of the field.
   */
  router.post({
    path: '/api/ml/data_visualizer/get_field_histograms/{indexPatternTitle}',
    validate: {
      params: _data_visualizer_schema.indexPatternTitleSchema,
      body: _data_visualizer_schema.dataVisualizerFieldHistogramsSchema
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
      const {
        params: {
          indexPatternTitle
        },
        body: {
          query,
          fields,
          samplerShardSize
        }
      } = request;
      const results = await getHistogramsForFields(client, indexPatternTitle, query, fields, samplerShardSize);
      return response.ok({
        body: results
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup DataVisualizer
   *
   * @api {post} /api/ml/data_visualizer/get_field_stats/:indexPatternTitle Get stats for fields
   * @apiName GetStatsForFields
   * @apiDescription Returns the stats on individual fields in the specified index pattern.
   *
   * @apiSchema (params) indexPatternTitleSchema
   * @apiSchema (body) dataVisualizerFieldStatsSchema
   *
   * @apiSuccess {Object} fieldName stats by field, keyed on the name of the field.
   */

  router.post({
    path: '/api/ml/data_visualizer/get_field_stats/{indexPatternTitle}',
    validate: {
      params: _data_visualizer_schema.indexPatternTitleSchema,
      body: _data_visualizer_schema.dataVisualizerFieldStatsSchema
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
      const {
        params: {
          indexPatternTitle
        },
        body: {
          query,
          fields,
          samplerShardSize,
          timeFieldName,
          earliest,
          latest,
          interval,
          maxExamples
        }
      } = request;
      const results = await getStatsForFields(client, indexPatternTitle, query, fields, samplerShardSize, timeFieldName, earliest, latest, interval, maxExamples);
      return response.ok({
        body: results
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup DataVisualizer
   *
   * @api {post} /api/ml/data_visualizer/get_overall_stats/:indexPatternTitle Get overall stats
   * @apiName GetOverallStats
   * @apiDescription Returns the top level overall stats for the specified index pattern.
   *
   * @apiSchema (params) indexPatternTitleSchema
   * @apiSchema (body) dataVisualizerOverallStatsSchema
   *
   * @apiSuccess {number} totalCount total count of documents.
   * @apiSuccess {Object} aggregatableExistsFields stats on aggregatable fields that exist in documents.
   * @apiSuccess {Object} aggregatableNotExistsFields stats on aggregatable fields that do not exist in documents.
   * @apiSuccess {Object} nonAggregatableExistsFields stats on non-aggregatable fields that exist in documents.
   * @apiSuccess {Object} nonAggregatableNotExistsFields stats on non-aggregatable fields that do not exist in documents.
   */

  router.post({
    path: '/api/ml/data_visualizer/get_overall_stats/{indexPatternTitle}',
    validate: {
      params: _data_visualizer_schema.indexPatternTitleSchema,
      body: _data_visualizer_schema.dataVisualizerOverallStatsSchema
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
      const {
        params: {
          indexPatternTitle
        },
        body: {
          query,
          aggregatableFields,
          nonAggregatableFields,
          samplerShardSize,
          timeFieldName,
          earliest,
          latest
        }
      } = request;
      const results = await getOverallStats(client, indexPatternTitle, query, aggregatableFields, nonAggregatableFields, samplerShardSize, timeFieldName, earliest, latest);
      return response.ok({
        body: results
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
}