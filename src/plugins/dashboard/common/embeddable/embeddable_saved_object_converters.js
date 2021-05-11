"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertSavedDashboardPanelToPanelState = convertSavedDashboardPanelToPanelState;
exports.convertPanelStateToSavedDashboardPanel = convertPanelStateToSavedDashboardPanel;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function convertSavedDashboardPanelToPanelState(savedDashboardPanel) {
  return {
    type: savedDashboardPanel.type,
    gridData: savedDashboardPanel.gridData,
    explicitInput: {
      id: savedDashboardPanel.panelIndex,
      ...(savedDashboardPanel.id !== undefined && {
        savedObjectId: savedDashboardPanel.id
      }),
      ...(savedDashboardPanel.title !== undefined && {
        title: savedDashboardPanel.title
      }),
      ...savedDashboardPanel.embeddableConfig
    }
  };
}

function convertPanelStateToSavedDashboardPanel(panelState, version) {
  const savedObjectId = panelState.explicitInput.savedObjectId;
  return {
    version,
    type: panelState.type,
    gridData: panelState.gridData,
    panelIndex: panelState.explicitInput.id,
    embeddableConfig: (0, _lodash.omit)(panelState.explicitInput, ['id', 'savedObjectId', 'title']),
    ...(panelState.explicitInput.title !== undefined && {
      title: panelState.explicitInput.title
    }),
    ...(savedObjectId !== undefined && {
      id: savedObjectId
    })
  };
}