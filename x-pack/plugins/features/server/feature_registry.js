"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FeatureRegistry = void 0;

var _lodash = require("lodash");

var _common = require("../common");

var _feature_schema = require("./feature_schema");

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

class FeatureRegistry {
  constructor() {
    _defineProperty(this, "locked", false);

    _defineProperty(this, "kibanaFeatures", {});

    _defineProperty(this, "esFeatures", {});
  }

  registerKibanaFeature(feature) {
    if (this.locked) {
      throw new Error(`Features are locked, can't register new features. Attempt to register ${feature.id} failed.`);
    }

    (0, _feature_schema.validateKibanaFeature)(feature);

    if (feature.id in this.kibanaFeatures || feature.id in this.esFeatures) {
      throw new Error(`Feature with id ${feature.id} is already registered.`);
    }

    const featureCopy = (0, _lodash.cloneDeep)(feature);
    this.kibanaFeatures[feature.id] = applyAutomaticPrivilegeGrants(featureCopy);
  }

  registerElasticsearchFeature(feature) {
    if (this.locked) {
      throw new Error(`Features are locked, can't register new features. Attempt to register ${feature.id} failed.`);
    }

    if (feature.id in this.kibanaFeatures || feature.id in this.esFeatures) {
      throw new Error(`Feature with id ${feature.id} is already registered.`);
    }

    (0, _feature_schema.validateElasticsearchFeature)(feature);
    const featureCopy = (0, _lodash.cloneDeep)(feature);
    this.esFeatures[feature.id] = featureCopy;
  }

  getAllKibanaFeatures(license, ignoreLicense = false) {
    this.locked = true;
    let features = Object.values(this.kibanaFeatures);
    const performLicenseCheck = license && !ignoreLicense;

    if (performLicenseCheck) {
      features = features.filter(feature => {
        var _feature$subFeatures;

        const filter = !feature.minimumLicense || license.hasAtLeast(feature.minimumLicense);
        if (!filter) return false;
        (_feature$subFeatures = feature.subFeatures) === null || _feature$subFeatures === void 0 ? void 0 : _feature$subFeatures.forEach(subFeature => {
          subFeature.privilegeGroups.forEach(group => {
            group.privileges = group.privileges.filter(privilege => !privilege.minimumLicense || license.hasAtLeast(privilege.minimumLicense));
          });
        });
        return true;
      });
    }

    return features.map(featureConfig => new _common.KibanaFeature(featureConfig));
  }

  getAllElasticsearchFeatures() {
    this.locked = true;
    return Object.values(this.esFeatures).map(featureConfig => new _common.ElasticsearchFeature(featureConfig));
  }

}

exports.FeatureRegistry = FeatureRegistry;

function applyAutomaticPrivilegeGrants(feature) {
  var _feature$privileges, _feature$privileges2, _feature$reserved$pri, _feature$reserved;

  const allPrivilege = (_feature$privileges = feature.privileges) === null || _feature$privileges === void 0 ? void 0 : _feature$privileges.all;
  const readPrivilege = (_feature$privileges2 = feature.privileges) === null || _feature$privileges2 === void 0 ? void 0 : _feature$privileges2.read;
  const reservedPrivileges = ((_feature$reserved$pri = (_feature$reserved = feature.reserved) === null || _feature$reserved === void 0 ? void 0 : _feature$reserved.privileges) !== null && _feature$reserved$pri !== void 0 ? _feature$reserved$pri : []).map(rp => rp.privilege);
  applyAutomaticAllPrivilegeGrants(allPrivilege, ...reservedPrivileges);
  applyAutomaticReadPrivilegeGrants(readPrivilege);
  return feature;
}

function applyAutomaticAllPrivilegeGrants(...allPrivileges) {
  allPrivileges.forEach(allPrivilege => {
    if (allPrivilege) {
      allPrivilege.savedObject.all = (0, _lodash.uniq)([...allPrivilege.savedObject.all, 'telemetry']);
      allPrivilege.savedObject.read = (0, _lodash.uniq)([...allPrivilege.savedObject.read, 'config', 'url']);
    }
  });
}

function applyAutomaticReadPrivilegeGrants(...readPrivileges) {
  readPrivileges.forEach(readPrivilege => {
    if (readPrivilege) {
      readPrivilege.savedObject.read = (0, _lodash.uniq)([...readPrivilege.savedObject.read, 'config', 'telemetry', 'url']);
    }
  });
}