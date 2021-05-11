"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractDocumentation = extractDocumentation;

var ts = _interopRequireWildcard(require("typescript"));

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

/** Generate documentation for all schema definitions in a set of .ts files */


function extractDocumentation(fileNames, options = {
  target: ts.ScriptTarget.ES2015,
  module: ts.ModuleKind.CommonJS
}) {
  // Build a program using the set of root file names in fileNames
  const program = ts.createProgram(fileNames, options); // Get the checker, we will use it to find more about properties

  const checker = program.getTypeChecker(); // Result map

  const result = new Map(); // Visit every sourceFile in the program

  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      // Walk the tree to search for schemas
      ts.forEachChild(sourceFile, visit);
    }
  }

  return result;
  /** visit nodes finding exported schemas */

  function visit(node) {
    if (isNodeExported(node) && ts.isVariableDeclaration(node)) {
      const schemaName = node.name.getText();
      const schemaType = checker.getTypeAtLocation(node);
      result.set(schemaName, extractDocEntries(schemaType));
    }

    if (node.getChildCount() > 0) {
      ts.forEachChild(node, visit);
    }
  }
  /**
   * Extracts doc entries for the schema definition
   * @param schemaType
   */


  function extractDocEntries(schemaType) {
    const collection = [];
    const members = getTypeMembers(schemaType);

    if (!members) {
      return collection;
    }

    members.forEach(member => {
      collection.push(serializeProperty(member));
    });
    return collection;
  }
  /**
   * Resolves members of the type
   * @param type
   */


  function getTypeMembers(type) {
    const argsOfType = checker.getTypeArguments(type);
    let members = type.getProperties();

    if (argsOfType && argsOfType.length > 0) {
      members = argsOfType[0].getProperties();
    }

    return members;
  }
  /**
   * Extracts properties of the type.
   * @param type
   */


  function resolveTypeProperties(type) {
    let props = type.getProperties();
    const typeArguments = checker.getTypeArguments(type);

    if (type.aliasTypeArguments) {
      // @ts-ignores
      props = type.aliasTypeArguments[0].getProperties();
    }

    if (typeArguments.length > 0) {
      props = resolveTypeProperties(typeArguments[0]);
    }

    return props;
  }

  function serializeProperty(symbol) {
    var _typeOfSymbol$getProp, _typeOfSymbol$getProp2, _targetType$symbol; // @ts-ignore


    const typeOfSymbol = symbol.type;

    if (typeOfSymbol === undefined) {
      return {
        name: symbol.getName(),
        documentation: getCommentString(symbol),
        type: 'any'
      };
    }

    let targetType = (_typeOfSymbol$getProp = (_typeOfSymbol$getProp2 = typeOfSymbol.getProperty('type')) === null || _typeOfSymbol$getProp2 === void 0 ? void 0 : _typeOfSymbol$getProp2.type) !== null && _typeOfSymbol$getProp !== void 0 ? _typeOfSymbol$getProp : typeOfSymbol;
    const isArrayOf = ((_targetType$symbol = targetType.symbol) === null || _targetType$symbol === void 0 ? void 0 : _targetType$symbol.name) === 'Array';

    if (isArrayOf) {
      targetType = checker.getTypeArguments(targetType)[0];
    }

    let typeAsString = checker.typeToString(targetType);
    const nestedEntries = [];

    if (targetType.aliasTypeArguments || checker.getTypeArguments(targetType).length > 0) {
      // Resolve complex types, objects and arrays, that contain nested properties
      const typeProperties = resolveTypeProperties(targetType);

      if (Array.isArray(typeProperties) && typeProperties.length > 0) {
        var _targetType$symbol2, _typeOfSymbol$symbol; // we hit an object or collection


        typeAsString = ((_targetType$symbol2 = targetType.symbol) === null || _targetType$symbol2 === void 0 ? void 0 : _targetType$symbol2.name) === 'Array' || ((_typeOfSymbol$symbol = typeOfSymbol.symbol) === null || _typeOfSymbol$symbol === void 0 ? void 0 : _typeOfSymbol$symbol.name) === 'Array' ? `${symbol.getName()}[]` : symbol.getName();
        typeProperties.forEach(member => {
          nestedEntries.push(serializeProperty(member));
        });
      }
    }

    const res = {
      name: symbol.getName(),
      documentation: getCommentString(symbol),
      type: isArrayOf ? `${typeAsString}[]` : typeAsString,
      ...(nestedEntries.length > 0 ? {
        nested: nestedEntries
      } : {})
    };
    return res;
  }

  function getCommentString(symbol) {
    return ts.displayPartsToString(symbol.getDocumentationComment(checker)).replace(/\n/g, ' ');
  }
  /**
   * True if this is visible outside this file, false otherwise
   */


  function isNodeExported(node) {
    return (// eslint-disable-next-line no-bitwise
      (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 || !!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile
    );
  }
}