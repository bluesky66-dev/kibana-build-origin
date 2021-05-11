"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexNameField = void 0;

var _public = require("../../../../public");

var _string = require("../../../validators/string");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const indexNameField = i18n => (...args) => {
  const [{
    value
  }] = args;

  if ((0, _string.startsWith)('.')(value)) {
    return {
      code: 'ERR_FIELD_FORMAT',
      formatType: 'INDEX_NAME',
      message: i18n.translate('esUi.forms.fieldValidation.indexNameStartsWithDotError', {
        defaultMessage: 'The index name cannot start with a dot (.).'
      })
    };
  }

  const {
    doesContain: doesContainSpaces
  } = (0, _string.containsChars)(' ')(value);

  if (doesContainSpaces) {
    return {
      code: 'ERR_FIELD_FORMAT',
      formatType: 'INDEX_NAME',
      message: i18n.translate('esUi.forms.fieldValidation.indexNameSpacesError', {
        defaultMessage: 'The index name cannot contain spaces.'
      })
    };
  }

  const {
    charsFound,
    doesContain
  } = (0, _string.containsChars)(_public.indices.INDEX_ILLEGAL_CHARACTERS_VISIBLE)(value);

  if (doesContain) {
    return {
      message: i18n.translate('esUi.forms.fieldValidation.indexNameInvalidCharactersError', {
        defaultMessage: 'The index name contains the invalid {characterListLength, plural, one {character} other {characters}} { characterList }.',
        values: {
          characterList: charsFound.join(' '),
          characterListLength: charsFound.length
        }
      })
    };
  }
};

exports.indexNameField = indexNameField;