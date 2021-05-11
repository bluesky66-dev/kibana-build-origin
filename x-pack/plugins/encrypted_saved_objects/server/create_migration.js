"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCreateMigration = void 0;

var _saved_objects = require("./saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getCreateMigration = (encryptedSavedObjectsService, instantiateServiceWithLegacyType) => (isMigrationNeededPredicate, migration, inputType, migratedType) => {
  if (inputType && migratedType && inputType.type !== migratedType.type) {
    throw new Error(`An Invalid Encrypted Saved Objects migration is trying to migrate across types ("${inputType.type}" => "${migratedType.type}"), which isn't permitted`);
  }

  const inputService = inputType ? instantiateServiceWithLegacyType(inputType) : encryptedSavedObjectsService;
  const migratedService = migratedType ? instantiateServiceWithLegacyType(migratedType) : encryptedSavedObjectsService;
  return (encryptedDoc, context) => {
    var _encryptedDoc$namespa;

    if (!isMigrationNeededPredicate(encryptedDoc)) {
      return encryptedDoc;
    } // If an object has been converted right before this migration function is called, it will no longer have a `namespace` field, but it
    // will have a `namespaces` field; in that case, the first/only element in that array should be used as the namespace in the descriptor
    // during decryption.


    const convertToMultiNamespaceType = context.convertToMultiNamespaceTypeVersion === context.migrationVersion;
    const decryptDescriptorNamespace = convertToMultiNamespaceType ? (0, _saved_objects.normalizeNamespace)((_encryptedDoc$namespa = encryptedDoc.namespaces) === null || _encryptedDoc$namespa === void 0 ? void 0 : _encryptedDoc$namespa[0]) // `namespaces` contains string values, but we need to normalize this to the namespace ID representation
    : encryptedDoc.namespace;
    const {
      id,
      type
    } = encryptedDoc; // These descriptors might have a `namespace` that is undefined. That is expected for multi-namespace and namespace-agnostic types.

    const decryptDescriptor = {
      id,
      type,
      namespace: decryptDescriptorNamespace
    };
    const encryptDescriptor = {
      id,
      type,
      namespace: encryptedDoc.namespace
    }; // decrypt the attributes using the input type definition
    // then migrate the document
    // then encrypt the attributes using the migration type definition

    return mapAttributes(migration(mapAttributes(encryptedDoc, inputAttributes => inputService.decryptAttributesSync(decryptDescriptor, inputAttributes, {
      convertToMultiNamespaceType
    })), context), migratedAttributes => migratedService.encryptAttributesSync(encryptDescriptor, migratedAttributes));
  };
};

exports.getCreateMigration = getCreateMigration;

function mapAttributes(obj, mapper) {
  return Object.assign(obj, {
    attributes: mapper(obj.attributes)
  });
}