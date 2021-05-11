"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upsertUIReindexOption = upsertUIReindexOption;

var _types = require("../../../common/types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function incrementUIReindexOptionCounter({
  savedObjects,
  uiReindexOptionCounter
}) {
  const internalRepository = savedObjects.createInternalRepository();
  await internalRepository.incrementCounter(_types.UPGRADE_ASSISTANT_TYPE, _types.UPGRADE_ASSISTANT_DOC_ID, [`ui_reindex.${uiReindexOptionCounter}`]);
}

async function upsertUIReindexOption({
  start,
  close,
  open,
  stop,
  savedObjects
}) {
  if (close) {
    await incrementUIReindexOptionCounter({
      savedObjects,
      uiReindexOptionCounter: 'close'
    });
  }

  if (open) {
    await incrementUIReindexOptionCounter({
      savedObjects,
      uiReindexOptionCounter: 'open'
    });
  }

  if (start) {
    await incrementUIReindexOptionCounter({
      savedObjects,
      uiReindexOptionCounter: 'start'
    });
  }

  if (stop) {
    await incrementUIReindexOptionCounter({
      savedObjects,
      uiReindexOptionCounter: 'stop'
    });
  }

  return {
    close,
    open,
    start,
    stop
  };
}