"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PromiseWithCancel = exports.Status = void 0;

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


let Status;
/**
 * Simple [PromiseWithCancel] factory
 */

exports.Status = Status;

(function (Status) {
  Status[Status["Canceled"] = 0] = "Canceled";
  Status[Status["Failed"] = 1] = "Failed";
  Status[Status["Resolved"] = 2] = "Resolved";
  Status[Status["Awaiting"] = 3] = "Awaiting";
  Status[Status["Idle"] = 4] = "Idle";
})(Status || (exports.Status = Status = {}));

class PromiseWithCancel {
  /**
   * @param {Promise} promise  Promise you want to cancel / track
   */
  constructor(promise) {
    _defineProperty(this, "_promise", void 0);

    _defineProperty(this, "_status", Status.Idle);

    _defineProperty(this, "cancel", () => {
      this._status = Status.Canceled;
    });

    _defineProperty(this, "status", () => {
      return this._status;
    });

    _defineProperty(this, "promise", () => {
      if (this._status === Status.Canceled) {
        throw Error('Getting a canceled promise is not allowed');
      } else if (this._status !== Status.Idle) {
        return this._promise;
      }

      return new Promise((resolve, reject) => {
        this._status = Status.Awaiting;
        return this._promise.then(response => {
          if (this._status !== Status.Canceled) {
            this._status = Status.Resolved;
            return resolve(response);
          }
        }).catch(error => {
          if (this._status !== Status.Canceled) {
            this._status = Status.Failed;
            return reject(error);
          }
        });
      });
    });

    this._promise = promise;
  }
  /**
   * Cancel the promise in any state
   */


}

exports.PromiseWithCancel = PromiseWithCancel;