"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onPremInstructions = onPremInstructions;

var _i18n = require("@kbn/i18n");

var _server = require("../../../../../../src/plugins/home/server");

var _apm_server_instructions = require("../instructions/apm_server_instructions");

var _apm_agent_instructions = require("../instructions/apm_agent_instructions");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function onPremInstructions({
  errorIndices,
  transactionIndices,
  metricsIndices,
  sourcemapIndices,
  onboardingIndices
}) {
  const EDIT_CONFIG = (0, _apm_server_instructions.createEditConfig)();
  const START_SERVER_UNIX = (0, _apm_server_instructions.createStartServerUnix)();
  const START_SERVER_UNIX_SYSV = (0, _apm_server_instructions.createStartServerUnixSysv)();
  return {
    instructionSets: [{
      title: _i18n.i18n.translate('apmOss.tutorial.apmServer.title', {
        defaultMessage: 'APM Server'
      }),
      callOut: {
        title: _i18n.i18n.translate('apmOss.tutorial.apmServer.callOut.title', {
          defaultMessage: 'Important: Updating to 7.0 or higher'
        }),
        message: _i18n.i18n.translate('apmOss.tutorial.apmServer.callOut.message', {
          defaultMessage: `Please make sure your APM Server is updated to 7.0 or higher. \
            You can also migrate your 6.x data with the migration assistant found in Kibana's management section.`
        }),
        iconType: 'alert'
      },
      instructionVariants: [{
        id: _server.INSTRUCTION_VARIANT.OSX,
        instructions: [(0, _apm_server_instructions.createDownloadServerOsx)(), EDIT_CONFIG, START_SERVER_UNIX]
      }, {
        id: _server.INSTRUCTION_VARIANT.DEB,
        instructions: [(0, _apm_server_instructions.createDownloadServerDeb)(), EDIT_CONFIG, START_SERVER_UNIX_SYSV]
      }, {
        id: _server.INSTRUCTION_VARIANT.RPM,
        instructions: [(0, _apm_server_instructions.createDownloadServerRpm)(), EDIT_CONFIG, START_SERVER_UNIX_SYSV]
      }, {
        id: _server.INSTRUCTION_VARIANT.WINDOWS,
        instructions: (0, _apm_server_instructions.createWindowsServerInstructions)()
      }],
      statusCheck: {
        title: _i18n.i18n.translate('apmOss.tutorial.apmServer.statusCheck.title', {
          defaultMessage: 'APM Server status'
        }),
        text: _i18n.i18n.translate('apmOss.tutorial.apmServer.statusCheck.text', {
          defaultMessage: 'Make sure APM Server is running before you start implementing the APM agents.'
        }),
        btnLabel: _i18n.i18n.translate('apmOss.tutorial.apmServer.statusCheck.btnLabel', {
          defaultMessage: 'Check APM Server status'
        }),
        success: _i18n.i18n.translate('apmOss.tutorial.apmServer.statusCheck.successMessage', {
          defaultMessage: 'You have correctly setup APM Server'
        }),
        error: _i18n.i18n.translate('apmOss.tutorial.apmServer.statusCheck.errorMessage', {
          defaultMessage: 'No APM Server detected. Please make sure it is running and you have updated to 7.0 or higher.'
        }),
        esHitsCheck: {
          index: onboardingIndices,
          query: {
            bool: {
              filter: [{
                term: {
                  'processor.event': 'onboarding'
                }
              }, {
                range: {
                  'observer.version_major': {
                    gte: 7
                  }
                }
              }]
            }
          }
        }
      }
    }, {
      title: _i18n.i18n.translate('apmOss.tutorial.apmAgents.title', {
        defaultMessage: 'APM Agents'
      }),
      instructionVariants: [{
        id: _server.INSTRUCTION_VARIANT.JAVA,
        instructions: (0, _apm_agent_instructions.createJavaAgentInstructions)()
      }, {
        id: _server.INSTRUCTION_VARIANT.JS,
        instructions: (0, _apm_agent_instructions.createJsAgentInstructions)()
      }, {
        id: _server.INSTRUCTION_VARIANT.NODE,
        instructions: (0, _apm_agent_instructions.createNodeAgentInstructions)()
      }, {
        id: _server.INSTRUCTION_VARIANT.DJANGO,
        instructions: (0, _apm_agent_instructions.createDjangoAgentInstructions)()
      }, {
        id: _server.INSTRUCTION_VARIANT.FLASK,
        instructions: (0, _apm_agent_instructions.createFlaskAgentInstructions)()
      }, {
        id: _server.INSTRUCTION_VARIANT.RAILS,
        instructions: (0, _apm_agent_instructions.createRailsAgentInstructions)()
      }, {
        id: _server.INSTRUCTION_VARIANT.RACK,
        instructions: (0, _apm_agent_instructions.createRackAgentInstructions)()
      }, {
        id: _server.INSTRUCTION_VARIANT.GO,
        instructions: (0, _apm_agent_instructions.createGoAgentInstructions)()
      }, {
        id: _server.INSTRUCTION_VARIANT.DOTNET,
        instructions: (0, _apm_agent_instructions.createDotNetAgentInstructions)()
      }, {
        id: _server.INSTRUCTION_VARIANT.PHP,
        instructions: (0, _apm_agent_instructions.createPhpAgentInstructions)()
      }],
      statusCheck: {
        title: _i18n.i18n.translate('apmOss.tutorial.apmAgents.statusCheck.title', {
          defaultMessage: 'Agent status'
        }),
        text: _i18n.i18n.translate('apmOss.tutorial.apmAgents.statusCheck.text', {
          defaultMessage: 'Make sure your application is running and the agents are sending data.'
        }),
        btnLabel: _i18n.i18n.translate('apmOss.tutorial.apmAgents.statusCheck.btnLabel', {
          defaultMessage: 'Check agent status'
        }),
        success: _i18n.i18n.translate('apmOss.tutorial.apmAgents.statusCheck.successMessage', {
          defaultMessage: 'Data successfully received from one or more agents'
        }),
        error: _i18n.i18n.translate('apmOss.tutorial.apmAgents.statusCheck.errorMessage', {
          defaultMessage: 'No data has been received from agents yet'
        }),
        esHitsCheck: {
          index: [errorIndices, transactionIndices, metricsIndices, sourcemapIndices],
          query: {
            bool: {
              filter: [{
                terms: {
                  'processor.event': ['error', 'transaction', 'metric', 'sourcemap']
                }
              }, {
                range: {
                  'observer.version_major': {
                    gte: 7
                  }
                }
              }]
            }
          }
        }
      }
    }]
  };
}