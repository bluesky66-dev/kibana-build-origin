"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexPatternsServiceProvider = void 0;

var _routes = require("./routes");

var _saved_objects = require("../saved_objects");

var _capabilities_provider = require("./capabilities_provider");

var _ = require("../");

var _expressions = require("./expressions");

var _ui_settings_wrapper = require("./ui_settings_wrapper");

var _index_patterns_api_client = require("./index_patterns_api_client");

var _saved_objects_client_wrapper = require("./saved_objects_client_wrapper");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class IndexPatternsServiceProvider {
  setup(core, {
    expressions
  }) {
    core.savedObjects.registerType(_saved_objects.indexPatternSavedObjectType);
    core.capabilities.registerProvider(_capabilities_provider.capabilitiesProvider);
    (0, _routes.registerRoutes)(core.http, core.getStartServices);
    expressions.registerFunction((0, _expressions.getIndexPatternLoad)({
      getStartServices: core.getStartServices
    }));
  }

  start(core, {
    fieldFormats,
    logger
  }) {
    const {
      uiSettings
    } = core;
    return {
      indexPatternsServiceFactory: async (savedObjectsClient, elasticsearchClient) => {
        const uiSettingsClient = uiSettings.asScopedToClient(savedObjectsClient);
        const formats = await fieldFormats.fieldFormatServiceFactory(uiSettingsClient);
        return new _.IndexPatternsCommonService({
          uiSettings: new _ui_settings_wrapper.UiSettingsServerToCommon(uiSettingsClient),
          savedObjectsClient: new _saved_objects_client_wrapper.SavedObjectsClientServerToCommon(savedObjectsClient),
          apiClient: new _index_patterns_api_client.IndexPatternsApiServer(elasticsearchClient),
          fieldFormats: formats,
          onError: error => {
            logger.error(error);
          },
          onNotification: ({
            title,
            text
          }) => {
            logger.warn(`${title}${text ? ` : ${text}` : ''}`);
          },
          onUnsupportedTimePattern: ({
            index,
            title
          }) => {
            logger.warn(`Currently querying all indices matching ${index}. ${title} should be migrated to a wildcard-based index pattern.`);
          }
        });
      }
    };
  }

}

exports.IndexPatternsServiceProvider = IndexPatternsServiceProvider;