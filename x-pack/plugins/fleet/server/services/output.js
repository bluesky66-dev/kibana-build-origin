"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.outputService = void 0;

var _constants = require("../constants");

var _app_context = require("./app_context");

var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const SAVED_OBJECT_TYPE = _constants.OUTPUT_SAVED_OBJECT_TYPE;
let cachedAdminUser = null;

class OutputService {
  async getDefaultOutput(soClient) {
    return await soClient.find({
      type: _constants.OUTPUT_SAVED_OBJECT_TYPE,
      searchFields: ['is_default'],
      search: 'true'
    });
  }

  async ensureDefaultOutput(soClient) {
    var _decodeCloudId;

    const outputs = await this.getDefaultOutput(soClient);

    const cloud = _app_context.appContextService.getCloud();

    const cloudId = (cloud === null || cloud === void 0 ? void 0 : cloud.isCloudEnabled) && cloud.cloudId;
    const cloudUrl = cloudId && ((_decodeCloudId = (0, _common.decodeCloudId)(cloudId)) === null || _decodeCloudId === void 0 ? void 0 : _decodeCloudId.elasticsearchUrl);

    const flagsUrl = _app_context.appContextService.getConfig().agents.elasticsearch.host;

    const defaultUrl = 'http://localhost:9200';
    const defaultOutputUrl = cloudUrl || flagsUrl || defaultUrl;

    if (!outputs.saved_objects.length) {
      const newDefaultOutput = { ..._constants.DEFAULT_OUTPUT,
        hosts: [defaultOutputUrl],
        ca_sha256: _app_context.appContextService.getConfig().agents.elasticsearch.ca_sha256
      };
      return await this.create(soClient, newDefaultOutput);
    }

    return {
      id: outputs.saved_objects[0].id,
      ...outputs.saved_objects[0].attributes
    };
  }

  async updateOutput(soClient, id, data) {
    await soClient.update(SAVED_OBJECT_TYPE, id, data);
  }

  async getDefaultOutputId(soClient) {
    const outputs = await this.getDefaultOutput(soClient);

    if (!outputs.saved_objects.length) {
      return null;
    }

    return outputs.saved_objects[0].id;
  }

  async getAdminUser(soClient, useCache = true) {
    var _appContextService$ge;

    if (useCache && cachedAdminUser) {
      return cachedAdminUser;
    }

    const defaultOutputId = await this.getDefaultOutputId(soClient);

    if (!defaultOutputId) {
      return null;
    }

    const so = await ((_appContextService$ge = _app_context.appContextService.getEncryptedSavedObjects()) === null || _appContextService$ge === void 0 ? void 0 : _appContextService$ge.getDecryptedAsInternalUser(_constants.OUTPUT_SAVED_OBJECT_TYPE, defaultOutputId));

    if (!so || !so.attributes.fleet_enroll_username || !so.attributes.fleet_enroll_password) {
      return null;
    }

    cachedAdminUser = {
      username: so.attributes.fleet_enroll_username,
      password: so.attributes.fleet_enroll_password
    };
    return cachedAdminUser;
  }

  async create(soClient, output, options) {
    const newSo = await soClient.create(SAVED_OBJECT_TYPE, output, options);
    return {
      id: newSo.id,
      ...newSo.attributes
    };
  }

  async get(soClient, id) {
    const outputSO = await soClient.get(SAVED_OBJECT_TYPE, id);

    if (outputSO.error) {
      throw new Error(outputSO.error.message);
    }

    return {
      id: outputSO.id,
      ...outputSO.attributes
    };
  }

  async update(soClient, id, data) {
    const outputSO = await soClient.update(SAVED_OBJECT_TYPE, id, data);

    if (outputSO.error) {
      throw new Error(outputSO.error.message);
    }
  }

  async list(soClient) {
    const outputs = await soClient.find({
      type: SAVED_OBJECT_TYPE,
      page: 1,
      perPage: 1000
    });
    return {
      items: outputs.saved_objects.map(outputSO => {
        return {
          id: outputSO.id,
          ...outputSO.attributes
        };
      }),
      total: outputs.total,
      page: 1,
      perPage: 1000
    };
  } // Warning! This method is not going to working in a scenario with multiple Kibana instances,
  // in this case Kibana should be restarted if the Admin User change


  invalidateCache() {
    cachedAdminUser = null;
  }

}

const outputService = new OutputService();
exports.outputService = outputService;