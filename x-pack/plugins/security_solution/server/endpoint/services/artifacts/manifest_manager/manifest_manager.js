"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ManifestManager = void 0;

var _semver = _interopRequireDefault(require("semver"));

var _lodash = require("lodash");

var _manifest = require("../../../../../common/endpoint/schema/manifest");

var _artifacts = require("../../../lib/artifacts");

var _artifacts2 = require("../../../schemas/artifacts");

var _manifest_client = require("../manifest_client");

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

const iterateArtifactsBuildResult = async (result, callback) => {
  for (const artifact of result.defaultArtifacts) {
    await callback(artifact);
  }

  for (const policyId of Object.keys(result.policySpecificArtifacts)) {
    for (const artifact of result.policySpecificArtifacts[policyId]) {
      await callback(artifact, policyId);
    }
  }
};

const iterateAllListItems = async (pageSupplier, itemCallback) => {
  let paging = true;
  let page = 1;

  while (paging) {
    const {
      items,
      total
    } = await pageSupplier(page);

    for (const item of items) {
      await itemCallback(item);
    }

    paging = (page - 1) * 20 + items.length < total;
    page++;
  }
};

const getArtifactIds = manifest => [...Object.keys(manifest.artifacts)].map(key => `${key}-${manifest.artifacts[key].decoded_sha256}`);

const manifestsEqual = (manifest1, manifest2) => (0, _lodash.isEqual)(new Set(getArtifactIds(manifest1)), new Set(getArtifactIds(manifest2)));

class ManifestManager {
  constructor(context) {
    _defineProperty(this, "artifactClient", void 0);

    _defineProperty(this, "exceptionListClient", void 0);

    _defineProperty(this, "packagePolicyService", void 0);

    _defineProperty(this, "savedObjectsClient", void 0);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "cache", void 0);

    _defineProperty(this, "schemaVersion", void 0);

