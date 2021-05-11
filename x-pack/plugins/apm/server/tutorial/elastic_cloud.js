"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createElasticCloudInstructions = createElasticCloudInstructions;

var _i18n = require("@kbn/i18n");

var _server = require("../../../../../src/plugins/home/server");

var _server2 = require("../../../../../src/plugins/apm_oss/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createElasticCloudInstructions(cloudSetup) {
  const apmServerUrl = cloudSetup === null || cloudSetup === void 0 ? void 0 : cloudSetup.apm.url;
  const instructionSets = [];

  if (!apmServerUrl) {
    instructionSets.push(getApmServerInstructionSet(cloudSetup));
  }

  instructionSets.push(getApmAgentInstructionSet(cloudSetup));
  return {
    instructionSets
  };
}

function getApmServerInstructionSet(cloudSetup) {
  const cloudId = cloudSetup === null || cloudSetup === void 0 ? void 0 : cloudSetup.cloudId;
  return {
    title: _i18n.i18n.translate('xpack.apm.tutorial.apmServer.title', {
      defaultMessage: 'APM Server'
    }),
    instructionVariants: [{
      id: _server.INSTRUCTION_VARIANT.ESC,
      instructions: [{
        title: 'Enable the APM Server in the ESS console',
        textPre: _i18n.i18n.translate('xpack.apm.tutorial.elasticCloud.textPre', {
          defaultMessage: 'To enable the APM Server go to [the Elastic Cloud console](https://cloud.elastic.co/deployments?q={cloudId}) and enable APM in the deployment settings. Once enabled, refresh this page.',
          values: {
            cloudId
          }
        })
      }]
    }]
  };
}

function getApmAgentInstructionSet(cloudSetup) {
  const apmServerUrl = cloudSetup === null || cloudSetup === void 0 ? void 0 : cloudSetup.apm.url;
  const secretToken = cloudSetup === null || cloudSetup === void 0 ? void 0 : cloudSetup.apm.secretToken;
  return {
    title: _i18n.i18n.translate('xpack.apm.tutorial.elasticCloudInstructions.title', {
      defaultMessage: 'APM Agents'
    }),
    instructionVariants: [{
      id: _server.INSTRUCTION_VARIANT.NODE,
      instructions: (0, _server2.createNodeAgentInstructions)(apmServerUrl, secretToken)
    }, {
      id: _server.INSTRUCTION_VARIANT.DJANGO,
      instructions: (0, _server2.createDjangoAgentInstructions)(apmServerUrl, secretToken)
    }, {
      id: _server.INSTRUCTION_VARIANT.FLASK,
      instructions: (0, _server2.createFlaskAgentInstructions)(apmServerUrl, secretToken)
    }, {
      id: _server.INSTRUCTION_VARIANT.RAILS,
      instructions: (0, _server2.createRailsAgentInstructions)(apmServerUrl, secretToken)
    }, {
      id: _server.INSTRUCTION_VARIANT.RACK,
      instructions: (0, _server2.createRackAgentInstructions)(apmServerUrl, secretToken)
    }, {
      id: _server.INSTRUCTION_VARIANT.JS,
      instructions: (0, _server2.createJsAgentInstructions)(apmServerUrl)
    }, {
      id: _server.INSTRUCTION_VARIANT.GO,
      instructions: (0, _server2.createGoAgentInstructions)(apmServerUrl, secretToken)
    }, {
      id: _server.INSTRUCTION_VARIANT.JAVA,
      instructions: (0, _server2.createJavaAgentInstructions)(apmServerUrl, secretToken)
    }, {
      id: _server.INSTRUCTION_VARIANT.DOTNET,
      instructions: (0, _server2.createDotNetAgentInstructions)(apmServerUrl, secretToken)
    }, {
      id: _server.INSTRUCTION_VARIANT.PHP,
      instructions: (0, _server2.createPhpAgentInstructions)(apmServerUrl, secretToken)
    }]
  };
}