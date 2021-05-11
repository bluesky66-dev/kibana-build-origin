"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.packageToPackagePolicy = exports.packageToPackagePolicyInputs = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getStreamsForInputType = (inputType, packageInfo) => {
  const streams = [];
  (packageInfo.data_streams || []).forEach(dataStream => {
    (dataStream.streams || []).forEach(stream => {
      if (stream.input === inputType) {
        streams.push({ ...stream,
          data_stream: {
            type: dataStream.type,
            dataset: dataStream.dataset
          }
        });
      }
    });
  });
  return streams;
};
/*
 * This service creates a package policy inputs definition from defaults provided in package info
 */


const packageToPackagePolicyInputs = packageInfo => {
  var _packagePolicyTemplat;

  const inputs = []; // Assume package will only ever ship one package policy template for now

  const packagePolicyTemplate = packageInfo.policy_templates && packageInfo.policy_templates[0] ? packageInfo.policy_templates[0] : null; // Create package policy input property

  if (packagePolicyTemplate !== null && packagePolicyTemplate !== void 0 && (_packagePolicyTemplat = packagePolicyTemplate.inputs) !== null && _packagePolicyTemplat !== void 0 && _packagePolicyTemplat.length) {
    // Map each package package policy input to agent policy package policy input
    packagePolicyTemplate.inputs.forEach(packageInput => {
      // Reduces registry var def into config object entry
      const varsReducer = (configObject, registryVar) => {
        const configEntry = {
          value: !registryVar.default && registryVar.multi ? [] : registryVar.default
        };

        if (registryVar.type) {
          configEntry.type = registryVar.type;
        }

        configObject[registryVar.name] = configEntry;
        return configObject;
      }; // Map each package input stream into package policy input stream


      const streams = getStreamsForInputType(packageInput.type, packageInfo).map(packageStream => {
        const stream = {
          enabled: packageStream.enabled === false ? false : true,
          data_stream: packageStream.data_stream
        };

        if (packageStream.vars && packageStream.vars.length) {
          stream.vars = packageStream.vars.reduce(varsReducer, {});
        }

        return stream;
      });
      const input = {
        type: packageInput.type,
        enabled: streams.length ? !!streams.find(stream => stream.enabled) : true,
        streams
      };

      if (packageInput.vars && packageInput.vars.length) {
        input.vars = packageInput.vars.reduce(varsReducer, {});
      }

      inputs.push(input);
    });
  }

  return inputs;
};
/**
 * Builds a `NewPackagePolicy` structure based on a package
 *
 * @param packageInfo
 * @param agentPolicyId
 * @param outputId
 * @param packagePolicyName
 */


exports.packageToPackagePolicyInputs = packageToPackagePolicyInputs;

const packageToPackagePolicy = (packageInfo, agentPolicyId, outputId, namespace = '', packagePolicyName, description) => {
  return {
    name: packagePolicyName || `${packageInfo.name}-1`,
    namespace,
    description,
    package: {
      name: packageInfo.name,
      title: packageInfo.title,
      version: packageInfo.version
    },
    enabled: true,
    policy_id: agentPolicyId,
    output_id: outputId,
    inputs: packageToPackagePolicyInputs(packageInfo)
  };
};

exports.packageToPackagePolicy = packageToPackagePolicy;