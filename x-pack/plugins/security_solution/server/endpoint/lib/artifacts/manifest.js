"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEmptyManifestDiff = isEmptyManifestDiff;
exports.Manifest = void 0;

var _lodash = require("lodash");

var _semver = _interopRequireDefault(require("semver"));

var _common = require("../../../../common");

var _common2 = require("../../../../common/endpoint/schema/common");

var _manifest = require("../../../../common/endpoint/schema/manifest");

var _manifest_entry = require("./manifest_entry");

var _common3 = require("./common");

var _manifest2 = require("../../schemas/artifacts/manifest");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

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

function createInternalManifestEntries(artifactIds, policyId) {
  return artifactIds.map(artifactId => ({
    policyId,
    artifactId
  }));
}

function isEmptyManifestDiff(diff) {
  return diff.additions.length === 0 && diff.removals.length === 0 && diff.transitions.length === 0;
}

function addValueToSet(set, value) {
  return new Set([...((set === null || set === void 0 ? void 0 : set.values()) || []), ...(value !== undefined ? [value] : [])]);
}

class Manifest {
  constructor(version) {
    var _version$schemaVersio, _version$semanticVers;

    _defineProperty(this, "allEntries", void 0);

    _defineProperty(this, "defaultEntries", void 0);

    _defineProperty(this, "policySpecificEntries", void 0);

    _defineProperty(this, "version", void 0);

    this.allEntries = new Map();
    this.defaultEntries = new Map();
    this.policySpecificEntries = new Map();
    const decodedVersion = {
      schemaVersion: (_version$schemaVersio = version === null || version === void 0 ? void 0 : version.schemaVersion) !== null && _version$schemaVersio !== void 0 ? _version$schemaVersio : 'v1',
      semanticVersion: (_version$semanticVers = version === null || version === void 0 ? void 0 : version.semanticVersion) !== null && _version$semanticVers !== void 0 ? _version$semanticVers : '1.0.0',
      soVersion: version === null || version === void 0 ? void 0 : version.soVersion
    };
    const [validated, errors] = (0, _common.validate)(decodedVersion, _manifest2.manifestVersion);

    if (errors != null || validated === null) {
      throw new Error(errors !== null && errors !== void 0 ? errors : 'Invalid version format.');
    }

    this.version = validated;
  }

  static getDefault(schemaVersion) {
    return new Manifest({
      schemaVersion,
      semanticVersion: '1.0.0'
    });
  }

  bumpSemanticVersion() {
    const newSemanticVersion = _semver.default.inc(this.getSemanticVersion(), 'patch');

    if (!_common2.semanticVersion.is(newSemanticVersion)) {
      throw new Error(`Invalid semver: ${newSemanticVersion}`);
    }

    this.version.semanticVersion = newSemanticVersion;
  }

  getSchemaVersion() {
    return this.version.schemaVersion;
  }

  getSavedObjectVersion() {
    return this.version.soVersion;
  }

  getSemanticVersion() {
    return this.version.semanticVersion;
  }

  addEntry(artifact, policyId) {
    const existingDescriptor = this.allEntries.get((0, _common3.getArtifactId)(artifact));
    const descriptor = {
      isDefaultEntry: (existingDescriptor === null || existingDescriptor === void 0 ? void 0 : existingDescriptor.isDefaultEntry) || policyId === undefined,
      specificTargetPolicies: addValueToSet(existingDescriptor === null || existingDescriptor === void 0 ? void 0 : existingDescriptor.specificTargetPolicies, policyId),
      entry: (existingDescriptor === null || existingDescriptor === void 0 ? void 0 : existingDescriptor.entry) || new _manifest_entry.ManifestEntry(artifact)
    };
    this.allEntries.set(descriptor.entry.getDocId(), descriptor);

    if (policyId) {
      const entries = this.policySpecificEntries.get(policyId) || new Map();
      entries.set(descriptor.entry.getDocId(), descriptor.entry);
      this.policySpecificEntries.set(policyId, entries);
    } else {
      this.defaultEntries.set(descriptor.entry.getDocId(), descriptor.entry);
    }
  }

  getAllArtifacts() {
    return [...this.allEntries.values()].map(descriptor => descriptor.entry.getArtifact());
  }

  getArtifact(artifactId) {
    var _this$allEntries$get;

    return (_this$allEntries$get = this.allEntries.get(artifactId)) === null || _this$allEntries$get === void 0 ? void 0 : _this$allEntries$get.entry.getArtifact();
  }

  containsArtifact(artifact) {
    return this.allEntries.has((0, _common3.getArtifactId)(artifact));
  }

  isDefaultArtifact(artifact) {
    var _this$allEntries$get2;

    return (_this$allEntries$get2 = this.allEntries.get((0, _common3.getArtifactId)(artifact))) === null || _this$allEntries$get2 === void 0 ? void 0 : _this$allEntries$get2.isDefaultEntry;
  }

  getArtifactTargetPolicies(artifact) {
    var _this$allEntries$get3;

    return (_this$allEntries$get3 = this.allEntries.get((0, _common3.getArtifactId)(artifact))) === null || _this$allEntries$get3 === void 0 ? void 0 : _this$allEntries$get3.specificTargetPolicies;
  }

  diff(manifest) {
    const diff = {
      additions: [],
      removals: [],
      transitions: []
    };

    for (const artifact of manifest.getAllArtifacts()) {
      if (!this.containsArtifact(artifact)) {
        diff.removals.push(artifact);
      } else if (this.isDefaultArtifact(artifact) !== manifest.isDefaultArtifact(artifact) || !(0, _lodash.isEqual)(this.getArtifactTargetPolicies(artifact), manifest.getArtifactTargetPolicies(artifact))) {
        diff.transitions.push(artifact);
      }
    }

    for (const artifact of this.getAllArtifacts()) {
      if (!manifest.containsArtifact(artifact)) {
        diff.additions.push(artifact);
      }
    }

    return diff;
  }

  toPackagePolicyManifest(policyId) {
    const entries = !!policyId && this.policySpecificEntries.get(policyId) || this.defaultEntries;
    const manifestObj = {
      manifest_version: this.getSemanticVersion(),
      schema_version: this.getSchemaVersion(),
      artifacts: {}
    };

    for (const entry of entries.values()) {
      manifestObj.artifacts[entry.getIdentifier()] = entry.getRecord();
    }

    const [validated, errors] = (0, _common.validate)(manifestObj, _manifest.manifestSchema);

    if (errors != null) {
      throw new Error(errors);
    }

    return validated;
  }

  toSavedObject() {
    return {
      artifacts: [...createInternalManifestEntries([...this.defaultEntries.keys()]), ...(0, _lodash.flatMap)([...this.policySpecificEntries.keys()], policyId => {
        var _this$policySpecificE;

        return createInternalManifestEntries([...(((_this$policySpecificE = this.policySpecificEntries.get(policyId)) === null || _this$policySpecificE === void 0 ? void 0 : _this$policySpecificE.keys()) || [])], policyId);
      })],
      schemaVersion: this.getSchemaVersion(),
      semanticVersion: this.getSemanticVersion()
    };
  }

}

exports.Manifest = Manifest;