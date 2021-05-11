"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ManifestEntry = void 0;

var _common = require("./common");

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

class ManifestEntry {
  constructor(artifact) {
    _defineProperty(this, "artifact", void 0);

    this.artifact = artifact;
  }

  getDocId() {
    return (0, _common.getArtifactId)(this.artifact);
  }

  getIdentifier() {
    return this.artifact.identifier;
  }

  getCompressionAlgorithm() {
    return this.artifact.compressionAlgorithm;
  }

  getEncodedSha256() {
    return this.artifact.encodedSha256;
  }

  getDecodedSha256() {
    return this.artifact.decodedSha256;
  }

  getEncodedSize() {
    return this.artifact.encodedSize;
  }

  getDecodedSize() {
    return this.artifact.decodedSize;
  }

  getUrl() {
    return `/api/endpoint/artifacts/download/${this.getIdentifier()}/${this.getDecodedSha256()}`;
  }

  getArtifact() {
    return this.artifact;
  }

  getRecord() {
    return {
      compression_algorithm: this.getCompressionAlgorithm(),
      encryption_algorithm: 'none',
      decoded_sha256: this.getDecodedSha256(),
      decoded_size: this.getDecodedSize(),
      encoded_sha256: this.getEncodedSha256(),
      encoded_size: this.getEncodedSize(),
      relative_url: this.getUrl()
    };
  }

}

exports.ManifestEntry = ManifestEntry;