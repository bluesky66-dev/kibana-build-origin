"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findLayout = void 0;

var _i18n = require("@kbn/i18n");

var _layout = require("./host/layout");

var _layout2 = require("./pod/layout");

var _layout3 = require("./container/layout");

var _layout4 = require("./aws_ec2/layout");

var _layout5 = require("./aws_s3/layout");

var _layout6 = require("./aws_rds/layout");

var _layout7 = require("./aws_sqs/layout");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * WHY ARE THE LAYOUTS A SEPERATE FILE?
 *
 * Files with React can not be included on the server without
 * crashing due to the requirement of the `window` object.
 */


const layouts = {
  host: _layout.Layout,
  pod: _layout2.Layout,
  container: _layout3.Layout,
  awsEC2: _layout4.Layout,
  awsS3: _layout5.Layout,
  awsRDS: _layout6.Layout,
  awsSQS: _layout7.Layout
};

const findLayout = type => {
  const Layout = layouts === null || layouts === void 0 ? void 0 : layouts[type];

  if (!Layout) {
    throw new Error(_i18n.i18n.translate('xpack.infra.inventoryModels.findLayout.error', {
      defaultMessage: "The layout you've attempted to find does not exist"
    }));
  }

  return Layout;
};

exports.findLayout = findLayout;