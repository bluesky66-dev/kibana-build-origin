"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ACTIONS_FEATURE = void 0;

var _i18n = require("@kbn/i18n");

var _saved_objects = require("./saved_objects");

var _server = require("../../../../src/core/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ACTIONS_FEATURE = {
  id: 'actions',
  name: _i18n.i18n.translate('xpack.actions.featureRegistry.actionsFeatureName', {
    defaultMessage: 'Actions and Connectors'
  }),
  category: _server.DEFAULT_APP_CATEGORIES.management,
  app: [],
  management: {
    insightsAndAlerting: ['triggersActions']
  },
  privileges: {
    all: {
      app: [],
      api: [],
      catalogue: [],
      management: {
        insightsAndAlerting: ['triggersActions']
      },
      savedObject: {
        all: [_saved_objects.ACTION_SAVED_OBJECT_TYPE, _saved_objects.ACTION_TASK_PARAMS_SAVED_OBJECT_TYPE],
        read: []
      },
      ui: ['show', 'execute', 'save', 'delete']
    },
    read: {
      app: [],
      api: [],
      catalogue: [],
      management: {
        insightsAndAlerting: ['triggersActions']
      },
      savedObject: {
        // action execution requires 'read' over `actions`, but 'all' over `action_task_params`
        all: [_saved_objects.ACTION_TASK_PARAMS_SAVED_OBJECT_TYPE],
        read: [_saved_objects.ACTION_SAVED_OBJECT_TYPE]
      },
      ui: ['show', 'execute']
    }
  }
};
exports.ACTIONS_FEATURE = ACTIONS_FEATURE;