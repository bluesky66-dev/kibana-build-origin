"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.packagePolicyService = void 0;

var _uuid = _interopRequireDefault(require("uuid"));

var _common = require("../../common");

var _constants = require("../constants");

var _errors = require("../errors");

var _types = require("../types");

var _agent_policy = require("./agent_policy");

var _output = require("./output");

var Registry = _interopRequireWildcard(require("./epm/registry"));

var _packages = require("./epm/packages");

var _assets = require("./epm/packages/assets");

var _agent = require("./epm/agent/agent");

var _saved_object = require("./saved_object");

var _ = require(".");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const SAVED_OBJECT_TYPE = _constants.PACKAGE_POLICY_SAVED_OBJECT_TYPE;

function getDataset(st) {
  return st.split('.')[1];
}

class PackagePolicyService {
  async create(soClient, esClient, callCluster, packagePolicy, options) {
    var _packagePolicy$packag, _options$user$usernam, _options$user, _options$user$usernam2, _options$user2, _options$bumpRevision; // Check that its agent policy does not have a package policy with the same name


    const parentAgentPolicy = await _agent_policy.agentPolicyService.get(soClient, packagePolicy.policy_id);

    if (!parentAgentPolicy) {
      throw new Error('Agent policy not found');
    }

    if (parentAgentPolicy.is_managed) {
      throw new _errors.IngestManagerError(`Cannot add integrations to managed policy ${parentAgentPolicy.id}`);
    }

    if (parentAgentPolicy.package_policies.find(siblingPackagePolicy => siblingPackagePolicy.name === packagePolicy.name)) {
      throw new Error('There is already a package with the same name on this agent policy');
    } // Add ids to stream


    const packagePolicyId = (options === null || options === void 0 ? void 0 : options.id) || _uuid.default.v4();

    let inputs = packagePolicy.inputs.map(input => assignStreamIdToInput(packagePolicyId, input)); // Make sure the associated package is installed

    if ((_packagePolicy$packag = packagePolicy.package) !== null && _packagePolicy$packag !== void 0 && _packagePolicy$packag.name) {
      const [, pkgInfo] = await Promise.all([(0, _packages.ensureInstalledPackage)({
        savedObjectsClient: soClient,
        pkgName: packagePolicy.package.name,
        callCluster
      }), (0, _packages.getPackageInfo)({
        savedObjectsClient: soClient,
        pkgName: packagePolicy.package.name,
        pkgVersion: packagePolicy.package.version
      })]); // Check if it is a limited package, and if so, check that the corresponding agent policy does not
      // already contain a package policy for this package

      if ((0, _common.isPackageLimited)(pkgInfo)) {
        const agentPolicy = await _agent_policy.agentPolicyService.get(soClient, packagePolicy.policy_id, true);

        if (agentPolicy && (0, _common.doesAgentPolicyAlreadyIncludePackage)(agentPolicy, pkgInfo.name)) {
          throw new Error(`Unable to create package policy. Package '${pkgInfo.name}' already exists on this agent policy.`);
        }
      }

      inputs = await this.compilePackagePolicyInputs(pkgInfo, inputs);
    }

    const isoDate = new Date().toISOString();
    const newSo = await soClient.create(SAVED_OBJECT_TYPE, { ...packagePolicy,
      inputs,
      revision: 1,
      created_at: isoDate,
      created_by: (_options$user$usernam = options === null || options === void 0 ? void 0 : (_options$user = options.user) === null || _options$user === void 0 ? void 0 : _options$user.username) !== null && _options$user$usernam !== void 0 ? _options$user$usernam : 'system',
      updated_at: isoDate,
      updated_by: (_options$user$usernam2 = options === null || options === void 0 ? void 0 : (_options$user2 = options.user) === null || _options$user2 === void 0 ? void 0 : _options$user2.username) !== null && _options$user$usernam2 !== void 0 ? _options$user$usernam2 : 'system'
    }, { ...options,
      id: packagePolicyId
    }); // Assign it to the given agent policy

    await _agent_policy.agentPolicyService.assignPackagePolicies(soClient, esClient, packagePolicy.policy_id, [newSo.id], {
      user: options === null || options === void 0 ? void 0 : options.user,
      bumpRevision: (_options$bumpRevision = options === null || options === void 0 ? void 0 : options.bumpRevision) !== null && _options$bumpRevision !== void 0 ? _options$bumpRevision : true
    });
    return {
      id: newSo.id,
      version: newSo.version,
      ...newSo.attributes
    };
  }

