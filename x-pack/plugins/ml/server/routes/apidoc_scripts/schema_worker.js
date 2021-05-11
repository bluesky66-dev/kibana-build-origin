"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postProcess = postProcess;

var fs = _interopRequireWildcard(require("fs"));

var path = _interopRequireWildcard(require("path"));

var _schema_extractor = require("./schema_extractor");

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
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function postProcess(parsedFiles) {
  const schemasDirPath = path.resolve(__dirname, '..', '..', 'schemas');
  const schemaFiles = fs.readdirSync(schemasDirPath).map(filename => path.resolve(schemasDirPath, filename));
  const schemaDocs = (0, _schema_extractor.extractDocumentation)(schemaFiles);
  parsedFiles.forEach(parsedFile => {
    parsedFile.forEach(block => {
      const {
        local: {
          schemas
        }
      } = block;
      if (!schemas || schemas.length === 0) return;

      for (const schema of schemas) {
        const {
          name: schemaName,
          group: paramsGroup
        } = schema;
        const schemaFields = schemaDocs.get(schemaName);
        if (!schemaFields) return;
        updateBlockParameters(schemaFields, block, paramsGroup);
      }
    });
  });
}
/**
 * Extracts schema's doc entries to apidoc parameters
 * @param docEntries
 * @param block
 * @param paramsGroup
 */


function updateBlockParameters(docEntries, block, paramsGroup) {
  if (!block.local.parameter) {
    block.local.parameter = {};
  }

  if (!block.local.parameter.fields) {
    block.local.parameter.fields = {};
  }

  if (!block.local.parameter.fields[paramsGroup]) {
    block.local.parameter.fields[paramsGroup] = [];
  }

  const collection = block.local.parameter.fields[paramsGroup];

  for (const field of docEntries) {
    collection.push({
      group: paramsGroup,
      type: escapeSpecial(field.type),
      size: undefined,
      allowedValues: undefined,
      optional: !!field.optional,
      field: field.name,
      defaultValue: undefined,
      description: field.documentation
    });

    if (field.nested) {
      updateBlockParameters(field.nested, block, field.name);
    }
  }
}
/**
 * Escape special character to make sure the markdown table isn't broken
 */


function escapeSpecial(str) {
  return str.replace(/\|/g, '\\|');
}