    this.artifactClient = context.artifactClient;
    this.exceptionListClient = context.exceptionListClient;
    this.packagePolicyService = context.packagePolicyService;
    this.savedObjectsClient = context.savedObjectsClient;
    this.logger = context.logger;
    this.cache = context.cache;
    this.schemaVersion = 'v1';
  }
  /**
   * Gets a ManifestClient for this manager's schemaVersion.
   *
   * @returns {ManifestClient} A ManifestClient scoped to the appropriate schemaVersion.
   */


  getManifestClient() {
    return new _manifest_client.ManifestClient(this.savedObjectsClient, this.schemaVersion);
  }
  /**
   * Builds an artifact (one per supported OS) based on the current
   * state of exception-list-agnostic SOs.
   */


  async buildExceptionListArtifact(os) {
    return (0, _artifacts.buildArtifact)(await (0, _artifacts.getEndpointExceptionList)(this.exceptionListClient, this.schemaVersion, os), this.schemaVersion, os, _artifacts.ArtifactConstants.GLOBAL_ALLOWLIST_NAME);
  }
  /**
   * Builds an array of artifacts (one per supported OS) based on the current
   * state of exception-list-agnostic SOs.
   *
   * @returns {Promise<InternalArtifactCompleteSchema[]>} An array of uncompressed artifacts built from exception-list-agnostic SOs.
   * @throws Throws/rejects if there are errors building the list.
   */


  async buildExceptionListArtifacts() {
    const defaultArtifacts = [];
    const policySpecificArtifacts = {};

    for (const os of _artifacts.ArtifactConstants.SUPPORTED_OPERATING_SYSTEMS) {
      defaultArtifacts.push(await this.buildExceptionListArtifact(os));
    }

    await iterateAllListItems(page => this.listEndpointPolicyIds(page), async policyId => {
      policySpecificArtifacts[policyId] = defaultArtifacts;
    });
    return {
      defaultArtifacts,
      policySpecificArtifacts
    };
  }
  /**
   * Builds an artifact (one per supported OS) based on the current state of the
   * Trusted Apps list (which uses the `exception-list-agnostic` SO type)
   */


  async buildTrustedAppsArtifact(os, policyId) {
    return (0, _artifacts.buildArtifact)(await (0, _artifacts.getEndpointTrustedAppsList)(this.exceptionListClient, this.schemaVersion, os, policyId), this.schemaVersion, os, _artifacts.ArtifactConstants.GLOBAL_TRUSTED_APPS_NAME);
  }
  /**
   * Builds an array of artifacts (one per supported OS) based on the current state of the
   * Trusted Apps list (which uses the `exception-list-agnostic` SO type)
   */


  async buildTrustedAppsArtifacts() {
    const defaultArtifacts = [];
    const policySpecificArtifacts = {};

    for (const os of _artifacts.ArtifactConstants.SUPPORTED_TRUSTED_APPS_OPERATING_SYSTEMS) {
      defaultArtifacts.push(await this.buildTrustedAppsArtifact(os));
    }

    await iterateAllListItems(page => this.listEndpointPolicyIds(page), async policyId => {
      for (const os of _artifacts.ArtifactConstants.SUPPORTED_TRUSTED_APPS_OPERATING_SYSTEMS) {
        policySpecificArtifacts[policyId] = policySpecificArtifacts[policyId] || [];
        policySpecificArtifacts[policyId].push(await this.buildTrustedAppsArtifact(os, policyId));
      }
    });
    return {
      defaultArtifacts,
      policySpecificArtifacts
    };
  }
  /**
   * Writes new artifact SO.
   *
   * @param artifact An InternalArtifactCompleteSchema representing the artifact.
   * @returns {Promise<Error | null>} An error, if encountered, or null.
   */


  async pushArtifact(artifact) {
    const artifactId = (0, _artifacts.getArtifactId)(artifact);

    try {
      // Write the artifact SO
      await this.artifactClient.createArtifact(artifact); // Cache the compressed body of the artifact

      this.cache.set(artifactId, Buffer.from(artifact.body, 'base64'));
    } catch (err) {
      if (this.savedObjectsClient.errors.isConflictError(err)) {
        this.logger.debug(`Tried to create artifact ${artifactId}, but it already exists.`);
      } else {
        return err;
      }
    }

    return null;
  }
  /**
   * Writes new artifact SOs.
   *
   * @param artifacts An InternalArtifactCompleteSchema array representing the artifacts.
   * @returns {Promise<Error[]>} Any errors encountered.
   */


  async pushArtifacts(artifacts) {
    const errors = [];

    for (const artifact of artifacts) {
      if (_artifacts2.internalArtifactCompleteSchema.is(artifact)) {
        const err = await this.pushArtifact(artifact);

        if (err) {
          errors.push(err);
        }
      } else {
        errors.push(new Error(`Incomplete artifact: ${(0, _artifacts.getArtifactId)(artifact)}`));
      }
    }

    return errors;
  }
  /**
   * Deletes outdated artifact SOs.
   *
   * The artifact may still remain in the cache.
   *
   * @param artifactIds The IDs of the artifact to delete..
   * @returns {Promise<Error[]>} Any errors encountered.
   */


  async deleteArtifacts(artifactIds) {
    const errors = [];

    for (const artifactId of artifactIds) {
      try {
        await this.artifactClient.deleteArtifact(artifactId);
        this.logger.info(`Cleaned up artifact ${artifactId}`);
      } catch (err) {
        errors.push(err);
      }
    }

    return errors;
  }
  /**
   * Returns the last computed manifest based on the state of the
   * user-artifact-manifest SO.
   *
   * @returns {Promise<Manifest | null>} The last computed manifest, or null if does not exist.
   * @throws Throws/rejects if there is an unexpected error retrieving the manifest.
   */


  async getLastComputedManifest() {
    try {
      const manifestSo = await this.getManifestClient().getManifest();

      if (manifestSo.version === undefined) {
        throw new Error('No version returned for manifest.');
      }

      const manifest = new _artifacts.Manifest({
        schemaVersion: this.schemaVersion,
        semanticVersion: manifestSo.attributes.semanticVersion,
        soVersion: manifestSo.version
      });

      for (const entry of manifestSo.attributes.artifacts) {
        manifest.addEntry((await this.artifactClient.getArtifact(entry.artifactId)).attributes, entry.policyId);
      }

      return manifest;
    } catch (error) {
      if (!error.output || error.output.statusCode !== 404) {
        throw error;
      }

      return null;
    }
  }
  /**
   * Builds a new manifest based on the current user exception list.
   *
   * @param baselineManifest A baseline manifest to use for initializing pre-existing artifacts.
   * @returns {Promise<Manifest>} A new Manifest object reprenting the current exception list.
   */


  async buildNewManifest(baselineManifest = _artifacts.Manifest.getDefault(this.schemaVersion)) {
    const results = await Promise.all([this.buildExceptionListArtifacts(), this.buildTrustedAppsArtifacts()]);
    const manifest = new _artifacts.Manifest({
      schemaVersion: this.schemaVersion,
      semanticVersion: baselineManifest.getSemanticVersion(),
      soVersion: baselineManifest.getSavedObjectVersion()
    });

    for (const result of results) {
      await iterateArtifactsBuildResult(result, async (artifact, policyId) => {
        let artifactToAdd = baselineManifest.getArtifact((0, _artifacts.getArtifactId)(artifact)) || artifact;

        if (!(0, _artifacts.isCompressed)(artifactToAdd)) {
          artifactToAdd = await (0, _artifacts.maybeCompressArtifact)(artifactToAdd);

          if (!(0, _artifacts.isCompressed)(artifactToAdd)) {
            throw new Error(`Unable to compress artifact: ${(0, _artifacts.getArtifactId)(artifactToAdd)}`);
          } else if (!_artifacts2.internalArtifactCompleteSchema.is(artifactToAdd)) {
            throw new Error(`Incomplete artifact detected: ${(0, _artifacts.getArtifactId)(artifactToAdd)}`);
          }
        }

        manifest.addEntry(artifactToAdd, policyId);
      });
    }

    return manifest;
  }
  /**
   * Dispatches the manifest by writing it to the endpoint package policy, if different
   * from the manifest already in the config.
   *
   * @param manifest The Manifest to dispatch.
   * @returns {Promise<Error[]>} Any errors encountered.
   */


  async tryDispatch(manifest) {
    const errors = [];
    await iterateAllListItems(page => this.listEndpointPolicies(page), async packagePolicy => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const {
        id,
        revision,
        updated_at,
        updated_by,
        ...newPackagePolicy
      } = packagePolicy;

      if (newPackagePolicy.inputs.length > 0 && newPackagePolicy.inputs[0].config !== undefined) {
        var _newPackagePolicy$inp;

        const oldManifest = (_newPackagePolicy$inp = newPackagePolicy.inputs[0].config.artifact_manifest) !== null && _newPackagePolicy$inp !== void 0 ? _newPackagePolicy$inp : {
          value: {}
        };
        const newManifestVersion = manifest.getSemanticVersion();

        if (_semver.default.gt(newManifestVersion, oldManifest.value.manifest_version)) {
          const serializedManifest = manifest.toPackagePolicyManifest(packagePolicy.id);

          if (!_manifest.manifestDispatchSchema.is(serializedManifest)) {
            errors.push(new Error(`Invalid manifest for policy ${packagePolicy.id}`));
          } else if (!manifestsEqual(serializedManifest, oldManifest.value)) {
            newPackagePolicy.inputs[0].config.artifact_manifest = {
              value: serializedManifest
            };

            try {
              await this.packagePolicyService.update(this.savedObjectsClient, // @ts-ignore
              undefined, id, newPackagePolicy);
              this.logger.debug(`Updated package policy ${id} with manifest version ${manifest.getSemanticVersion()}`);
            } catch (err) {
              errors.push(err);
            }
          } else {
            this.logger.debug(`No change in manifest content for package policy: ${id}. Staying on old version`);
          }
        } else {
          this.logger.debug(`No change in manifest version for package policy: ${id}`);
        }
      } else {
        errors.push(new Error(`Package Policy ${id} has no config.`));
      }
    });
    return errors;
  }
  /**
   * Commits a manifest to indicate that a new version has been computed.
   *
   * @param manifest The Manifest to commit.
   * @returns {Promise<Error | null>} An error, if encountered, or null.
   */


  async commit(manifest) {
    const manifestClient = this.getManifestClient(); // Commit the new manifest

    const manifestSo = manifest.toSavedObject();
    const version = manifest.getSavedObjectVersion();

    if (version == null) {
      await manifestClient.createManifest(manifestSo);
    } else {
      await manifestClient.updateManifest(manifestSo, {
        version
      });
    }

    this.logger.info(`Committed manifest ${manifest.getSemanticVersion()}`);
  }

  async listEndpointPolicies(page) {
    return this.packagePolicyService.list(this.savedObjectsClient, {
      page,
      perPage: 20,
      kuery: 'ingest-package-policies.package.name:endpoint'
    });
  }

  async listEndpointPolicyIds(page) {
    return this.packagePolicyService.listIds(this.savedObjectsClient, {
      page,
      perPage: 20,
      kuery: 'ingest-package-policies.package.name:endpoint'
    });
  }

}

exports.ManifestManager = ManifestManager;