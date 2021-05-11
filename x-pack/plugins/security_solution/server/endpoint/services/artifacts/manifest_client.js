"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ManifestClient = void 0;

var _common = require("../../../../common/endpoint/schema/common");

var _validate = require("../../../../common/validate");

var _artifacts = require("../../lib/artifacts");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class ManifestClient {
  constructor(savedObjectsClient, schemaVersion) {
    _defineProperty(this, "schemaVersion", void 0);

    _defineProperty(this, "savedObjectsClient", void 0);

    this.savedObjectsClient = savedObjectsClient;
    const [validated, errors] = (0, _validate.validate)(schemaVersion, _common.manifestSchemaVersion);

    if (errors != null || validated === null) {
      throw new Error(`Invalid manifest version: ${schemaVersion}`);
    }

    this.schemaVersion = validated;
  }

  getManifestId() {
    return `endpoint-manifest-${this.schemaVersion}`;
  }

  async getManifest() {
    return this.savedObjectsClient.get(_artifacts.ManifestConstants.SAVED_OBJECT_TYPE, this.getManifestId());
  }

  async createManifest(manifest) {
    return this.savedObjectsClient.create(_artifacts.ManifestConstants.SAVED_OBJECT_TYPE, { ...manifest,
      created: Date.now()
    }, {
      id: this.getManifestId()
    });
  }

  async updateManifest(manifest, opts) {
    return this.savedObjectsClient.update(_artifacts.ManifestConstants.SAVED_OBJECT_TYPE, this.getManifestId(), manifest, opts);
  }

  async deleteManifest() {
    return this.savedObjectsClient.delete(_artifacts.ManifestConstants.SAVED_OBJECT_TYPE, this.getManifestId());
  }

}

exports.ManifestClient = ManifestClient;