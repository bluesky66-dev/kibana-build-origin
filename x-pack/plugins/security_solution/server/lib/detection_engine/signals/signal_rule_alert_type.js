"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signalRulesAlertType = void 0;

var _isEmpty = _interopRequireDefault(require("lodash/isEmpty"));

var _TaskEither = require("fp-ts/lib/TaskEither");

var _function = require("fp-ts/lib/function");

var _perf_hooks = require("perf_hooks");

var _fp_utils = require("../../../../common/fp_utils");

var _constants = require("../../../../common/constants");

var _helpers = require("../../../../common/machine_learning/helpers");

var _utils = require("../../../../common/detection_engine/utils");

var _parse_schedule_dates = require("../../../../common/detection_engine/parse_schedule_dates");

var _get_input_output_index = require("./get_input_output_index");

var _search_after_bulk_create = require("./search_after_bulk_create");

var _get_filter = require("./get_filter");

var _utils2 = require("./utils");

var _signal_params_schema = require("./signal_params_schema");

var _siem_rule_action_groups = require("./siem_rule_action_groups");

var _find_ml_signals = require("./find_ml_signals");

var _threshold = require("./threshold");

var _bulk_create_ml_signals = require("./bulk_create_ml_signals");

var _schedule_notification_actions = require("../notifications/schedule_notification_actions");

var _rule_status_service = require("./rule_status_service");

var _rule_messages = require("./rule_messages");

var _rule_status_saved_objects_client = require("./rule_status_saved_objects_client");

var _utils3 = require("../notifications/utils");

var _get_query_filter = require("../../../../common/detection_engine/get_query_filter");

var _single_bulk_create = require("./single_bulk_create");

var _build_bulk_body = require("./build_bulk_body");

var _create_threat_signals = require("./threat_mapping/create_threat_signals");

var _get_index_version = require("../routes/index/get_index_version");

var _get_signals_template = require("../routes/index/get_signals_template");

var _filter_events_against_list = require("./filters/filter_events_against_list");

var _helpers2 = require("../migrations/helpers");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable complexity */


