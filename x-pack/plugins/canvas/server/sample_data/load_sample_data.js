"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadSampleData = loadSampleData;

var _i18n = require("../../i18n");

var _index = require("./index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function loadSampleData(addSavedObjectsToSampleDataset, addAppLinksToSampleDataset) {
  const now = new Date();
  const nowTimestamp = now.toISOString(); // @ts-expect-error: untyped local

  function updateCanvasWorkpadTimestamps(savedObjects) {
    // @ts-expect-error: untyped local
    return savedObjects.map(savedObject => {
      if (savedObject.type === 'canvas-workpad') {
        savedObject.attributes['@timestamp'] = nowTimestamp;
        savedObject.attributes['@created'] = nowTimestamp;
      }

      return savedObject;
    });
  }

  addSavedObjectsToSampleDataset('ecommerce', updateCanvasWorkpadTimestamps(_index.ecommerceSavedObjects));
  addAppLinksToSampleDataset('ecommerce', [{
    path: '/app/canvas#/workpad/workpad-e08b9bdb-ec14-4339-94c4-063bddfd610e',
    icon: 'canvasApp',
    label: _i18n.CANVAS
  }]);
  addSavedObjectsToSampleDataset('flights', updateCanvasWorkpadTimestamps(_index.flightsSavedObjects));
  addAppLinksToSampleDataset('flights', [{
    path: '/app/canvas#/workpad/workpad-a474e74b-aedc-47c3-894a-db77e62c41e0',
    icon: 'canvasApp',
    label: _i18n.CANVAS
  }]);
  addSavedObjectsToSampleDataset('logs', updateCanvasWorkpadTimestamps(_index.webLogsSavedObjects));
  addAppLinksToSampleDataset('logs', [{
    path: '/app/canvas#/workpad/workpad-ad72a4e9-b422-480c-be6d-a64a0b79541d',
    icon: 'canvasApp',
    label: _i18n.CANVAS
  }]);
}