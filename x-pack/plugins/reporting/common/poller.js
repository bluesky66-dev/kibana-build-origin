"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Poller = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

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
} // @TODO Maybe move to observables someday


class Poller {
  constructor(options) {
    _defineProperty(this, "functionToPoll", void 0);

    _defineProperty(this, "successFunction", void 0);

    _defineProperty(this, "errorFunction", void 0);

    _defineProperty(this, "_isRunning", void 0);

    _defineProperty(this, "_timeoutId", void 0);

    _defineProperty(this, "pollFrequencyInMillis", void 0);

    _defineProperty(this, "trailing", void 0);

    _defineProperty(this, "continuePollingOnError", void 0);

    _defineProperty(this, "pollFrequencyErrorMultiplier", void 0);

    this.functionToPoll = options.functionToPoll; // Must return a Promise

    this.successFunction = options.successFunction || _lodash.default.noop;
    this.errorFunction = options.errorFunction || _lodash.default.noop;
    this.pollFrequencyInMillis = options.pollFrequencyInMillis;
    this.trailing = options.trailing || false;
    this.continuePollingOnError = options.continuePollingOnError || false;
    this.pollFrequencyErrorMultiplier = options.pollFrequencyErrorMultiplier || 1;
    this._timeoutId = null;
    this._isRunning = false;
  }

  getPollFrequency() {
    return this.pollFrequencyInMillis;
  }

  _poll() {
    return this.functionToPoll().then(this.successFunction).then(() => {
      if (!this._isRunning) {
        return;
      }

      this._timeoutId = setTimeout(this._poll.bind(this), this.pollFrequencyInMillis);
    }).catch(e => {
      this.errorFunction(e);

      if (!this._isRunning) {
        return;
      }

      if (this.continuePollingOnError) {
        this._timeoutId = setTimeout(this._poll.bind(this), this.pollFrequencyInMillis * this.pollFrequencyErrorMultiplier);
      } else {
        this.stop();
      }
    });
  }

  start() {
    if (this._isRunning) {
      return;
    }

    this._isRunning = true;

    if (this.trailing) {
      this._timeoutId = setTimeout(this._poll.bind(this), this.pollFrequencyInMillis);
    } else {
      this._poll();
    }
  }

  stop() {
    if (!this._isRunning) {
      return;
    }

    this._isRunning = false;

    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
    }

    this._timeoutId = null;
  }

  isRunning() {
    return this._isRunning;
  }

}

exports.Poller = Poller;