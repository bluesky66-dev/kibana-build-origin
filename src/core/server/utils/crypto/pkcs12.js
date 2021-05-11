"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertCert = exports.readPkcs12Truststore = exports.readPkcs12Keystore = void 0;

var _nodeForge = require("node-forge");

var _fs = require("fs");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Reads a private key and certificate chain from a PKCS12 key store.
 *
 * @remarks
 * The PKCS12 key store may contain the following:
 * - 0 or more certificates contained in a `certBag` (OID
 *  1.2.840.113549.1.12.10.1.3); if a certificate has an associated
 *  private key it is treated as an instance certificate, otherwise it is
 *  treated as a CA certificate
 * - 0 or 1 private keys contained in a `keyBag` (OID
 *  1.2.840.113549.1.12.10.1.1) or a `pkcs8ShroudedKeyBag` (OID
 *  1.2.840.113549.1.12.10.1.2)
 *
 * Any other PKCS12 bags are ignored.
 *
 * @privateRemarks
 * This intentionally does not allow for a separate key store password and
 * private key password. In conventional implementations, these two values
 * are expected to be identical, so we do not support other configurations.
 *
 * @param path The file path of the PKCS12 key store
 * @param password The optional password of the key store and private key;
 * if there is no password, this may be an empty string or `undefined`,
 * depending on how the key store was generated.
 * @returns the parsed private key and certificate(s) in PEM format
 */
const readPkcs12Keystore = (path, password) => {
  const p12base64 = (0, _fs.readFileSync)(path, 'base64');

  const p12Der = _nodeForge.util.decode64(p12base64);

  const p12Asn1 = _nodeForge.asn1.fromDer(p12Der);

  const p12 = _nodeForge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

  const keyObj = getKey(p12);
  const {
    ca,
    cert
  } = getCerts(p12, keyObj === null || keyObj === void 0 ? void 0 : keyObj.publicKeyData);
  return {
    ca,
    cert,
    key: keyObj === null || keyObj === void 0 ? void 0 : keyObj.key
  };
};
/**
 * Reads a certificate chain from a PKCS12 trust store.
 *
 * @remarks
 * The PKCS12 trust store may contain the following:
 * - 0 or more certificates contained in a `certBag` (OID
 *  1.2.840.113549.1.12.10.1.3); all are treated as CA certificates
 *
 * Any other PKCS12 bags are ignored.
 *
 * @param path The file path of the PKCS12 trust store
 * @param password The optional password of the trust store; if there is
 * no password, this may be an empty string or `undefined`, depending on
 * how the trust store was generated.
 * @returns the parsed certificate(s) in PEM format
 */


exports.readPkcs12Keystore = readPkcs12Keystore;

const readPkcs12Truststore = (path, password) => {
  const p12base64 = (0, _fs.readFileSync)(path, 'base64');

  const p12Der = _nodeForge.util.decode64(p12base64);

  const p12Asn1 = _nodeForge.asn1.fromDer(p12Der);

  const p12 = _nodeForge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

  const keyObj = getKey(p12);
  const {
    ca
  } = getCerts(p12, keyObj === null || keyObj === void 0 ? void 0 : keyObj.publicKeyData);
  return ca;
}; // jsbn.BigInteger as described in type definition is wrong, it doesn't include `compareTo`


exports.readPkcs12Truststore = readPkcs12Truststore;

const doesPubKeyMatch = (a, b) => {
  if (a && b) {
    return a.n.compareTo(b.n) === 0 && a.e.compareTo(b.e) === 0;
  }

  return false;
};

const getCerts = (p12, pubKey) => {
  // OID 1.2.840.113549.1.12.10.1.3 (certBag)
  const bags = getBags(p12, _nodeForge.pki.oids.certBag);
  let ca;
  let cert;

  if (bags && bags.length) {
    var _certs$find;

    const certs = bags.map(convertCert).filter(x => x !== undefined);
    cert = (_certs$find = certs.find(x => doesPubKeyMatch(x.publicKeyData, pubKey))) === null || _certs$find === void 0 ? void 0 : _certs$find.cert;
    ca = certs.filter(x => !doesPubKeyMatch(x.publicKeyData, pubKey)).map(x => x.cert);

    if (ca.length === 0) {
      ca = undefined;
    }
  }

  return {
    ca,
    cert
  };
};

const convertCert = bag => {
  const cert = bag.cert;

  if (cert) {
    const pem = _nodeForge.pki.certificateToPem(cert);

    const key = cert.publicKey;
    const publicKeyData = {
      n: key.n,
      e: key.e
    };
    return {
      cert: pem,
      publicKeyData
    };
  }

  return undefined;
};

exports.convertCert = convertCert;

const getKey = p12 => {
  // OID 1.2.840.113549.1.12.10.1.1 (keyBag) || OID 1.2.840.113549.1.12.10.1.2 (pkcs8ShroudedKeyBag)
  const bags = [...(getBags(p12, _nodeForge.pki.oids.keyBag) || []), ...(getBags(p12, _nodeForge.pki.oids.pkcs8ShroudedKeyBag) || [])];

  if (bags && bags.length) {
    if (bags.length > 1) {
      throw new Error(`Keystore contains multiple private keys.`);
    }

    const key = bags[0].key;

    if (key) {
      const pem = _nodeForge.pki.privateKeyToPem(key);

      const publicKeyData = {
        n: key.n,
        e: key.e
      };
      return {
        key: pem,
        publicKeyData
      };
    }
  }

  return undefined;
};

const getBags = (p12, bagType) => {
  const bagObj = p12.getBags({
    bagType
  });
  const bags = bagObj[bagType];

  if (bags && bags.length) {
    return bags;
  }

  return undefined;
};