"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esArchiverResetKibana = exports.esArchiverUnload = exports.esArchiverLoad = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const esArchiverLoad = folder => {
  cy.exec(`node ../../../scripts/es_archiver load ${folder} --dir ../../test/security_solution_cypress/es_archives --config ../../../test/functional/config.js --es-url ${Cypress.env('ELASTICSEARCH_URL')} --kibana-url ${Cypress.config().baseUrl}`);
};

exports.esArchiverLoad = esArchiverLoad;

const esArchiverUnload = folder => {
  cy.exec(`node ../../../scripts/es_archiver unload ${folder} --dir ../../test/security_solution_cypress/es_archives --config ../../../test/functional/config.js --es-url ${Cypress.env('ELASTICSEARCH_URL')} --kibana-url ${Cypress.config().baseUrl}`);
};

exports.esArchiverUnload = esArchiverUnload;

const esArchiverResetKibana = () => {
  cy.exec(`node ../../../scripts/es_archiver empty-kibana-index --config ../../../test/functional/config.js --es-url ${Cypress.env('ELASTICSEARCH_URL')} --kibana-url ${Cypress.config().baseUrl}`, {
    failOnNonZeroExit: false
  });
};

exports.esArchiverResetKibana = esArchiverResetKibana;