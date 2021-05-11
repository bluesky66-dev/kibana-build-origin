"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMlSystemProvider = getMlSystemProvider;

var _spaces_utils = require("../../lib/spaces_utils");

var _capabilities = require("../../lib/capabilities");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getMlSystemProvider(getGuards, mlLicense, getSpaces, cloud, resolveMlCapabilities) {
  return {
    mlSystemProvider(request, savedObjectsClient) {
      return {
        async mlCapabilities() {
          return await getGuards(request, savedObjectsClient).isMinimumLicense().ok(async ({
            mlClient
          }) => {
            const {
              isMlEnabledInSpace
            } = (0, _spaces_utils.spacesUtilsProvider)(getSpaces, request);
            const mlCapabilities = await resolveMlCapabilities(request);

            if (mlCapabilities === null) {
              throw new Error('mlCapabilities is not defined');
            }

            const {
              getCapabilities
            } = (0, _capabilities.capabilitiesProvider)(mlClient, mlCapabilities, mlLicense, isMlEnabledInSpace);
            return getCapabilities();
          });
        },

        async mlInfo() {
          return await getGuards(request, savedObjectsClient).isMinimumLicense().ok(async ({
            mlClient
          }) => {
            const {
              body: info
            } = await mlClient.info();
            const cloudId = cloud && cloud.cloudId;
            return { ...info,
              cloudId
            };
          });
        },

        async mlAnomalySearch(searchParams, jobIds) {
          return await getGuards(request, savedObjectsClient).isFullLicense().hasMlCapabilities(['canAccessML']).ok(async ({
            mlClient
          }) => {
            const {
              body
            } = await mlClient.anomalySearch(searchParams, jobIds);
            return body;
          });
        }

      };
    }

  };
}