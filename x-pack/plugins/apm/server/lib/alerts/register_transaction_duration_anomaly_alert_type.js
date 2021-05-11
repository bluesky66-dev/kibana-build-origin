"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTransactionDurationAnomalyAlertType = registerTransactionDurationAnomalyAlertType;

var _configSchema = require("@kbn/config-schema");

var _lodash = require("lodash");

var _anomaly_detection = require("../../../common/anomaly_detection");

var _common = require("../../../../ml/common");

var _alert_types = require("../../../common/alert_types");

var _get_service_anomalies = require("../service_map/get_service_anomalies");

var _action_variables = require("./action_variables");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramsSchema = _configSchema.schema.object({
  serviceName: _configSchema.schema.maybe(_configSchema.schema.string()),
  transactionType: _configSchema.schema.maybe(_configSchema.schema.string()),
  windowSize: _configSchema.schema.number(),
  windowUnit: _configSchema.schema.string(),
  environment: _configSchema.schema.string(),
  anomalySeverityType: _configSchema.schema.oneOf([_configSchema.schema.literal(_common.ANOMALY_SEVERITY.CRITICAL), _configSchema.schema.literal(_common.ANOMALY_SEVERITY.MAJOR), _configSchema.schema.literal(_common.ANOMALY_SEVERITY.MINOR), _configSchema.schema.literal(_common.ANOMALY_SEVERITY.WARNING)])
});

const alertTypeConfig = _alert_types.ALERT_TYPES_CONFIG[_alert_types.AlertType.TransactionDurationAnomaly];

function registerTransactionDurationAnomalyAlertType({
  alerts,
  ml,
  config$
}) {
  alerts.registerType({
    id: _alert_types.AlertType.TransactionDurationAnomaly,
    name: alertTypeConfig.name,
    actionGroups: alertTypeConfig.actionGroups,
    defaultActionGroupId: alertTypeConfig.defaultActionGroupId,
    validate: {
      params: paramsSchema
    },
    actionVariables: {
      context: [_action_variables.apmActionVariables.serviceName, _action_variables.apmActionVariables.transactionType, _action_variables.apmActionVariables.environment, _action_variables.apmActionVariables.threshold, _action_variables.apmActionVariables.triggerValue]
    },
    producer: 'apm',
    minimumLicenseRequired: 'basic',
    executor: async ({
      services,
      params,
      state
    }) => {
      if (!ml) {
        return;
      }

      const alertParams = params;
      const request = {};
      const {
        mlAnomalySearch
      } = ml.mlSystemProvider(request, services.savedObjectsClient);
      const anomalyDetectors = ml.anomalyDetectorsProvider(request, services.savedObjectsClient);
      const mlJobs = await (0, _get_service_anomalies.getMLJobs)(anomalyDetectors, alertParams.environment);

      const selectedOption = _alert_types.ANOMALY_ALERT_SEVERITY_TYPES.find(option => option.type === alertParams.anomalySeverityType);

      if (!selectedOption) {
        throw new Error(`Anomaly alert severity type ${alertParams.anomalySeverityType} is not supported.`);
      }

      const threshold = selectedOption.threshold;

      if (mlJobs.length === 0) {
        return {};
      }

      const jobIds = mlJobs.map(job => job.job_id);
      const anomalySearchParams = {
        terminateAfter: 1,
        body: {
          size: 0,
          query: {
            bool: {
              filter: [{
                term: {
                  result_type: 'record'
                }
              }, {
                terms: {
                  job_id: jobIds
                }
              }, {
                range: {
                  timestamp: {
                    gte: `now-${alertParams.windowSize}${alertParams.windowUnit}`,
                    format: 'epoch_millis'
                  }
                }
              }, ...(alertParams.serviceName ? [{
                term: {
                  partition_field_value: alertParams.serviceName
                }
              }] : []), ...(alertParams.transactionType ? [{
                term: {
                  by_field_value: alertParams.transactionType
                }
              }] : []), {
                range: {
                  record_score: {
                    gte: threshold
                  }
                }
              }]
            }
          },
          aggs: {
            services: {
              terms: {
                field: 'partition_field_value',
                size: 50
              },
              aggs: {
                transaction_types: {
                  terms: {
                    field: 'by_field_value'
                  }
                },
                record_avg: {
                  avg: {
                    field: 'record_score'
                  }
                }
              }
            }
          }
        }
      };
      const response = await mlAnomalySearch(anomalySearchParams, jobIds);
      const hitCount = response.hits.total.value;

      if (hitCount > 0) {
        function scheduleAction({
          serviceName,
          severity,
          environment,
          transactionType
        }) {
          const alertInstanceName = [_alert_types.AlertType.TransactionDurationAnomaly, serviceName, environment, transactionType].filter(name => name).join('_');
          const alertInstance = services.alertInstanceFactory(alertInstanceName);
          alertInstance.scheduleActions(alertTypeConfig.defaultActionGroupId, {
            serviceName,
            environment,
            transactionType,
            threshold: selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.label,
            thresholdValue: severity
          });
        }

        mlJobs.map(job => {
          var _job$custom_settings, _job$custom_settings$, _response$aggregation;

          const environment = (_job$custom_settings = job.custom_settings) === null || _job$custom_settings === void 0 ? void 0 : (_job$custom_settings$ = _job$custom_settings.job_tags) === null || _job$custom_settings$ === void 0 ? void 0 : _job$custom_settings$.environment;
          (_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : _response$aggregation.services.buckets.forEach(serviceBucket => {
            var _serviceBucket$transa;

            const serviceName = serviceBucket.key;
            const severity = (0, _anomaly_detection.getSeverity)(serviceBucket.record_avg.value);

            if ((0, _lodash.isEmpty)((_serviceBucket$transa = serviceBucket.transaction_types) === null || _serviceBucket$transa === void 0 ? void 0 : _serviceBucket$transa.buckets)) {
              scheduleAction({
                serviceName,
                severity,
                environment
              });
            } else {
              var _serviceBucket$transa2;

              (_serviceBucket$transa2 = serviceBucket.transaction_types) === null || _serviceBucket$transa2 === void 0 ? void 0 : _serviceBucket$transa2.buckets.forEach(typeBucket => {
                const transactionType = typeBucket.key;
                scheduleAction({
                  serviceName,
                  severity,
                  environment,
                  transactionType
                });
              });
            }
          });
        });
      }
    }
  });
}