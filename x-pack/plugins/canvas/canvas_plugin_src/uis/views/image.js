"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.image = void 0;

var _elastic_logo = require("../../lib/elastic_logo");

var _resolve_dataurl = require("../../../common/lib/resolve_dataurl");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  Image: strings
} = _i18n.ViewStrings;

const image = () => ({
  name: 'image',
  displayName: strings.getDisplayName(),
  modelArgs: [],
  requiresContext: false,
  args: [{
    name: 'dataurl',
    argType: 'imageUpload',

    resolve({
      args
    }) {
      return {
        dataurl: (0, _resolve_dataurl.resolveFromArgs)(args, _elastic_logo.elasticLogo)
      };
    }

  }, {
    name: 'mode',
    displayName: strings.getModeDisplayName(),
    help: strings.getModeHelp(),
    argType: 'select',
    options: {
      choices: [{
        value: 'contain',
        name: strings.getContainMode()
      }, {
        value: 'cover',
        name: strings.getCoverMode()
      }, {
        value: 'stretch',
        name: strings.getStretchMode()
      }]
    }
  }]
});

exports.image = image;