  async bulkCreate(soClient, esClient, packagePolicies, agentPolicyId, options) {
    var _options$bumpRevision2;

    const isoDate = new Date().toISOString(); // eslint-disable-next-line @typescript-eslint/naming-convention

    const {
      saved_objects
    } = await soClient.bulkCreate(packagePolicies.map(packagePolicy => {
      var _options$user$usernam3, _options$user3, _options$user$usernam4, _options$user4;

      const packagePolicyId = _uuid.default.v4();

      const inputs = packagePolicy.inputs.map(input => assignStreamIdToInput(packagePolicyId, input));
      return {
        type: SAVED_OBJECT_TYPE,
        id: packagePolicyId,
        attributes: { ...packagePolicy,
          inputs,
          policy_id: agentPolicyId,
          revision: 1,
          created_at: isoDate,
          created_by: (_options$user$usernam3 = options === null || options === void 0 ? void 0 : (_options$user3 = options.user) === null || _options$user3 === void 0 ? void 0 : _options$user3.username) !== null && _options$user$usernam3 !== void 0 ? _options$user$usernam3 : 'system',
          updated_at: isoDate,
          updated_by: (_options$user$usernam4 = options === null || options === void 0 ? void 0 : (_options$user4 = options.user) === null || _options$user4 === void 0 ? void 0 : _options$user4.username) !== null && _options$user$usernam4 !== void 0 ? _options$user$usernam4 : 'system'
        }
      };
    })); // Filter out invalid SOs

    const newSos = saved_objects.filter(so => !so.error && so.attributes); // Assign it to the given agent policy

    await _agent_policy.agentPolicyService.assignPackagePolicies(soClient, esClient, agentPolicyId, newSos.map(newSo => newSo.id), {
      user: options === null || options === void 0 ? void 0 : options.user,
      bumpRevision: (_options$bumpRevision2 = options === null || options === void 0 ? void 0 : options.bumpRevision) !== null && _options$bumpRevision2 !== void 0 ? _options$bumpRevision2 : true
    });
    return newSos.map(newSo => ({
      id: newSo.id,
      version: newSo.version,
      ...newSo.attributes
    }));
  }

  async get(soClient, id) {
    const packagePolicySO = await soClient.get(SAVED_OBJECT_TYPE, id);

    if (!packagePolicySO) {
      return null;
    }

    if (packagePolicySO.error) {
      throw new Error(packagePolicySO.error.message);
    }

    return {
      id: packagePolicySO.id,
      version: packagePolicySO.version,
      ...packagePolicySO.attributes
    };
  }

  async getByIDs(soClient, ids) {
    const packagePolicySO = await soClient.bulkGet(ids.map(id => ({
      id,
      type: SAVED_OBJECT_TYPE
    })));

    if (!packagePolicySO) {
      return null;
    }

    return packagePolicySO.saved_objects.map(so => ({
      id: so.id,
      version: so.version,
      ...so.attributes
    }));
  }

  async list(soClient, options) {
    const {
      page = 1,
      perPage = 20,
      sortField = 'updated_at',
      sortOrder = 'desc',
      kuery
    } = options;
    const packagePolicies = await soClient.find({
      type: SAVED_OBJECT_TYPE,
      sortField,
      sortOrder,
      page,
      perPage,
      filter: kuery ? (0, _saved_object.normalizeKuery)(SAVED_OBJECT_TYPE, kuery) : undefined
    });
    return {
      items: packagePolicies.saved_objects.map(packagePolicySO => ({
        id: packagePolicySO.id,
        version: packagePolicySO.version,
        ...packagePolicySO.attributes
      })),
      total: packagePolicies.total,
      page,
      perPage
    };
  }

  async listIds(soClient, options) {
    const {
      page = 1,
      perPage = 20,
      sortField = 'updated_at',
      sortOrder = 'desc',
      kuery
    } = options;
    const packagePolicies = await soClient.find({
      type: SAVED_OBJECT_TYPE,
      sortField,
      sortOrder,
      page,
      perPage,
      fields: [],
      filter: kuery ? (0, _saved_object.normalizeKuery)(SAVED_OBJECT_TYPE, kuery) : undefined
    });
    return {
      items: packagePolicies.saved_objects.map(packagePolicySO => packagePolicySO.id),
      total: packagePolicies.total,
      page,
      perPage
    };
  }

