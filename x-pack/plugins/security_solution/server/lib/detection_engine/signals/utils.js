"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThresholdTermsHash = exports.getThresholdAggregationParts = exports.calculateThresholdSignalUuid = exports.createTotalHitsFromSearchResult = exports.mergeSearchResults = exports.mergeReturns = exports.createSearchResultReturnType = exports.createSearchAfterReturnType = exports.createSearchAfterReturnTypeFromResponse = exports.lastValidDate = exports.createErrorsFromShard = exports.getCatchupTuples = exports.getRuleRangeTuples = exports.errorAggregator = exports.makeFloatString = exports.getGapBetweenRuns = exports.getDriftTolerance = exports.parseInterval = exports.wrapSignal = exports.wrapBuildingBlocks = exports.generateBuildingBlockIds = exports.generateSignalId = exports.generateId = exports.sortExceptionItems = exports.getExceptions = exports.getListsClient = exports.getNumCatchupIntervals = exports.checkPrivileges = exports.hasTimestampFields = exports.hasReadIndexPrivileges = exports.shorthandMap = exports.MAX_RULE_GAP_RATIO = void 0;

var _crypto = require("crypto");

var _moment = _interopRequireDefault(require("moment"));

var _v = _interopRequireDefault(require("uuid/v5"));

var _datemath = _interopRequireDefault(require("@elastic/datemath"));

var _lodash = require("lodash");

var _server = require("../../../../../alerts/server");

var _parse_schedule_dates = require("../../../../common/detection_engine/parse_schedule_dates");

var _utils = require("../../../../common/detection_engine/utils");

var _constants = require("../../../../../lists/common/constants");

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


const MAX_RULE_GAP_RATIO = 4;
exports.MAX_RULE_GAP_RATIO = MAX_RULE_GAP_RATIO;
const shorthandMap = {
  s: {
    momentString: 'seconds',
    asFn: duration => duration.asSeconds()
  },
  m: {
    momentString: 'minutes',
    asFn: duration => duration.asMinutes()
  },
  h: {
    momentString: 'hours',
    asFn: duration => duration.asHours()
  }
};
exports.shorthandMap = shorthandMap;

const hasReadIndexPrivileges = async (privileges, logger, buildRuleMessage, ruleStatusService) => {
  const indexNames = Object.keys(privileges.index);
  const [indexesWithReadPrivileges, indexesWithNoReadPrivileges] = (0, _lodash.partition)(indexNames, indexName => privileges.index[indexName].read);

  if (indexesWithReadPrivileges.length > 0 && indexesWithNoReadPrivileges.length > 0) {
    // some indices have read privileges others do not.
    // set a warning status
    const errorString = `Missing required read privileges on the following indices: ${JSON.stringify(indexesWithNoReadPrivileges)}`;
    logger.error(buildRuleMessage(errorString));
    await ruleStatusService.partialFailure(errorString);
    return true;
  } else if (indexesWithReadPrivileges.length === 0 && indexesWithNoReadPrivileges.length === indexNames.length) {
    // none of the indices had read privileges so set the status to failed
    // since we can't search on any indices we do not have read privileges on
    const errorString = `This rule may not have the required read privileges to the following indices: ${JSON.stringify(indexesWithNoReadPrivileges)}`;
    logger.error(buildRuleMessage(errorString));
    await ruleStatusService.partialFailure(errorString);
    return true;
  }

  return false;
};

exports.hasReadIndexPrivileges = hasReadIndexPrivileges;

