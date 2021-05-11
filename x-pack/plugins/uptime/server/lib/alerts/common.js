"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateState = void 0;

var _Either = require("fp-ts/lib/Either");

var _runtime_types = require("../../../common/runtime_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const updateState = (state, isTriggeredNow) => {
  const now = new Date().toISOString();

  const decoded = _runtime_types.UptimeCommonStateType.decode(state);

  if (!(0, _Either.isRight)(decoded)) {
    const triggerVal = isTriggeredNow ? now : undefined;
    return {
      currentTriggerStarted: triggerVal,
      firstCheckedAt: now,
      firstTriggeredAt: triggerVal,
      isTriggered: isTriggeredNow,
      lastTriggeredAt: triggerVal,
      lastCheckedAt: now,
      lastResolvedAt: undefined
    };
  }

  const {
    currentTriggerStarted,
    firstCheckedAt,
    firstTriggeredAt,
    lastTriggeredAt,
    // this is the stale trigger status, we're naming it `wasTriggered`
    // to differentiate it from the `isTriggeredNow` param
    isTriggered: wasTriggered,
    lastResolvedAt
  } = decoded.right;
  let cts;

  if (isTriggeredNow && !currentTriggerStarted) {
    cts = now;
  } else if (isTriggeredNow) {
    cts = currentTriggerStarted;
  }

  return {
    currentTriggerStarted: cts,
    firstCheckedAt: firstCheckedAt !== null && firstCheckedAt !== void 0 ? firstCheckedAt : now,
    firstTriggeredAt: isTriggeredNow && !firstTriggeredAt ? now : firstTriggeredAt,
    lastCheckedAt: now,
    lastTriggeredAt: isTriggeredNow ? now : lastTriggeredAt,
    lastResolvedAt: !isTriggeredNow && wasTriggered ? now : lastResolvedAt,
    isTriggered: isTriggeredNow
  };
};

exports.updateState = updateState;