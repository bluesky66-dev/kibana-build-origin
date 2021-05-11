"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAtLeast = exports.LicenseService = void 0;

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

  isAtLeast(level) {
    return isAtLeast(this.licenseInformation, level);
  }

  isGoldPlus() {
    return this.isAtLeast('gold');
  }

  isPlatinumPlus() {
    return this.isAtLeast('platinum');
  }

  isEnterprise() {
    return this.isAtLeast('enterprise');
  }

}

exports.LicenseService = LicenseService;

const isAtLeast = (license, level) => {
  return !!license && license.isAvailable && license.isActive && license.hasAtLeast(level);
};

exports.isAtLeast = isAtLeast;