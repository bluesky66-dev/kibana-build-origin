"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CidrMask = void 0;

var _utils = require("../../utils");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const NUM_BITS = 32;

function throwError(mask) {
  throw Error('Invalid CIDR mask: ' + mask);
}

class CidrMask {
  constructor(mask) {
    _defineProperty(this, "initialAddress", void 0);

    _defineProperty(this, "prefixLength", void 0);

    const splits = mask.split('/');

    if (splits.length !== 2) {
      throwError(mask);
    }

    this.initialAddress = new _utils.Ipv4Address(splits[0]);
    this.prefixLength = Number(splits[1]);

    if (isNaN(this.prefixLength) || this.prefixLength < 1 || this.prefixLength > NUM_BITS) {
      throwError(mask);
    }
  }

  getRange() {
    const variableBits = NUM_BITS - this.prefixLength; // eslint-disable-next-line no-bitwise

    const fromAddress = this.initialAddress.valueOf() >> variableBits << variableBits >>> 0; // >>> 0 coerces to unsigned

    const numAddresses = Math.pow(2, variableBits);
    return {
      from: new _utils.Ipv4Address(fromAddress).toString(),
      to: new _utils.Ipv4Address(fromAddress + numAddresses - 1).toString()
    };
  }

  toString() {
    return this.initialAddress.toString() + '/' + this.prefixLength;
  }

}

exports.CidrMask = CidrMask;