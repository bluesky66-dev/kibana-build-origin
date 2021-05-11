"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installIndexPatterns = installIndexPatterns;
exports.createFieldFormatMap = exports.flattenFields = exports.transformField = exports.findFieldByPath = exports.dedupeFields = exports.createIndexPatternFields = exports.createIndexPattern = exports.getAllDataStreamFieldsByType = exports.indexPatternTypes = void 0;

var _constants = require("../../../../constants");

var _field = require("../../fields/field");

var _constants2 = require("../../../../../common/constants");

var _get = require("../../packages/get");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const typeMap = {
  binary: 'binary',
  half_float: 'number',
  scaled_float: 'number',
  float: 'number',
  integer: 'number',
  long: 'number',
  short: 'number',
  byte: 'number',
  text: 'string',
  keyword: 'string',
  '': 'string',
  geo_point: 'geo_point',
  date: 'date',
  ip: 'ip',
  boolean: 'boolean',
  constant_keyword: 'string'
};
const indexPatternTypes = Object.values(_constants2.dataTypes);
exports.indexPatternTypes = indexPatternTypes;

async function installIndexPatterns(savedObjectsClient, pkgName, pkgVersion, installSource) {
  // get all user installed packages
  const installedPackagesRes = await (0, _get.getPackageSavedObjects)(savedObjectsClient);
  const installedPackagesSavedObjects = installedPackagesRes.saved_objects.filter(so => so.attributes.install_status === _constants2.installationStatuses.Installed);
  const packagesToFetch = installedPackagesSavedObjects.reduce((acc, pkg) => {
    acc.push({
      name: pkg.attributes.name,
      version: pkg.attributes.version,
      installedPkg: pkg.attributes
    });
    return acc;
  }, []);

  if (pkgName && pkgVersion && installSource) {
    const packageToInstall = packagesToFetch.find(pkg => pkg.name === pkgName);

    if (packageToInstall) {
      // set the version to the one we want to install
      // if we're reinstalling the number will be the same
      // if this is an upgrade then we'll be modifying the version number to the upgrade version
      packageToInstall.version = pkgVersion;
    } else {
      // if we're installing for the first time, add to the list
      packagesToFetch.push({
        name: pkgName,
        version: pkgVersion,
        installedPkg: await (0, _get.getInstallation)({
          savedObjectsClient,
          pkgName
        })
      });
    }
  } // get each package's registry info


  const packagesToFetchPromise = packagesToFetch.map(pkg => (0, _get.getPackageFromSource)({
    pkgName: pkg.name,
    pkgVersion: pkg.version,
    installedPkg: pkg.installedPkg,
    savedObjectsClient
  }));
  const packages = await Promise.all(packagesToFetchPromise); // for each index pattern type, create an index pattern

  indexPatternTypes.forEach(async indexPatternType => {
    // if this is an update because a package is being uninstalled (no pkgkey argument passed) and no other packages are installed, remove the index pattern
    if (!pkgName && installedPackagesSavedObjects.length === 0) {
      try {
        await savedObjectsClient.delete(_constants.INDEX_PATTERN_SAVED_OBJECT_TYPE, `${indexPatternType}-*`);
      } catch (err) {// index pattern was probably deleted by the user already
      }

      return;
    }

    const packagesWithInfo = packages.map(pkg => pkg.packageInfo); // get all data stream fields from all installed packages

    const fields = await getAllDataStreamFieldsByType(packagesWithInfo, indexPatternType);
    const kibanaIndexPattern = createIndexPattern(indexPatternType, fields); // create or overwrite the index pattern

    await savedObjectsClient.create(_constants.INDEX_PATTERN_SAVED_OBJECT_TYPE, kibanaIndexPattern, {
      id: `${indexPatternType}-*`,
      overwrite: true
    });
  });
} // loops through all given packages and returns an array
// of all fields from all data streams matching data stream type


const getAllDataStreamFieldsByType = async (packages, dataStreamType) => {
  const dataStreamsPromises = packages.reduce((acc, pkg) => {
    if (pkg.data_streams) {
      // filter out data streams by data stream type
      const matchingDataStreams = pkg.data_streams.filter(dataStream => dataStream.type === dataStreamType);
      matchingDataStreams.forEach(dataStream => {
        acc.push((0, _field.loadFieldsFromYaml)(pkg, dataStream.path));
      });
    }

    return acc;
  }, []); // get all the data stream fields for each installed package into one array

  const allDataStreamFields = await Promise.all(dataStreamsPromises);
  return allDataStreamFields.flat();
}; // creates or updates index pattern


