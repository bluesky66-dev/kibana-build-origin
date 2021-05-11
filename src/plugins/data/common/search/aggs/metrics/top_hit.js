"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTopHitMetricAgg = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _i18n = require("@kbn/i18n");

var _top_hit_fn = require("./top_hit_fn");

var _metric_agg_type = require("./metric_agg_type");

var _metric_agg_types = require("./metric_agg_types");

var _common = require("../../../../common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const isNumericFieldSelected = agg => {
  const field = agg.getParam('field');
  return field && field.type && field.type === _common.KBN_FIELD_TYPES.NUMBER;
};

const getTopHitMetricAgg = () => {
  return new _metric_agg_type.MetricAggType({
    name: _metric_agg_types.METRIC_TYPES.TOP_HITS,
    expressionName: _top_hit_fn.aggTopHitFnName,
    title: _i18n.i18n.translate('data.search.aggs.metrics.topHitTitle', {
      defaultMessage: 'Top Hit'
    }),

    makeLabel(aggConfig) {
      const lastPrefixLabel = _i18n.i18n.translate('data.search.aggs.metrics.topHit.lastPrefixLabel', {
        defaultMessage: 'Last'
      });

      const firstPrefixLabel = _i18n.i18n.translate('data.search.aggs.metrics.topHit.firstPrefixLabel', {
        defaultMessage: 'First'
      });

      let prefix = aggConfig.getParam('sortOrder').value === 'desc' ? lastPrefixLabel : firstPrefixLabel;
      const size = aggConfig.getParam('size');

      if (size !== 1) {
        prefix += ` ${size}`;
      }

      const field = aggConfig.getParam('field');
      return `${prefix} ${field ? field.displayName : ''}`;
    },

    params: [{
      name: 'field',
      type: 'field',
      onlyAggregatable: false,
      filterFieldTypes: Object.values(_common.KBN_FIELD_TYPES).filter(type => type !== _common.KBN_FIELD_TYPES.HISTOGRAM),

      write(agg, output) {
        const field = agg.getParam('field');
        output.params = {};

        if (field.scripted) {
          output.params.script_fields = {
            [field.name]: {
              script: {
                source: field.script,
                lang: field.lang
              }
            }
          };
        } else {
          if (field.readFromDocValues) {
            output.params.docvalue_fields = [{
              field: field.name,
              // always format date fields as date_time to avoid
              // displaying unformatted dates like epoch_millis
              // or other not-accepted momentjs formats
              ...(field.type === _common.KBN_FIELD_TYPES.DATE && {
                format: 'date_time'
              })
            }];
          }

          output.params._source = field.name === '_source' ? true : field.name;
        }
      }

    }, {
      name: 'aggregate',
      type: 'optioned',
      options: [{
        text: _i18n.i18n.translate('data.search.aggs.metrics.topHit.minLabel', {
          defaultMessage: 'Min'
        }),
        isCompatible: isNumericFieldSelected,
        disabled: true,
        value: 'min'
      }, {
        text: _i18n.i18n.translate('data.search.aggs.metrics.topHit.maxLabel', {
          defaultMessage: 'Max'
        }),
        isCompatible: isNumericFieldSelected,
        disabled: true,
        value: 'max'
      }, {
        text: _i18n.i18n.translate('data.search.aggs.metrics.topHit.sumLabel', {
          defaultMessage: 'Sum'
        }),
        isCompatible: isNumericFieldSelected,
        disabled: true,
        value: 'sum'
      }, {
        text: _i18n.i18n.translate('data.search.aggs.metrics.topHit.averageLabel', {
          defaultMessage: 'Average'
        }),
        isCompatible: isNumericFieldSelected,
        disabled: true,
        value: 'average'
      }, {
        text: _i18n.i18n.translate('data.search.aggs.metrics.topHit.concatenateLabel', {
          defaultMessage: 'Concatenate'
        }),

        isCompatible(aggConfig) {
          return _lodash.default.get(aggConfig.params, 'field.filterFieldTypes', '*') === '*';
        },

        disabled: true,
        value: 'concat'
      }],
      write: _lodash.default.noop
    }, {
      name: 'size',
      default: 1
    }, {
      name: 'sortField',
      type: 'field',
      filterFieldTypes: [_common.KBN_FIELD_TYPES.NUMBER, _common.KBN_FIELD_TYPES.DATE, _common.KBN_FIELD_TYPES.IP, _common.KBN_FIELD_TYPES.STRING],

      default(agg) {
        return agg.getIndexPattern().timeFieldName;
      },

      write: _lodash.default.noop // prevent default write, it is handled below

    }, {
      name: 'sortOrder',
      type: 'optioned',
      default: 'desc',
      options: [{
        text: _i18n.i18n.translate('data.search.aggs.metrics.topHit.descendingLabel', {
          defaultMessage: 'Descending'
        }),
        value: 'desc'
      }, {
        text: _i18n.i18n.translate('data.search.aggs.metrics.topHit.ascendingLabel', {
          defaultMessage: 'Ascending'
        }),
        value: 'asc'
      }],

      write(agg, output) {
        const sortField = agg.params.sortField;
        const sortOrder = agg.params.sortOrder;

        if (sortField.scripted) {
          output.params.sort = [{
            _script: {
              script: {
                source: sortField.script,
                lang: sortField.lang
              },
              type: sortField.type,
              order: sortOrder.value
            }
          }];
        } else {
          output.params.sort = [{
            [sortField.name]: {
              order: sortOrder.value
            }
          }];
        }
      }

    }],

    getValue(agg, bucket) {
      const hits = _lodash.default.get(bucket, `${agg.id}.hits.hits`);

      if (!hits || !hits.length) {
        return null;
      }

      const path = agg.getParam('field').name;

      let values = _lodash.default.flatten(hits.map(hit => path === '_source' ? hit._source : agg.getIndexPattern().flattenHit(hit, true)[path]));

      if (values.length === 1) {
        values = values[0];
      }

      if (Array.isArray(values)) {
        if (!_lodash.default.compact(values).length) {
          return null;
        }

        const aggregate = agg.getParam('aggregate');

        switch (aggregate.value) {
          case 'max':
            return _lodash.default.max(values);

          case 'min':
            return _lodash.default.min(values);

          case 'sum':
            return _lodash.default.sum(values);

          case 'average':
            return _lodash.default.sum(values) / values.length;
        }
      }

      return values;
    }

  });
};

exports.getTopHitMetricAgg = getTopHitMetricAgg;