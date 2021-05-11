"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIsoDateString = exports.signalsAreOutdated = exports.isOutdated = exports.isMigrationFailed = exports.isMigrationSuccess = exports.isMigrationPending = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const isMigrationPending = migration => migration.attributes.status === 'pending';

exports.isMigrationPending = isMigrationPending;

const isMigrationSuccess = migration => migration.attributes.status === 'success';

exports.isMigrationSuccess = isMigrationSuccess;

const isMigrationFailed = migration => migration.attributes.status === 'failure';

exports.isMigrationFailed = isMigrationFailed;

const isOutdated = ({
  current,
  target
}) => current < target;

exports.isOutdated = isOutdated;

const signalsAreOutdated = ({
  signalVersions,
  target
}) => signalVersions.some(signalVersion => signalVersion.count > 0 && isOutdated({
  current: signalVersion.version,
  target
}));

exports.signalsAreOutdated = signalsAreOutdated;

const getIsoDateString = () => new Date().toISOString();

exports.getIsoDateString = getIsoDateString;