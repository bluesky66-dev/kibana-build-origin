"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AZURE = void 0;

var _lodash = require("lodash");

var _util = require("util");

var _cloud_service = require("./cloud_service");

var _cloud_response = require("./cloud_response");

var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * {@code AzureCloudService} will check and load the service metadata for an Azure VM if it is available.
 */


class AzureCloudService extends _cloud_service.CloudService {
  constructor(options = {}) {
    super('azure', options);
  }

  _checkIfService(request) {
    const req = {
      method: 'GET',
      uri: _constants.CLOUD_METADATA_SERVICES.AZURE_URL,
      headers: {
        // Azure requires this header
        Metadata: 'true'
      },
      json: true
    };
    return (0, _util.promisify)(request)(req) // Note: there is no fallback option for Azure
    .then(response => {
      return this._parseResponse(response.body, body => this._parseBody(body));
    });
  }
  /**
   * Parse the Azure response, if possible. Example payload (with network object ignored):
   *
   * {
   *   "compute": {
   *     "location": "eastus",
   *     "name": "my-ubuntu-vm",
   *     "offer": "UbuntuServer",
   *     "osType": "Linux",
   *     "platformFaultDomain": "0",
   *     "platformUpdateDomain": "0",
   *     "publisher": "Canonical",
   *     "sku": "16.04-LTS",
   *     "version": "16.04.201706191",
   *     "vmId": "d4c57456-2b3b-437a-9f1f-7082cfce02d4",
   *     "vmSize": "Standard_A1"
   *   },
   *   "network": {
   *     ...
   *   }
   * }
   *
   * Note: Azure VMs created using the "classic" method, as opposed to the resource manager,
   * do not provide a "compute" field / object. However, both report the "network" field / object.
   *
   * @param {Object} body The response from the VM web service.
   * @return {CloudServiceResponse} {@code null} for default fallback.
   */


  _parseBody(body) {
    const compute = (0, _lodash.get)(body, 'compute');
    const id = (0, _lodash.get)(compute, 'vmId');
    const vmType = (0, _lodash.get)(compute, 'vmSize');
    const region = (0, _lodash.get)(compute, 'location'); // remove keys that we already have; explicitly undefined so we don't send it when empty

    const metadata = compute ? (0, _lodash.omit)(compute, ['vmId', 'vmSize', 'location']) : undefined; // we don't actually use network, but we check for its existence to see if this is a response from Azure

    const network = (0, _lodash.get)(body, 'network'); // ensure we actually have some data

    if (id || vmType || region) {
      return new _cloud_response.CloudServiceResponse(this._name, true, {
        id,
        vmType,
        region,
        metadata
      });
    } else if (network) {
      // classic-managed VMs in Azure don't provide compute so we highlight the lack of info
      return new _cloud_response.CloudServiceResponse(this._name, true, {
        metadata: {
          classic: true
        }
      });
    }

    return null;
  }

}
/**
 * Singleton instance of {@code AzureCloudService}.
 *
 * @type {AzureCloudService}
 */


const AZURE = new AzureCloudService();
exports.AZURE = AZURE;