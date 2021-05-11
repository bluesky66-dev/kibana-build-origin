"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSampleData = registerSampleData;

var _logs = require("./logs");

var _ecommerce = require("./ecommerce");

var _flights = require("./flights");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerSampleData(sampleDataRegistry, licenseState) {
  // always register the saved objects...
  (0, _ecommerce.registerEcommerceSampleData)(sampleDataRegistry);
  (0, _flights.registerFlightsSampleData)(sampleDataRegistry);
  (0, _logs.registerLogsSampleData)(sampleDataRegistry); // but wait for a license actually supporting Graph to add links to the sample data panels

  const licenseUpdates = licenseState.getLicenseInformation$();

  if (licenseUpdates === null) {
    throw new Error('License state has to be initialized before registering sample data');
  }

  let registered = false;
  licenseUpdates.subscribe(licenseInformation => {
    if (!registered && licenseInformation.showAppLink) {
      registered = true;
      (0, _ecommerce.registerEcommerceSampleDataLink)(sampleDataRegistry);
      (0, _flights.registerFlightsSampleDataLink)(sampleDataRegistry);
      (0, _logs.registerLogsSampleDataLink)(sampleDataRegistry);
    }
  });
}