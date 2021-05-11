"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getVisData = getVisData;

var _lodash = _interopRequireDefault(require("lodash"));

var _operators = require("rxjs/operators");

var _get_panel_data = require("./vis_data/get_panel_data");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getVisData(requestContext, request, framework) {
  // NOTE / TODO: This facade has been put in place to make migrating to the New Platform easier. It
  // removes the need to refactor many layers of dependencies on "req", and instead just augments the top
  // level object passed from here. The layers should be refactored fully at some point, but for now
  // this works and we are still using the New Platform services for these vis data portions.
  const reqFacade = {
    requestContext,
    ...request,
    framework,
    pre: {},
    payload: request.body,
    getUiSettingsService: () => requestContext.core.uiSettings.client,
    getSavedObjectsClient: () => requestContext.core.savedObjects.client,
    getEsShardTimeout: async () => {
      return await framework.globalConfig$.pipe((0, _operators.first)(), (0, _operators.map)(config => config.elasticsearch.shardTimeout.asMilliseconds())).toPromise();
    },
    getIndexPatternsService: async () => {
      const [, {
        data
      }] = await framework.core.getStartServices();
      return await data.indexPatterns.indexPatternsServiceFactory(requestContext.core.savedObjects.client, requestContext.core.elasticsearch.client.asCurrentUser);
    }
  };
  const promises = reqFacade.payload.panels.map((0, _get_panel_data.getPanelData)(reqFacade));
  return Promise.all(promises).then(res => {
    return res.reduce((acc, data) => {
      return _lodash.default.assign(acc, data);
    }, {});
  });
}