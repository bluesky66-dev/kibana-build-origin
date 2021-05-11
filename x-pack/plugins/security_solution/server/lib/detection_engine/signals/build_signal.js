"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.additionalSignalFields = exports.buildSignal = exports.removeClashes = exports.buildAncestors = exports.buildParent = void 0;

var _get_signals_template = require("../routes/index/get_signals_template");

var _build_event_type_signal = require("./build_event_type_signal");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Takes a parent signal or event document and extracts the information needed for the corresponding entry in the child
 * signal's `signal.parents` array.
 * @param doc The parent signal or event
 */


const buildParent = doc => {
  if (doc._source.signal != null) {
    var _ref, _doc$_source$signal$d, _doc$_source$signal$p;

    return {
      rule: doc._source.signal.rule.id,
      id: doc._id,
      type: 'signal',
      index: doc._index,
      // We first look for signal.depth and use that if it exists. If it doesn't exist, this should be a pre-7.10 signal
      // and should have signal.parent.depth instead. signal.parent.depth in this case is treated as equivalent to signal.depth.
      depth: (_ref = (_doc$_source$signal$d = doc._source.signal.depth) !== null && _doc$_source$signal$d !== void 0 ? _doc$_source$signal$d : (_doc$_source$signal$p = doc._source.signal.parent) === null || _doc$_source$signal$p === void 0 ? void 0 : _doc$_source$signal$p.depth) !== null && _ref !== void 0 ? _ref : 1
    };
  } else {
    return {
      id: doc._id,
      type: 'event',
      index: doc._index,
      depth: 0
    };
  }
};
/**
 * Takes a parent signal or event document with N ancestors and adds the parent document to the ancestry array,
 * creating an array of N+1 ancestors.
 * @param doc The parent signal/event for which to extend the ancestry.
 */


exports.buildParent = buildParent;

const buildAncestors = doc => {
  var _doc$_source$signal;

  const newAncestor = buildParent(doc);
  const existingAncestors = (_doc$_source$signal = doc._source.signal) === null || _doc$_source$signal === void 0 ? void 0 : _doc$_source$signal.ancestors;

  if (existingAncestors != null) {
    return [...existingAncestors, newAncestor];
  } else {
    return [newAncestor];
  }
};
/**
 * This removes any signal named clashes such as if a source index has
 * "signal" but is not a signal object we put onto the object. If this
 * is our "signal object" then we don't want to remove it.
 * @param doc The source index doc to a signal.
 */


exports.buildAncestors = buildAncestors;

const removeClashes = doc => {
  const {
    signal,
    ...noSignal
  } = doc._source;

  if (signal == null || (0, _build_event_type_signal.isEventTypeSignal)(doc)) {
    return doc;
  } else {
    return { ...doc,
      _source: { ...noSignal
      }
    };
  }
};
/**
 * Builds the `signal.*` fields that are common across all signals.
 * @param docs The parent signals/events of the new signal to be built.
 * @param rule The rule that is generating the new signal.
 */


exports.removeClashes = removeClashes;

const buildSignal = (docs, rule) => {
  const _meta = {
    version: _get_signals_template.SIGNALS_TEMPLATE_VERSION
  };
  const removedClashes = docs.map(removeClashes);
  const parents = removedClashes.map(buildParent);
  const depth = parents.reduce((acc, parent) => Math.max(parent.depth, acc), 0) + 1;
  const ancestors = removedClashes.reduce((acc, doc) => acc.concat(buildAncestors(doc)), []);
  return {
    _meta,
    parents,
    ancestors,
    status: 'open',
    rule,
    depth
  };
};

exports.buildSignal = buildSignal;

const isThresholdResult = thresholdResult => {
  return typeof thresholdResult === 'object';
};
/**
 * Creates signal fields that are only available in the special case where a signal has only 1 parent signal/event.
 * @param doc The parent signal/event of the new signal to be built.
 */


const additionalSignalFields = doc => {
  var _doc$_source$event;

  const thresholdResult = doc._source.threshold_result;

  if (thresholdResult != null && !isThresholdResult(thresholdResult)) {
    throw new Error(`threshold_result failed to validate: ${thresholdResult}`);
  }

  return {
    parent: buildParent(removeClashes(doc)),
    original_time: doc._source['@timestamp'],
    // This field has already been replaced with timestampOverride, if provided.
    original_event: (_doc$_source$event = doc._source.event) !== null && _doc$_source$event !== void 0 ? _doc$_source$event : undefined,
    threshold_result: thresholdResult,
    original_signal: doc._source.signal != null && !(0, _build_event_type_signal.isEventTypeSignal)(doc) ? doc._source.signal : undefined
  };
};

exports.additionalSignalFields = additionalSignalFields;