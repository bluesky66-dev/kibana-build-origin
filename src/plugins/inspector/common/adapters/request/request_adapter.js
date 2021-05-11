"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestAdapter = void 0;

var _events = require("events");

var _v = _interopRequireDefault(require("uuid/v4"));

var _request_responder = require("./request_responder");

var _types = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * An generic inspector adapter to log requests.
 * These can be presented in the inspector using the requests view.
 * The adapter is not coupled to a specific implementation or even Elasticsearch
 * instead it offers a generic API to log requests of any kind.
 * @extends EventEmitter
 */
class RequestAdapter extends _events.EventEmitter {
  constructor() {
    super();

    _defineProperty(this, "requests", void 0);

    this.requests = new Map();
  }
  /**
   * Start logging a new request into this request adapter. The new request will
   * by default be in a processing state unless you explicitly finish it via
   * {@link RequestResponder#finish}, {@link RequestResponder#ok} or
   * {@link RequestResponder#error}.
   *
   * @param  {string} name The name of this request as it should be shown in the UI.
   * @param  {object} args Additional arguments for the request.
   * @return {RequestResponder} An instance to add information to the request and finish it.
   */


  start(name, params = {}) {
    var _params$id;

    const req = { ...params,
      name,
      startTime: Date.now(),
      status: _types.RequestStatus.PENDING,
      id: (_params$id = params.id) !== null && _params$id !== void 0 ? _params$id : (0, _v.default)()
    };
    this.requests.set(req.id, req);

    this._onChange();

    return new _request_responder.RequestResponder(req, () => this._onChange());
  }

  reset() {
    this.requests = new Map();

    this._onChange();
  }

  resetRequest(id) {
    this.requests.delete(id);

    this._onChange();
  }

  getRequests() {
    return Array.from(this.requests.values());
  }

  _onChange() {
    this.emit('change');
  }

}

exports.RequestAdapter = RequestAdapter;