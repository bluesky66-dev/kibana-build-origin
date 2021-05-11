"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGlobalConfig$ = exports.getGlobalConfig = void 0;

var _operators = require("rxjs/operators");

var _rxjs = require("rxjs");

var _utils = require("@kbn/utils");

var _std = require("@kbn/std");

var _types = require("./types");

var _kibana_config = require("../kibana_config");

var _elasticsearch_config = require("../elasticsearch/elasticsearch_config");

var _saved_objects_config = require("../saved_objects/saved_objects_config");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const createGlobalConfig = ({
  kibana,
  elasticsearch,
  path,
  savedObjects
}) => {
  return (0, _std.deepFreeze)({
    kibana: (0, _std.pick)(kibana, _types.SharedGlobalConfigKeys.kibana),
    elasticsearch: (0, _std.pick)(elasticsearch, _types.SharedGlobalConfigKeys.elasticsearch),
    path: (0, _std.pick)(path, _types.SharedGlobalConfigKeys.path),
    savedObjects: (0, _std.pick)(savedObjects, _types.SharedGlobalConfigKeys.savedObjects)
  });
};

const getGlobalConfig = configService => {
  return createGlobalConfig({
    kibana: configService.atPathSync(_kibana_config.config.path),
    elasticsearch: configService.atPathSync(_elasticsearch_config.config.path),
    path: configService.atPathSync(_utils.config.path),
    savedObjects: configService.atPathSync(_saved_objects_config.savedObjectsConfig.path)
  });
};

exports.getGlobalConfig = getGlobalConfig;

const getGlobalConfig$ = configService => {
  return (0, _rxjs.combineLatest)([configService.atPath(_kibana_config.config.path), configService.atPath(_elasticsearch_config.config.path), configService.atPath(_utils.config.path), configService.atPath(_saved_objects_config.savedObjectsConfig.path)]).pipe((0, _operators.map)(([kibana, elasticsearch, path, savedObjects]) => createGlobalConfig({
    kibana,
    elasticsearch,
    path,
    savedObjects
  }), (0, _operators.shareReplay)(1)));
};

exports.getGlobalConfig$ = getGlobalConfig$;