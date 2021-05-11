"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.injectPanelsReferences = injectPanelsReferences;
exports.extractPanelsReferences = extractPanelsReferences;

var _lodash = require("lodash");

var _embeddable_saved_object_converters = require("./embeddable_saved_object_converters");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function injectPanelsReferences(panels, references, deps) {
  const result = [];

  for (const panel of panels) {
    const embeddableState = (0, _embeddable_saved_object_converters.convertSavedDashboardPanelToPanelState)(panel);
    embeddableState.explicitInput = (0, _lodash.omit)(deps.embeddablePersistableStateService.inject({ ...embeddableState.explicitInput,
      type: panel.type
    }, references), 'type');
    result.push((0, _embeddable_saved_object_converters.convertPanelStateToSavedDashboardPanel)(embeddableState, panel.version));
  }

  return result;
}

function extractPanelsReferences(panels, deps) {
  const result = [];

  for (const panel of panels) {
    const embeddable = (0, _embeddable_saved_object_converters.convertSavedDashboardPanelToPanelState)(panel);
    const {
      state: embeddableInputWithExtractedReferences,
      references
    } = deps.embeddablePersistableStateService.extract({ ...embeddable.explicitInput,
      type: embeddable.type
    });
    embeddable.explicitInput = (0, _lodash.omit)(embeddableInputWithExtractedReferences, 'type');
    const newPanel = (0, _embeddable_saved_object_converters.convertPanelStateToSavedDashboardPanel)(embeddable, panel.version);
    result.push({
      panel: newPanel,
      references
    });
  }

  return result;
}