"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newTrustedAppToCreateExceptionListItemOptions = exports.conditionEntriesToEntries = exports.createEntryNested = exports.createEntryMatch = exports.osFromExceptionItem = exports.exceptionListItemToTrustedApp = exports.entriesToConditionEntriesMap = exports.createConditionEntry = void 0;

var _uuid = _interopRequireDefault(require("uuid"));

var _common = require("../../../../../lists/common");

var _types = require("../../../../common/endpoint/types");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const OS_TYPE_TO_OPERATING_SYSTEM = {
  linux: _types.OperatingSystem.LINUX,
  macos: _types.OperatingSystem.MAC,
  windows: _types.OperatingSystem.WINDOWS
};
const OPERATING_SYSTEM_TO_OS_TYPE = {
  [_types.OperatingSystem.LINUX]: 'linux',
  [_types.OperatingSystem.MAC]: 'macos',
  [_types.OperatingSystem.WINDOWS]: 'windows'
};

const filterUndefined = list => {
  return list.filter(item => item !== undefined);
};

const createConditionEntry = (field, value) => {
  return {
    field,
    value,
    type: 'match',
    operator: 'included'
  };
};

exports.createConditionEntry = createConditionEntry;

const entriesToConditionEntriesMap = entries => {
  return entries.reduce((result, entry) => {
    if (entry.field.startsWith('process.hash') && entry.type === 'match') {
      return { ...result,
        [_types.ConditionEntryField.HASH]: createConditionEntry(_types.ConditionEntryField.HASH, entry.value)
      };
    } else if (entry.field === 'process.executable.caseless' && entry.type === 'match') {
      return { ...result,
        [_types.ConditionEntryField.PATH]: createConditionEntry(_types.ConditionEntryField.PATH, entry.value)
      };
    } else if (entry.field === 'process.Ext.code_signature' && entry.type === 'nested') {
      const subjectNameCondition = entry.entries.find(subEntry => {
        return subEntry.field === 'subject_name' && subEntry.type === 'match';
      });

      if (subjectNameCondition) {
        return { ...result,
          [_types.ConditionEntryField.SIGNER]: createConditionEntry(_types.ConditionEntryField.SIGNER, subjectNameCondition.value)
        };
      }
    }

    return result;
  }, {});
};
/**
 * Map an ExceptionListItem to a TrustedApp item
 * @param exceptionListItem
 */


exports.entriesToConditionEntriesMap = entriesToConditionEntriesMap;

const exceptionListItemToTrustedApp = exceptionListItem => {
  if (exceptionListItem.os_types[0]) {
    const os = osFromExceptionItem(exceptionListItem);
    const grouped = entriesToConditionEntriesMap(exceptionListItem.entries);
    return {
      id: exceptionListItem.id,
      name: exceptionListItem.name,
      description: exceptionListItem.description,
      created_at: exceptionListItem.created_at,
      created_by: exceptionListItem.created_by,
      ...(os === _types.OperatingSystem.LINUX || os === _types.OperatingSystem.MAC ? {
        os,
        entries: filterUndefined([grouped[_types.ConditionEntryField.HASH], grouped[_types.ConditionEntryField.PATH]])
      } : {
        os,
        entries: filterUndefined([grouped[_types.ConditionEntryField.HASH], grouped[_types.ConditionEntryField.PATH], grouped[_types.ConditionEntryField.SIGNER]])
      })
    };
  } else {
    throw new Error('Unknown Operating System assigned to trusted application.');
  }
};

exports.exceptionListItemToTrustedApp = exceptionListItemToTrustedApp;

const osFromExceptionItem = exceptionListItem => {
  return OS_TYPE_TO_OPERATING_SYSTEM[exceptionListItem.os_types[0]];
};

exports.osFromExceptionItem = osFromExceptionItem;

const hashType = hash => {
  switch (hash.length) {
    case 32:
      return 'md5';

    case 40:
      return 'sha1';

    case 64:
      return 'sha256';
  }
};

const createEntryMatch = (field, value) => {
  return {
    field,
    value,
    type: 'match',
    operator: 'included'
  };
};

exports.createEntryMatch = createEntryMatch;

const createEntryNested = (field, entries) => {
  return {
    field,
    entries,
    type: 'nested'
  };
};

exports.createEntryNested = createEntryNested;

const conditionEntriesToEntries = conditionEntries => {
  return conditionEntries.map(conditionEntry => {
    if (conditionEntry.field === _types.ConditionEntryField.HASH) {
      return createEntryMatch(`process.hash.${hashType(conditionEntry.value)}`, conditionEntry.value.toLowerCase());
    } else if (conditionEntry.field === _types.ConditionEntryField.SIGNER) {
      return createEntryNested(`process.Ext.code_signature`, [createEntryMatch('trusted', 'true'), createEntryMatch('subject_name', conditionEntry.value)]);
    } else {
      return createEntryMatch(`process.executable.caseless`, conditionEntry.value);
    }
  });
};
/**
 * Map NewTrustedApp to CreateExceptionListItemOptions.
 */


exports.conditionEntriesToEntries = conditionEntriesToEntries;

const newTrustedAppToCreateExceptionListItemOptions = ({
  os,
  entries,
  name,
  description = ''
}) => {
  return {
    comments: [],
    description,
    entries: conditionEntriesToEntries(entries),
    itemId: _uuid.default.v4(),
    listId: _common.ENDPOINT_TRUSTED_APPS_LIST_ID,
    meta: undefined,
    name,
    namespaceType: 'agnostic',
    osTypes: [OPERATING_SYSTEM_TO_OS_TYPE[os]],
    tags: ['policy:all'],
    type: 'simple'
  };
};

exports.newTrustedAppToCreateExceptionListItemOptions = newTrustedAppToCreateExceptionListItemOptions;