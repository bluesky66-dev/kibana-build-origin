"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getQueryOrder = exports.getTopNFlowEdges = void 0;

var _fp = require("lodash/fp");

var _utility_types = require("../../../../../../common/utility_types");

var _search_strategy = require("../../../../../../common/search_strategy");

var _helpers = require("../helpers");

var _format_response_object_values = require("../../../../helpers/format_response_object_values");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getTopNFlowEdges = (response, options) => formatTopNFlowEdges((0, _fp.getOr)([], `aggregations.${options.flowTarget}.buckets`, response.rawResponse), options.flowTarget);

exports.getTopNFlowEdges = getTopNFlowEdges;

const formatTopNFlowEdges = (buckets, flowTarget) => buckets.map(bucket => ({
  node: {
    _id: bucket.key,
    [flowTarget]: {
      domain: bucket.domain.buckets.map(bucketDomain => bucketDomain.key),
      ip: bucket.key,
      location: getGeoItem(bucket),
      autonomous_system: getAsItem(bucket),
      flows: (0, _fp.getOr)(0, 'flows.value', bucket),
      [`${(0, _helpers.getOppositeField)(flowTarget)}_ips`]: (0, _fp.getOr)(0, `${(0, _helpers.getOppositeField)(flowTarget)}_ips.value`, bucket)
    },
    network: {
      bytes_in: (0, _fp.getOr)(0, 'bytes_in.value', bucket),
      bytes_out: (0, _fp.getOr)(0, 'bytes_out.value', bucket)
    }
  },
  cursor: {
    value: bucket.key,
    tiebreaker: null
  }
}));

const getFlowTargetFromString = flowAsString => flowAsString === 'source' ? _search_strategy.FlowTargetSourceDest.source : _search_strategy.FlowTargetSourceDest.destination;

const getGeoItem = result => result.location.top_geo.hits.hits.length > 0 && result.location.top_geo.hits.hits[0]._source ? {
  geo: (0, _format_response_object_values.formatResponseObjectValues)((0, _fp.getOr)('', `location.top_geo.hits.hits[0]._source.${Object.keys(result.location.top_geo.hits.hits[0]._source)[0]}.geo`, result)),
  flowTarget: getFlowTargetFromString(Object.keys(result.location.top_geo.hits.hits[0]._source)[0])
} : null;

const getAsItem = result => result.autonomous_system.top_as.hits.hits.length > 0 && result.autonomous_system.top_as.hits.hits[0]._source ? {
  number: (0, _fp.getOr)(null, `autonomous_system.top_as.hits.hits[0]._source.${Object.keys(result.autonomous_system.top_as.hits.hits[0]._source)[0]}.as.number`, result),
  name: (0, _fp.getOr)('', `autonomous_system.top_as.hits.hits[0]._source.${Object.keys(result.autonomous_system.top_as.hits.hits[0]._source)[0]}.as.organization.name`, result)
} : null;

const getQueryOrder = networkTopNFlowSortField => {
  switch (networkTopNFlowSortField.field) {
    case _search_strategy.NetworkTopTablesFields.bytes_in:
      return {
        bytes_in: networkTopNFlowSortField.direction
      };

    case _search_strategy.NetworkTopTablesFields.bytes_out:
      return {
        bytes_out: networkTopNFlowSortField.direction
      };

    case _search_strategy.NetworkTopTablesFields.flows:
      return {
        flows: networkTopNFlowSortField.direction
      };

    case _search_strategy.NetworkTopTablesFields.destination_ips:
      return {
        destination_ips: networkTopNFlowSortField.direction
      };

    case _search_strategy.NetworkTopTablesFields.source_ips:
      return {
        source_ips: networkTopNFlowSortField.direction
      };
  }

  (0, _utility_types.assertUnreachable)(networkTopNFlowSortField.field);
};

exports.getQueryOrder = getQueryOrder;