"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toAssignableObject = void 0;

var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const toAssignableObject = (object, typeDef) => {
  var _typeDef$management, _typeDef$management2;

  return {
    id: object.id,
    type: object.type,
    title: (_typeDef$management = typeDef.management) !== null && _typeDef$management !== void 0 && _typeDef$management.getTitle ? typeDef.management.getTitle(object) : object.id,
    icon: (_typeDef$management2 = typeDef.management) === null || _typeDef$management2 === void 0 ? void 0 : _typeDef$management2.icon,
    tags: object.references.filter(({
      type
    }) => type === _common.tagSavedObjectTypeName).map(({
      id
    }) => id)
  };
};

exports.toAssignableObject = toAssignableObject;