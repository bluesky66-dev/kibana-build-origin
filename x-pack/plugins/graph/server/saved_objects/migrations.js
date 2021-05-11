"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.graphMigrations = void 0;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const graphMigrations = {
  '7.0.0': doc => {
    // Set new "references" attribute
    doc.references = doc.references || []; // Migrate index pattern

    const wsState = (0, _lodash.get)(doc, 'attributes.wsState');

    if (typeof wsState !== 'string') {
      return doc;
    }

    let state;

    try {
      state = JSON.parse(JSON.parse(wsState));
    } catch (e) {
      // Let it go, the data is invalid and we'll leave it as is
      return doc;
    }

    const {
      indexPattern
    } = state;

    if (!indexPattern) {
      return doc;
    }

    state.indexPatternRefName = 'indexPattern_0';
    delete state.indexPattern;
    doc.attributes.wsState = JSON.stringify(JSON.stringify(state));
    doc.references.push({
      name: 'indexPattern_0',
      type: 'index-pattern',
      id: indexPattern
    });
    return doc;
  },
  '7.10.0': doc => {
    const wsState = (0, _lodash.get)(doc, 'attributes.wsState');

    if (typeof wsState !== 'string') {
      return doc;
    }

    let state;

    try {
      state = JSON.parse(JSON.parse(wsState));
    } catch (e) {
      // Let it go, the data is invalid and we'll leave it as is
      return doc;
    }

    if (state.blacklist) {
      state.blocklist = state.blacklist;
      delete state.blacklist;
    }

    doc.attributes.wsState = JSON.stringify(JSON.stringify(state));
    return doc;
  },
  '7.11.0': doc => {
    var _doc$references;

    const wsState = (0, _lodash.get)(doc, 'attributes.wsState');

    if (typeof wsState !== 'string') {
      return doc;
    }

    let state;

    try {
      state = JSON.parse(JSON.parse(wsState));
    } catch (e) {
      // Let it go, the data is invalid and we'll leave it as is
      return doc;
    }

    const indexPatternRefName = state.indexPatternRefName;
    const indexPatternReference = (_doc$references = doc.references) === null || _doc$references === void 0 ? void 0 : _doc$references.find(reference => reference.name === indexPatternRefName);

    if (!indexPatternReference) {
      // This saved object doesn't have an reference, there's something corrupted here,
      // leave it as is
      return doc;
    }

    const indexPatternTitle = indexPatternReference.id; // remove index pattern title from workspace state (this should always be the id)

    delete state.indexPatternRefName; // add index pattern title as legacyIndexPatternRef so it can get resolved to the id on next open

    doc.attributes.legacyIndexPatternRef = indexPatternTitle;
    doc.attributes.wsState = JSON.stringify(JSON.stringify(state)); // remove references

    doc.references = [];
    return doc;
  }
};
exports.graphMigrations = graphMigrations;