"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KibanaSocket = void 0;

var _tls = require("tls");

var _util = require("util");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class KibanaSocket {
  get authorized() {
    return this.socket instanceof _tls.TLSSocket ? this.socket.authorized : undefined;
  }

  get authorizationError() {
    return this.socket instanceof _tls.TLSSocket ? this.socket.authorizationError : undefined;
  }

  constructor(socket) {
    this.socket = socket;
  }

  getPeerCertificate(detailed) {
    if (this.socket instanceof _tls.TLSSocket) {
      const peerCertificate = this.socket.getPeerCertificate(detailed); // If the peer does not provide a certificate, it returns null (if the socket has been destroyed)
      // or an empty object, so we should check for both these cases.

      if (peerCertificate && Object.keys(peerCertificate).length > 0) return peerCertificate;
    }

    return null;
  }

  getProtocol() {
    if (this.socket instanceof _tls.TLSSocket) {
      return this.socket.getProtocol();
    }

    return null;
  }

  async renegotiate(options) {
    if (this.socket instanceof _tls.TLSSocket) {
      return (0, _util.promisify)(this.socket.renegotiate.bind(this.socket))(options);
    }

    return Promise.reject(new Error('Cannot renegotiate a connection when TLS is not enabled.'));
  }

}

exports.KibanaSocket = KibanaSocket;