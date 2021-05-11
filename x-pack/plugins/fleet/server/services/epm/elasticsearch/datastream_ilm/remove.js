"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteIlmRefs = exports.deleteIlms = void 0;

var _types = require("../../../../types");

var _constants = require("../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const deleteIlms = async (callCluster, ilmPolicyIds) => {
  await Promise.all(ilmPolicyIds.map(async ilmPolicyId => {
    await callCluster('transport.request', {
      method: 'DELETE',
      path: `_ilm/policy/${ilmPolicyId}`,
      ignore: [404, 400]
    });
  }));
};

exports.deleteIlms = deleteIlms;

const deleteIlmRefs = async (savedObjectsClient, installedEsAssets, pkgName, installedEsIdToRemove, currentInstalledEsIlmIds) => {
  const seen = new Set();
  const filteredAssets = installedEsAssets.filter(({
    type,
    id
  }) => {
    if (type !== _types.ElasticsearchAssetType.dataStreamIlmPolicy) return true;
    const add = (currentInstalledEsIlmIds.includes(id) || !installedEsIdToRemove.includes(id)) && !seen.has(id);
    seen.add(id);
    return add;
  });
  return savedObjectsClient.update(_constants.PACKAGES_SAVED_OBJECT_TYPE, pkgName, {
    installed_es: filteredAssets
  });
};

exports.deleteIlmRefs = deleteIlmRefs;