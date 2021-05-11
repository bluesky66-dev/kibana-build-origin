"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseAndVerifyArchiveBuffer = parseAndVerifyArchiveBuffer;
exports.parseAndVerifyDataStreams = parseAndVerifyDataStreams;
exports.parseAndVerifyStreams = parseAndVerifyStreams;
exports.parseAndVerifyVars = parseAndVerifyVars;
exports.parseAndVerifyPolicyTemplates = parseAndVerifyPolicyTemplates;
exports.parseAndVerifyInputs = parseAndVerifyInputs;

var _jsYaml = _interopRequireDefault(require("js-yaml"));

var _lodash = require("lodash");

var _types = require("../../../../common/types");

var _errors = require("../../../errors");

var _index = require("./index");

var _registry = require("../registry");

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


const MANIFESTS = {};
const MANIFEST_NAME = 'manifest.yml'; // not sure these are 100% correct but they do the job here
// keeping them local until others need them
// pro: guarantee only supplying known values. these keys must be in ArchivePackage. no typos or new values
// pro: any values added to these lists will be passed through by default
// pro & con: values do need to be shadowed / repeated from ArchivePackage, but perhaps we want to limit values

const requiredArchivePackageProps = ['name', 'version', 'description', 'title', 'format_version', 'release', 'owner'];
const optionalArchivePackageProps = ['readme', 'assets', 'data_streams', 'internal', 'license', 'type', 'categories', 'conditions', 'screenshots', 'icons', 'policy_templates'];
const registryInputProps = Object.values(_types.RegistryInputKeys);
const registryVarsProps = Object.values(_types.RegistryVarsEntryKeys);
const registryPolicyTemplateProps = Object.values(_types.RegistryPolicyTemplateKeys);
const registryStreamProps = Object.values(_types.RegistryStreamKeys);
const registryDataStreamProps = Object.values(_types.RegistryDataStreamKeys); // TODO: everything below performs verification of manifest.yml files, and hence duplicates functionality already implemented in the
// package registry. At some point this should probably be replaced (or enhanced) with verification based on
// https://github.com/elastic/package-spec/

async function parseAndVerifyArchiveBuffer(archiveBuffer, contentType) {
  const entries = await (0, _index.unpackBufferEntries)(archiveBuffer, contentType);
  const paths = [];
  entries.forEach(({
    path,
    buffer
  }) => {
    paths.push(path);
    if (path.endsWith(MANIFEST_NAME) && buffer) MANIFESTS[path] = buffer;
  });
  return {
    packageInfo: parseAndVerifyArchive(paths),
    paths
  };
}

function parseAndVerifyArchive(paths) {
  // The top-level directory must match pkgName-pkgVersion, and no other top-level files or directories may be present
  const toplevelDir = paths[0].split('/')[0];
  paths.forEach(path => {
    if (path.split('/')[0] !== toplevelDir) {
      throw new _errors.PackageInvalidArchiveError('Package contains more than one top-level directory.');
    }
  }); // The package must contain a manifest file ...

  const manifestFile = `${toplevelDir}/${MANIFEST_NAME}`;
  const manifestBuffer = MANIFESTS[manifestFile];

  if (!paths.includes(manifestFile) || !manifestBuffer) {
    throw new _errors.PackageInvalidArchiveError(`Package must contain a top-level ${MANIFEST_NAME} file.`);
  } // ... which must be valid YAML


  let manifest;

  try {
    manifest = _jsYaml.default.load(manifestBuffer.toString());
  } catch (error) {
    throw new _errors.PackageInvalidArchiveError(`Could not parse top-level package manifest: ${error}.`);
  } // must have mandatory fields


  const reqGiven = (0, _lodash.pick)(manifest, requiredArchivePackageProps);
  const requiredKeysMatch = Object.keys(reqGiven).toString() === requiredArchivePackageProps.toString();

  if (!requiredKeysMatch) {
    const list = requiredArchivePackageProps.join(', ');
    throw new _errors.PackageInvalidArchiveError(`Invalid top-level package manifest: one or more fields missing of ${list}`);
  } // at least have all required properties
  // get optional values and combine into one object for the remaining operations


  const optGiven = (0, _lodash.pick)(manifest, optionalArchivePackageProps);
  const parsed = { ...reqGiven,
    ...optGiven
  }; // Package name and version from the manifest must match those from the toplevel directory

  const pkgKey = (0, _registry.pkgToPkgKey)({
    name: parsed.name,
    version: parsed.version
  });

  if (toplevelDir !== pkgKey) {
    throw new _errors.PackageInvalidArchiveError(`Name ${parsed.name} and version ${parsed.version} do not match top-level directory ${toplevelDir}`);
  }

  parsed.data_streams = parseAndVerifyDataStreams(paths, parsed.name, parsed.version);
  parsed.policy_templates = parseAndVerifyPolicyTemplates(manifest); // add readme if exists

  const readme = parseAndVerifyReadme(paths, parsed.name, parsed.version);

  if (readme) {
    parsed.readme = readme;
  }

  return parsed;
}

