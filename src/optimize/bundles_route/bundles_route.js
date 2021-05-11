"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBundlesRoute = createBundlesRoute;

var _path = require("path");

var UiSharedDeps = _interopRequireWildcard(require("@kbn/ui-shared-deps"));

var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));

var _dynamic_asset_response = require("./dynamic_asset_response");

var _file_hash_cache = require("./file_hash_cache");

var _np_ui_plugin_public_dirs = require("../np_ui_plugin_public_dirs");

var _utils = require("../../core/server/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 *  Creates the routes that serves files from `bundlesPath`.
 *
 *  @param {Object} options
 *  @property {Array<{id,path}>} options.npUiPluginPublicDirs array of ids and paths that should be served for new platform plugins
 *  @property {string} options.regularBundlesPath
 *  @property {string} options.basePublicPath
 *
 *  @return Array.of({Hapi.Route})
 */
function createBundlesRoute({
  basePublicPath,
  npUiPluginPublicDirs = [],
  buildHash,
  isDist = false
}) {
  // rather than calculate the fileHash on every request, we
  // provide a cache object to `resolveDynamicAssetResponse()` that
  // will store the 100 most recently used hashes.
  const fileHashCache = new _file_hash_cache.FileHashCache();
  (0, _np_ui_plugin_public_dirs.assertIsNpUiPluginPublicDirs)(npUiPluginPublicDirs);

  if (typeof basePublicPath !== 'string') {
    throw new TypeError('basePublicPath must be a string');
  }

  if (!basePublicPath.match(/(^$|^\/.*[^\/]$)/)) {
    throw new TypeError('basePublicPath must be empty OR start and not end with a /');
  }

  return [buildRouteForBundles({
    publicPath: `${basePublicPath}/${buildHash}/bundles/kbn-ui-shared-deps/`,
    routePath: `/${buildHash}/bundles/kbn-ui-shared-deps/`,
    bundlesPath: UiSharedDeps.distDir,
    fileHashCache,
    isDist
  }), ...npUiPluginPublicDirs.map(({
    id,
    path
  }) => buildRouteForBundles({
    publicPath: `${basePublicPath}/${buildHash}/bundles/plugin/${id}/`,
    routePath: `/${buildHash}/bundles/plugin/${id}/`,
    bundlesPath: path,
    fileHashCache,
    isDist
  })), buildRouteForBundles({
    publicPath: `${basePublicPath}/${buildHash}/bundles/core/`,
    routePath: `/${buildHash}/bundles/core/`,
    bundlesPath: (0, _utils.fromRoot)((0, _path.join)('src', 'core', 'target', 'public')),
    fileHashCache,
    isDist
  })];
}

function buildRouteForBundles({
  publicPath,
  routePath,
  bundlesPath,
  fileHashCache,
  isDist
}) {
  return {
    method: 'GET',
    path: `${routePath}{path*}`,
    config: {
      auth: false,
      ext: {
        onPreHandler: {
          method(request, h) {
            const ext = (0, _path.extname)(request.params.path);

            _elasticApmNode.default.setTransactionName('GET ?/bundles/?');

            if (ext !== '.js' && ext !== '.css') {
              return h.continue;
            }

            return (0, _dynamic_asset_response.createDynamicAssetResponse)({
              request,
              h,
              bundlesPath,
              fileHashCache,
              publicPath,
              isDist
            });
          }

        }
      }
    },
    handler: {
      directory: {
        path: bundlesPath,
        listing: false,
        lookupCompressed: true
      }
    }
  };
}