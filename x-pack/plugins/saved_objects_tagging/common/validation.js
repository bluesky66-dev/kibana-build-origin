"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateTagDescription = exports.validateTagName = exports.validateTagColor = exports.tagDescriptionMaxLength = exports.tagNameMaxLength = exports.tagNameMinLength = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const tagNameMinLength = 2;
exports.tagNameMinLength = tagNameMinLength;
const tagNameMaxLength = 50;
exports.tagNameMaxLength = tagNameMaxLength;
const tagDescriptionMaxLength = 100;
exports.tagDescriptionMaxLength = tagDescriptionMaxLength;
const hexColorRegexp = /^#[0-9A-F]{6}$/i;

const isHexColor = color => {
  return hexColorRegexp.test(color);
};

const validateTagColor = color => {
  if (!isHexColor(color)) {
    return _i18n.i18n.translate('xpack.savedObjectsTagging.validation.color.errorInvalid', {
      defaultMessage: 'Tag color must be a valid hex color'
    });
  }
};

exports.validateTagColor = validateTagColor;

const validateTagName = name => {
  if (name.length < tagNameMinLength) {
    return _i18n.i18n.translate('xpack.savedObjectsTagging.validation.name.errorTooShort', {
      defaultMessage: 'Tag name must be at least {length} characters',
      values: {
        length: tagNameMinLength
      }
    });
  }

  if (name.length > tagNameMaxLength) {
    return _i18n.i18n.translate('xpack.savedObjectsTagging.validation.name.errorTooLong', {
      defaultMessage: 'Tag name may not exceed {length} characters',
      values: {
        length: tagNameMaxLength
      }
    });
  }
};

exports.validateTagName = validateTagName;

const validateTagDescription = description => {
  if (description.length > tagDescriptionMaxLength) {
    return _i18n.i18n.translate('xpack.savedObjectsTagging.validation.description.errorTooLong', {
      defaultMessage: 'Tag description may not exceed {length} characters',
      values: {
        length: tagDescriptionMaxLength
      }
    });
  }
};

exports.validateTagDescription = validateTagDescription;