function parseAndVerifyReadme(paths, pkgName, pkgVersion) {
  const readmeRelPath = `/docs/README.md`;
  const readmePath = `${pkgName}-${pkgVersion}${readmeRelPath}`;
  return paths.includes(readmePath) ? `/package/${pkgName}/${pkgVersion}${readmeRelPath}` : null;
}

function parseAndVerifyDataStreams(paths, pkgName, pkgVersion) {
  // A data stream is made up of a subdirectory of name-version/data_stream/, containing a manifest.yml
  let dataStreamPaths = [];
  const dataStreams = [];
  const pkgKey = (0, _registry.pkgToPkgKey)({
    name: pkgName,
    version: pkgVersion
  }); // pick all paths matching name-version/data_stream/DATASTREAM_PATH/...
  // from those, pick all unique data stream paths

  paths.filter(path => path.startsWith(`${pkgKey}/data_stream/`)).forEach(path => {
    const parts = path.split('/');
    if (parts.length > 2 && parts[2]) dataStreamPaths.push(parts[2]);
  });
  dataStreamPaths = (0, _lodash.uniq)(dataStreamPaths);
  dataStreamPaths.forEach(dataStreamPath => {
    const manifestFile = `${pkgKey}/data_stream/${dataStreamPath}/${MANIFEST_NAME}`;
    const manifestBuffer = MANIFESTS[manifestFile];

    if (!paths.includes(manifestFile) || !manifestBuffer) {
      throw new _errors.PackageInvalidArchiveError(`No manifest.yml file found for data stream '${dataStreamPath}'`);
    }

    let manifest;

    try {
      manifest = _jsYaml.default.load(manifestBuffer.toString());
    } catch (error) {
      throw new _errors.PackageInvalidArchiveError(`Could not parse package manifest for data stream '${dataStreamPath}': ${error}.`);
    }

    const {
      title: dataStreamTitle,
      release,
      type,
      dataset,
      ingest_pipeline: ingestPipeline,
      streams: manifestStreams,
      ...restOfProps
    } = manifest;

    if (!(dataStreamTitle && release && type)) {
      throw new _errors.PackageInvalidArchiveError(`Invalid manifest for data stream '${dataStreamPath}': one or more fields missing of 'title', 'release', 'type'`);
    }

    const streams = parseAndVerifyStreams(manifestStreams, dataStreamPath); // default ingest pipeline name see https://github.com/elastic/package-registry/blob/master/util/dataset.go#L26

    dataStreams.push(Object.entries(restOfProps).reduce((validatedDataStream, [key, value]) => {
      if (registryDataStreamProps.includes(key)) {
        // @ts-expect-error
        validatedDataStream[key] = value;
      }

      return validatedDataStream;
    }, {
      title: dataStreamTitle,
      release,
      type,
      package: pkgName,
      dataset: dataset || `${pkgName}.${dataStreamPath}`,
      ingest_pipeline: ingestPipeline || 'default',
      path: dataStreamPath,
      streams
    }));
  });
  return dataStreams;
}

