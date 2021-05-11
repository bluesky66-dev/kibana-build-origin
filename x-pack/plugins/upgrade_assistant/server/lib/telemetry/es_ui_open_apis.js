"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upsertUIOpenOption = upsertUIOpenOption;

var _types = require("../../../common/types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function incrementUIOpenOptionCounter({
  savedObjects,
  uiOpenOptionCounter
}) {
  const internalRepository = savedObjects.createInternalRepository();
  await internalRepository.incrementCounter(_types.UPGRADE_ASSISTANT_TYPE, _types.UPGRADE_ASSISTANT_DOC_ID, [`ui_open.${uiOpenOptionCounter}`]);
}

async function upsertUIOpenOption({
  overview,
  cluster,
  indices,
  savedObjects
}) {
  if (overview) {
    await incrementUIOpenOptionCounter({
      savedObjects,
      uiOpenOptionCounter: 'overview'
    });
  }

  if (cluster) {
    await incrementUIOpenOptionCounter({
      savedObjects,
      uiOpenOptionCounter: 'cluster'
    });
  }

  if (indices) {
    await incrementUIOpenOptionCounter({
      savedObjects,
      uiOpenOptionCounter: 'indices'
    });
  }

  return {
    overview,
    cluster,
    indices
  };
}