const hasTimestampFields = async (wroteStatus, timestampField, ruleName, timestampFieldCapsResponse, inputIndices, ruleStatusService, logger, buildRuleMessage) => {
  var _timestampFieldCapsRe, _timestampFieldCapsRe2;

  if (!wroteStatus && (0, _lodash.isEmpty)(timestampFieldCapsResponse.body.indices)) {
    const errorString = `This rule is attempting to query data from Elasticsearch indices listed in the "Index pattern" section of the rule definition, however no index matching: ${JSON.stringify(inputIndices)} was found. This warning will continue to appear until a matching index is created or this rule is de-activated. ${ruleName === 'Endpoint Security' ? 'If you have recently enrolled agents enabled with Endpoint Security through Fleet, this warning should stop once an alert is sent from an agent.' : ''}`;
    logger.error(buildRuleMessage(errorString.trimEnd()));
    await ruleStatusService.partialFailure(errorString.trimEnd());
    return true;
  } else if (!wroteStatus && ((0, _lodash.isEmpty)(timestampFieldCapsResponse.body.fields) || timestampFieldCapsResponse.body.fields[timestampField] == null || ((_timestampFieldCapsRe = timestampFieldCapsResponse.body.fields[timestampField]) === null || _timestampFieldCapsRe === void 0 ? void 0 : (_timestampFieldCapsRe2 = _timestampFieldCapsRe.unmapped) === null || _timestampFieldCapsRe2 === void 0 ? void 0 : _timestampFieldCapsRe2.indices) != null)) {
    var _timestampFieldCapsRe3, _timestampFieldCapsRe4; // if there is a timestamp override and the unmapped array for the timestamp override key is not empty,
    // warning


    const errorString = `The following indices are missing the ${timestampField === '@timestamp' ? 'timestamp field "@timestamp"' : `timestamp override field "${timestampField}"`}: ${JSON.stringify((0, _lodash.isEmpty)(timestampFieldCapsResponse.body.fields) || (0, _lodash.isEmpty)(timestampFieldCapsResponse.body.fields[timestampField]) ? timestampFieldCapsResponse.body.indices : (_timestampFieldCapsRe3 = timestampFieldCapsResponse.body.fields[timestampField]) === null || _timestampFieldCapsRe3 === void 0 ? void 0 : (_timestampFieldCapsRe4 = _timestampFieldCapsRe3.unmapped) === null || _timestampFieldCapsRe4 === void 0 ? void 0 : _timestampFieldCapsRe4.indices)}`;
    logger.error(buildRuleMessage(errorString));
    await ruleStatusService.partialFailure(errorString);
    return true;
  }

  return wroteStatus;
};

exports.hasTimestampFields = hasTimestampFields;

const checkPrivileges = async (services, indices) => services.callCluster('transport.request', {
  path: '/_security/user/_has_privileges',
  method: 'POST',
  body: {
    index: [{
      names: indices !== null && indices !== void 0 ? indices : [],
      privileges: ['read']
    }]
  }
});

exports.checkPrivileges = checkPrivileges;

const getNumCatchupIntervals = ({
  gap,
  intervalDuration
}) => {
  if (gap.asMilliseconds() <= 0 || intervalDuration.asMilliseconds() <= 0) {
    return 0;
  }

  const ratio = Math.ceil(gap.asMilliseconds() / intervalDuration.asMilliseconds()); // maxCatchup is to ensure we are not trying to catch up too far back.
  // This allows for a maximum of 4 consecutive rule execution misses
  // to be included in the number of signals generated.

  return ratio < MAX_RULE_GAP_RATIO ? ratio : MAX_RULE_GAP_RATIO;
};

exports.getNumCatchupIntervals = getNumCatchupIntervals;

const getListsClient = ({
  lists,
  spaceId,
  updatedByUser,
  services,
  savedObjectClient
}) => {
  if (lists == null) {
    throw new Error('lists plugin unavailable during rule execution');
  }

  const listClient = lists.getListClient(services.callCluster, spaceId, updatedByUser !== null && updatedByUser !== void 0 ? updatedByUser : 'elastic');
  const exceptionsClient = lists.getExceptionListClient(savedObjectClient, updatedByUser !== null && updatedByUser !== void 0 ? updatedByUser : 'elastic');
  return {
    listClient,
    exceptionsClient
  };
};

exports.getListsClient = getListsClient;

