"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savedObjectsTaggingFeature = void 0;

var _i18n = require("@kbn/i18n");

var _server = require("../../../../src/core/server");

var _constants = require("../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const savedObjectsTaggingFeature = {
  id: _constants.tagFeatureId,
  name: _i18n.i18n.translate('xpack.savedObjectsTagging.feature.featureName', {
    defaultMessage: 'Tag Management'
  }),
  category: _server.DEFAULT_APP_CATEGORIES.management,
  order: 1800,
  app: [],
  management: {
    kibana: [_constants.tagManagementSectionId]
  },
  privileges: {
    all: {
      savedObject: {
        all: [_constants.tagSavedObjectTypeName],
        read: []
      },
      api: [],
      management: {
        kibana: [_constants.tagManagementSectionId]
      },
      ui: ['view', 'create', 'edit', 'delete', 'assign']
    },
    read: {
      savedObject: {
        all: [],
        read: [_constants.tagSavedObjectTypeName]
      },
      management: {
        kibana: [_constants.tagManagementSectionId]
      },
      api: [],
      ui: ['view', 'assign']
    }
  }
};
exports.savedObjectsTaggingFeature = savedObjectsTaggingFeature;