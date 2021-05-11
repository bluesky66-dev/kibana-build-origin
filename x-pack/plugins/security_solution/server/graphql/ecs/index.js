"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ecsSchema", {
  enumerable: true,
  get: function () {
    return _schema.ecsSchema;
  }
});
Object.defineProperty(exports, "createScalarToStringArrayValueResolvers", {
  enumerable: true,
  get: function () {
    return _resolvers.createScalarToStringArrayValueResolvers;
  }
});

var _schema = require("./schema.gql");

var _resolvers = require("./resolvers");