"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBytesRt = getBytesRt;

var t = _interopRequireWildcard(require("io-ts"));

var _Either = require("fp-ts/lib/Either");

var _amount_and_unit = require("../amount_and_unit");

var _get_range_type_message = require("./get_range_type_message");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function toBytes(amount, unit) {
  switch (unit) {
    case 'b':
      return amount;

    case 'kb':
      return amount * 2 ** 10;

    case 'mb':
      return amount * 2 ** 20;
  }
}

function amountAndUnitToBytes(value) {
  if (value) {
    const {
      amount,
      unit
    } = (0, _amount_and_unit.amountAndUnitToObject)(value);

    if (isFinite(amount) && unit) {
      return toBytes(amount, unit);
    }
  }
}

function getBytesRt({
  min,
  max
}) {
  var _amountAndUnitToBytes, _amountAndUnitToBytes2;

  const minAsBytes = (_amountAndUnitToBytes = amountAndUnitToBytes(min)) !== null && _amountAndUnitToBytes !== void 0 ? _amountAndUnitToBytes : -Infinity;
  const maxAsBytes = (_amountAndUnitToBytes2 = amountAndUnitToBytes(max)) !== null && _amountAndUnitToBytes2 !== void 0 ? _amountAndUnitToBytes2 : Infinity;
  const message = (0, _get_range_type_message.getRangeTypeMessage)(min, max);
  return new t.Type('bytesRt', t.string.is, (input, context) => {
    return _Either.either.chain(t.string.validate(input, context), inputAsString => {
      const inputAsBytes = amountAndUnitToBytes(inputAsString);
      const isValidAmount = inputAsBytes !== undefined && inputAsBytes >= minAsBytes && inputAsBytes <= maxAsBytes;
      return isValidAmount ? t.success(inputAsString) : t.failure(input, context, message);
    });
  }, t.identity);
}