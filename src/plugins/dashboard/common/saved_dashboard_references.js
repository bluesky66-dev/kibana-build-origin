"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractReferences = extractReferences;
exports.injectReferences = injectReferences;

var _satisfies = _interopRequireDefault(require("semver/functions/satisfies"));

var _embeddable_references = require("./embeddable/embeddable_references");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function extractReferences({
  attributes,
  references = []
}, deps) {
  if (typeof attributes.panelsJSON !== 'string') {
    return {
      attributes,
      references
    };
  }

  const panelReferences = [];
  let panels = JSON.parse(String(attributes.panelsJSON));

  const isPre730Panel = panel => {
    return 'version' in panel ? (0, _satisfies.default)(panel.version, '<7.3') : true;
  };

  const hasPre730Panel = panels.some(isPre730Panel);
  /**
   * `extractPanelsReferences` only knows how to reliably handle "latest" panels
   * It is possible that `extractReferences` is run on older dashboard SO with older panels,
   * for example, when importing a saved object using saved object UI `extractReferences` is called BEFORE any server side migrations are run.
   *
   * In this case we skip running `extractPanelsReferences` on such object.
   * We also know that there is nothing to extract
   * (First possible entity to be extracted by this mechanism is a dashboard drilldown since 7.11)
   */

  if (!hasPre730Panel) {
    const extractedReferencesResult = (0, _embeddable_references.extractPanelsReferences)( // it is ~safe~ to cast to `SavedDashboardPanel730ToLatest` because above we've checked that there are only >=7.3 panels
    panels, deps);
    panels = extractedReferencesResult.map(res => res.panel);
    extractedReferencesResult.forEach(res => {
      panelReferences.push(...res.references);
    });
  } // TODO: This extraction should be done by EmbeddablePersistableStateService
  // https://github.com/elastic/kibana/issues/82830


  panels.forEach((panel, i) => {
    if (!panel.type) {
      throw new Error(`"type" attribute is missing from panel "${i}"`);
    }

    if (!panel.id) {
      // Embeddables are not required to be backed off a saved object.
      return;
    }

    panel.panelRefName = `panel_${i}`;
    panelReferences.push({
      name: `panel_${i}`,
      type: panel.type,
      id: panel.id
    });
    delete panel.type;
    delete panel.id;
  });
  return {
    references: [...references, ...panelReferences],
    attributes: { ...attributes,
      panelsJSON: JSON.stringify(panels)
    }
  };
}

function injectReferences({
  attributes,
  references = []
}, deps) {
  // Skip if panelsJSON is missing otherwise this will cause saved object import to fail when
  // importing objects without panelsJSON. At development time of this, there is no guarantee each saved
  // object has panelsJSON in all previous versions of kibana.
  if (typeof attributes.panelsJSON !== 'string') {
    return attributes;
  }

  let panels = JSON.parse(attributes.panelsJSON); // Same here, prevent failing saved object import if ever panels aren't an array.

  if (!Array.isArray(panels)) {
    return attributes;
  } // TODO: This injection should be done by EmbeddablePersistableStateService
  // https://github.com/elastic/kibana/issues/82830


  panels.forEach(panel => {
    if (!panel.panelRefName) {
      return;
    }

    const reference = references.find(ref => ref.name === panel.panelRefName);

    if (!reference) {
      // Throw an error since "panelRefName" means the reference exists within
      // "references" and in this scenario we have bad data.
      throw new Error(`Could not find reference "${panel.panelRefName}"`);
    }

    panel.id = reference.id;
    panel.type = reference.type;
    delete panel.panelRefName;
  });
  panels = (0, _embeddable_references.injectPanelsReferences)(panels, references, deps);
  return { ...attributes,
    panelsJSON: JSON.stringify(panels)
  };
}