const getExceptions = async ({
  client,
  lists
}) => {
  if (lists.length > 0) {
    try {
      const listIds = lists.map(({
        list_id: listId
      }) => listId);
      const namespaceTypes = lists.map(({
        namespace_type: namespaceType
      }) => namespaceType);
      const items = await client.findExceptionListsItem({
        listId: listIds,
        namespaceType: namespaceTypes,
        page: 1,
        perPage: _constants.MAX_EXCEPTION_LIST_SIZE,
        filter: [],
        sortOrder: undefined,
        sortField: undefined
      });
      return items != null ? items.data : [];
    } catch {
      throw new Error('unable to fetch exception list items');
    }
  } else {
    return [];
  }
};

exports.getExceptions = getExceptions;

const sortExceptionItems = exceptions => {
  return exceptions.reduce((acc, exception) => {
    const {
      entries
    } = exception;
    const {
      exceptionsWithValueLists,
      exceptionsWithoutValueLists
    } = acc;

    if ((0, _utils.hasLargeValueList)(entries)) {
      return {
        exceptionsWithValueLists: [...exceptionsWithValueLists, { ...exception
        }],
        exceptionsWithoutValueLists
      };
    } else {
      return {
        exceptionsWithValueLists,
        exceptionsWithoutValueLists: [...exceptionsWithoutValueLists, { ...exception
        }]
      };
    }
  }, {
    exceptionsWithValueLists: [],
    exceptionsWithoutValueLists: []
  });
};

exports.sortExceptionItems = sortExceptionItems;

const generateId = (docIndex, docId, version, ruleId) => (0, _crypto.createHash)('sha256').update(docIndex.concat(docId, version, ruleId)).digest('hex'); // TODO: do we need to include version in the id? If it does matter then we should include it in signal.parents as well


exports.generateId = generateId;

const generateSignalId = signal => (0, _crypto.createHash)('sha256').update(signal.parents.reduce((acc, parent) => acc.concat(parent.id, parent.index), '').concat(signal.rule.id)).digest('hex');
/**
 * Generates unique doc ids for each building block signal within a sequence. The id of each building block
 * depends on the parents of every building block, so that a signal which appears in multiple different sequences
 * (e.g. if multiple rules build sequences that share a common event/signal) will get a unique id per sequence.
 * @param buildingBlocks The full list of building blocks in the sequence.
 */


exports.generateSignalId = generateSignalId;

const generateBuildingBlockIds = buildingBlocks => {
  const baseHashString = buildingBlocks.reduce((baseString, block) => baseString.concat(block.signal.parents.reduce((acc, parent) => acc.concat(parent.id, parent.index), '')).concat(block.signal.rule.id), '');
  return buildingBlocks.map((block, idx) => (0, _crypto.createHash)('sha256').update(baseHashString).update(String(idx)).digest('hex'));
};

exports.generateBuildingBlockIds = generateBuildingBlockIds;

const wrapBuildingBlocks = (buildingBlocks, index) => {
  const blockIds = generateBuildingBlockIds(buildingBlocks);
  return buildingBlocks.map((block, idx) => {
    return {
      _id: blockIds[idx],
      _index: index,
      _source: { ...block
      }
    };
  });
};

exports.wrapBuildingBlocks = wrapBuildingBlocks;

const wrapSignal = (signal, index) => {
  return {
    _id: generateSignalId(signal.signal),
    _index: index,
    _source: { ...signal
    }
  };
};

exports.wrapSignal = wrapSignal;

const parseInterval = intervalString => {
  try {
    return _moment.default.duration((0, _server.parseDuration)(intervalString));
  } catch (err) {
    return null;
  }
};

exports.parseInterval = parseInterval;

