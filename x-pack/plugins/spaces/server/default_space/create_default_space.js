"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDefaultSpace = createDefaultSpace;

var _i18n = require("@kbn/i18n");

var _server = require("../../../../../src/core/server");

var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function createDefaultSpace({
  getSavedObjects,
  logger
}) {
  const {
    createInternalRepository
  } = await getSavedObjects();
  const savedObjectsRepository = createInternalRepository(['space']);
  logger.debug('Checking for existing default space');
  const defaultSpaceExists = await doesDefaultSpaceExist(savedObjectsRepository);

  if (defaultSpaceExists) {
    logger.debug('Default space already exists');
    return;
  }

  const options = {
    id: _constants.DEFAULT_SPACE_ID
  };
  logger.debug('Creating the default space');

  try {
    await savedObjectsRepository.create('space', {
      name: _i18n.i18n.translate('xpack.spaces.defaultSpaceTitle', {
        defaultMessage: 'Default'
      }),
      description: _i18n.i18n.translate('xpack.spaces.defaultSpaceDescription', {
        defaultMessage: 'This is your default space!'
      }),
      color: '#00bfb3',
      disabledFeatures: [],
      _reserved: true
    }, options);
  } catch (error) {
    // Ignore conflict errors.
    // It is possible that another Kibana instance, or another invocation of this function
    // created the default space in the time it took this to complete.
    if (_server.SavedObjectsErrorHelpers.isConflictError(error)) {
      return;
    }

    throw error;
  }

  logger.debug('Default space created');
}

async function doesDefaultSpaceExist(savedObjectsRepository) {
  try {
    await savedObjectsRepository.get('space', _constants.DEFAULT_SPACE_ID);
    return true;
  } catch (e) {
    if (_server.SavedObjectsErrorHelpers.isNotFoundError(e)) {
      return false;
    }

    throw e;
  }
}