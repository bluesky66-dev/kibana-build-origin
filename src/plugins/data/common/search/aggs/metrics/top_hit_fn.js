"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggTopHit = exports.aggTopHitFnName = void 0;

var _i18n = require("@kbn/i18n");

var _ = require("../");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const aggTopHitFnName = 'aggTopHit';
exports.aggTopHitFnName = aggTopHitFnName;

const aggTopHit = () => ({
  name: aggTopHitFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.metrics.top_hit.help', {
    defaultMessage: 'Generates a serialized agg config for a Top Hit agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.top_hit.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.metrics.top_hit.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.top_hit.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    field: {
      types: ['string'],
      required: true,
      help: _i18n.i18n.translate('data.search.aggs.metrics.top_hit.field.help', {
        defaultMessage: 'Field to use for this aggregation'
      })
    },
    aggregate: {
      types: ['string'],
      required: true,
      options: ['min', 'max', 'sum', 'average', 'concat'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.top_hit.aggregate.help', {
        defaultMessage: 'Aggregate type'
      })
    },
    size: {
      types: ['number'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.top_hit.size.help', {
        defaultMessage: 'Max number of buckets to retrieve'
      })
    },
    sortOrder: {
      types: ['string'],
      options: ['desc', 'asc'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.top_hit.sortOrder.help', {
        defaultMessage: 'Order in which to return the results: asc or desc'
      })
    },
    sortField: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.top_hit.sortField.help', {
        defaultMessage: 'Field to order results by'
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.top_hit.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
      })
    },
    customLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.top_hit.customLabel.help', {
        defaultMessage: 'Represents a custom label for this aggregation'
      })
    }
  },
  fn: (input, args) => {
    const {
      id,
      enabled,
      schema,
      ...rest
    } = args;
    return {
      type: 'agg_type',
      value: {
        id,
        enabled,
        schema,
        type: _.METRIC_TYPES.TOP_HITS,
        params: { ...rest
        }
      }
    };
  }
});

exports.aggTopHit = aggTopHit;