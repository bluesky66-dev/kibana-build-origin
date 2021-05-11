"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FIRED_ACTIONS = exports.LogsThresholdFiredActionGroupId = exports.queryMappings = exports.getNegativeComparators = exports.getPositiveComparators = exports.getUngroupedESQuery = exports.getGroupedESQuery = exports.buildFiltersFromCriteria = exports.updateAlertInstance = exports.processGroupByRatioResults = exports.processGroupByResults = exports.processUngroupedRatioResults = exports.processUngroupedResults = exports.createLogThresholdExecutor = void 0;

var _i18n = require("@kbn/i18n");

var _types = require("../../../../common/alerting/logs/log_threshold/types");

var _get_interval_in_seconds = require("../../../utils/get_interval_in_seconds");

var _runtime_types = require("../../../../common/runtime_types");

var _utils = require("../common/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const COMPOSITE_GROUP_SIZE = 40;
const checkValueAgainstComparatorMap = {
  [_types.Comparator.GT]: (a, b) => a > b,
  [_types.Comparator.GT_OR_EQ]: (a, b) => a >= b,
  [_types.Comparator.LT]: (a, b) => a < b,
  [_types.Comparator.LT_OR_EQ]: (a, b) => a <= b
};

const createLogThresholdExecutor = libs => async function ({
  services,
  params
}) {
  const {
    alertInstanceFactory,
    savedObjectsClient,
    callCluster
  } = services;
  const {
    sources
  } = libs;
  const sourceConfiguration = await sources.getSourceConfiguration(savedObjectsClient, 'default');
  const indexPattern = sourceConfiguration.configuration.logAlias;
  const timestampField = sourceConfiguration.configuration.fields.timestamp;

  try {
    const validatedParams = (0, _runtime_types.decodeOrThrow)(_types.alertParamsRT)(params);

    if (!(0, _types.isRatioAlertParams)(validatedParams)) {
      await executeAlert(validatedParams, timestampField, indexPattern, callCluster, alertInstanceFactory);
    } else {
      await executeRatioAlert(validatedParams, timestampField, indexPattern, callCluster, alertInstanceFactory);
    }
  } catch (e) {
    throw new Error(e);
  }
};

exports.createLogThresholdExecutor = createLogThresholdExecutor;

async function executeAlert(alertParams, timestampField, indexPattern, callCluster, alertInstanceFactory) {
  const query = getESQuery(alertParams, timestampField, indexPattern);

  if (!query) {
    throw new Error('ES query could not be built from the provided alert params');
  }

  if ((0, _types.hasGroupBy)(alertParams)) {
    processGroupByResults(await getGroupedResults(query, callCluster), alertParams, alertInstanceFactory, updateAlertInstance);
  } else {
    processUngroupedResults(await getUngroupedResults(query, callCluster), alertParams, alertInstanceFactory, updateAlertInstance);
  }
}

async function executeRatioAlert(alertParams, timestampField, indexPattern, callCluster, alertInstanceFactory) {
  // Ratio alert params are separated out into two standard sets of alert params
  const numeratorParams = { ...alertParams,
    criteria: (0, _types.getNumerator)(alertParams.criteria)
  };
  const denominatorParams = { ...alertParams,
    criteria: (0, _types.getDenominator)(alertParams.criteria)
  };
  const numeratorQuery = getESQuery(numeratorParams, timestampField, indexPattern);
  const denominatorQuery = getESQuery(denominatorParams, timestampField, indexPattern);

  if (!numeratorQuery || !denominatorQuery) {
    throw new Error('ES query could not be built from the provided ratio alert params');
  }

  if ((0, _types.hasGroupBy)(alertParams)) {
    const numeratorGroupedResults = await getGroupedResults(numeratorQuery, callCluster);
    const denominatorGroupedResults = await getGroupedResults(denominatorQuery, callCluster);
    processGroupByRatioResults(numeratorGroupedResults, denominatorGroupedResults, alertParams, alertInstanceFactory, updateAlertInstance);
  } else {
    const numeratorUngroupedResults = await getUngroupedResults(numeratorQuery, callCluster);
    const denominatorUngroupedResults = await getUngroupedResults(denominatorQuery, callCluster);
    processUngroupedRatioResults(numeratorUngroupedResults, denominatorUngroupedResults, alertParams, alertInstanceFactory, updateAlertInstance);
  }
}

const getESQuery = (alertParams, timestampField, indexPattern) => {
  return (0, _types.hasGroupBy)(alertParams) ? getGroupedESQuery(alertParams, timestampField, indexPattern) : getUngroupedESQuery(alertParams, timestampField, indexPattern);
};

const processUngroupedResults = (results, params, alertInstanceFactory, alertInstaceUpdater) => {
  const {
    count,
    criteria
  } = params;
  const documentCount = results.hits.total.value;

  if (checkValueAgainstComparatorMap[count.comparator](documentCount, count.value)) {
    const alertInstance = alertInstanceFactory(_utils.UNGROUPED_FACTORY_KEY);
    alertInstaceUpdater(alertInstance, _types.AlertStates.ALERT, [{
      actionGroup: FIRED_ACTIONS.id,
      context: {
        matchingDocuments: documentCount,
        conditions: createConditionsMessageForCriteria(criteria),
        group: null,
        isRatio: false
      }
    }]);
  }
};

exports.processUngroupedResults = processUngroupedResults;

const processUngroupedRatioResults = (numeratorResults, denominatorResults, params, alertInstanceFactory, alertInstaceUpdater) => {
  const {
    count,
    criteria
  } = params;
  const numeratorCount = numeratorResults.hits.total.value;
  const denominatorCount = denominatorResults.hits.total.value;
  const ratio = getRatio(numeratorCount, denominatorCount);

  if (ratio !== undefined && checkValueAgainstComparatorMap[count.comparator](ratio, count.value)) {
    const alertInstance = alertInstanceFactory(_utils.UNGROUPED_FACTORY_KEY);
    alertInstaceUpdater(alertInstance, _types.AlertStates.ALERT, [{
      actionGroup: FIRED_ACTIONS.id,
      context: {
        ratio,
        numeratorConditions: createConditionsMessageForCriteria((0, _types.getNumerator)(criteria)),
        denominatorConditions: createConditionsMessageForCriteria((0, _types.getDenominator)(criteria)),
        group: null,
        isRatio: true
      }
    }]);
  }
};

exports.processUngroupedRatioResults = processUngroupedRatioResults;

const getRatio = (numerator, denominator) => {
  // We follow the mathematics principle that dividing by 0 isn't possible,
  // and a ratio is therefore undefined (or indeterminate).
  if (numerator === 0 || denominator === 0) return undefined;
  return numerator / denominator;
};

const getReducedGroupByResults = results => {
  return results.reduce((acc, groupBucket) => {
    const groupName = Object.values(groupBucket.key).join(', ');
    const groupResult = {
      name: groupName,
      documentCount: groupBucket.filtered_results.doc_count
    };
    return [...acc, groupResult];
  }, []);
};

const processGroupByResults = (results, params, alertInstanceFactory, alertInstaceUpdater) => {
  const {
    count,
    criteria
  } = params;
  const groupResults = getReducedGroupByResults(results);
  groupResults.forEach(group => {
    const documentCount = group.documentCount;

    if (checkValueAgainstComparatorMap[count.comparator](documentCount, count.value)) {
      const alertInstance = alertInstanceFactory(group.name);
      alertInstaceUpdater(alertInstance, _types.AlertStates.ALERT, [{
        actionGroup: FIRED_ACTIONS.id,
        context: {
          matchingDocuments: documentCount,
          conditions: createConditionsMessageForCriteria(criteria),
          group: group.name,
          isRatio: false
        }
      }]);
    }
  });
};

exports.processGroupByResults = processGroupByResults;

const processGroupByRatioResults = (numeratorResults, denominatorResults, params, alertInstanceFactory, alertInstaceUpdater) => {
  const {
    count,
    criteria
  } = params;
  const numeratorGroupResults = getReducedGroupByResults(numeratorResults);
  const denominatorGroupResults = getReducedGroupByResults(denominatorResults);
  numeratorGroupResults.forEach(numeratorGroup => {
    const numeratorDocumentCount = numeratorGroup.documentCount;
    const denominatorGroup = denominatorGroupResults.find(_group => _group.name === numeratorGroup.name); // If there is no matching group, a ratio cannot be determined, and is therefore undefined.

    const ratio = denominatorGroup ? getRatio(numeratorDocumentCount, denominatorGroup.documentCount) : undefined;

    if (ratio !== undefined && checkValueAgainstComparatorMap[count.comparator](ratio, count.value)) {
      const alertInstance = alertInstanceFactory(numeratorGroup.name);
      alertInstaceUpdater(alertInstance, _types.AlertStates.ALERT, [{
        actionGroup: FIRED_ACTIONS.id,
        context: {
          ratio,
          numeratorConditions: createConditionsMessageForCriteria((0, _types.getNumerator)(criteria)),
          denominatorConditions: createConditionsMessageForCriteria((0, _types.getDenominator)(criteria)),
          group: numeratorGroup.name,
          isRatio: true
        }
      }]);
    }
  });
};

exports.processGroupByRatioResults = processGroupByRatioResults;

const updateAlertInstance = (alertInstance, state, actions) => {
  if (actions && actions.length > 0) {
    const sharedContext = {
      timestamp: new Date().toISOString()
    };
    actions.forEach(actionSet => {
      const {
        actionGroup,
        context
      } = actionSet;
      alertInstance.scheduleActions(actionGroup, { ...sharedContext,
        ...context
      });
    });
  }

  alertInstance.replaceState({
    alertState: state
  });
};

exports.updateAlertInstance = updateAlertInstance;

const buildFiltersFromCriteria = (params, timestampField) => {
  const {
    timeSize,
    timeUnit,
    criteria
  } = params;
  const interval = `${timeSize}${timeUnit}`;
  const intervalAsSeconds = (0, _get_interval_in_seconds.getIntervalInSeconds)(interval);
  const intervalAsMs = intervalAsSeconds * 1000;
  const to = Date.now();
  const from = to - intervalAsMs;
  const positiveComparators = getPositiveComparators();
  const negativeComparators = getNegativeComparators();
  const positiveCriteria = criteria.filter(criterion => positiveComparators.includes(criterion.comparator));
  const negativeCriteria = criteria.filter(criterion => negativeComparators.includes(criterion.comparator)); // Positive assertions (things that "must" match)

  const mustFilters = buildFiltersForCriteria(positiveCriteria); // Negative assertions (things that "must not" match)

  const mustNotFilters = buildFiltersForCriteria(negativeCriteria);
  const rangeFilter = {
    range: {
      [timestampField]: {
        gte: from,
        lte: to,
        format: 'epoch_millis'
      }
    }
  }; // For group by scenarios we'll pad the time range by 1 x the interval size on the left (lte) and right (gte), this is so
  // a wider net is cast to "capture" the groups. This is to account for scenarios where we want ascertain if
  // there were "no documents" (less than 1 for example). In these cases we may be missing documents to build the groups
  // and match / not match the criteria.

  const groupedRangeFilter = {
    range: {
      [timestampField]: {
        gte: from - intervalAsMs,
        lte: to + intervalAsMs,
        format: 'epoch_millis'
      }
    }
  };
  return {
    rangeFilter,
    groupedRangeFilter,
    mustFilters,
    mustNotFilters
  };
};

exports.buildFiltersFromCriteria = buildFiltersFromCriteria;

const getGroupedESQuery = (params, timestampField, index) => {
  const {
    groupBy
  } = params;

  if (!groupBy || !groupBy.length) {
    return;
  }

  const {
    rangeFilter,
    groupedRangeFilter,
    mustFilters,
    mustNotFilters
  } = buildFiltersFromCriteria(params, timestampField);
  const aggregations = {
    groups: {
      composite: {
        size: COMPOSITE_GROUP_SIZE,
        sources: groupBy.map((field, groupIndex) => ({
          [`group-${groupIndex}-${field}`]: {
            terms: {
              field
            }
          }
        }))
      },
      aggregations: {
        filtered_results: {
          filter: {
            bool: {
              // Scope the inner filtering back to the unpadded range
              filter: [rangeFilter, ...mustFilters],
              ...(mustNotFilters.length > 0 && {
                must_not: mustNotFilters
              })
            }
          }
        }
      }
    }
  };
  const body = {
    query: {
      bool: {
        filter: [groupedRangeFilter]
      }
    },
    aggregations,
    size: 0
  };
  return {
    index,
    allowNoIndices: true,
    ignoreUnavailable: true,
    body
  };
};

exports.getGroupedESQuery = getGroupedESQuery;

const getUngroupedESQuery = (params, timestampField, index) => {
  const {
    rangeFilter,
    mustFilters,
    mustNotFilters
  } = buildFiltersFromCriteria(params, timestampField);
  const body = {
    // Ensure we accurately track the hit count for the ungrouped case, otherwise we can only ensure accuracy up to 10,000.
    track_total_hits: true,
    query: {
      bool: {
        filter: [rangeFilter, ...mustFilters],
        ...(mustNotFilters.length > 0 && {
          must_not: mustNotFilters
        })
      }
    },
    size: 0
  };
  return {
    index,
    allowNoIndices: true,
    ignoreUnavailable: true,
    body
  };
};

exports.getUngroupedESQuery = getUngroupedESQuery;

const buildFiltersForCriteria = criteria => {
  let filters = [];
  criteria.forEach(criterion => {
    const criterionQuery = buildCriterionQuery(criterion);

    if (criterionQuery) {
      filters = [...filters, criterionQuery];
    }
  });
  return filters;
};

const buildCriterionQuery = criterion => {
  const {
    field,
    value,
    comparator
  } = criterion;
  const queryType = getQueryMappingForComparator(comparator);

  switch (queryType) {
    case 'term':
      return {
        term: {
          [field]: {
            value
          }
        }
      };

    case 'match':
      {
        return {
          match: {
            [field]: value
          }
        };
      }

    case 'match_phrase':
      {
        return {
          match_phrase: {
            [field]: value
          }
        };
      }

    case 'range':
      {
        const comparatorToRangePropertyMapping = {
          [_types.Comparator.LT]: 'lt',
          [_types.Comparator.LT_OR_EQ]: 'lte',
          [_types.Comparator.GT]: 'gt',
          [_types.Comparator.GT_OR_EQ]: 'gte'
        };
        const rangeProperty = comparatorToRangePropertyMapping[comparator];
        return {
          range: {
            [field]: {
              [rangeProperty]: value
            }
          }
        };
      }

    default:
      {
        return undefined;
      }
  }
};

const getPositiveComparators = () => {
  return [_types.Comparator.GT, _types.Comparator.GT_OR_EQ, _types.Comparator.LT, _types.Comparator.LT_OR_EQ, _types.Comparator.EQ, _types.Comparator.MATCH, _types.Comparator.MATCH_PHRASE];
};

exports.getPositiveComparators = getPositiveComparators;

const getNegativeComparators = () => {
  return [_types.Comparator.NOT_EQ, _types.Comparator.NOT_MATCH, _types.Comparator.NOT_MATCH_PHRASE];
};

exports.getNegativeComparators = getNegativeComparators;
const queryMappings = {
  [_types.Comparator.GT]: 'range',
  [_types.Comparator.GT_OR_EQ]: 'range',
  [_types.Comparator.LT]: 'range',
  [_types.Comparator.LT_OR_EQ]: 'range',
  [_types.Comparator.EQ]: 'term',
  [_types.Comparator.MATCH]: 'match',
  [_types.Comparator.MATCH_PHRASE]: 'match_phrase',
  [_types.Comparator.NOT_EQ]: 'term',
  [_types.Comparator.NOT_MATCH]: 'match',
  [_types.Comparator.NOT_MATCH_PHRASE]: 'match_phrase'
};
exports.queryMappings = queryMappings;

const getQueryMappingForComparator = comparator => {
  return queryMappings[comparator];
};

const getUngroupedResults = async (query, callCluster) => {
  return (0, _runtime_types.decodeOrThrow)(_types.UngroupedSearchQueryResponseRT)(await callCluster('search', query));
};

const getGroupedResults = async (query, callCluster) => {
  let compositeGroupBuckets = [];
  let lastAfterKey;

  while (true) {
    const queryWithAfterKey = { ...query
    };
    queryWithAfterKey.body.aggregations.groups.composite.after = lastAfterKey;
    const groupResponse = (0, _runtime_types.decodeOrThrow)(_types.GroupedSearchQueryResponseRT)(await callCluster('search', queryWithAfterKey));
    compositeGroupBuckets = [...compositeGroupBuckets, ...groupResponse.aggregations.groups.buckets];
    lastAfterKey = groupResponse.aggregations.groups.after_key;

    if (groupResponse.aggregations.groups.buckets.length < COMPOSITE_GROUP_SIZE) {
      break;
    }
  }

  return compositeGroupBuckets;
};

const createConditionsMessageForCriteria = criteria => {
  const parts = criteria.map((criterion, index) => {
    const {
      field,
      comparator,
      value
    } = criterion;
    return `${index === 0 ? '' : 'and'} ${field} ${comparator} ${value}`;
  });
  return parts.join(' ');
}; // When the Alerting plugin implements support for multiple action groups, add additional
// action groups here to send different messages, e.g. a recovery notification


const LogsThresholdFiredActionGroupId = 'logs.threshold.fired';
exports.LogsThresholdFiredActionGroupId = LogsThresholdFiredActionGroupId;
const FIRED_ACTIONS = {
  id: LogsThresholdFiredActionGroupId,
  name: _i18n.i18n.translate('xpack.infra.logs.alerting.threshold.fired', {
    defaultMessage: 'Fired'
  })
};
exports.FIRED_ACTIONS = FIRED_ACTIONS;