  async update(soClient, esClient, id, packagePolicy, options) {
    var _packagePolicy$packag2, _options$user$usernam5, _options$user5;

    const oldPackagePolicy = await this.get(soClient, id);
    const {
      version,
      ...restOfPackagePolicy
    } = packagePolicy;

    if (!oldPackagePolicy) {
      throw new Error('Package policy not found');
    } // Check that its agent policy does not have a package policy with the same name


    const parentAgentPolicy = await _agent_policy.agentPolicyService.get(soClient, packagePolicy.policy_id);

    if (!parentAgentPolicy) {
      throw new Error('Agent policy not found');
    } else {
      if (parentAgentPolicy.is_managed) {
        throw new _errors.IngestManagerError(`Cannot update integrations of managed policy ${id}`);
      }

      if (parentAgentPolicy.package_policies.find(siblingPackagePolicy => siblingPackagePolicy.id !== id && siblingPackagePolicy.name === packagePolicy.name)) {
        throw new Error('There is already a package with the same name on this agent policy');
      }
    }

    let inputs = restOfPackagePolicy.inputs.map(input => assignStreamIdToInput(oldPackagePolicy.id, input));

    if ((_packagePolicy$packag2 = packagePolicy.package) !== null && _packagePolicy$packag2 !== void 0 && _packagePolicy$packag2.name) {
      const pkgInfo = await (0, _packages.getPackageInfo)({
        savedObjectsClient: soClient,
        pkgName: packagePolicy.package.name,
        pkgVersion: packagePolicy.package.version
      });
      inputs = await this.compilePackagePolicyInputs(pkgInfo, inputs);
    }

    await soClient.update(SAVED_OBJECT_TYPE, id, { ...restOfPackagePolicy,
      inputs,
      revision: oldPackagePolicy.revision + 1,
      updated_at: new Date().toISOString(),
      updated_by: (_options$user$usernam5 = options === null || options === void 0 ? void 0 : (_options$user5 = options.user) === null || _options$user5 === void 0 ? void 0 : _options$user5.username) !== null && _options$user$usernam5 !== void 0 ? _options$user$usernam5 : 'system'
    }, {
      version
    }); // Bump revision of associated agent policy

    await _agent_policy.agentPolicyService.bumpRevision(soClient, esClient, packagePolicy.policy_id, {
      user: options === null || options === void 0 ? void 0 : options.user
    });
    return await this.get(soClient, id);
  }

  async delete(soClient, esClient, ids, options) {
    const result = [];

    for (const id of ids) {
      try {
        const packagePolicy = await this.get(soClient, id);

        if (!packagePolicy) {
          throw new Error('Package policy not found');
        }

        if (!(options !== null && options !== void 0 && options.skipUnassignFromAgentPolicies)) {
          await _agent_policy.agentPolicyService.unassignPackagePolicies(soClient, esClient, packagePolicy.policy_id, [packagePolicy.id], {
            user: options === null || options === void 0 ? void 0 : options.user
          });
        }

        await soClient.delete(SAVED_OBJECT_TYPE, id);
        result.push({
          id,
          name: packagePolicy.name,
          success: true
        });
      } catch (error) {
        result.push({
          id,
          success: false,
          ...(0, _errors.ingestErrorToResponseOptions)(error)
        });
      }
    }

    return result;
  }

  async buildPackagePolicyFromPackage(soClient, pkgName) {
    const pkgInstall = await (0, _packages.getInstallation)({
      savedObjectsClient: soClient,
      pkgName
    });

    if (pkgInstall) {
      const [pkgInfo, defaultOutputId] = await Promise.all([(0, _packages.getPackageInfo)({
        savedObjectsClient: soClient,
        pkgName: pkgInstall.name,
        pkgVersion: pkgInstall.version
      }), _output.outputService.getDefaultOutputId(soClient)]);

      if (pkgInfo) {
        if (!defaultOutputId) {
          throw new Error('Default output is not set');
        }

        return (0, _common.packageToPackagePolicy)(pkgInfo, '', defaultOutputId);
      }
    }
  }

  async compilePackagePolicyInputs(pkgInfo, inputs) {
    const registryPkgInfo = await Registry.fetchInfo(pkgInfo.name, pkgInfo.version);
    const inputsPromises = inputs.map(async input => {
      const compiledInput = await _compilePackagePolicyInput(registryPkgInfo, pkgInfo, input);
      const compiledStreams = await _compilePackageStreams(registryPkgInfo, pkgInfo, input);
      return { ...input,
        compiled_input: compiledInput,
        streams: compiledStreams
      };
    });
    return Promise.all(inputsPromises);
  }

