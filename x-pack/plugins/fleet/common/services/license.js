"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LicenseService = void 0;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Generic license service class that works with the license observable
// Both server and client plugins instancates a singleton version of this class


class LicenseService {
  constructor() {
    _defineProperty(this, "observable", null);

    _defineProperty(this, "subscription", null);

    _defineProperty(this, "licenseInformation", null);
  }

  updateInformation(licenseInformation) {
    this.licenseInformation = licenseInformation;
  }

  start(license$) {
    this.observable = license$;
    this.subscription = this.observable.subscribe(this.updateInformation.bind(this));
  }

  stop() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getLicenseInformation() {
    return this.licenseInformation;
  }

  getLicenseInformation$() {
    return this.observable;
  }

  isGoldPlus() {
    var _this$licenseInformat, _this$licenseInformat2, _this$licenseInformat3;

    return ((_this$licenseInformat = this.licenseInformation) === null || _this$licenseInformat === void 0 ? void 0 : _this$licenseInformat.isAvailable) && ((_this$licenseInformat2 = this.licenseInformation) === null || _this$licenseInformat2 === void 0 ? void 0 : _this$licenseInformat2.isActive) && ((_this$licenseInformat3 = this.licenseInformation) === null || _this$licenseInformat3 === void 0 ? void 0 : _this$licenseInformat3.hasAtLeast('gold'));
  }

  isEnterprise() {
    var _this$licenseInformat4, _this$licenseInformat5, _this$licenseInformat6;

    return ((_this$licenseInformat4 = this.licenseInformation) === null || _this$licenseInformat4 === void 0 ? void 0 : _this$licenseInformat4.isAvailable) && ((_this$licenseInformat5 = this.licenseInformation) === null || _this$licenseInformat5 === void 0 ? void 0 : _this$licenseInformat5.isActive) && ((_this$licenseInformat6 = this.licenseInformation) === null || _this$licenseInformat6 === void 0 ? void 0 : _this$licenseInformat6.hasAtLeast('enterprise'));
  }

}

exports.LicenseService = LicenseService;