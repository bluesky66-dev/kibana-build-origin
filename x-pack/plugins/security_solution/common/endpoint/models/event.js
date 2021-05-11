"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isLegacyEventSafeVersion = isLegacyEventSafeVersion;
exports.isLegacyEvent = isLegacyEvent;
exports.isProcessRunning = isProcessRunning;
exports.timestampSafeVersion = timestampSafeVersion;
exports.timestampAsDateSafeVersion = timestampAsDateSafeVersion;
exports.eventTimestamp = eventTimestamp;
exports.processName = processName;
exports.userName = userName;
exports.parentPID = parentPID;
exports.md5HashForProcess = md5HashForProcess;
exports.argsForProcess = argsForProcess;
exports.userDomain = userDomain;
exports.processNameSafeVersion = processNameSafeVersion;
exports.eventID = eventID;
exports.winlogRecordID = winlogRecordID;
exports.eventSequence = eventSequence;
exports.eventIDSafeVersion = eventIDSafeVersion;
exports.entityId = entityId;
exports.entityIDSafeVersion = entityIDSafeVersion;
exports.parentEntityId = parentEntityId;
exports.parentEntityIDSafeVersion = parentEntityIDSafeVersion;
exports.ancestryArray = ancestryArray;
exports.ancestry = ancestry;
exports.eventCategory = eventCategory;
exports.eventType = eventType;
exports.eventKind = eventKind;