  async runExternalCallbacks(externalCallbackType, newPackagePolicy, context, request) {
    let newData = newPackagePolicy;

    const externalCallbacks = _.appContextService.getExternalCallbacks(externalCallbackType);

    if (externalCallbacks && externalCallbacks.size > 0) {
      let updatedNewData = newData;

      for (const callback of externalCallbacks) {
        const result = await callback(updatedNewData, context, request);

        if (externalCallbackType === 'packagePolicyCreate') {
          updatedNewData = _types.NewPackagePolicySchema.validate(result);
        } else if (externalCallbackType === 'packagePolicyUpdate') {
          updatedNewData = _types.UpdatePackagePolicySchema.validate(result);
        }
      }

      newData = updatedNewData;
    }

    return newData;
  }

}

function assignStreamIdToInput(packagePolicyId, input) {
  return { ...input,
    streams: input.streams.map(stream => {
      return { ...stream,
        id: `${input.type}-${stream.data_stream.dataset}-${packagePolicyId}`
      };
    })
  };
}

async function _compilePackagePolicyInput(registryPkgInfo, pkgInfo, input) {
  var _ref, _pkgInfo$policy_templ, _pkgInfo$policy_templ2, _pkgInfo$policy_templ3;

  if ((_ref = !input.enabled || !((_pkgInfo$policy_templ = pkgInfo.policy_templates) !== null && _pkgInfo$policy_templ !== void 0 && (_pkgInfo$policy_templ2 = _pkgInfo$policy_templ[0]) !== null && _pkgInfo$policy_templ2 !== void 0 && (_pkgInfo$policy_templ3 = _pkgInfo$policy_templ2.inputs) !== null && _pkgInfo$policy_templ3 !== void 0 && _pkgInfo$policy_templ3.length)) !== null && _ref !== void 0 ? _ref : 0 > 0) {
    return undefined;
  }

  const packageInputs = pkgInfo.policy_templates[0].inputs;
  const packageInput = packageInputs.find(pkgInput => pkgInput.type === input.type);

  if (!packageInput) {
    throw new Error(`Input template not found, unable to find input type ${input.type}`);
  }

  if (!packageInput.template_path) {
    return undefined;
  }

  const [pkgInputTemplate] = await (0, _assets.getAssetsData)(registryPkgInfo, path => path.endsWith(`/agent/input/${packageInput.template_path}`));

  if (!pkgInputTemplate || !pkgInputTemplate.buffer) {
    throw new Error(`Unable to load input template at /agent/input/${packageInput.template_path}`);
  }

  return (0, _agent.compileTemplate)( // Populate template variables from input vars
  Object.assign({}, input.vars), pkgInputTemplate.buffer.toString());
}

async function _compilePackageStreams(registryPkgInfo, pkgInfo, input) {
  const streamsPromises = input.streams.map(stream => _compilePackageStream(registryPkgInfo, pkgInfo, input, stream));
  return await Promise.all(streamsPromises);
}

async function _compilePackageStream(registryPkgInfo, pkgInfo, input, stream) {
  if (!stream.enabled) {
    return { ...stream,
      compiled_stream: undefined
    };
  }

  const datasetPath = getDataset(stream.data_stream.dataset);
  const packageDataStreams = pkgInfo.data_streams;

  if (!packageDataStreams) {
    throw new Error('Stream template not found, no data streams');
  }

  const packageDataStream = packageDataStreams.find(pkgDataStream => pkgDataStream.dataset === stream.data_stream.dataset);

  if (!packageDataStream) {
    throw new Error(`Stream template not found, unable to find dataset ${datasetPath}`);
  }

  const streamFromPkg = (packageDataStream.streams || []).find(pkgStream => pkgStream.input === input.type);

  if (!streamFromPkg) {
    throw new Error(`Stream template not found, unable to find stream for input ${input.type}`);
  }

  if (!streamFromPkg.template_path) {
    throw new Error(`Stream template path not found for dataset ${datasetPath}`);
  }

  const [pkgStreamTemplate] = await (0, _assets.getAssetsData)(registryPkgInfo, path => path.endsWith(streamFromPkg.template_path), datasetPath);

  if (!pkgStreamTemplate || !pkgStreamTemplate.buffer) {
    throw new Error(`Unable to load stream template ${streamFromPkg.template_path} for dataset ${datasetPath}`);
  }

  const yaml = (0, _agent.compileTemplate)( // Populate template variables from input vars and stream vars
  Object.assign({}, input.vars, stream.vars), pkgStreamTemplate.buffer.toString());
  stream.compiled_stream = yaml;
  return { ...stream
  };
}

const packagePolicyService = new PackagePolicyService();
exports.packagePolicyService = packagePolicyService;