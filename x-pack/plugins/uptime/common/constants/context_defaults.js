"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CONTEXT_DEFAULTS = void 0;

var _runtime_types = require("../runtime_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * The Uptime UI utilizes a settings context, the defaults for which are stored here.
 */


const CONTEXT_DEFAULTS = {
  /**
   * The application cannot assume a basePath.
   */
  BASE_PATH: '',
  CURSOR_PAGINATION: {
    cursorDirection: _runtime_types.CursorDirection.AFTER,
    sortOrder: _runtime_types.SortOrder.ASC
  }
};
exports.CONTEXT_DEFAULTS = CONTEXT_DEFAULTS;