"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storedPackagePoliciesToAgentInputs = void 0;

var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const storedPackagePoliciesToAgentInputs = packagePolicies => {
  const fullInputs = [];
  packagePolicies.forEach(packagePolicy => {
    if (!packagePolicy.enabled || !packagePolicy.inputs || !packagePolicy.inputs.length) {
      return;
    }

    packagePolicy.inputs.forEach(input => {
      if (!input.enabled) {
        return;
      }

      const fullInput = {
        id: packagePolicy.id || packagePolicy.name,
        revision: packagePolicy.revision,
        name: packagePolicy.name,
        type: input.type,
        data_stream: {
          namespace: packagePolicy.namespace || 'default'
        },
        use_output: _constants.DEFAULT_OUTPUT.name,
        ...Object.entries(input.config || {}).reduce((acc, [key, {
          value
        }]) => {
          acc[key] = value;
          return acc;
        }, {}),
        ...(input.compiled_input || {}),
        ...(input.streams.length ? {
          streams: input.streams.filter(stream => stream.enabled).map(stream => {
            const fullStream = {
              id: stream.id,
              data_stream: stream.data_stream,
              ...stream.compiled_stream,
              ...Object.entries(stream.config || {}).reduce((acc, [key, {
                value
              }]) => {
                acc[key] = value;
                return acc;
              }, {})
            };
            return fullStream;
          })
        } : {})
      };

      if (packagePolicy.package) {
        fullInput.meta = {
          package: {
            name: packagePolicy.package.name,
            version: packagePolicy.package.version
          }
        };
      }

      fullInputs.push(fullInput);
    });
  });
  return fullInputs;
};

exports.storedPackagePoliciesToAgentInputs = storedPackagePoliciesToAgentInputs;