const signalRulesAlertType = ({
  logger,
  eventsTelemetry,
  version,
  ml,
  lists
}) => {
  return {
    id: _constants.SIGNALS_ID,
    name: 'SIEM signal',
    actionGroups: _siem_rule_action_groups.siemRuleActionGroups,
    defaultActionGroupId: 'default',
    validate: {
      /**
       * TODO: Fix typing inconsistancy between `RuleTypeParams` and `CreateRulesOptions`
       * Once that's done, you should be able to do:
       * ```
       * params: signalParamsSchema(),
       * ```
       */
      params: (0, _signal_params_schema.signalParamsSchema)()
    },
    producer: _constants.SERVER_APP_ID,
    minimumLicenseRequired: 'basic',

    async executor({
      previousStartedAt,
      startedAt,
      alertId,
      services,
      params,
      spaceId,
      updatedBy: updatedByUser
    }) {
      var _savedObject$updated_;

      const {
        anomalyThreshold,
        from,
        ruleId,
        index,
        eventCategoryOverride,
        filters,
        language,
        maxSignals,
        meta,
        machineLearningJobId,
        outputIndex,
        savedId,
        query,
        to,
        threshold,
        threatFilters,
        threatQuery,
        threatIndex,
        threatIndicatorPath,
        threatMapping,
        threatLanguage,
        timestampOverride,
        type,
        exceptionsList,
        concurrentSearches,
        itemsPerSearch
      } = params;
      const searchAfterSize = Math.min(maxSignals, _constants.DEFAULT_SEARCH_AFTER_PAGE_SIZE);
      let hasError = false;
      let result = (0, _utils2.createSearchAfterReturnType)();
      const ruleStatusClient = (0, _rule_status_saved_objects_client.ruleStatusSavedObjectsClientFactory)(services.savedObjectsClient);
      const ruleStatusService = await (0, _rule_status_service.ruleStatusServiceFactory)({
        alertId,
        ruleStatusClient
      });
      const savedObject = await services.savedObjectsClient.get('alert', alertId);
      const {
        actions,
        name,
        tags,
        createdAt,
        createdBy,
        updatedBy,
        enabled,
        schedule: {
          interval
        },
        throttle
      } = savedObject.attributes;
      const updatedAt = (_savedObject$updated_ = savedObject.updated_at) !== null && _savedObject$updated_ !== void 0 ? _savedObject$updated_ : '';
      const refresh = actions.length ? 'wait_for' : false;
      const buildRuleMessage = (0, _rule_messages.buildRuleMessageFactory)({
        id: alertId,
        ruleId,
        name,
        index: outputIndex
      });
      logger.debug(buildRuleMessage('[+] Starting Signal Rule execution'));
      logger.debug(buildRuleMessage(`interval: ${interval}`));
      let wroteWarningStatus = false;
      await ruleStatusService.goingToRun(); // check if rule has permissions to access given index pattern
      // move this collection of lines into a function in utils
      // so that we can use it in create rules route, bulk, etc.

      try {
        if (!(0, _isEmpty.default)(index)) {
          const hasTimestampOverride = timestampOverride != null && !(0, _isEmpty.default)(timestampOverride);
          const inputIndices = await (0, _get_input_output_index.getInputIndex)(services, version, index);
          const [privileges, timestampFieldCaps] = await Promise.all([(0, _utils2.checkPrivileges)(services, inputIndices), services.scopedClusterClient.fieldCaps({
            index,
            fields: hasTimestampOverride ? ['@timestamp', timestampOverride] : ['@timestamp'],
            include_unmapped: true
          })]);
          wroteWarningStatus = await (0, _function.flow)(() => (0, _TaskEither.tryCatch)(() => (0, _utils2.hasReadIndexPrivileges)(privileges, logger, buildRuleMessage, ruleStatusService), _fp_utils.toError), (0, _TaskEither.chain)(wroteStatus => (0, _TaskEither.tryCatch)(() => (0, _utils2.hasTimestampFields)(wroteStatus, hasTimestampOverride ? timestampOverride : '@timestamp', name, timestampFieldCaps, inputIndices, ruleStatusService, logger, buildRuleMessage), _fp_utils.toError)), _fp_utils.toPromise)();
        }
      } catch (exc) {
        logger.error(buildRuleMessage(`Check privileges failed to execute ${exc}`));
      }

      const {
        tuples,
        remainingGap
      } = (0, _utils2.getRuleRangeTuples)({
        logger,
        previousStartedAt,
        from,
        to,
        interval,
        maxSignals,
        buildRuleMessage
      });

      if (remainingGap.asMilliseconds() > 0) {
        const gapString = remainingGap.humanize();
        const gapMessage = buildRuleMessage(`${gapString} (${remainingGap.asMilliseconds()}ms) were not queried between this rule execution and the last execution, so signals may have been missed.`, 'Consider increasing your look behind time or adding more Kibana instances.');
        logger.warn(gapMessage);
        hasError = true;
        await ruleStatusService.error(gapMessage, {
          gap: gapString
        });
      }

      try {
        const {
          listClient,
          exceptionsClient
        } = (0, _utils2.getListsClient)({
          services,
          updatedByUser,
          spaceId,
          lists,
          savedObjectClient: services.savedObjectsClient
        });
        const exceptionItems = await (0, _utils2.getExceptions)({
          client: exceptionsClient,
          lists: exceptionsList !== null && exceptionsList !== void 0 ? exceptionsList : []
        });

        if ((0, _helpers.isMlRule)(type)) {
          var _failures;

          if (ml == null) {
            throw new Error('ML plugin unavailable during rule execution');
          }

          if (machineLearningJobId == null || anomalyThreshold == null) {
            throw new Error(['Machine learning rule is missing job id and/or anomaly threshold:', `job id: "${machineLearningJobId}"`, `anomaly threshold: "${anomalyThreshold}"`].join(' '));
          } // Using fake KibanaRequest as it is needed to satisfy the ML Services API, but can be empty as it is
          // currently unused by the jobsSummary function.


          const fakeRequest = {};
          const summaryJobs = await ml.jobServiceProvider(fakeRequest, services.savedObjectsClient).jobsSummary([machineLearningJobId]);
          const jobSummary = summaryJobs.find(job => job.id === machineLearningJobId);

          if (jobSummary == null || !(0, _helpers.isJobStarted)(jobSummary.jobState, jobSummary.datafeedState)) {
            const errorMessage = buildRuleMessage('Machine learning job is not started:', `job id: "${machineLearningJobId}"`, `job status: "${jobSummary === null || jobSummary === void 0 ? void 0 : jobSummary.jobState}"`, `datafeed status: "${jobSummary === null || jobSummary === void 0 ? void 0 : jobSummary.datafeedState}"`);
            logger.warn(errorMessage);
            hasError = true;
            await ruleStatusService.error(errorMessage);
          }

          const anomalyResults = await (0, _find_ml_signals.findMlSignals)({
            ml,
            // Using fake KibanaRequest as it is needed to satisfy the ML Services API, but can be empty as it is
            // currently unused by the mlAnomalySearch function.
            request: {},
            savedObjectsClient: services.savedObjectsClient,
            jobId: machineLearningJobId,
            anomalyThreshold,
            from,
            to,
            exceptionItems: exceptionItems !== null && exceptionItems !== void 0 ? exceptionItems : []
          });
          const filteredAnomalyResults = await (0, _filter_events_against_list.filterEventsAgainstList)({
            listClient,
            exceptionsList: exceptionItems !== null && exceptionItems !== void 0 ? exceptionItems : [],
            logger,
            eventSearchResult: anomalyResults,
            buildRuleMessage
          });
          const anomalyCount = filteredAnomalyResults.hits.hits.length;

          if (anomalyCount) {
            logger.info(buildRuleMessage(`Found ${anomalyCount} signals from ML anomalies.`));
          }

          const {
            success,
            errors,
            bulkCreateDuration,
            createdItemsCount,
            createdItems
          } = await (0, _bulk_create_ml_signals.bulkCreateMlSignals)({
            actions,
            throttle,
            someResult: filteredAnomalyResults,
            ruleParams: params,
            services,
            logger,
            id: alertId,
            signalsIndex: outputIndex,
            name,
            createdBy,
            createdAt,
            updatedBy,
            updatedAt,
            interval,
            enabled,
            refresh,
            tags,
            buildRuleMessage
          }); // The legacy ES client does not define failures when it can be present on the structure, hence why I have the & { failures: [] }

          const shardFailures = (_failures = filteredAnomalyResults._shards.failures) !== null && _failures !== void 0 ? _failures : [];
          const searchErrors = (0, _utils2.createErrorsFromShard)({
            errors: shardFailures
          });
          result = (0, _utils2.mergeReturns)([result, (0, _utils2.createSearchAfterReturnType)({
            success: success && filteredAnomalyResults._shards.failed === 0,
            errors: [...errors, ...searchErrors],
            createdSignalsCount: createdItemsCount,
            createdSignals: createdItems,
            bulkCreateTimes: bulkCreateDuration ? [bulkCreateDuration] : []
          })]);
        } else if ((0, _utils.isThresholdRule)(type) && threshold) {
          if ((0, _utils.hasLargeValueItem)(exceptionItems !== null && exceptionItems !== void 0 ? exceptionItems : [])) {
            await ruleStatusService.partialFailure('Exceptions that use "is in list" or "is not in list" operators are not applied to Threshold rules');
            wroteWarningStatus = true;
          }

          const inputIndex = await (0, _get_input_output_index.getInputIndex)(services, version, index);

          for (const tuple of tuples) {
            const {
              thresholdSignalHistory,
              searchErrors: previousSearchErrors
            } = await (0, _threshold.getThresholdSignalHistory)({
              indexPattern: [outputIndex],
              from: tuple.from.toISOString(),
              to: tuple.to.toISOString(),
              services,
              logger,
              ruleId,
              bucketByFields: (0, _utils.normalizeThresholdField)(threshold.field),
              timestampOverride,
              buildRuleMessage
            });
            const bucketFilters = await (0, _threshold.getThresholdBucketFilters)({
              thresholdSignalHistory,
              timestampOverride
            });
            const esFilter = await (0, _get_filter.getFilter)({
              type,
              filters: filters ? filters.concat(bucketFilters) : bucketFilters,
              language,
              query,
              savedId,
              services,
              index: inputIndex,
              lists: exceptionItems !== null && exceptionItems !== void 0 ? exceptionItems : []
            });
            const {
              searchResult: thresholdResults,
              searchErrors,
              searchDuration: thresholdSearchDuration
            } = await (0, _threshold.findThresholdSignals)({
              inputIndexPattern: inputIndex,
              from: tuple.from.toISOString(),
              to: tuple.to.toISOString(),
              services,
              logger,
              filter: esFilter,
              threshold,
              timestampOverride,
              buildRuleMessage
            });
            const {
              success,
              bulkCreateDuration,
              createdItemsCount,
              createdItems,
              errors
            } = await (0, _threshold.bulkCreateThresholdSignals)({
              actions,
              throttle,
              someResult: thresholdResults,
              ruleParams: params,
              filter: esFilter,
              services,
              logger,
              id: alertId,
              inputIndexPattern: inputIndex,
              signalsIndex: outputIndex,
              timestampOverride,
              startedAt,
              from: tuple.from.toDate(),
              name,
              createdBy,
              createdAt,
              updatedBy,
              updatedAt,
              interval,
              enabled,
              refresh,
              tags,
              thresholdSignalHistory,
              buildRuleMessage
            });
            result = (0, _utils2.mergeReturns)([result, (0, _utils2.createSearchAfterReturnTypeFromResponse)({
              searchResult: thresholdResults,
              timestampOverride
            }), (0, _utils2.createSearchAfterReturnType)({
              success,
              errors: [...errors, ...previousSearchErrors, ...searchErrors],
              createdSignalsCount: createdItemsCount,
              createdSignals: createdItems,
              bulkCreateTimes: bulkCreateDuration ? [bulkCreateDuration] : [],
              searchAfterTimes: [thresholdSearchDuration]
            })]);
          }
        } else if ((0, _utils.isThreatMatchRule)(type)) {
          if (threatQuery == null || threatIndex == null || threatMapping == null || query == null) {
            throw new Error(['Indicator match is missing threatQuery and/or threatIndex and/or threatMapping:', `threatQuery: "${threatQuery}"`, `threatIndex: "${threatIndex}"`, `threatMapping: "${threatMapping}"`].join(' '));
          }

          const inputIndex = await (0, _get_input_output_index.getInputIndex)(services, version, index);
          result = await (0, _create_threat_signals.createThreatSignals)({
            tuples,
            threatMapping,
            query,
            inputIndex,
            type,
            filters: filters !== null && filters !== void 0 ? filters : [],
            language,
            name,
            savedId,
            services,
            exceptionItems: exceptionItems !== null && exceptionItems !== void 0 ? exceptionItems : [],
            listClient,
            logger,
            eventsTelemetry,
            alertId,
            outputIndex,
            params,
            searchAfterSize,
            actions,
            createdBy,
            createdAt,
            updatedBy,
            interval,
            updatedAt,
            enabled,
            refresh,
            tags,
            throttle,
            threatFilters: threatFilters !== null && threatFilters !== void 0 ? threatFilters : [],
            threatQuery,
            threatLanguage,
            buildRuleMessage,
            threatIndex,
            threatIndicatorPath,
            concurrentSearches: concurrentSearches !== null && concurrentSearches !== void 0 ? concurrentSearches : 1,
            itemsPerSearch: itemsPerSearch !== null && itemsPerSearch !== void 0 ? itemsPerSearch : 9000
          });
        } else if (type === 'query' || type === 'saved_query') {
          const inputIndex = await (0, _get_input_output_index.getInputIndex)(services, version, index);
          const esFilter = await (0, _get_filter.getFilter)({
            type,
            filters,
            language,
            query,
            savedId,
            services,
            index: inputIndex,
            lists: exceptionItems !== null && exceptionItems !== void 0 ? exceptionItems : []
          });
          result = await (0, _search_after_bulk_create.searchAfterAndBulkCreate)({
            tuples,
            listClient,
            exceptionsList: exceptionItems !== null && exceptionItems !== void 0 ? exceptionItems : [],
            ruleParams: params,
            services,
            logger,
            eventsTelemetry,
            id: alertId,
            inputIndexPattern: inputIndex,
            signalsIndex: outputIndex,
            filter: esFilter,
            actions,
            name,
            createdBy,
            createdAt,
            updatedBy,
            updatedAt,
            interval,
            enabled,
            pageSize: searchAfterSize,
            refresh,
            tags,
            throttle,
            buildRuleMessage
          });
        } else if ((0, _utils.isEqlRule)(type)) {
          if (query === undefined) {
            throw new Error('EQL query rule must have a query defined');
          }

          if ((0, _utils.hasLargeValueItem)(exceptionItems !== null && exceptionItems !== void 0 ? exceptionItems : [])) {
            await ruleStatusService.partialFailure('Exceptions that use "is in list" or "is not in list" operators are not applied to EQL rules');
            wroteWarningStatus = true;
          }

          try {
            const signalIndexVersion = await (0, _get_index_version.getIndexVersion)(services.callCluster, outputIndex);

            if ((0, _helpers2.isOutdated)({
              current: signalIndexVersion,
              target: _get_signals_template.MIN_EQL_RULE_INDEX_VERSION
            })) {
              throw new Error(`EQL based rules require an update to version ${_get_signals_template.MIN_EQL_RULE_INDEX_VERSION} of the detection alerts index mapping`);
            }
          } catch (err) {
            if (err.statusCode === 403) {
              throw new Error(`EQL based rules require the user that created it to have the view_index_metadata, read, and write permissions for index: ${outputIndex}`);
            } else {
              throw err;
            }
          }

          const inputIndex = await (0, _get_input_output_index.getInputIndex)(services, version, index);
          const request = (0, _get_query_filter.buildEqlSearchRequest)(query, inputIndex, from, to, searchAfterSize, timestampOverride, exceptionItems !== null && exceptionItems !== void 0 ? exceptionItems : [], eventCategoryOverride);

          const eqlSignalSearchStart = _perf_hooks.performance.now();

          const response = await services.callCluster('transport.request', request);

          const eqlSignalSearchEnd = _perf_hooks.performance.now();

          const eqlSearchDuration = (0, _utils2.makeFloatString)(eqlSignalSearchEnd - eqlSignalSearchStart);
          result.searchAfterTimes = [eqlSearchDuration];
          let newSignals;

          if (response.hits.sequences !== undefined) {
            newSignals = response.hits.sequences.reduce((acc, sequence) => acc.concat((0, _build_bulk_body.buildSignalGroupFromSequence)(sequence, savedObject, outputIndex)), []);
          } else if (response.hits.events !== undefined) {
            newSignals = (0, _single_bulk_create.filterDuplicateSignals)(savedObject.id, response.hits.events.map(event => (0, _utils2.wrapSignal)((0, _build_bulk_body.buildSignalFromEvent)(event, savedObject, true), outputIndex)));
          } else {
            throw new Error('eql query response should have either `sequences` or `events` but had neither');
          }

          if (newSignals.length > 0) {
            const insertResult = await (0, _single_bulk_create.bulkInsertSignals)(newSignals, logger, services, refresh);
            result.bulkCreateTimes.push(insertResult.bulkCreateDuration);
            result.createdSignalsCount += insertResult.createdItemsCount;
            result.createdSignals = insertResult.createdItems;
          }

          result.success = true;
        } else {
          throw new Error(`unknown rule type ${type}`);
        }

        if (result.success) {
          if (actions.length) {
            var _parseScheduleDates, _parseScheduleDates2;

            const notificationRuleParams = { ...params,
              name,
              id: savedObject.id
            };
            const fromInMs = (_parseScheduleDates = (0, _parse_schedule_dates.parseScheduleDates)(`now-${interval}`)) === null || _parseScheduleDates === void 0 ? void 0 : _parseScheduleDates.format('x');
            const toInMs = (_parseScheduleDates2 = (0, _parse_schedule_dates.parseScheduleDates)('now')) === null || _parseScheduleDates2 === void 0 ? void 0 : _parseScheduleDates2.format('x');
            const resultsLink = (0, _utils3.getNotificationResultsLink)({
              from: fromInMs,
              to: toInMs,
              id: savedObject.id,
              kibanaSiemAppUrl: meta === null || meta === void 0 ? void 0 : meta.kibana_siem_app_url
            });
            logger.info(buildRuleMessage(`Found ${result.createdSignalsCount} signals for notification.`));

            if (result.createdSignalsCount) {
              const alertInstance = services.alertInstanceFactory(alertId);
              (0, _schedule_notification_actions.scheduleNotificationActions)({
                alertInstance,
                signalsCount: result.createdSignalsCount,
                signals: result.createdSignals,
                resultsLink,
                ruleParams: notificationRuleParams
              });
            }
          }

          logger.debug(buildRuleMessage('[+] Signal Rule execution completed.'));
          logger.debug(buildRuleMessage(`[+] Finished indexing ${result.createdSignalsCount} signals into ${outputIndex}`));

          if (!hasError && !wroteWarningStatus) {
            var _result$lastLookBackD;

            await ruleStatusService.success('succeeded', {
              bulkCreateTimeDurations: result.bulkCreateTimes,
              searchAfterTimeDurations: result.searchAfterTimes,
              lastLookBackDate: (_result$lastLookBackD = result.lastLookBackDate) === null || _result$lastLookBackD === void 0 ? void 0 : _result$lastLookBackD.toISOString()
            });
          } // adding this log line so we can get some information from cloud


          logger.info(buildRuleMessage(`[+] Finished indexing ${result.createdSignalsCount}  ${!(0, _isEmpty.default)(result.totalToFromTuples) ? `signals searched between date ranges ${JSON.stringify(result.totalToFromTuples, null, 2)}` : ''}`));
        } else {
          var _result$lastLookBackD2;

          const errorMessage = buildRuleMessage('Bulk Indexing of signals failed:', result.errors.join());
          logger.error(errorMessage);
          await ruleStatusService.error(errorMessage, {
            bulkCreateTimeDurations: result.bulkCreateTimes,
            searchAfterTimeDurations: result.searchAfterTimes,
            lastLookBackDate: (_result$lastLookBackD2 = result.lastLookBackDate) === null || _result$lastLookBackD2 === void 0 ? void 0 : _result$lastLookBackD2.toISOString()
          });
        }
      } catch (error) {
        var _error$message, _result$lastLookBackD3;

        const errorMessage = (_error$message = error.message) !== null && _error$message !== void 0 ? _error$message : '(no error message given)';
        const message = buildRuleMessage('An error occurred during rule execution:', `message: "${errorMessage}"`);
        logger.error(message);
        await ruleStatusService.error(message, {
          bulkCreateTimeDurations: result.bulkCreateTimes,
          searchAfterTimeDurations: result.searchAfterTimes,
          lastLookBackDate: (_result$lastLookBackD3 = result.lastLookBackDate) === null || _result$lastLookBackD3 === void 0 ? void 0 : _result$lastLookBackD3.toISOString()
        });
      }
    }

  };
};

exports.signalRulesAlertType = signalRulesAlertType;