"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerErrorCountAlertType = registerErrorCountAlertType;

var _configSchema = require("@kbn/config-schema");

var _lodash = require("lodash");

var _operators = require("rxjs/operators");

var _alert_types = require("../../../common/alert_types");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../common/processor_event");

var _queries = require("../../../common/utils/queries");

var _get_apm_indices = require("../settings/apm_indices/get_apm_indices");

var _action_variables = require("./action_variables");

var _alerting_es_client = require("./alerting_es_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramsSchema = _configSchema.schema.object({
  windowSize: _configSchema.schema.number(),
  windowUnit: _configSchema.schema.string(),
  threshold: _configSchema.schema.number(),
  serviceName: _configSchema.schema.maybe(_configSchema.schema.string()),
  environment: _configSchema.schema.string()
});

const alertTypeConfig = _alert_types.ALERT_TYPES_CONFIG[_alert_types.AlertType.ErrorCount];

function registerErrorCountAlertType({
  alerts,
  config$
}) {
  alerts.registerType({
    id: _alert_types.AlertType.ErrorCount,
    name: alertTypeConfig.name,
    actionGroups: alertTypeConfig.actionGroups,
    defaultActionGroupId: alertTypeConfig.defaultActionGroupId,
    validate: {
      params: paramsSchema
    },
    actionVariables: {
      context: [_action_variables.apmActionVariables.serviceName, _action_variables.apmActionVariables.environment, _action_variables.apmActionVariables.threshold, _action_variables.apmActionVariables.triggerValue, _action_variables.apmActionVariables.interval]
    },
    producer: 'apm',
    minimumLicenseRequired: 'basic',
    executor: async ({
      services,
      params
    }) => {
      const config = await config$.pipe((0, _operators.take)(1)).toPromise();
      const alertParams = params;
      const indices = await (0, _get_apm_indices.getApmIndices)({
        config,
        savedObjectsClient: services.savedObjectsClient
      });
      const maxServiceEnvironments = config['xpack.apm.maxServiceEnvironments'];
      const searchParams = {
        index: indices['apm_oss.errorIndices'],
        size: 0,
        body: {
          track_total_hits: true,
          query: {
            bool: {
              filter: [{
                range: {
                  '@timestamp': {
                    gte: `now-${alertParams.windowSize}${alertParams.windowUnit}`
                  }
                }
              }, {
                term: {
                  [_elasticsearch_fieldnames.PROCESSOR_EVENT]: _processor_event.ProcessorEvent.error
                }
              }, ...(alertParams.serviceName ? [{
                term: {
                  [_elasticsearch_fieldnames.SERVICE_NAME]: alertParams.serviceName
                }
              }] : []), ...(0, _queries.environmentQuery)(alertParams.environment)]
            }
          },
          aggs: {
            services: {
              terms: {
                field: _elasticsearch_fieldnames.SERVICE_NAME,
                size: 50
              },
              aggs: {
                environments: {
                  terms: {
                    field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT,
                    size: maxServiceEnvironments
                  }
                }
              }
            }
          }
        }
      };
      const response = await (0, _alerting_es_client.alertingEsClient)(services, searchParams);
      const errorCount = response.hits.total.value;

      if (errorCount > alertParams.threshold) {
        var _response$aggregation;

        function scheduleAction({
          serviceName,
          environment
        }) {
          const alertInstanceName = [_alert_types.AlertType.ErrorCount, serviceName, environment].filter(name => name).join('_');
          const alertInstance = services.alertInstanceFactory(alertInstanceName);
          alertInstance.scheduleActions(alertTypeConfig.defaultActionGroupId, {
            serviceName,
            environment,
            threshold: alertParams.threshold,
            triggerValue: errorCount,
            interval: `${alertParams.windowSize}${alertParams.windowUnit}`
          });
        }

        (_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : _response$aggregation.services.buckets.forEach(serviceBucket => {
          var _serviceBucket$enviro;

          const serviceName = serviceBucket.key;

          if ((0, _lodash.isEmpty)((_serviceBucket$enviro = serviceBucket.environments) === null || _serviceBucket$enviro === void 0 ? void 0 : _serviceBucket$enviro.buckets)) {
            scheduleAction({
              serviceName
            });
          } else {
            serviceBucket.environments.buckets.forEach(envBucket => {
              const environment = envBucket.key;
              scheduleAction({
                serviceName,
                environment
              });
            });
          }
        });
      }
    }
  });
}