var _ecs_safety_helpers = require("./ecs_safety_helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Determine if a higher level event type is the legacy variety. Can be used to narrow an event type.
 * T optionally defines an `endgame` object field used for determining the type of event. If T doesn't contain the
 * `endgame` field it will serve as the narrowed type.
 */


function isLegacyEventSafeVersion(event) {
  return 'endgame' in event && event.endgame !== undefined;
}
/*
 * Determine if a `ResolverEvent` is the legacy variety. Can be used to narrow `ResolverEvent` to `LegacyEndpointEvent`. See `isLegacyEventSafeVersion`
 */


function isLegacyEvent(event) {
  return event.endgame !== undefined;
}
/**
 * Minimum fields needed from the `SafeResolverEvent` type for the function below to operate correctly.
 */

/**
 * Checks if an event describes a process as running (whether it was started, already running, or changed)
 *
 * @param event a document to check for running fields
 */


function isProcessRunning(event) {
  var _event$event4, _event$event5, _event$event6;

  if (isLegacyEventSafeVersion(event)) {
    var _event$event, _event$event2, _event$event3;

    return (0, _ecs_safety_helpers.hasValue)((_event$event = event.event) === null || _event$event === void 0 ? void 0 : _event$event.type, 'process_start') || (0, _ecs_safety_helpers.hasValue)((_event$event2 = event.event) === null || _event$event2 === void 0 ? void 0 : _event$event2.action, 'fork_event') || (0, _ecs_safety_helpers.hasValue)((_event$event3 = event.event) === null || _event$event3 === void 0 ? void 0 : _event$event3.type, 'already_running');
  }

  return (0, _ecs_safety_helpers.hasValue)((_event$event4 = event.event) === null || _event$event4 === void 0 ? void 0 : _event$event4.type, 'start') || (0, _ecs_safety_helpers.hasValue)((_event$event5 = event.event) === null || _event$event5 === void 0 ? void 0 : _event$event5.type, 'change') || (0, _ecs_safety_helpers.hasValue)((_event$event6 = event.event) === null || _event$event6 === void 0 ? void 0 : _event$event6.type, 'info');
}
/**
 * Minimum fields needed from the `SafeResolverEvent` type for the function below to operate correctly.
 */

/**
 * Extracts the first non null value from the `@timestamp` field in the document. Returns undefined if the field doesn't
 * exist in the document.
 *
 * @param event a document from ES
 */


function timestampSafeVersion(event) {
  return (0, _ecs_safety_helpers.firstNonNullValue)(event === null || event === void 0 ? void 0 : event['@timestamp']);
}
/**
 * The `@timestamp` for the event, as a `Date` object.
 * If `@timestamp` couldn't be parsed as a `Date`, returns `undefined`.
 */


function timestampAsDateSafeVersion(event) {
  const value = timestampSafeVersion(event);

  if (value === undefined) {
    return undefined;
  }

  const date = new Date(value); // Check if the date is valid

  if (isFinite(date.getTime())) {
    return date;
  } else {
    return undefined;
  }
}
/**
 * The @timestamp ECS field
 */


function eventTimestamp(event) {
  return (0, _ecs_safety_helpers.firstNonNullValue)(event['@timestamp']);
}
/**
 * Find the name of the related process.
 */


function processName(event) {
  if (isLegacyEvent(event)) {
    return event.endgame.process_name ? event.endgame.process_name : '';
  } else {
    return event.process.name;
  }
}
/**
 * First non-null value in the `user.name` field.
 */


function userName(event) {
  if (isLegacyEventSafeVersion(event)) {
    return undefined;
  } else {
    var _event$user;

    return (0, _ecs_safety_helpers.firstNonNullValue)((_event$user = event.user) === null || _event$user === void 0 ? void 0 : _event$user.name);
  }
}
/**
 * Returns the process event's parent PID
 */


function parentPID(event) {
  var _event$process, _event$process$parent;

  return (0, _ecs_safety_helpers.firstNonNullValue)(isLegacyEventSafeVersion(event) ? event.endgame.ppid : (_event$process = event.process) === null || _event$process === void 0 ? void 0 : (_event$process$parent = _event$process.parent) === null || _event$process$parent === void 0 ? void 0 : _event$process$parent.pid);
}
/**
 * First non-null value for the `process.hash.md5` field.
 */


function md5HashForProcess(event) {
  var _event$process2, _event$process2$hash;

  return (0, _ecs_safety_helpers.firstNonNullValue)(isLegacyEventSafeVersion(event) ? undefined : (_event$process2 = event.process) === null || _event$process2 === void 0 ? void 0 : (_event$process2$hash = _event$process2.hash) === null || _event$process2$hash === void 0 ? void 0 : _event$process2$hash.md5);
}
/**
 * First non-null value for the `event.process.args` field.
 */


function argsForProcess(event) {
  var _event$process3;

  if (isLegacyEventSafeVersion(event)) {
    // There is not currently a key for this on Legacy event types
    return undefined;
  }

  return (0, _ecs_safety_helpers.values)((_event$process3 = event.process) === null || _event$process3 === void 0 ? void 0 : _event$process3.args);
}
/**
 * First non-null value in the `user.name` field.
 */


function userDomain(event) {
  if (isLegacyEventSafeVersion(event)) {
    return undefined;
  } else {
    var _event$user2;

    return (0, _ecs_safety_helpers.firstNonNullValue)((_event$user2 = event.user) === null || _event$user2 === void 0 ? void 0 : _event$user2.domain);
  }
}
/**
 * Find the name of the related process.
 */


function processNameSafeVersion(event) {
  if (isLegacyEventSafeVersion(event)) {
    return (0, _ecs_safety_helpers.firstNonNullValue)(event.endgame.process_name);
  } else {
    var _event$process4;

    return (0, _ecs_safety_helpers.firstNonNullValue)((_event$process4 = event.process) === null || _event$process4 === void 0 ? void 0 : _event$process4.name);
  }
}

function eventID(event) {
  var _event$event7;

  return (0, _ecs_safety_helpers.firstNonNullValue)(isLegacyEventSafeVersion(event) ? event.endgame.serial_event_id : (_event$event7 = event.event) === null || _event$event7 === void 0 ? void 0 : _event$event7.id);
}
/**
 * Retrieve the record_id field from a winlog event.
 *
 * @param event a winlog event
 */


function winlogRecordID(event) {
  var _event$winlog;

  return (0, _ecs_safety_helpers.firstNonNullValue)((_event$winlog = event.winlog) === null || _event$winlog === void 0 ? void 0 : _event$winlog.record_id);
}
/**
 * Minimum fields needed from the `SafeResolverEvent` type for the function below to operate correctly.
 */

/**
 * Extract the first non null event sequence value from a document. Returns undefined if the field doesn't exist in the document.
 *
 * @param event a document from ES
 */


function eventSequence(event) {
  var _event$event8;

  if (isLegacyEventSafeVersion(event)) {
    var _event$endgame;

    return (0, _ecs_safety_helpers.firstNonNullValue)((_event$endgame = event.endgame) === null || _event$endgame === void 0 ? void 0 : _event$endgame.serial_event_id);
  }

  return (0, _ecs_safety_helpers.firstNonNullValue)((_event$event8 = event.event) === null || _event$event8 === void 0 ? void 0 : _event$event8.sequence);
}
/**
 * The event.id ECS field.
 */


function eventIDSafeVersion(event) {
  var _event$endgame2, _event$event9;

  return (0, _ecs_safety_helpers.firstNonNullValue)(isLegacyEventSafeVersion(event) ? (_event$endgame2 = event.endgame) === null || _event$endgame2 === void 0 ? void 0 : _event$endgame2.serial_event_id : (_event$event9 = event.event) === null || _event$event9 === void 0 ? void 0 : _event$event9.id);
}
/**
 * The event.entity_id field.
 */


function entityId(event) {
  if (isLegacyEvent(event)) {
    return event.endgame.unique_pid ? String(event.endgame.unique_pid) : '';
  }

  return event.process.entity_id;
}
/**
 * Minimum fields needed from the `SafeResolverEvent` type for the function below to operate correctly.
 */

/**
 * Extract the first non null value from either the `entity_id` or `unique_pid` depending on the document type. Returns
 * undefined if the field doesn't exist in the document.
 *
 * @param event a document from ES
 */


function entityIDSafeVersion(event) {
  if (isLegacyEventSafeVersion(event)) {
    var _event$endgame3;

    return ((_event$endgame3 = event.endgame) === null || _event$endgame3 === void 0 ? void 0 : _event$endgame3.unique_pid) === undefined ? undefined : String((0, _ecs_safety_helpers.firstNonNullValue)(event.endgame.unique_pid));
  } else {
    var _event$process5;

    return (0, _ecs_safety_helpers.firstNonNullValue)((_event$process5 = event.process) === null || _event$process5 === void 0 ? void 0 : _event$process5.entity_id);
  }
}
/**
 * The process.parent.entity_id ECS field.
 */


function parentEntityId(event) {
  var _event$process$parent2;

  if (isLegacyEvent(event)) {
    return event.endgame.unique_ppid ? String(event.endgame.unique_ppid) : undefined;
  }

  return (_event$process$parent2 = event.process.parent) === null || _event$process$parent2 === void 0 ? void 0 : _event$process$parent2.entity_id;
}
/**
 * Minimum fields needed from the `SafeResolverEvent` type for the function below to operate correctly.
 */

/**
 * Extract the first non null value from either the `parent.entity_id` or `unique_ppid` depending on the document type. Returns
 * undefined if the field doesn't exist in the document.
 *
 * @param event a document from ES
 */


function parentEntityIDSafeVersion(event) {
  var _event$process6, _event$process6$paren;

  if (isLegacyEventSafeVersion(event)) {
    var _event$endgame4;

    return String((0, _ecs_safety_helpers.firstNonNullValue)((_event$endgame4 = event.endgame) === null || _event$endgame4 === void 0 ? void 0 : _event$endgame4.unique_ppid));
  }

  return (0, _ecs_safety_helpers.firstNonNullValue)((_event$process6 = event.process) === null || _event$process6 === void 0 ? void 0 : (_event$process6$paren = _event$process6.parent) === null || _event$process6$paren === void 0 ? void 0 : _event$process6$paren.entity_id);
}
/**
 * Minimum fields needed from the `SafeResolverEvent` type for the function below to operate correctly.
 */

/**
 * Extracts all ancestry array from a document if it exists.
 *
 * @param event an ES document
 */


function ancestryArray(event) {
  var _event$process7, _event$process7$Ext;

  if (isLegacyEventSafeVersion(event)) {
    return undefined;
  } // this is to guard against the endpoint accidentally not sending the ancestry array
  // otherwise the request will fail when really we should just try using the parent entity id


  return (0, _ecs_safety_helpers.values)((_event$process7 = event.process) === null || _event$process7 === void 0 ? void 0 : (_event$process7$Ext = _event$process7.Ext) === null || _event$process7$Ext === void 0 ? void 0 : _event$process7$Ext.ancestry);
}
/**
 * Minimum fields needed from the `SafeResolverEvent` type for the function below to operate correctly.
 */

/**
 * Returns an array of strings representing the ancestry for a process.
 *
 * @param event an ES document
 */


function ancestry(event) {
  const ancestors = ancestryArray(event);

  if (ancestors) {
    return ancestors;
  }

  const parentID = parentEntityIDSafeVersion(event);

  if (parentID) {
    return [parentID];
  }

  return [];
}
/**
 * @param event The event to get the full ECS category for
 */


function eventCategory(event) {
  var _event$event10;

  return (0, _ecs_safety_helpers.values)(isLegacyEventSafeVersion(event) ? event.endgame.event_type_full : (_event$event10 = event.event) === null || _event$event10 === void 0 ? void 0 : _event$event10.category);
}
/**
 * ECS event type will be things like 'creation', 'deletion', 'access', etc.
 * see: https://www.elastic.co/guide/en/ecs/current/ecs-event.html
 * @param event The ResolverEvent to get the ecs type for
 */


function eventType(event) {
  var _event$event11;

  return (0, _ecs_safety_helpers.values)(isLegacyEventSafeVersion(event) ? event.endgame.event_subtype_full : (_event$event11 = event.event) === null || _event$event11 === void 0 ? void 0 : _event$event11.type);
}
/**
 * event.kind as an array.
 */


function eventKind(event) {
  if (isLegacyEventSafeVersion(event)) {
    return [];
  } else {
    var _event$event12;

    return (0, _ecs_safety_helpers.values)((_event$event12 = event.event) === null || _event$event12 === void 0 ? void 0 : _event$event12.kind);
  }
}