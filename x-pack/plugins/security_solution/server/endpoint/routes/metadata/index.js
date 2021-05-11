"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerEndpointRoutes = registerEndpointRoutes;
exports.GetMetadataListRequestSchema = exports.GetMetadataRequestSchema = exports.endpointFilters = exports.GET_METADATA_REQUEST_ROUTE = exports.METADATA_REQUEST_ROUTE = exports.GET_METADATA_REQUEST_V1_ROUTE = exports.METADATA_REQUEST_V1_ROUTE = exports.BASE_ENDPOINT_ROUTE = void 0;

var _configSchema = require("@kbn/config-schema");

var _types = require("../../../../common/endpoint/types");

var _handlers = require("./handlers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const BASE_ENDPOINT_ROUTE = '/api/endpoint';
exports.BASE_ENDPOINT_ROUTE = BASE_ENDPOINT_ROUTE;
const METADATA_REQUEST_V1_ROUTE = `${BASE_ENDPOINT_ROUTE}/v1/metadata`;
exports.METADATA_REQUEST_V1_ROUTE = METADATA_REQUEST_V1_ROUTE;
const GET_METADATA_REQUEST_V1_ROUTE = `${METADATA_REQUEST_V1_ROUTE}/{id}`;
exports.GET_METADATA_REQUEST_V1_ROUTE = GET_METADATA_REQUEST_V1_ROUTE;
const METADATA_REQUEST_ROUTE = `${BASE_ENDPOINT_ROUTE}/metadata`;
exports.METADATA_REQUEST_ROUTE = METADATA_REQUEST_ROUTE;
const GET_METADATA_REQUEST_ROUTE = `${METADATA_REQUEST_ROUTE}/{id}`;
/* Filters that can be applied to the endpoint fetch route */

exports.GET_METADATA_REQUEST_ROUTE = GET_METADATA_REQUEST_ROUTE;

const endpointFilters = _configSchema.schema.object({
  kql: _configSchema.schema.nullable(_configSchema.schema.string()),
  host_status: _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.oneOf([_configSchema.schema.literal(_types.HostStatus.ONLINE.toString()), _configSchema.schema.literal(_types.HostStatus.OFFLINE.toString()), _configSchema.schema.literal(_types.HostStatus.UNENROLLING.toString()), _configSchema.schema.literal(_types.HostStatus.ERROR.toString())])))
});

exports.endpointFilters = endpointFilters;
const GetMetadataRequestSchema = {
  params: _configSchema.schema.object({
    id: _configSchema.schema.string()
  })
};
exports.GetMetadataRequestSchema = GetMetadataRequestSchema;
const GetMetadataListRequestSchema = {
  body: _configSchema.schema.nullable(_configSchema.schema.object({
    paging_properties: _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.oneOf([
    /**
     * the number of results to return for this request per page
     */
    _configSchema.schema.object({
      page_size: _configSchema.schema.number({
        defaultValue: 10,
        min: 1,
        max: 10000
      })
    }),
    /**
     * the zero based page index of the the total number of pages of page size
     */
    _configSchema.schema.object({
      page_index: _configSchema.schema.number({
        defaultValue: 0,
        min: 0
      })
    })]))),
    filters: endpointFilters
  }))
};
exports.GetMetadataListRequestSchema = GetMetadataListRequestSchema;

function registerEndpointRoutes(router, endpointAppContext) {
  const logger = (0, _handlers.getLogger)(endpointAppContext);
  router.post({
    path: `${METADATA_REQUEST_V1_ROUTE}`,
    validate: GetMetadataListRequestSchema,
    options: {
      authRequired: true,
      tags: ['access:securitySolution']
    }
  }, (0, _handlers.getMetadataListRequestHandler)(endpointAppContext, logger, _types.MetadataQueryStrategyVersions.VERSION_1));
  router.post({
    path: `${METADATA_REQUEST_ROUTE}`,
    validate: GetMetadataListRequestSchema,
    options: {
      authRequired: true,
      tags: ['access:securitySolution']
    }
  }, (0, _handlers.getMetadataListRequestHandler)(endpointAppContext, logger));
  router.get({
    path: `${GET_METADATA_REQUEST_V1_ROUTE}`,
    validate: GetMetadataRequestSchema,
    options: {
      authRequired: true,
      tags: ['access:securitySolution']
    }
  }, (0, _handlers.getMetadataRequestHandler)(endpointAppContext, logger, _types.MetadataQueryStrategyVersions.VERSION_1));
  router.get({
    path: `${GET_METADATA_REQUEST_ROUTE}`,
    validate: GetMetadataRequestSchema,
    options: {
      authRequired: true,
      tags: ['access:securitySolution']
    }
  }, (0, _handlers.getMetadataRequestHandler)(endpointAppContext, logger));
}