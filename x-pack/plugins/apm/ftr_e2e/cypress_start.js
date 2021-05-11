"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cypressRunTests = cypressRunTests;
exports.cypressOpenTests = cypressOpenTests;

var _url = _interopRequireDefault(require("url"));

var _cypress = _interopRequireDefault(require("cypress"));

var _archives_metadata = _interopRequireDefault(require("./cypress/fixtures/es_archiver/archives_metadata"));

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


async function cypressRunTests({
  getService
}) {
  await cypressStart(getService, _cypress.default.run);
}

async function cypressOpenTests({
  getService
}) {
  await cypressStart(getService, _cypress.default.open);
}

async function cypressStart(getService, cypressExecution) {
  const config = getService('config');
  const esArchiver = getService('esArchiver');
  const archiveName = 'apm_8.0.0'; // Load apm data on ES

  await esArchiver.load(archiveName);
  const {
    start,
    end
  } = _archives_metadata.default[archiveName];
  await cypressExecution({
    config: {
      baseUrl: _url.default.format(config.get('servers.kibana'))
    },
    env: {
      START_DATE: start,
      END_DATE: end
    }
  });
}