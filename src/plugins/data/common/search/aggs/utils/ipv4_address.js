"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Ipv4Address = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const NUM_BYTES = 4;
const BYTE_SIZE = 256;

function throwError(ipAddress) {
  throw Error('Invalid IPv4 address: ' + ipAddress);
}

function isIntegerInRange(integer, min, max) {
  return !isNaN(integer) && integer >= min && integer < max && integer % 1 === 0;
}

class Ipv4Address {
  constructor(ipAddress) {
    _defineProperty(this, "value", void 0);

    if (typeof ipAddress === 'string') {
      this.value = 0;
      const bytes = ipAddress.split('.');

      if (bytes.length !== NUM_BYTES) {
        throwError(ipAddress);
      }

      for (let i = 0; i < bytes.length; i++) {
        const byte = Number(bytes[i]);

        if (!isIntegerInRange(byte, 0, BYTE_SIZE)) {
          throwError(ipAddress);
        }

        this.value += Math.pow(BYTE_SIZE, NUM_BYTES - 1 - i) * byte;
      }
    } else {
      this.value = ipAddress;
    }

    if (!isIntegerInRange(this.value, 0, Math.pow(BYTE_SIZE, NUM_BYTES))) {
      throwError(ipAddress);
    }
  }

  toString() {
    let value = this.value;
    const bytes = [];

    for (let i = 0; i < NUM_BYTES; i++) {
      bytes.unshift(value % 256);
      value = Math.floor(value / 256);
    }

    return bytes.join('.');
  }

  valueOf() {
    return this.value;
  }

}

exports.Ipv4Address = Ipv4Address;