const getDriftTolerance = ({
  from,
  to,
  intervalDuration,
  now = (0, _moment.default)()
}) => {
  var _parseScheduleDates, _parseScheduleDates2;

  const toDate = (_parseScheduleDates = (0, _parse_schedule_dates.parseScheduleDates)(to)) !== null && _parseScheduleDates !== void 0 ? _parseScheduleDates : now;
  const fromDate = (_parseScheduleDates2 = (0, _parse_schedule_dates.parseScheduleDates)(from)) !== null && _parseScheduleDates2 !== void 0 ? _parseScheduleDates2 : _datemath.default.parse('now-6m');
  const timeSegment = toDate.diff(fromDate);

  const duration = _moment.default.duration(timeSegment);

  return duration.subtract(intervalDuration);
};

exports.getDriftTolerance = getDriftTolerance;

const getGapBetweenRuns = ({
  previousStartedAt,
  intervalDuration,
  from,
  to,
  now = (0, _moment.default)()
}) => {
  if (previousStartedAt == null) {
    return _moment.default.duration(0);
  }

  const driftTolerance = getDriftTolerance({
    from,
    to,
    intervalDuration
  });

  const diff = _moment.default.duration(now.diff(previousStartedAt));

  const drift = diff.subtract(intervalDuration);
  return drift.subtract(driftTolerance);
};

exports.getGapBetweenRuns = getGapBetweenRuns;

const makeFloatString = num => Number(num).toFixed(2);
/**
 * Given a BulkResponse this will return an aggregation based on the errors if any exist
 * from the BulkResponse. Errors are aggregated on the reason as the unique key.
 *
 * Example would be:
 * {
 *   'Parse Error': {
 *      count: 100,
 *      statusCode: 400,
 *   },
 *   'Internal server error': {
 *       count: 3,
 *       statusCode: 500,
 *   }
 * }
 * If this does not return any errors then you will get an empty object like so: {}
 * @param response The bulk response to aggregate based on the error message
 * @param ignoreStatusCodes Optional array of status codes to ignore when creating aggregate error messages
 * @returns The aggregated example as shown above.
 */


exports.makeFloatString = makeFloatString;

const errorAggregator = (response, ignoreStatusCodes) => {
  return response.items.reduce((accum, item) => {
    var _item$create;

    if (((_item$create = item.create) === null || _item$create === void 0 ? void 0 : _item$create.error) != null && !ignoreStatusCodes.includes(item.create.status)) {
      if (accum[item.create.error.reason] == null) {
        accum[item.create.error.reason] = {
          count: 1,
          statusCode: item.create.status
        };
      } else {
        accum[item.create.error.reason] = {
          count: accum[item.create.error.reason].count + 1,
          statusCode: item.create.status
        };
      }
    }

    return accum;
  }, Object.create(null));
};

exports.errorAggregator = errorAggregator;

const getRuleRangeTuples = ({
  logger,
  previousStartedAt,
  from,
  to,
  interval,
  maxSignals,
  buildRuleMessage
}) => {
  const originalTo = _datemath.default.parse(to);

  const originalFrom = _datemath.default.parse(from);

  if (originalTo == null || originalFrom == null) {
    throw new Error(buildRuleMessage('dateMath parse failed'));
  }

  const tuples = [{
    to: originalTo,
    from: originalFrom,
    maxSignals
  }];
  const intervalDuration = parseInterval(interval);

  if (intervalDuration == null) {
    logger.error(`Failed to compute gap between rule runs: could not parse rule interval`);
    return {
      tuples,
      remainingGap: _moment.default.duration(0)
    };
  }

  const gap = getGapBetweenRuns({
    previousStartedAt,
    intervalDuration,
    from,
    to
  });
  const catchup = getNumCatchupIntervals({
    gap,
    intervalDuration
  });
  const catchupTuples = getCatchupTuples({
    to: originalTo,
    from: originalFrom,
    ruleParamsMaxSignals: maxSignals,
    catchup,
    intervalDuration
  });
  tuples.push(...catchupTuples); // Each extra tuple adds one extra intervalDuration to the time range this rule will cover.

  const remainingGapMilliseconds = Math.max(gap.asMilliseconds() - catchup * intervalDuration.asMilliseconds(), 0);
  return {
    tuples: tuples.reverse(),
    remainingGap: _moment.default.duration(remainingGapMilliseconds)
  };
};
/**
 * Creates rule range tuples needed to cover gaps since the last rule run.
 * @param to moment.Moment representing the rules 'to' property
 * @param from moment.Moment representing the rules 'from' property
 * @param ruleParamsMaxSignals int representing the maxSignals property on the rule (usually unmodified at 100)
 * @param catchup number the number of additional rule run intervals to add
 * @param intervalDuration moment.Duration the interval which the rule runs
 */


