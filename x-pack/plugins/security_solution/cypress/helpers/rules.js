"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatMitreAttackDescription = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const formatMitreAttackDescription = mitre => {
  return mitre.map(threat => threat.tactic + threat.techniques.map(technique => {
    return technique.name + technique.subtechniques.join('');
  }).join('')).join('');
};

exports.formatMitreAttackDescription = formatMitreAttackDescription;