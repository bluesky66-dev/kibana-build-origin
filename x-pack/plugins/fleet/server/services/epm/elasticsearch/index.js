"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRegistryDataStreamAssetBaseName = getRegistryDataStreamAssetBaseName;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Creates the base name for Elasticsearch assets in the form of
 * {type}-{dataset}
 */

function getRegistryDataStreamAssetBaseName(dataStream) {
  const baseName = `${dataStream.type}-${dataStream.dataset}`;
  return dataStream.hidden ? `.${baseName}` : baseName;
}