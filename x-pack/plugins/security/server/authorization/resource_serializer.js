"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResourceSerializer = exports.spaceResourcePrefix = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const spaceResourcePrefix = `space:`;
exports.spaceResourcePrefix = spaceResourcePrefix;

class ResourceSerializer {
  static serializeSpaceResource(spaceId) {
    return `${spaceResourcePrefix}${spaceId}`;
  }

  static deserializeSpaceResource(resource) {
    if (!this.isSerializedSpaceResource(resource)) {
      throw new Error(`Resource should have started with ${spaceResourcePrefix}`);
    }

    return resource.slice(spaceResourcePrefix.length);
  }

  static isSerializedSpaceResource(resource) {
    return resource.startsWith(spaceResourcePrefix);
  }

}

exports.ResourceSerializer = ResourceSerializer;