exports.getRuleRangeTuples = getRuleRangeTuples;

const getCatchupTuples = ({
  to,
  from,
  ruleParamsMaxSignals,
  catchup,
  intervalDuration
}) => {
  const catchupTuples = [];
  const intervalInMilliseconds = intervalDuration.asMilliseconds();
  let currentTo = to;
  let currentFrom = from; // This loop will create tuples with overlapping time ranges, the same way rule runs have overlapping time
  // ranges due to the additional lookback. We could choose to create tuples that don't overlap here by using the
  // "from" value from one tuple as "to" in the next one, however, the overlap matters for rule types like EQL and
  // threshold rules that look for sets of documents within the query. Thus we keep the overlap so that these
  // extra tuples behave as similarly to the regular rule runs as possible.

  while (catchupTuples.length < catchup) {
    const nextTo = currentTo.clone().subtract(intervalInMilliseconds);
    const nextFrom = currentFrom.clone().subtract(intervalInMilliseconds);
    catchupTuples.push({
      to: nextTo,
      from: nextFrom,
      maxSignals: ruleParamsMaxSignals
    });
    currentTo = nextTo;
    currentFrom = nextFrom;
  }

  return catchupTuples;
};
/**
 * Given errors from a search query this will return an array of strings derived from the errors.
 * @param errors The errors to derive the strings from
 */


exports.getCatchupTuples = getCatchupTuples;

const createErrorsFromShard = ({
  errors
}) => {
  return errors.map(error => {
    const {
      index,
      reason: {
        reason,
        type,
        caused_by: {
          reason: causedByReason,
          type: causedByType
        } = {
          reason: undefined,
          type: undefined
        }
      } = {}
    } = error;
    return [...(index != null ? [`index: "${index}"`] : []), ...(reason != null ? [`reason: "${reason}"`] : []), ...(type != null ? [`type: "${type}"`] : []), ...(causedByReason != null ? [`caused by reason: "${causedByReason}"`] : []), ...(causedByType != null ? [`caused by type: "${causedByType}"`] : [])].join(' ');
  });
};
/**
 * Given a SignalSearchResponse this will return a valid last date if it can find one, otherwise it
 * will return undefined. This tries the "fields" first to get a formatted date time if it can, but if
 * it cannot it will resort to using the "_source" fields second which can be problematic if the date time
 * is not correctly ISO8601 or epoch milliseconds formatted.
 * @param searchResult The result to try and parse out the timestamp.
 * @param timestampOverride The timestamp override to use its values if we have it.
 */


exports.createErrorsFromShard = createErrorsFromShard;

const lastValidDate = ({
  searchResult,
  timestampOverride
}) => {
  if (searchResult.hits.hits.length === 0) {
    return undefined;
  } else {
    const lastRecord = searchResult.hits.hits[searchResult.hits.hits.length - 1];
    const timestamp = timestampOverride !== null && timestampOverride !== void 0 ? timestampOverride : '@timestamp';
    const timestampValue = lastRecord.fields != null && lastRecord.fields[timestamp] != null ? lastRecord.fields[timestamp][0] : lastRecord._source[timestamp];
    const lastTimestamp = typeof timestampValue === 'string' || typeof timestampValue === 'number' ? timestampValue : undefined;

    if (lastTimestamp != null) {
      const tempMoment = (0, _moment.default)(lastTimestamp);

      if (tempMoment.isValid()) {
        return tempMoment.toDate();
      } else {
        return undefined;
      }
    }
  }
};

