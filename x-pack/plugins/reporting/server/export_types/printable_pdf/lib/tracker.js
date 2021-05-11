"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTracker = getTracker;

var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const SPANTYPE_SETUP = 'setup';
const SPANTYPE_OUTPUT = 'output';

function getTracker() {
  const apmTrans = _elasticApmNode.default.startTransaction('reporting generate_pdf', 'reporting');

  let apmLayout = null;
  let apmScreenshots = null;
  let apmSetup = null;
  let apmAddImage = null;
  let apmCompilePdf = null;
  let apmGetBuffer = null;
  return {
    startLayout() {
      apmLayout = (apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('create_layout', SPANTYPE_SETUP)) || null;
    },

    endLayout() {
      if (apmLayout) apmLayout.end();
    },

    startScreenshots() {
      apmScreenshots = (apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('screenshots_pipeline', SPANTYPE_SETUP)) || null;
    },

    endScreenshots() {
      if (apmScreenshots) apmScreenshots.end();
    },

    startSetup() {
      apmSetup = (apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('setup_pdf', SPANTYPE_SETUP)) || null;
    },

    endSetup() {
      if (apmSetup) apmSetup.end();
    },

    startAddImage() {
      apmAddImage = (apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('add_pdf_image', SPANTYPE_OUTPUT)) || null;
    },

    endAddImage() {
      if (apmAddImage) apmAddImage.end();
    },

    startCompile() {
      apmCompilePdf = (apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('compile_pdf', SPANTYPE_OUTPUT)) || null;
    },

    endCompile() {
      if (apmCompilePdf) apmCompilePdf.end();
    },

    startGetBuffer() {
      apmGetBuffer = (apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('get_buffer', SPANTYPE_OUTPUT)) || null;
    },

    endGetBuffer() {
      if (apmGetBuffer) apmGetBuffer.end();
    },

    end() {
      if (apmTrans) apmTrans.end();
    }

  };
}