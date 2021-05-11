"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discover = discover;

var _fs = require("fs");

var _path = require("path");

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _plugin = require("../plugin");

var _plugin_context = require("../plugin_context");

var _plugin_discovery_error = require("./plugin_discovery_error");

var _plugin_manifest_parser = require("./plugin_manifest_parser");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const fsReadDir$ = (0, _rxjs.bindNodeCallback)(_fs.readdir);
const fsStat$ = (0, _rxjs.bindNodeCallback)(_fs.stat);
const maxScanDepth = 5;

/**
 * Tries to discover all possible plugins based on the provided plugin config.
 * Discovery result consists of two separate streams, the one (`plugin$`) is
 * for the successfully discovered plugins and the other one (`error$`) is for
 * all the errors that occurred during discovery process.
 *
 * @param config Plugin config instance.
 * @param coreContext Kibana core values.
 * @internal
 */
function discover(config, coreContext, instanceInfo) {
  const log = coreContext.logger.get('plugins-discovery');
  log.debug('Discovering plugins...');

  if (config.additionalPluginPaths.length && coreContext.env.mode.dev) {
    log.warn(`Explicit plugin paths [${config.additionalPluginPaths}] should only be used in development. Relative imports may not work properly in production.`);
  }

  const discoveryResults$ = (0, _rxjs.merge)((0, _rxjs.from)(config.additionalPluginPaths), processPluginSearchPaths$(config.pluginSearchPaths, log)).pipe((0, _operators.mergeMap)(pluginPathOrError => {
    return typeof pluginPathOrError === 'string' ? createPlugin$(pluginPathOrError, log, coreContext, instanceInfo) : [pluginPathOrError];
  }), (0, _operators.shareReplay)());
  return {
    plugin$: discoveryResults$.pipe((0, _operators.filter)(entry => entry instanceof _plugin.PluginWrapper)),
    error$: discoveryResults$.pipe((0, _operators.filter)(entry => !(entry instanceof _plugin.PluginWrapper)))
  };
}
/**
 * Recursively iterates over every plugin search path and returns a merged stream of all
 * sub-directories containing a manifest file. If directory cannot be read or it's impossible to get stat
 * for any of the nested entries then error is added into the stream instead.
 *
 * @param pluginDirs List of the top-level directories to process.
 * @param log Plugin discovery logger instance.
 */


function processPluginSearchPaths$(pluginDirs, log) {
  function recursiveScanFolder(ent) {
    return (0, _rxjs.from)([ent]).pipe((0, _operators.mergeMap)(entry => {
      return findManifestInFolder(entry.dir, () => {
        if (entry.depth > maxScanDepth) {
          return [];
        }

        return mapSubdirectories(entry.dir, subDir => recursiveScanFolder({
          dir: subDir,
          depth: entry.depth + 1
        }));
      });
    }));
  }

  return (0, _rxjs.from)(pluginDirs.map(dir => ({
    dir,
    depth: 0
  }))).pipe((0, _operators.mergeMap)(entry => {
    log.debug(`Scanning "${entry.dir}" for plugin sub-directories...`);
    return fsReadDir$(entry.dir).pipe((0, _operators.mergeMap)(() => recursiveScanFolder(entry)), (0, _operators.catchError)(err => [_plugin_discovery_error.PluginDiscoveryError.invalidSearchPath(entry.dir, err)]));
  }));
}
/**
 * Attempts to read manifest file in specified directory or calls `notFound` and returns results if not found. For any
 * manifest files that cannot be read, a PluginDiscoveryError is added.
 * @param dir
 * @param notFound
 */


function findManifestInFolder(dir, notFound) {
  return fsStat$((0, _path.resolve)(dir, 'kibana.json')).pipe((0, _operators.mergeMap)(stats => {
    // `kibana.json` exists in given directory, we got a plugin
    if (stats.isFile()) {
      return [dir];
    }

    return [];
  }), (0, _operators.catchError)(manifestStatError => {
    // did not find manifest. recursively process sub directories until we reach max depth.
    if (manifestStatError.code !== 'ENOENT') {
      return [_plugin_discovery_error.PluginDiscoveryError.invalidPluginPath(dir, manifestStatError)];
    }

    return notFound();
  }));
}
/**
 * Finds all subdirectories in `dir` and executed `mapFunc` for each one. For any directories that cannot be read,
 * a PluginDiscoveryError is added.
 * @param dir
 * @param mapFunc
 */


function mapSubdirectories(dir, mapFunc) {
  return fsReadDir$(dir).pipe((0, _operators.mergeMap)(subDirs => subDirs.map(subDir => (0, _path.resolve)(dir, subDir))), (0, _operators.mergeMap)(subDir => fsStat$(subDir).pipe((0, _operators.mergeMap)(pathStat => pathStat.isDirectory() ? mapFunc(subDir) : []), (0, _operators.catchError)(subDirStatError => [_plugin_discovery_error.PluginDiscoveryError.invalidPluginPath(subDir, subDirStatError)]))));
}
/**
 * Tries to load and parse the plugin manifest file located at the provided plugin
 * directory path and produces an error result if it fails to do so or plugin manifest
 * isn't valid.
 * @param path Path to the plugin directory where manifest should be loaded from.
 * @param log Plugin discovery logger instance.
 * @param coreContext Kibana core context.
 */


function createPlugin$(path, log, coreContext, instanceInfo) {
  return (0, _rxjs.from)((0, _plugin_manifest_parser.parseManifest)(path, coreContext.env.packageInfo)).pipe((0, _operators.map)(manifest => {
    log.debug(`Successfully discovered plugin "${manifest.id}" at "${path}"`);
    const opaqueId = Symbol(manifest.id);
    return new _plugin.PluginWrapper({
      path,
      manifest,
      opaqueId,
      initializerContext: (0, _plugin_context.createPluginInitializerContext)(coreContext, opaqueId, manifest, instanceInfo)
    });
  }), (0, _operators.catchError)(err => [err]));
}