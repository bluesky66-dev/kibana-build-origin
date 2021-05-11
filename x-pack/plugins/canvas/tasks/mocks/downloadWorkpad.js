"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.downloadZippedRuntime = exports.downloadRuntime = exports.downloadRenderedWorkpad = exports.downloadWorkpad = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const downloadWorkpad = async workpadId => console.log(`Download workpad ${workpadId}`);

exports.downloadWorkpad = downloadWorkpad;

const downloadRenderedWorkpad = async renderedWorkpad => console.log(`Download workpad ${renderedWorkpad.id}`);

exports.downloadRenderedWorkpad = downloadRenderedWorkpad;

const downloadRuntime = async basePath => console.log(`Download run time at ${basePath}`);

exports.downloadRuntime = downloadRuntime;

const downloadZippedRuntime = async data => console.log(`Downloading data ${data}`);

exports.downloadZippedRuntime = downloadZippedRuntime;