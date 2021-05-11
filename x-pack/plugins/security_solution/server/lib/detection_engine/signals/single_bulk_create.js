"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkInsertSignals = exports.singleBulkCreate = exports.filterDuplicateSignals = exports.filterDuplicateRules = void 0;

var _lodash = require("lodash");

var _perf_hooks = require("perf_hooks");

var _utils = require("./utils");

var _build_bulk_body = require("./build_bulk_body");

var _build_event_type_signal = require("./build_event_type_signal");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This is for signals on signals to work correctly. If given a rule id this will check if
 * that rule id already exists in the ancestor tree of each signal search response and remove
 * those documents so they cannot be created as a signal since we do not want a rule id to
 * ever be capable of re-writing the same signal continuously if both the _input_ and _output_
 * of the signals index happens to be the same index.
 * @param ruleId The rule id
 * @param signalSearchResponse The search response that has all the documents
 */


const filterDuplicateRules = (ruleId, signalSearchResponse) => {
  return signalSearchResponse.hits.hits.filter(doc => {
    if (doc._source.signal == null || !(0, _build_event_type_signal.isEventTypeSignal)(doc)) {
      return true;
    } else {
      return !(doc._source.signal.ancestors.some(ancestor => ancestor.rule === ruleId) || doc._source.signal.rule.id === ruleId);
    }
  });
};
/**
 * Similar to filterDuplicateRules, but operates on candidate signal documents rather than events that matched
 * the detection query. This means we only have to compare the ruleId against the ancestors array.
 * @param ruleId The rule id
 * @param signals The candidate new signals
 */


exports.filterDuplicateRules = filterDuplicateRules;

const filterDuplicateSignals = (ruleId, signals) => {
  return signals.filter(doc => {
    var _doc$_source$signal;

    return !((_doc$_source$signal = doc._source.signal) !== null && _doc$_source$signal !== void 0 && _doc$_source$signal.ancestors.some(ancestor => ancestor.rule === ruleId));
  });
};

exports.filterDuplicateSignals = filterDuplicateSignals; // Bulk Index documents.

const singleBulkCreate = async ({
  buildRuleMessage,
  filteredEvents,
  ruleParams,
  services,
  logger,
  id,
  signalsIndex,
  actions,
  name,
  createdAt,
  createdBy,
  updatedAt,
  updatedBy,
  interval,
  enabled,
  refresh,
  tags,
  throttle
}) => {
  filteredEvents.hits.hits = filterDuplicateRules(id, filteredEvents);
  logger.debug(buildRuleMessage(`about to bulk create ${filteredEvents.hits.hits.length} events`));

  if (filteredEvents.hits.hits.length === 0) {
    logger.debug(buildRuleMessage(`all events were duplicates`));
    return {
      success: true,
      createdItemsCount: 0,
      createdItems: [],
      errors: []
    };
  } // index documents after creating an ID based on the
  // source documents' originating index, and the original
  // document _id. This will allow two documents from two
  // different indexes with the same ID to be
  // indexed, and prevents us from creating any updates
  // to the documents once inserted into the signals index,
  // while preventing duplicates from being added to the
  // signals index if rules are re-run over the same time
  // span. Also allow for versioning.


  const bulkBody = filteredEvents.hits.hits.flatMap(doc => {
    var _ruleParams$ruleId;

    return [{
      create: {
        _index: signalsIndex,
        _id: (0, _utils.generateId)(doc._index, doc._id, doc._version ? doc._version.toString() : '', (_ruleParams$ruleId = ruleParams.ruleId) !== null && _ruleParams$ruleId !== void 0 ? _ruleParams$ruleId : '')
      }
    }, (0, _build_bulk_body.buildBulkBody)({
      doc,
      ruleParams,
      id,
      actions,
      name,
      createdAt,
      createdBy,
      updatedAt,
      updatedBy,
      interval,
      enabled,
      tags,
      throttle
    })];
  });

  const start = _perf_hooks.performance.now();

  const response = await services.callCluster('bulk', {
    index: signalsIndex,
    refresh,
    body: bulkBody
  });

  const end = _perf_hooks.performance.now();

  logger.debug(buildRuleMessage(`individual bulk process time took: ${(0, _utils.makeFloatString)(end - start)} milliseconds`));
  logger.debug(buildRuleMessage(`took property says bulk took: ${response.took} milliseconds`));
  const createdItems = filteredEvents.hits.hits.map((doc, index) => {
    var _response$items$index, _response$items$index2, _response$items$index3, _response$items$index4;

    return {
      _id: (_response$items$index = (_response$items$index2 = response.items[index].create) === null || _response$items$index2 === void 0 ? void 0 : _response$items$index2._id) !== null && _response$items$index !== void 0 ? _response$items$index : '',
      _index: (_response$items$index3 = (_response$items$index4 = response.items[index].create) === null || _response$items$index4 === void 0 ? void 0 : _response$items$index4._index) !== null && _response$items$index3 !== void 0 ? _response$items$index3 : '',
      ...(0, _build_bulk_body.buildBulkBody)({
        doc,
        ruleParams,
        id,
        actions,
        name,
        createdAt,
        createdBy,
        updatedAt,
        updatedBy,
        interval,
        enabled,
        tags,
        throttle
      })
    };
  }).filter((_, index) => (0, _lodash.get)(response.items[index], 'create.status') === 201);
  const createdItemsCount = createdItems.length;
  const duplicateSignalsCount = (0, _lodash.countBy)(response.items, 'create.status')['409'];
  const errorCountByMessage = (0, _utils.errorAggregator)(response, [409]);
  logger.debug(buildRuleMessage(`bulk created ${createdItemsCount} signals`));

  if (duplicateSignalsCount > 0) {
    logger.debug(buildRuleMessage(`ignored ${duplicateSignalsCount} duplicate signals`));
  }

  if (!(0, _lodash.isEmpty)(errorCountByMessage)) {
    logger.error(buildRuleMessage(`[-] bulkResponse had errors with responses of: ${JSON.stringify(errorCountByMessage)}`));
    return {
      errors: Object.keys(errorCountByMessage),
      success: false,
      bulkCreateDuration: (0, _utils.makeFloatString)(end - start),
      createdItemsCount,
      createdItems
    };
  } else {
    return {
      errors: [],
      success: true,
      bulkCreateDuration: (0, _utils.makeFloatString)(end - start),
      createdItemsCount,
      createdItems
    };
  }
}; // Bulk Index new signals.


