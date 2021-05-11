"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUiSettings = registerUiSettings;
exports.PdfLogoSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const kbToBase64Length = kb => Math.floor(kb * 1024 * 8 / 6);

const maxLogoSizeInKilobytes = kbToBase64Length(200); // inspired by x-pack/plugins/canvas/common/lib/dataurl.ts

const dataurlRegex = /^data:([a-z]+\/[a-z0-9-+.]+)(;[a-z-]+=[a-z0-9-]+)?(;([a-z0-9]+))?,/;
const imageTypes = ['image/svg+xml', 'image/jpeg', 'image/png', 'image/gif'];

const isImageData = str => {
  const matches = str.match(dataurlRegex);

  if (!matches) {
    return false;
  }

  const [, mimetype,,, encoding] = matches;
  const imageTypeIndex = imageTypes.indexOf(mimetype);

  if (imageTypeIndex < 0 || encoding !== 'base64') {
    return false;
  }

  return true;
};

const isLessThanMaxSize = str => {
  if (str.length > maxLogoSizeInKilobytes) {
    return false;
  }

  return true;
};

const validatePdfLogoBase64String = str => {
  if (typeof str !== 'string' || !isImageData(str)) {
    return _i18n.i18n.translate('xpack.reporting.uiSettings.validate.customLogo.badFile', {
      defaultMessage: `Sorry, that file will not work. Please try a different image file.`
    });
  }

  if (!isLessThanMaxSize(str)) {
    return _i18n.i18n.translate('xpack.reporting.uiSettings.validate.customLogo.tooLarge', {
      defaultMessage: `Sorry, that file is too large. The image file must be less than 200 kilobytes.`
    });
  }
};

const PdfLogoSchema = _configSchema.schema.nullable(_configSchema.schema.any({
  validate: validatePdfLogoBase64String
}));

exports.PdfLogoSchema = PdfLogoSchema;

function registerUiSettings(core) {
  core.uiSettings.register({
    [_constants.UI_SETTINGS_CUSTOM_PDF_LOGO]: {
      name: _i18n.i18n.translate('xpack.reporting.pdfFooterImageLabel', {
        defaultMessage: 'PDF footer image'
      }),
      value: null,
      description: _i18n.i18n.translate('xpack.reporting.pdfFooterImageDescription', {
        defaultMessage: `Custom image to use in the PDF's footer`
      }),
      sensitive: true,
      type: 'image',
      schema: PdfLogoSchema,
      category: [_constants.PLUGIN_ID],
      validation: {
        maxSize: {
          length: maxLogoSizeInKilobytes,
          description: '200 kB'
        }
      }
    }
  });
}