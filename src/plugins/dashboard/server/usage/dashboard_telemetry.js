"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collectDashboardTelemetry = collectDashboardTelemetry;
exports.collectForPanels = exports.collectByValueLensInfo = exports.collectByValueVisualizationInfo = exports.collectDashboardInfo = exports.getEmptyTelemetryData = void 0;

var _saved_dashboard_references = require("../../common/saved_dashboard_references");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getEmptyTelemetryData = () => ({
  panels: 0,
  panelsByValue: 0,
  lensByValue: {},
  visualizationByValue: {}
});

exports.getEmptyTelemetryData = getEmptyTelemetryData;

const collectDashboardInfo = (panels, collectorData) => {
  collectorData.panels += panels.length;
  collectorData.panelsByValue += panels.filter(panel => panel.id === undefined).length;
};

exports.collectDashboardInfo = collectDashboardInfo;

const collectByValueVisualizationInfo = (panels, collectorData) => {
  const byValueVisualizations = panels.filter(panel => panel.id === undefined && panel.type === 'visualization');

  for (const panel of byValueVisualizations) {
    const visPanel = panel;

    if (visPanel.embeddableConfig.savedVis !== undefined && visPanel.embeddableConfig.savedVis.type !== undefined) {
      const type = visPanel.embeddableConfig.savedVis.type;

      if (!collectorData.visualizationByValue[type]) {
        collectorData.visualizationByValue[type] = 0;
      }

      collectorData.visualizationByValue[type] = collectorData.visualizationByValue[type] + 1;
    }
  }
};

exports.collectByValueVisualizationInfo = collectByValueVisualizationInfo;

const collectByValueLensInfo = (panels, collectorData) => {
  const byValueLens = panels.filter(panel => panel.id === undefined && panel.type === 'lens');

  for (const panel of byValueLens) {
    var _lensPanel$embeddable;

    const lensPanel = panel;

    if (((_lensPanel$embeddable = lensPanel.embeddableConfig.attributes) === null || _lensPanel$embeddable === void 0 ? void 0 : _lensPanel$embeddable.visualizationType) !== undefined) {
      let type = lensPanel.embeddableConfig.attributes.visualizationType;

      if (type === 'lnsXY') {
        var _lensPanel$embeddable2, _lensPanel$embeddable3;

        type = ((_lensPanel$embeddable2 = lensPanel.embeddableConfig.attributes.state) === null || _lensPanel$embeddable2 === void 0 ? void 0 : (_lensPanel$embeddable3 = _lensPanel$embeddable2.visualization) === null || _lensPanel$embeddable3 === void 0 ? void 0 : _lensPanel$embeddable3.preferredSeriesType) || type;
      }

      if (!collectorData.lensByValue[type]) {
        collectorData.lensByValue[type] = 0;
      }

      collectorData.lensByValue[type] = collectorData.lensByValue[type] + 1;
    }
  }
};

exports.collectByValueLensInfo = collectByValueLensInfo;

const collectForPanels = (panels, collectorData) => {
  collectDashboardInfo(panels, collectorData);
  collectByValueVisualizationInfo(panels, collectorData);
  collectByValueLensInfo(panels, collectorData);
};

exports.collectForPanels = collectForPanels;

async function collectDashboardTelemetry(savedObjectClient, embeddableService) {
  const collectorData = getEmptyTelemetryData();
  const dashboards = await savedObjectClient.find({
    type: 'dashboard'
  });

  for (const dashboard of dashboards.saved_objects) {
    const attributes = (0, _saved_dashboard_references.injectReferences)(dashboard, {
      embeddablePersistableStateService: embeddableService
    });
    const panels = JSON.parse(attributes.panelsJSON);
    collectForPanels(panels, collectorData);
  }

  return collectorData;
}