exports.lastValidDate = lastValidDate;

const createSearchAfterReturnTypeFromResponse = ({
  searchResult,
  timestampOverride
}) => {
  var _searchResult$_shards;

  return createSearchAfterReturnType({
    success: searchResult._shards.failed === 0 || ((_searchResult$_shards = searchResult._shards.failures) === null || _searchResult$_shards === void 0 ? void 0 : _searchResult$_shards.every(failure => {
      var _failure$reason, _failure$reason$reaso, _failure$reason2, _failure$reason2$reas;

      return ((_failure$reason = failure.reason) === null || _failure$reason === void 0 ? void 0 : (_failure$reason$reaso = _failure$reason.reason) === null || _failure$reason$reaso === void 0 ? void 0 : _failure$reason$reaso.includes('No mapping found for [@timestamp] in order to sort on')) || ((_failure$reason2 = failure.reason) === null || _failure$reason2 === void 0 ? void 0 : (_failure$reason2$reas = _failure$reason2.reason) === null || _failure$reason2$reas === void 0 ? void 0 : _failure$reason2$reas.includes(`No mapping found for [${timestampOverride}] in order to sort on`));
    })),
    lastLookBackDate: lastValidDate({
      searchResult,
      timestampOverride
    })
  });
};

exports.createSearchAfterReturnTypeFromResponse = createSearchAfterReturnTypeFromResponse;

const createSearchAfterReturnType = ({
  success,
  searchAfterTimes,
  bulkCreateTimes,
  lastLookBackDate,
  createdSignalsCount,
  createdSignals,
  errors
} = {}) => {
  return {
    success: success !== null && success !== void 0 ? success : true,
    searchAfterTimes: searchAfterTimes !== null && searchAfterTimes !== void 0 ? searchAfterTimes : [],
    bulkCreateTimes: bulkCreateTimes !== null && bulkCreateTimes !== void 0 ? bulkCreateTimes : [],
    lastLookBackDate: lastLookBackDate !== null && lastLookBackDate !== void 0 ? lastLookBackDate : null,
    createdSignalsCount: createdSignalsCount !== null && createdSignalsCount !== void 0 ? createdSignalsCount : 0,
    createdSignals: createdSignals !== null && createdSignals !== void 0 ? createdSignals : [],
    errors: errors !== null && errors !== void 0 ? errors : []
  };
};

exports.createSearchAfterReturnType = createSearchAfterReturnType;

const createSearchResultReturnType = () => {
  return {
    took: 0,
    timed_out: false,
    _shards: {
      total: 0,
      successful: 0,
      failed: 0,
      skipped: 0,
      failures: []
    },
    hits: {
      total: 0,
      max_score: 0,
      hits: []
    }
  };
};

exports.createSearchResultReturnType = createSearchResultReturnType;

const mergeReturns = searchAfters => {
  return searchAfters.reduce((prev, next) => {
    const {
      success: existingSuccess,
      searchAfterTimes: existingSearchAfterTimes,
      bulkCreateTimes: existingBulkCreateTimes,
      lastLookBackDate: existingLastLookBackDate,
      createdSignalsCount: existingCreatedSignalsCount,
      createdSignals: existingCreatedSignals,
      errors: existingErrors
    } = prev;
    const {
      success: newSuccess,
      searchAfterTimes: newSearchAfterTimes,
      bulkCreateTimes: newBulkCreateTimes,
      lastLookBackDate: newLastLookBackDate,
      createdSignalsCount: newCreatedSignalsCount,
      createdSignals: newCreatedSignals,
      errors: newErrors
    } = next;
    return {
      success: existingSuccess && newSuccess,
      searchAfterTimes: [...existingSearchAfterTimes, ...newSearchAfterTimes],
      bulkCreateTimes: [...existingBulkCreateTimes, ...newBulkCreateTimes],
      lastLookBackDate: newLastLookBackDate !== null && newLastLookBackDate !== void 0 ? newLastLookBackDate : existingLastLookBackDate,
      createdSignalsCount: existingCreatedSignalsCount + newCreatedSignalsCount,
      createdSignals: [...existingCreatedSignals, ...newCreatedSignals],
      errors: [...new Set([...existingErrors, ...newErrors])]
    };
  });
};

