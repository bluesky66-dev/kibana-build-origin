"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KibanaMetricsAdapter = void 0;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _check_valid_node = require("./lib/check_valid_node");

var _inventory_models = require("../../../../common/inventory_models");

var _types = require("../../../../common/inventory_models/types");

var _calculate_metric_interval = require("../../../utils/calculate_metric_interval");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class KibanaMetricsAdapter {
  constructor(framework) {
    _defineProperty(this, "framework", void 0);

    this.framework = framework;
  }

  async getMetrics(requestContext, options, rawRequest) {
    const indexPattern = `${options.sourceConfiguration.metricAlias},${options.sourceConfiguration.logAlias}`;
    const fields = (0, _inventory_models.findInventoryFields)(options.nodeType, options.sourceConfiguration.fields);
    const nodeField = fields.id;

    const search = searchOptions => this.framework.callWithRequest(requestContext, 'search', searchOptions);

    const validNode = await (0, _check_valid_node.checkValidNode)(search, indexPattern, nodeField, options.nodeIds.nodeId);

    if (!validNode) {
      throw new Error(_i18n.i18n.translate('xpack.infra.kibanaMetrics.nodeDoesNotExistErrorMessage', {
        defaultMessage: '{nodeId} does not exist.',
        values: {
          nodeId: options.nodeIds.nodeId
        }
      }));
    }

    const requests = options.metrics.map(metricId => this.makeTSVBRequest(metricId, options, nodeField, requestContext, rawRequest));
    return Promise.all(requests).then(results => {
      return results.map(result => {
        const metricIds = Object.keys(result).filter(k => !['type', 'uiRestrictions'].includes(k));
        return metricIds.map(id => {
          if (!_types.InventoryMetricRT.is(id)) {
            throw new Error(_i18n.i18n.translate('xpack.infra.kibanaMetrics.invalidInfraMetricErrorMessage', {
              defaultMessage: '{id} is not a valid InfraMetric',
              values: {
                id
              }
            }));
          }

          const panel = result[id];
          return {
            id,
            series: panel.series.map(series => {
              return {
                id: series.id,
                label: series.label,
                data: series.data.map(point => ({
                  timestamp: point[0],
                  value: point[1]
                }))
              };
            })
          };
        });
      });
    }).then(result => (0, _lodash.flatten)(result));
  }

  async makeTSVBRequest(metricId, options, nodeField, requestContext, rawRequest) {
    const createTSVBModel = (0, _lodash.get)(_inventory_models.metrics, ['tsvb', metricId]);

    if (!createTSVBModel) {
      throw new Error(_i18n.i18n.translate('xpack.infra.metrics.missingTSVBModelError', {
        defaultMessage: 'The TSVB model for {metricId} does not exist for {nodeType}',
        values: {
          metricId,
          nodeType: options.nodeType
        }
      }));
    }

    const indexPattern = `${options.sourceConfiguration.metricAlias},${options.sourceConfiguration.logAlias}`;
    const timerange = {
      min: options.timerange.from,
      max: options.timerange.to
    };
    const model = createTSVBModel(options.sourceConfiguration.fields.timestamp, indexPattern, options.timerange.interval);

    const client = opts => this.framework.callWithRequest(requestContext, 'search', opts);

    const calculatedInterval = await (0, _calculate_metric_interval.calculateMetricInterval)(client, {
      indexPattern: `${options.sourceConfiguration.logAlias},${options.sourceConfiguration.metricAlias}`,
      timestampField: options.sourceConfiguration.fields.timestamp,
      timerange: options.timerange
    }, model.requires);

    if (calculatedInterval) {
      model.interval = `>=${calculatedInterval}s`;
    }

    if (model.id_type === 'cloud' && !options.nodeIds.cloudId) {
      throw new Error(_i18n.i18n.translate('xpack.infra.kibanaMetrics.cloudIdMissingErrorMessage', {
        defaultMessage: 'Model for {metricId} requires a cloudId, but none was given for {nodeId}.',
        values: {
          metricId,
          nodeId: options.nodeIds.nodeId
        }
      }));
    }

    const id = model.id_type === 'cloud' ? options.nodeIds.cloudId : options.nodeIds.nodeId;
    const filters = model.map_field_to ? [{
      match: {
        [model.map_field_to]: id
      }
    }] : [{
      match: {
        [nodeField]: id
      }
    }];
    return this.framework.makeTSVBRequest(requestContext, rawRequest, model, timerange, filters);
  }

}

exports.KibanaMetricsAdapter = KibanaMetricsAdapter;