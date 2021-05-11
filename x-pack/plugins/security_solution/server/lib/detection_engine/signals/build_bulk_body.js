"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.objectPairIntersection = exports.objectArrayIntersection = exports.buildSignalFromEvent = exports.buildSignalFromSequence = exports.buildSignalGroupFromSequence = exports.buildBulkBody = void 0;

var _build_rule = require("./build_rule");

var _build_signal = require("./build_signal");

var _build_event_type_signal = require("./build_event_type_signal");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// format search_after result for signals index.


const buildBulkBody = ({
  doc,
  ruleParams,
  id,
  name,
  actions,
  createdAt,
  createdBy,
  updatedAt,
  updatedBy,
  interval,
  enabled,
  tags,
  throttle
}) => {
  const rule = (0, _build_rule.buildRule)({
    actions,
    ruleParams,
    id,
    name,
    enabled,
    createdAt,
    createdBy,
    doc,
    updatedAt,
    updatedBy,
    interval,
    tags,
    throttle
  });
  const signal = { ...(0, _build_signal.buildSignal)([doc], rule),
    ...(0, _build_signal.additionalSignalFields)(doc)
  };
  const event = (0, _build_event_type_signal.buildEventTypeSignal)(doc);
  const {
    threshold_result: thresholdResult,
    ...filteredSource
  } = doc._source || {
    threshold_result: null
  };
  const signalHit = { ...filteredSource,
    '@timestamp': new Date().toISOString(),
    event,
    signal
  };
  return signalHit;
};
/**
 * Takes N raw documents from ES that form a sequence and builds them into N+1 signals ready to be indexed -
 * one signal for each event in the sequence, and a "shell" signal that ties them all together. All N+1 signals
 * share the same signal.group.id to make it easy to query them.
 * @param sequence The raw ES documents that make up the sequence
 * @param ruleSO SavedObject representing the rule that found the sequence
 * @param outputIndex Index to write the resulting signals to
 */


exports.buildBulkBody = buildBulkBody;

const buildSignalGroupFromSequence = (sequence, ruleSO, outputIndex) => {
  const wrappedBuildingBlocks = (0, _utils.wrapBuildingBlocks)(sequence.events.map(event => {
    const signal = buildSignalFromEvent(event, ruleSO, false);
    signal.signal.rule.building_block_type = 'default';
    return signal;
  }), outputIndex);

  if (wrappedBuildingBlocks.some(block => {
    var _block$_source$signal;

    return (_block$_source$signal = block._source.signal) === null || _block$_source$signal === void 0 ? void 0 : _block$_source$signal.ancestors.some(ancestor => ancestor.rule === ruleSO.id);
  })) {
    return [];
  } // Now that we have an array of building blocks for the events in the sequence,
  // we can build the signal that links the building blocks together
  // and also insert the group id (which is also the "shell" signal _id) in each building block


  const sequenceSignal = (0, _utils.wrapSignal)(buildSignalFromSequence(wrappedBuildingBlocks, ruleSO), outputIndex);
  wrappedBuildingBlocks.forEach((block, idx) => {
    // TODO: fix type of blocks so we don't have to check existence of _source.signal
    if (block._source.signal) {
      block._source.signal.group = {
        id: sequenceSignal._id,
        index: idx
      };
    }
  });
  return [...wrappedBuildingBlocks, sequenceSignal];
};

exports.buildSignalGroupFromSequence = buildSignalGroupFromSequence;

const buildSignalFromSequence = (events, ruleSO) => {
  const rule = (0, _build_rule.buildRuleWithoutOverrides)(ruleSO);
  const signal = (0, _build_signal.buildSignal)(events, rule);
  const mergedEvents = objectArrayIntersection(events.map(event => event._source));
  return { ...mergedEvents,
    '@timestamp': new Date().toISOString(),
    event: {
      kind: 'signal'
    },
    signal: { ...signal,
      group: {
        // This is the same function that is used later to generate the _id for the sequence signal document,
        // so _id should equal signal.group.id for the "shell" document
        id: (0, _utils.generateSignalId)(signal)
      }
    }
  };
};

exports.buildSignalFromSequence = buildSignalFromSequence;

const buildSignalFromEvent = (event, ruleSO, applyOverrides) => {
  const rule = applyOverrides ? (0, _build_rule.buildRuleWithOverrides)(ruleSO, event._source) : (0, _build_rule.buildRuleWithoutOverrides)(ruleSO);
  const signal = { ...(0, _build_signal.buildSignal)([event], rule),
    ...(0, _build_signal.additionalSignalFields)(event)
  };
  const eventFields = (0, _build_event_type_signal.buildEventTypeSignal)(event); // TODO: better naming for SignalHit - it's really a new signal to be inserted

  const signalHit = { ...event._source,
    '@timestamp': new Date().toISOString(),
    event: eventFields,
    signal
  };
  return signalHit;
};

exports.buildSignalFromEvent = buildSignalFromEvent;

const objectArrayIntersection = objects => {
  if (objects.length === 0) {
    return undefined;
  } else if (objects.length === 1) {
    return objects[0];
  } else {
    return objects.slice(1).reduce((acc, obj) => objectPairIntersection(acc, obj), objects[0]);
  }
};

exports.objectArrayIntersection = objectArrayIntersection;

const objectPairIntersection = (a, b) => {
  if (a === undefined || b === undefined) {
    return undefined;
  }

  const intersection = {};
  Object.entries(a).forEach(([key, aVal]) => {
    if (key in b) {
      const bVal = b[key];

      if (typeof aVal === 'object' && !(aVal instanceof Array) && aVal !== null && typeof bVal === 'object' && !(bVal instanceof Array) && bVal !== null) {
        intersection[key] = objectPairIntersection(aVal, bVal);
      } else if (aVal === bVal) {
        intersection[key] = aVal;
      }
    }
  }); // Count up the number of entries that are NOT undefined in the intersection
  // If there are no keys OR all entries are undefined, return undefined

  if (Object.values(intersection).reduce((acc, value) => value !== undefined ? acc + 1 : acc, 0) === 0) {
    return undefined;
  } else {
    return intersection;
  }
};

exports.objectPairIntersection = objectPairIntersection;