exports.getAllDataStreamFieldsByType = getAllDataStreamFieldsByType;

const createIndexPattern = (indexPatternType, fields) => {
  const {
    indexPatternFields,
    fieldFormatMap
  } = createIndexPatternFields(fields);
  return {
    title: `${indexPatternType}-*`,
    timeFieldName: '@timestamp',
    fields: JSON.stringify(indexPatternFields),
    fieldFormatMap: JSON.stringify(fieldFormatMap),
    allowNoIndex: true
  };
}; // takes fields from yaml files and transforms into Kibana Index Pattern fields
// and also returns the fieldFormatMap


exports.createIndexPattern = createIndexPattern;

const createIndexPatternFields = fields => {
  const flattenedFields = flattenFields(fields);
  const fieldFormatMap = createFieldFormatMap(flattenedFields);
  const transformedFields = flattenedFields.map(transformField);
  const dedupedFields = dedupeFields(transformedFields);
  return {
    indexPatternFields: dedupedFields,
    fieldFormatMap
  };
}; // merges fields that are duplicates with the existing taking precedence


exports.createIndexPatternFields = createIndexPatternFields;

const dedupeFields = fields => {
  const uniqueObj = fields.reduce((acc, field) => {
    // if field doesn't exist yet
    if (!acc[field.name]) {
      acc[field.name] = field; // if field exists already
    } else {
      const existingField = acc[field.name]; // if the existing field and this field have the same type, merge

      if (existingField.type === field.type) {
        const mergedField = { ...field,
          ...existingField
        };
        acc[field.name] = mergedField;
      } else {// log when there is a dup with different types
      }
    }

    return acc;
  }, {});
  return Object.values(uniqueObj);
};
/**
 * search through fields with field's path property
 * returns undefined if field not found or field is not a leaf node
 * @param  allFields fields to search
 * @param  path dot separated path from field.path
 */


exports.dedupeFields = dedupeFields;

const findFieldByPath = (allFields, path) => {
  const pathParts = path.split('.');
  return getField(allFields, pathParts);
};

exports.findFieldByPath = findFieldByPath;

const getField = (fields, pathNames) => {
  if (!pathNames.length) return undefined; // get the first rest of path names

  const [name, ...restPathNames] = pathNames;

  for (const field of fields) {
    if (field.name === name) {
      // check field's fields, passing in the remaining path names
      if (field.fields && field.fields.length > 0) {
        return getField(field.fields, restPathNames);
      } // no nested fields to search, but still more names - not found


      if (restPathNames.length) {
        return undefined;
      }

      return field;
    }
  }

  return undefined;
};