function parseAndVerifyStreams(manifestStreams, dataStreamPath) {
  const streams = [];

  if (manifestStreams && manifestStreams.length > 0) {
    manifestStreams.forEach(manifestStream => {
      const {
        input,
        title: streamTitle,
        vars: manifestVars,
        template_path: templatePath,
        ...restOfProps
      } = manifestStream;

      if (!(input && streamTitle)) {
        throw new _errors.PackageInvalidArchiveError(`Invalid manifest for data stream ${dataStreamPath}: stream is missing one or more fields of: input, title`);
      }

      const vars = parseAndVerifyVars(manifestVars, `data stream ${dataStreamPath}`); // default template path name see https://github.com/elastic/package-registry/blob/master/util/dataset.go#L143

      streams.push(Object.entries(restOfProps).reduce((validatedStream, [key, value]) => {
        if (registryStreamProps.includes(key)) {
          // @ts-expect-error
          validatedStream[key] = value;
        }

        return validatedStream;
      }, {
        input,
        title: streamTitle,
        vars,
        template_path: templatePath || 'stream.yml.hbs'
      }));
    });
  }

  return streams;
}

function parseAndVerifyVars(manifestVars, location) {
  const vars = [];

  if (manifestVars && manifestVars.length > 0) {
    manifestVars.forEach(manifestVar => {
      const {
        name,
        type,
        ...restOfProps
      } = manifestVar;

      if (!(name && type)) {
        throw new _errors.PackageInvalidArchiveError(`Invalid var definition for ${location}: one of mandatory fields 'name' and 'type' missing in var: ${manifestVar}`);
      }

      vars.push(Object.entries(restOfProps).reduce((validatedVarEntry, [key, value]) => {
        if (registryVarsProps.includes(key)) {
          // @ts-expect-error
          validatedVarEntry[key] = value;
        }

        return validatedVarEntry;
      }, {
        name,
        type
      }));
    });
  }

  return vars;
}

function parseAndVerifyPolicyTemplates(manifest) {
  const policyTemplates = [];
  const manifestPolicyTemplates = manifest.policy_templates;

  if (manifestPolicyTemplates && manifestPolicyTemplates.length > 0) {
    manifestPolicyTemplates.forEach(policyTemplate => {
      const {
        name,
        title: policyTemplateTitle,
        description,
        inputs,
        multiple,
        ...restOfProps
      } = policyTemplate;

      if (!(name && policyTemplateTitle && description)) {
        throw new _errors.PackageInvalidArchiveError(`Invalid top-level manifest: one of mandatory fields 'name', 'title', 'description' is missing in policy template: ${policyTemplate}`);
      }

      let parsedInputs = [];

      if (inputs) {
        parsedInputs = parseAndVerifyInputs(inputs, `config template ${name}`);
      } // defaults to true if undefined, but may be explicitly set to false.


      let parsedMultiple = true;
      if (typeof multiple === 'boolean' && multiple === false) parsedMultiple = false;
      policyTemplates.push(Object.entries(restOfProps).reduce((validatedPolicyTemplate, [key, value]) => {
        if (registryPolicyTemplateProps.includes(key)) {
          // @ts-expect-error
          validatedPolicyTemplate[key] = value;
        }

        return validatedPolicyTemplate;
      }, {
        name,
        title: policyTemplateTitle,
        description,
        inputs: parsedInputs,
        multiple: parsedMultiple
      }));
    });
  }

  return policyTemplates;
}

function parseAndVerifyInputs(manifestInputs, location) {
  const inputs = [];

  if (manifestInputs && manifestInputs.length > 0) {
    manifestInputs.forEach(input => {
      const {
        title: inputTitle,
        vars,
        ...restOfProps
      } = input;

      if (!(input.type && inputTitle)) {
        throw new _errors.PackageInvalidArchiveError(`Invalid top-level manifest: one of mandatory fields 'type', 'title' missing in input: ${input}`);
      }

      const parsedVars = parseAndVerifyVars(vars, location);
      inputs.push(Object.entries(restOfProps).reduce((validatedInput, [key, value]) => {
        if (registryInputProps.includes(key)) {
          // @ts-expect-error
          validatedInput[key] = value;
        }

        return validatedInput;
      }, {
        title: inputTitle,
        vars: parsedVars
      }));
    });
  }

  return inputs;
}