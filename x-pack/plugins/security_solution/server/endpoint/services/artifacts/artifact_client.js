"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArtifactClient = void 0;

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

class ArtifactClient {
  constructor(savedObjectsClient) {
    _defineProperty(this, "savedObjectsClient", void 0);

    this.savedObjectsClient = savedObjectsClient;
  }

  async getArtifact(id) {
    return this.savedObjectsClient.get(_artifacts.ArtifactConstants.SAVED_OBJECT_TYPE, id);
  }

  async createArtifact(artifact) {
    return this.savedObjectsClient.create(_artifacts.ArtifactConstants.SAVED_OBJECT_TYPE, { ...artifact,
      created: Date.now()
    }, {
      id: (0, _artifacts.getArtifactId)(artifact)
    });
  }

  async deleteArtifact(id) {
    return this.savedObjectsClient.delete(_artifacts.ArtifactConstants.SAVED_OBJECT_TYPE, id);
  }

}

exports.ArtifactClient = ArtifactClient;