exports.singleBulkCreate = singleBulkCreate;

const bulkInsertSignals = async (signals, logger, services, refresh) => {
  var _countBy$; // index documents after creating an ID based on the
  // id and index of each parent and the rule ID


  const bulkBody = signals.flatMap(doc => [{
    create: {
      _index: doc._index,
      _id: doc._id
    }
  }, doc._source]);

  const start = _perf_hooks.performance.now();

  const response = await services.callCluster('bulk', {
    refresh,
    body: bulkBody
  });

  const end = _perf_hooks.performance.now();

  logger.debug(`individual bulk process time took: ${(0, _utils.makeFloatString)(end - start)} milliseconds`);
  logger.debug(`took property says bulk took: ${response.took} milliseconds`);

  if (response.errors) {
    const duplicateSignalsCount = (0, _lodash.countBy)(response.items, 'create.status')['409'];
    logger.debug(`ignored ${duplicateSignalsCount} duplicate signals`);
    const errorCountByMessage = (0, _utils.errorAggregator)(response, [409]);

    if (!(0, _lodash.isEmpty)(errorCountByMessage)) {
      logger.error(`[-] bulkResponse had errors with responses of: ${JSON.stringify(errorCountByMessage)}`);
    }
  }

  const createdItemsCount = (_countBy$ = (0, _lodash.countBy)(response.items, 'create.status')['201']) !== null && _countBy$ !== void 0 ? _countBy$ : 0;
  const createdItems = signals.map((doc, index) => {
    var _response$items$index5, _response$items$index6, _response$items$index7, _response$items$index8;

    return { ...doc._source,
      _id: (_response$items$index5 = (_response$items$index6 = response.items[index].create) === null || _response$items$index6 === void 0 ? void 0 : _response$items$index6._id) !== null && _response$items$index5 !== void 0 ? _response$items$index5 : '',
      _index: (_response$items$index7 = (_response$items$index8 = response.items[index].create) === null || _response$items$index8 === void 0 ? void 0 : _response$items$index8._index) !== null && _response$items$index7 !== void 0 ? _response$items$index7 : ''
    };
  }).filter((_, index) => (0, _lodash.get)(response.items[index], 'create.status') === 201);
  logger.debug(`bulk created ${createdItemsCount} signals`);
  return {
    bulkCreateDuration: (0, _utils.makeFloatString)(end - start),
    createdItems,
    createdItemsCount
  };
};

exports.bulkInsertSignals = bulkInsertSignals;