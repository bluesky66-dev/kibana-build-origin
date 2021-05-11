"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMigrations = getMigrations;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getMigrations(encryptedSavedObjects) {
  const migrationActionsTen = encryptedSavedObjects.createMigration(doc => {
    var _doc$attributes$confi;

    return ((_doc$attributes$confi = doc.attributes.config) === null || _doc$attributes$confi === void 0 ? void 0 : _doc$attributes$confi.hasOwnProperty('casesConfiguration')) || doc.attributes.actionTypeId === '.email';
  }, pipeMigrations(renameCasesConfigurationObject, addHasAuthConfigurationObject));
  const migrationActionsEleven = encryptedSavedObjects.createMigration(doc => {
    var _doc$attributes$confi2, _doc$attributes$confi3;

    return ((_doc$attributes$confi2 = doc.attributes.config) === null || _doc$attributes$confi2 === void 0 ? void 0 : _doc$attributes$confi2.hasOwnProperty('isCaseOwned')) || ((_doc$attributes$confi3 = doc.attributes.config) === null || _doc$attributes$confi3 === void 0 ? void 0 : _doc$attributes$confi3.hasOwnProperty('incidentConfiguration')) || doc.attributes.actionTypeId === '.webhook';
  }, pipeMigrations(removeCasesFieldMappings, addHasAuthConfigurationObject));
  return {
    '7.10.0': executeMigrationWithErrorHandling(migrationActionsTen, '7.10.0'),
    '7.11.0': executeMigrationWithErrorHandling(migrationActionsEleven, '7.11.0')
  };
}

function executeMigrationWithErrorHandling(migrationFunc, version) {
  return (doc, context) => {
    try {
      return migrationFunc(doc, context);
    } catch (ex) {
      context.log.error(`encryptedSavedObject ${version} migration failed for action ${doc.id} with error: ${ex.message}`, {
        actionDocument: doc
      });
    }

    return doc;
  };
}

function renameCasesConfigurationObject(doc) {
  var _doc$attributes$confi4;

  if (!((_doc$attributes$confi4 = doc.attributes.config) !== null && _doc$attributes$confi4 !== void 0 && _doc$attributes$confi4.casesConfiguration)) {
    return doc;
  }

  const {
    casesConfiguration,
    ...restConfiguration
  } = doc.attributes.config;
  return { ...doc,
    attributes: { ...doc.attributes,
      config: { ...restConfiguration,
        incidentConfiguration: casesConfiguration
      }
    }
  };
}

function removeCasesFieldMappings(doc) {
  var _doc$attributes$confi5, _doc$attributes$confi6;

  if (!((_doc$attributes$confi5 = doc.attributes.config) !== null && _doc$attributes$confi5 !== void 0 && _doc$attributes$confi5.hasOwnProperty('isCaseOwned')) && !((_doc$attributes$confi6 = doc.attributes.config) !== null && _doc$attributes$confi6 !== void 0 && _doc$attributes$confi6.hasOwnProperty('incidentConfiguration'))) {
    return doc;
  }

  const {
    incidentConfiguration,
    isCaseOwned,
    ...restConfiguration
  } = doc.attributes.config;
  return { ...doc,
    attributes: { ...doc.attributes,
      config: restConfiguration
    }
  };
}

const addHasAuthConfigurationObject = doc => {
  if (doc.attributes.actionTypeId !== '.email' && doc.attributes.actionTypeId !== '.webhook') {
    return doc;
  }

  const hasAuth = !!doc.attributes.secrets.user || !!doc.attributes.secrets.password;
  return { ...doc,
    attributes: { ...doc.attributes,
      config: { ...doc.attributes.config,
        hasAuth
      }
    }
  };
};

function pipeMigrations(...migrations) {
  return doc => migrations.reduce((migratedDoc, nextMigration) => nextMigration(migratedDoc), doc);
}