"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTransactionDurationAlertType = registerTransactionDurationAlertType;

var _configSchema = require("@kbn/config-schema");

var _operators = require("rxjs/operators");

var _alert_types = require("../../../common/alert_types");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../common/processor_event");

var _formatters = require("../../../common/utils/formatters");

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
  serviceName: _configSchema.schema.string(),
  transactionType: _configSchema.schema.string(),
  windowSize: _configSchema.schema.number(),
  windowUnit: _configSchema.schema.string(),
  threshold: _configSchema.schema.number(),
  aggregationType: _configSchema.schema.oneOf([_configSchema.schema.literal('avg'), _configSchema.schema.literal('95th'), _configSchema.schema.literal('99th')]),
  environment: _configSchema.schema.string()
});

const alertTypeConfig = _alert_types.ALERT_TYPES_CONFIG[_alert_types.AlertType.TransactionDuration];

function registerTransactionDurationAlertType({
  alerts,
  config$
}) {
  alerts.registerType({
    id: _alert_types.AlertType.TransactionDuration,
    name: alertTypeConfig.name,
    actionGroups: alertTypeConfig.actionGroups,
    defaultActionGroupId: alertTypeConfig.defaultActionGroupId,
    validate: {
      params: paramsSchema
    },
    actionVariables: {
      context: [_action_variables.apmActionVariables.serviceName, _action_variables.apmActionVariables.transactionType, _action_variables.apmActionVariables.environment, _action_variables.apmActionVariables.threshold, _action_variables.apmActionVariables.triggerValue, _action_variables.apmActionVariables.interval]
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
        index: indices['apm_oss.transactionIndices'],
        size: 0,
        body: {
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
                  [_elasticsearch_fieldnames.PROCESSOR_EVENT]: _processor_event.ProcessorEvent.transaction
                }
              }, {
                term: {
                  [_elasticsearch_fieldnames.SERVICE_NAME]: alertParams.serviceName
                }
              }, {
                term: {
                  [_elasticsearch_fieldnames.TRANSACTION_TYPE]: alertParams.transactionType
                }
              }, ...(0, _queries.environmentQuery)(alertParams.environment)]
            }
          },
          aggs: {
            agg: alertParams.aggregationType === 'avg' ? {
              avg: {
                field: _elasticsearch_fieldnames.TRANSACTION_DURATION
              }
            } : {
              percentiles: {
                field: _elasticsearch_fieldnames.TRANSACTION_DURATION,
                percents: [alertParams.aggregationType === '95th' ? 95 : 99]
              }
            },
            environments: {
              terms: {
                field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT,
                size: maxServiceEnvironments
              }
            }
          }
        }
      };
      const response = await (0, _alerting_es_client.alertingEsClient)(services, searchParams);

      if (!response.aggregations) {
        return;
      }

      const {
        agg,
        environments
      } = response.aggregations;
      const transactionDuration = 'values' in agg ? Object.values(agg.values)[0] : agg === null || agg === void 0 ? void 0 : agg.value;
      const threshold = alertParams.threshold * 1000;

      if (transactionDuration && transactionDuration > threshold) {
        const durationFormatter = (0, _formatters.getDurationFormatter)(transactionDuration);
        const transactionDurationFormatted = durationFormatter(transactionDuration).formatted;
        environments.buckets.map(bucket => {
          const environment = bucket.key;
          const alertInstance = services.alertInstanceFactory(`${_alert_types.AlertType.TransactionDuration}_${environment}`);
          alertInstance.scheduleActions(alertTypeConfig.defaultActionGroupId, {
            transactionType: alertParams.transactionType,
            serviceName: alertParams.serviceName,
            environment,
            threshold,
            triggerValue: transactionDurationFormatted,
            interval: `${alertParams.windowSize}${alertParams.windowUnit}`
          });
        });
      }
    }
  });
}