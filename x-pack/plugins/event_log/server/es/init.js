"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeEs = initializeEs;

var _documents = require("./documents");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function initializeEs(esContext) {
  esContext.logger.debug('initializing elasticsearch resources starting');

  try {
    await initializeEsResources(esContext);
  } catch (err) {
    esContext.logger.error(`error initializing elasticsearch resources: ${err.message}`);
    return false;
  }

  esContext.logger.debug('initializing elasticsearch resources complete');
  return true;
}

async function initializeEsResources(esContext) {
  const steps = new EsInitializationSteps(esContext);
  await steps.createIlmPolicyIfNotExists();
  await steps.createIndexTemplateIfNotExists();
  await steps.createInitialIndexIfNotExists();
}

class EsInitializationSteps {
  constructor(esContext) {
    this.esContext = esContext;
    this.esContext = esContext;
  }

  async createIlmPolicyIfNotExists() {
    const exists = await this.esContext.esAdapter.doesIlmPolicyExist(this.esContext.esNames.ilmPolicy);

    if (!exists) {
      await this.esContext.esAdapter.createIlmPolicy(this.esContext.esNames.ilmPolicy, (0, _documents.getIlmPolicy)());
    }
  }

  async createIndexTemplateIfNotExists() {
    const exists = await this.esContext.esAdapter.doesIndexTemplateExist(this.esContext.esNames.indexTemplate);

    if (!exists) {
      const templateBody = (0, _documents.getIndexTemplate)(this.esContext.esNames);
      await this.esContext.esAdapter.createIndexTemplate(this.esContext.esNames.indexTemplate, templateBody);
    }
  }

  async createInitialIndexIfNotExists() {
    const exists = await this.esContext.esAdapter.doesAliasExist(this.esContext.esNames.alias);

    if (!exists) {
      await this.esContext.esAdapter.createIndex(this.esContext.esNames.initialIndex, {
        aliases: {
          [this.esContext.esNames.alias]: {
            is_write_index: true
          }
        }
      });
    }
  }

}