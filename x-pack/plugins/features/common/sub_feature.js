"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SubFeature = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Configuration for a sub-feature.
 */

/**
 * The type of privilege group.
 * - `mutually_exclusive`::
 *     Users will be able to select at most one privilege within this group.
 *     Privileges must be specified in descending order of permissiveness (e.g. `All`, `Read`, not `Read`, `All)
 * - `independent`::
 *     Users will be able to select any combination of privileges within this group.
 */

/**
 * Configuration for a sub-feature privilege group.
 */

/**
 * Configuration for a sub-feature privilege.
 */

class SubFeature {
  constructor(config) {
    this.config = config;
  }

  get name() {
    return this.config.name;
  }

  get privilegeGroups() {
    return this.config.privilegeGroups;
  }

  toRaw() {
    return { ...this.config
    };
  }

}

exports.SubFeature = SubFeature;