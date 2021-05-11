"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usageProvider = usageProvider;
exports.searchUsageObserver = searchUsageObserver;

var _lodash = require("lodash");

var _common = require("../../../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const SAVED_OBJECT_ID = 'search-telemetry';

function usageProvider(core) {
  const getRepository = (0, _lodash.once)(async () => {
    const [coreStart] = await core.getStartServices();
    return coreStart.savedObjects.createInternalRepository();
  });
  const collectedUsage = {
    successCount: 0,
    errorCount: 0,
    totalDuration: 0
  }; // Instead of updating the search count every time a search completes, we update some in-memory
  // counts and only update the saved object every ~5 seconds

  const updateSearchUsage = (0, _lodash.debounce)(async () => {
    const repository = await getRepository();
    const {
      successCount,
      errorCount,
      totalDuration
    } = collectedUsage;
    const counterFields = Object.entries(collectedUsage).map(([fieldName, incrementBy]) => ({
      fieldName,
      incrementBy
    })) // Filter out any zero values because `incrementCounter` will still increment them
    .filter(({
      incrementBy
    }) => incrementBy > 0);

    try {
      await repository.incrementCounter(SAVED_OBJECT_ID, SAVED_OBJECT_ID, counterFields); // Since search requests may have completed while the saved object was being updated, we minus
      // what was just updated in the saved object rather than resetting the values to 0

      collectedUsage.successCount -= successCount;
      collectedUsage.errorCount -= errorCount;
      collectedUsage.totalDuration -= totalDuration;
    } catch (e) {// We didn't reset the counters so we'll retry when the next search request completes
    }
  }, 5000, {
    maxWait: 5000
  });

  const trackSuccess = duration => {
    collectedUsage.successCount++;
    collectedUsage.totalDuration += duration;
    return updateSearchUsage();
  };

  const trackError = () => {
    collectedUsage.errorCount++;
    return updateSearchUsage();
  };

  return {
    trackSuccess,
    trackError
  };
}
/**
 * Rxjs observer for easily doing `tap(searchUsageObserver(logger, usage))` in an rxjs chain.
 */


function searchUsageObserver(logger, usage, {
  isRestore
} = {}) {
  return {
    next(response) {
      if (isRestore || !(0, _common.isCompleteResponse)(response)) return;
      logger.debug(`trackSearchStatus:next  ${response.rawResponse.took}`);
      usage === null || usage === void 0 ? void 0 : usage.trackSuccess(response.rawResponse.took);
    },

    error() {
      logger.debug(`trackSearchStatus:error`);
      usage === null || usage === void 0 ? void 0 : usage.trackError();
    }

  };
}