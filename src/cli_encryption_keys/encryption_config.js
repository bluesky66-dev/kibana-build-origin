"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EncryptionConfig = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _path = require("path");

var _lodash = require("lodash");

var _fs = require("fs");

var _jsYaml = require("js-yaml");

var _utils = require("@kbn/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var _config = new WeakMap();

var _encryptionKeyPaths = new WeakMap();

var _encryptionMeta = new WeakMap();

class EncryptionConfig {
  constructor() {
    _config.set(this, {
      writable: true,
      value: (0, _jsYaml.safeLoad)((0, _fs.readFileSync)((0, _path.join)((0, _utils.getConfigDirectory)(), 'kibana.yml')))
    });

    _encryptionKeyPaths.set(this, {
      writable: true,
      value: ['xpack.encryptedSavedObjects.encryptionKey', 'xpack.reporting.encryptionKey', 'xpack.security.encryptionKey']
    });

    _encryptionMeta.set(this, {
      writable: true,
      value: {
        'xpack.encryptedSavedObjects.encryptionKey': {
          docs: 'https://www.elastic.co/guide/en/kibana/current/xpack-security-secure-saved-objects.html#xpack-security-secure-saved-objects',
          description: 'Used to encrypt stored objects such as dashboards and visualizations'
        },
        'xpack.reporting.encryptionKey': {
          docs: 'https://www.elastic.co/guide/en/kibana/current/reporting-settings-kb.html#general-reporting-settings',
          description: 'Used to encrypt saved reports'
        },
        'xpack.security.encryptionKey': {
          docs: 'https://www.elastic.co/guide/en/kibana/current/security-settings-kb.html#security-session-and-cookie-settings',
          description: 'Used to encrypt session information'
        }
      }
    });
  }

  _getEncryptionKey(key) {
    return (0, _lodash.get)(_classPrivateFieldGet(this, _config), key);
  }

  _hasEncryptionKey(key) {
    return !!(0, _lodash.get)(_classPrivateFieldGet(this, _config), key);
  }

  _generateEncryptionKey() {
    return _crypto.default.randomBytes(16).toString('hex');
  }

  docs({
    comment
  } = {}) {
    const commentString = comment ? '#' : '';
    let docs = '';

    _classPrivateFieldGet(this, _encryptionKeyPaths).forEach(key => {
      docs += `${commentString}${key}
    ${commentString}${_classPrivateFieldGet(this, _encryptionMeta)[key].description}
    ${commentString}${_classPrivateFieldGet(this, _encryptionMeta)[key].docs}
\n`;
    });

    return docs;
  }

  generate({
    force = false
  }) {
    const output = {};

    _classPrivateFieldGet(this, _encryptionKeyPaths).forEach(key => {
      if (force || !this._hasEncryptionKey(key)) {
        output[key] = this._generateEncryptionKey();
      }
    });

    return output;
  }

}

exports.EncryptionConfig = EncryptionConfig;