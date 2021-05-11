"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerIndicesRoutes = registerIndicesRoutes;

var _register_clear_cache_route = require("./register_clear_cache_route");

var _register_close_route = require("./register_close_route");

var _register_flush_route = require("./register_flush_route");

var _register_forcemerge_route = require("./register_forcemerge_route");

var _register_list_route = require("./register_list_route");

var _register_open_route = require("./register_open_route");

var _register_refresh_route = require("./register_refresh_route");

var _register_reload_route = require("./register_reload_route");

var _register_delete_route = require("./register_delete_route");

var _register_freeze_route = require("./register_freeze_route");

var _register_unfreeze_route = require("./register_unfreeze_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerIndicesRoutes(dependencies) {
  (0, _register_clear_cache_route.registerClearCacheRoute)(dependencies);
  (0, _register_close_route.registerCloseRoute)(dependencies);
  (0, _register_flush_route.registerFlushRoute)(dependencies);
  (0, _register_forcemerge_route.registerForcemergeRoute)(dependencies);
  (0, _register_list_route.registerListRoute)(dependencies);
  (0, _register_open_route.registerOpenRoute)(dependencies);
  (0, _register_refresh_route.registerRefreshRoute)(dependencies);
  (0, _register_reload_route.registerReloadRoute)(dependencies);
  (0, _register_delete_route.registerDeleteRoute)(dependencies);
  (0, _register_freeze_route.registerFreezeRoute)(dependencies);
  (0, _register_unfreeze_route.registerUnfreezeRoute)(dependencies);
}