exports.mergeReturns = mergeReturns;

const mergeSearchResults = searchResults => {
  return searchResults.reduce((prev, next) => {
    const {
      took: existingTook,
      timed_out: existingTimedOut,
      // _scroll_id: existingScrollId,
      _shards: existingShards,
      // aggregations: existingAggregations,
      hits: existingHits
    } = prev;
    const {
      took: newTook,
      timed_out: newTimedOut,
      _scroll_id: newScrollId,
      _shards: newShards,
      aggregations: newAggregations,
      hits: newHits
    } = next;
    return {
      took: Math.max(newTook, existingTook),
      timed_out: newTimedOut && existingTimedOut,
      _scroll_id: newScrollId,
      _shards: {
        total: newShards.total + existingShards.total,
        successful: newShards.successful + existingShards.successful,
        failed: newShards.failed + existingShards.failed,
        skipped: newShards.skipped + existingShards.skipped,
        failures: [...(existingShards.failures != null ? existingShards.failures : []), ...(newShards.failures != null ? newShards.failures : [])]
      },
      aggregations: newAggregations,
      hits: {
        total: createTotalHitsFromSearchResult({
          searchResult: prev
        }) + createTotalHitsFromSearchResult({
          searchResult: next
        }),
        max_score: Math.max(newHits.max_score, existingHits.max_score),
        hits: [...existingHits.hits, ...newHits.hits]
      }
    };
  });
};

exports.mergeSearchResults = mergeSearchResults;

const createTotalHitsFromSearchResult = ({
  searchResult
}) => {
  const totalHits = typeof searchResult.hits.total === 'number' ? searchResult.hits.total : searchResult.hits.total.value;
  return totalHits;
};

exports.createTotalHitsFromSearchResult = createTotalHitsFromSearchResult;

const calculateThresholdSignalUuid = (ruleId, startedAt, thresholdFields, key) => {
  // used to generate constant Threshold Signals ID when run with the same params
  const NAMESPACE_ID = '0684ec03-7201-4ee0-8ee0-3a3f6b2479b2';
  const startedAtString = startedAt.toISOString();
  const keyString = key !== null && key !== void 0 ? key : '';
  const baseString = `${ruleId}${startedAtString}${thresholdFields.join(',')}${keyString}`;
  return (0, _v.default)(baseString, NAMESPACE_ID);
};

exports.calculateThresholdSignalUuid = calculateThresholdSignalUuid;

const getThresholdAggregationParts = (data, index) => {
  const idx = index != null ? index.toString() : '\\d';
  const pattern = `threshold_(?<index>${idx}):(?<name>.*)`;

  for (const key of Object.keys(data)) {
    var _matches$groups, _matches$groups2;

    const matches = key.match(pattern);

    if (matches != null && ((_matches$groups = matches.groups) === null || _matches$groups === void 0 ? void 0 : _matches$groups.name) != null && ((_matches$groups2 = matches.groups) === null || _matches$groups2 === void 0 ? void 0 : _matches$groups2.index) != null) {
      return {
        field: matches.groups.name,
        index: parseInt(matches.groups.index, 10),
        name: key
      };
    }
  }
};

exports.getThresholdAggregationParts = getThresholdAggregationParts;

const getThresholdTermsHash = terms => {
  return (0, _crypto.createHash)('sha256').update(terms.sort((term1, term2) => term1.field > term2.field ? 1 : -1).map(field => {
    return field.value;
  }).join(',')).digest('hex');
};

exports.getThresholdTermsHash = getThresholdTermsHash;