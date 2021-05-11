"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogEntriesService = void 0;

var _log_entry = require("../../../common/search_strategies/log_entries/log_entry");

var _log_entries = require("../../../common/search_strategies/log_entries/log_entries");

var _log_entries_search_strategy = require("./log_entries_search_strategy");

var _log_entry_search_strategy = require("./log_entry_search_strategy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class LogEntriesService {
  setup(core, setupDeps) {
    core.getStartServices().then(([, startDeps]) => {
      setupDeps.data.search.registerSearchStrategy(_log_entries.LOG_ENTRIES_SEARCH_STRATEGY, (0, _log_entries_search_strategy.logEntriesSearchStrategyProvider)({ ...setupDeps,
        ...startDeps
      }));
      setupDeps.data.search.registerSearchStrategy(_log_entry.LOG_ENTRY_SEARCH_STRATEGY, (0, _log_entry_search_strategy.logEntrySearchStrategyProvider)({ ...setupDeps,
        ...startDeps
      }));
    });
  }

  start(_startDeps) {}

}

exports.LogEntriesService = LogEntriesService;