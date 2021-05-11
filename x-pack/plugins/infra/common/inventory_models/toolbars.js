"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findToolbar = void 0;

var _i18n = require("@kbn/i18n");

var _toolbar_items = require("./host/toolbar_items");

var _toolbar_items2 = require("./container/toolbar_items");

var _toolbar_items3 = require("./pod/toolbar_items");

var _toolbar_items4 = require("./aws_ec2/toolbar_items");

var _toolbar_items5 = require("./aws_s3/toolbar_items");

var _toolbar_items6 = require("./aws_rds/toolbar_items");

var _toolbar_items7 = require("./aws_sqs/toolbar_items");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const toolbars = {
  host: _toolbar_items.HostToolbarItems,
  container: _toolbar_items2.ContainerToolbarItems,
  pod: _toolbar_items3.PodToolbarItems,
  awsEC2: _toolbar_items4.AwsEC2ToolbarItems,
  awsS3: _toolbar_items5.AwsS3ToolbarItems,
  awsRDS: _toolbar_items6.AwsRDSToolbarItems,
  awsSQS: _toolbar_items7.AwsSQSToolbarItems
};

const findToolbar = type => {
  const Toolbar = toolbars === null || toolbars === void 0 ? void 0 : toolbars[type];

  if (!Toolbar) {
    throw new Error(_i18n.i18n.translate('xpack.infra.inventoryModels.findToolbar.error', {
      defaultMessage: "The toolbar you've attempted to find does not exist."
    }));
  }

  return Toolbar;
};

exports.findToolbar = findToolbar;