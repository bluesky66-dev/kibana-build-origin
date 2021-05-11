"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAnnotationsFeatureAvailable = isAnnotationsFeatureAvailable;

var _log = require("../../lib/log");

var _index_patterns = require("../../../common/constants/index_patterns");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Annotations Feature is available if:
// - ML_ANNOTATIONS_INDEX_PATTERN index is present
// - ML_ANNOTATIONS_INDEX_ALIAS_READ alias is present
// - ML_ANNOTATIONS_INDEX_ALIAS_WRITE alias is present


async function isAnnotationsFeatureAvailable({
  asInternalUser
}) {
  try {
    const indexParams = {
      index: _index_patterns.ML_ANNOTATIONS_INDEX_PATTERN
    };
    const {
      body: annotationsIndexExists
    } = await asInternalUser.indices.exists(indexParams);

    if (!annotationsIndexExists) {
      return false;
    }

    const {
      body: annotationsReadAliasExists
    } = await asInternalUser.indices.existsAlias({
      index: _index_patterns.ML_ANNOTATIONS_INDEX_ALIAS_READ,
      name: _index_patterns.ML_ANNOTATIONS_INDEX_ALIAS_READ
    });

    if (!annotationsReadAliasExists) {
      return false;
    }

    const {
      body: annotationsWriteAliasExists
    } = await asInternalUser.indices.existsAlias({
      index: _index_patterns.ML_ANNOTATIONS_INDEX_ALIAS_WRITE,
      name: _index_patterns.ML_ANNOTATIONS_INDEX_ALIAS_WRITE
    });

    if (!annotationsWriteAliasExists) {
      return false;
    }
  } catch (err) {
    _log.mlLog.info('Disabling ML annotations feature because the index/alias integrity check failed.');

    return false;
  }

  return true;
}