const transformField = (field, i, fields) => {
  var _field$count, _field$index, _field$analyzed, _field$searchable, _field$aggregatable, _field$doc_values, _field$doc_values2;

  const newField = {
    name: field.name,
    count: (_field$count = field.count) !== null && _field$count !== void 0 ? _field$count : 0,
    scripted: false,
    indexed: (_field$index = field.index) !== null && _field$index !== void 0 ? _field$index : true,
    analyzed: (_field$analyzed = field.analyzed) !== null && _field$analyzed !== void 0 ? _field$analyzed : false,
    searchable: (_field$searchable = field.searchable) !== null && _field$searchable !== void 0 ? _field$searchable : true,
    aggregatable: (_field$aggregatable = field.aggregatable) !== null && _field$aggregatable !== void 0 ? _field$aggregatable : true,
    doc_values: (_field$doc_values = field.doc_values) !== null && _field$doc_values !== void 0 ? _field$doc_values : true,
    readFromDocValues: (_field$doc_values2 = field.doc_values) !== null && _field$doc_values2 !== void 0 ? _field$doc_values2 : true
  }; // if type exists, check if it exists in the map

  if (field.type) {
    // if no type match type is not set (undefined)
    if (typeMap[field.type]) {
      newField.type = typeMap[field.type];
    } // if type isn't set, default to string

  } else {
    newField.type = 'string';
  }

  if (newField.type === 'binary') {
    var _field$doc_values3, _field$doc_values4;

    newField.aggregatable = false;
    newField.analyzed = false;
    newField.doc_values = (_field$doc_values3 = field.doc_values) !== null && _field$doc_values3 !== void 0 ? _field$doc_values3 : false;
    newField.readFromDocValues = (_field$doc_values4 = field.doc_values) !== null && _field$doc_values4 !== void 0 ? _field$doc_values4 : false;
    newField.indexed = false;
    newField.searchable = false;
  }

  if (field.type === 'object' && field.hasOwnProperty('enabled')) {
    var _field$enabled;

    const enabled = (_field$enabled = field.enabled) !== null && _field$enabled !== void 0 ? _field$enabled : true;
    newField.enabled = enabled;

    if (!enabled) {
      newField.aggregatable = false;
      newField.analyzed = false;
      newField.doc_values = false;
      newField.readFromDocValues = false;
      newField.indexed = false;
      newField.searchable = false;
    }
  }

  if (field.type === 'text') {
    newField.aggregatable = false;
  }

  if (field.hasOwnProperty('script')) {
    newField.scripted = true;
    newField.script = field.script;
    newField.lang = 'painless';
    newField.doc_values = false;
    newField.readFromDocValues = false;
  }

  return newField;
};
/**
 * flattenFields
 *
 * flattens fields and renames them with a path of the parent names
 */


exports.transformField = transformField;

const flattenFields = allFields => {
  const flatten = fields => fields.reduce((acc, field) => {
    var _field$fields, _field$fields2; // if this is a group fields with no fields, skip the field


    if (field.type === 'group' && !((_field$fields = field.fields) !== null && _field$fields !== void 0 && _field$fields.length)) {
      return acc;
    } // recurse through nested fields


    if (field.type === 'group' && (_field$fields2 = field.fields) !== null && _field$fields2 !== void 0 && _field$fields2.length) {
      // skip if field.enabled is not explicitly set to false
      if (!field.hasOwnProperty('enabled') || field.enabled === true) {
        acc = renameAndFlatten(field, field.fields, [...acc]);
      }
    } else {
      var _field$multi_fields; // handle alias type fields


      if (field.type === 'alias' && field.path) {
        const foundField = findFieldByPath(allFields, field.path); // if aliased leaf field is found copy its props over except path and name

        if (foundField) {
          const {
            path,
            name
          } = field;
          field = { ...foundField,
            path,
            name
          };
        }
      } // add field before going through multi_fields because we still want to add the parent field


      acc.push(field); // for each field in multi_field add new field

      if ((_field$multi_fields = field.multi_fields) !== null && _field$multi_fields !== void 0 && _field$multi_fields.length) {
        acc = renameAndFlatten(field, field.multi_fields, [...acc]);
      }
    }

    return acc;
  }, []); // helper function to call flatten() and rename the fields


  const renameAndFlatten = (field, fields, acc) => {
    const flattenedFields = flatten(fields);
    flattenedFields.forEach(nestedField => {
      acc.push({ ...nestedField,
        name: `${field.name}.${nestedField.name}`
      });
    });
    return acc;
  };

  return flatten(allFields);
};

exports.flattenFields = flattenFields;

const createFieldFormatMap = fields => fields.reduce((acc, field) => {
  if (field.format || field.pattern) {
    const fieldFormatMapItem = {};

    if (field.format) {
      fieldFormatMapItem.id = field.format;
    }

    const params = getFieldFormatParams(field);
    if (Object.keys(params).length) fieldFormatMapItem.params = params;
    acc[field.name] = fieldFormatMapItem;
  }

  return acc;
}, {});

exports.createFieldFormatMap = createFieldFormatMap;

const getFieldFormatParams = field => {
  const params = {};
  if (field.pattern) params.pattern = field.pattern;
  if (field.input_format) params.inputFormat = field.input_format;
  if (field.output_format) params.outputFormat = field.output_format;
  if (field.output_precision) params.outputPrecision = field.output_precision;
  if (field.label_template) params.labelTemplate = field.label_template;
  if (field.url_template) params.urlTemplate = field.url_template;
  if (field.open_link_in_current_tab) params.openLinkInCurrentTab = field.open_link_in_current_tab;
  return params;
};