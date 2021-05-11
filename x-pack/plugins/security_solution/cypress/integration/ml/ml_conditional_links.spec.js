"use strict";

var _security_header = require("../../screens/security_header");

var _common = require("../../tasks/common");

var _login = require("../../tasks/login");

var _ml_conditional_links = require("../../urls/ml_conditional_links");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('ml conditional links', () => {
  before(() => {
    (0, _common.cleanKibana)();
  });
  it('sets the KQL from a single IP with a value for the query', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_ml_conditional_links.mlNetworkSingleIpKqlQuery);
    cy.get(_security_header.KQL_INPUT).should('have.text', '(process.name: "conhost.exe" or process.name: "sc.exe")');
  });
  it('sets the KQL from a multiple IPs with a null for the query', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_ml_conditional_links.mlNetworkMultipleIpNullKqlQuery);
    cy.get(_security_header.KQL_INPUT).should('have.text', '((source.ip: "127.0.0.1" or destination.ip: "127.0.0.1") or (source.ip: "127.0.0.2" or destination.ip: "127.0.0.2"))');
  });
  it('sets the KQL from a multiple IPs with a value for the query', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_ml_conditional_links.mlNetworkMultipleIpKqlQuery);
    cy.get(_security_header.KQL_INPUT).should('have.text', '((source.ip: "127.0.0.1" or destination.ip: "127.0.0.1") or (source.ip: "127.0.0.2" or destination.ip: "127.0.0.2")) and ((process.name: "conhost.exe" or process.name: "sc.exe"))');
  });
  it('sets the KQL from a $ip$ with a value for the query', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_ml_conditional_links.mlNetworkKqlQuery);
    cy.get(_security_header.KQL_INPUT).should('have.text', '(process.name: "conhost.exe" or process.name: "sc.exe")');
  });
  it('sets the KQL from a single host name with a value for query', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_ml_conditional_links.mlHostSingleHostKqlQuery);
    cy.get(_security_header.KQL_INPUT).invoke('text').should('eq', '(process.name: "conhost.exe" or process.name: "sc.exe")');
  });
  it('sets the KQL from a multiple host names with null for query', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_ml_conditional_links.mlHostMultiHostNullKqlQuery);
    cy.get(_security_header.KQL_INPUT).should('have.text', '(host.name: "siem-windows" or host.name: "siem-suricata")');
  });
  it('sets the KQL from a multiple host names with a value for query', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_ml_conditional_links.mlHostMultiHostKqlQuery);
    cy.get(_security_header.KQL_INPUT).should('have.text', '(host.name: "siem-windows" or host.name: "siem-suricata") and ((process.name: "conhost.exe" or process.name: "sc.exe"))');
  });
  it('sets the KQL from a undefined/null host name but with a value for query', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_ml_conditional_links.mlHostVariableHostKqlQuery);
    cy.get(_security_header.KQL_INPUT).should('have.text', '(process.name: "conhost.exe" or process.name: "sc.exe")');
  });
  it('redirects from a single IP with a null for the query', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_ml_conditional_links.mlNetworkSingleIpNullKqlQuery);
    cy.url().should('include', '/app/security/network/ip/127.0.0.1/source?timerange=(global:(linkTo:!(timeline),timerange:(from:%272019-08-28T11:00:00.000Z%27,kind:absolute,to:%272019-08-28T13:59:59.999Z%27)),timeline:(linkTo:!(global),timerange:(from:%272019-08-28T11:00:00.000Z%27,kind:absolute,to:%272019-08-28T13:59:59.999Z%27)))&sourcerer=(default:!(%27auditbeat-*%27))');
  });
  it('redirects from a single IP with a value for the query', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_ml_conditional_links.mlNetworkSingleIpKqlQuery);
    cy.url().should('include', '/app/security/network/ip/127.0.0.1/source?query=(language:kuery,query:%27(process.name:%20%22conhost.exe%22%20or%20process.name:%20%22sc.exe%22)%27)&timerange=(global:(linkTo:!(timeline),timerange:(from:%272019-08-28T11:00:00.000Z%27,kind:absolute,to:%272019-08-28T13:59:59.999Z%27)),timeline:(linkTo:!(global),timerange:(from:%272019-08-28T11:00:00.000Z%27,kind:absolute,to:%272019-08-28T13:59:59.999Z%27)))&sourcerer=(default:!(%27auditbeat-*%27))');
  });
  it('redirects from a multiple IPs with a null for the query', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_ml_conditional_links.mlNetworkMultipleIpNullKqlQuery);
    cy.url().should('include', '/app/security/network/flows?query=(language:kuery,query:%27((source.ip:%20%22127.0.0.1%22%20or%20destination.ip:%20%22127.0.0.1%22)%20or%20(source.ip:%20%22127.0.0.2%22%20or%20destination.ip:%20%22127.0.0.2%22))%27)&timerange=(global:(linkTo:!(timeline),timerange:(from:%272019-08-28T11:00:00.000Z%27,kind:absolute,to:%272019-08-28T13:59:59.999Z%27)),timeline:(linkTo:!(global),timerange:(from:%272019-08-28T11:00:00.000Z%27,kind:absolute,to:%272019-08-28T13:59:59.999Z%27)))&sourcerer=(default:!(%27auditbeat-*%27))');
  });
  it('redirects from a multiple IPs with a value for the query', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_ml_conditional_links.mlNetworkMultipleIpKqlQuery);
    cy.url().should('include', '/app/security/network/flows?query=(language:kuery,query:%27((source.ip:%20%22127.0.0.1%22%20or%20destination.ip:%20%22127.0.0.1%22)%20or%20(source.ip:%20%22127.0.0.2%22%20or%20destination.ip:%20%22127.0.0.2%22))%20and%20((process.name:%20%22conhost.exe%22%20or%20process.name:%20%22sc.exe%22))%27)&timerange=(global:(linkTo:!(timeline),timerange:(from:%272019-08-28T11:00:00.000Z%27,kind:absolute,to:%272019-08-28T13:59:59.999Z%27)),timeline:(linkTo:!(global),timerange:(from:%272019-08-28T11:00:00.000Z%27,kind:absolute,to:%272019-08-28T13:59:59.999Z%27)))&sourcerer=(default:!(%27auditbeat-*%27))');
  });
  it('redirects from a $ip$ with a null query', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_ml_conditional_links.mlNetworkNullKqlQuery);
    cy.url().should('include', '/app/security/network/flows?timerange=(global:(linkTo:!(timeline),timerange:(from:%272019-08-28T11:00:00.000Z%27,kind:absolute,to:%272019-08-28T13:59:59.999Z%27)),timeline:(linkTo:!(global),timerange:(from:%272019-08-28T11:00:00.000Z%27,kind:absolute,to:%272019-08-28T13:59:59.999Z%27)))&sourcerer=(default:!(%27auditbeat-*%27))');
  });
  it('redirects from a $ip$ with a value for the query', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_ml_conditional_links.mlNetworkKqlQuery);
    cy.url().should('include', '/app/security/network/flows?query=(language:kuery,query:%27(process.name:%20%22conhost.exe%22%20or%20process.name:%20%22sc.exe%22)%27)&timerange=(global:(linkTo:!(timeline),timerange:(from:%272019-08-28T11:00:00.000Z%27,kind:absolute,to:%272019-08-28T13:59:59.999Z%27)),timeline:(linkTo:!(global),timerange:(from:%272019-08-28T11:00:00.000Z%27,kind:absolute,to:%272019-08-28T13:59:59.999Z%27)))&sourcerer=(default:!(%27auditbeat-*%27))');
  });
  it('redirects from a single host name with a null for the query', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_ml_conditional_links.mlHostSingleHostNullKqlQuery);
    cy.url().should('include', '/app/security/hosts/siem-windows/anomalies?timerange=(global:(linkTo:!(timeline),timerange:(from:%272019-06-06T06:00:00.000Z%27,kind:absolute,to:%272019-06-07T05:59:59.999Z%27)),timeline:(linkTo:!(global),timerange:(from:%272019-06-06T06:00:00.000Z%27,kind:absolute,to:%272019-06-07T05:59:59.999Z%27)))&sourcerer=(default:!(%27auditbeat-*%27))');
  });
  it('redirects from a host name with a variable in the query', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_ml_conditional_links.mlHostSingleHostKqlQueryVariable);
    cy.url().should('include', '/app/security/hosts/siem-windows/anomalies?timerange=(global:(linkTo:!(timeline),timerange:(from:%272019-06-06T06:00:00.000Z%27,kind:absolute,to:%272019-06-07T05:59:59.999Z%27)),timeline:(linkTo:!(global),timerange:(from:%272019-06-06T06:00:00.000Z%27,kind:absolute,to:%272019-06-07T05:59:59.999Z%27)))&sourcerer=(default:!(%27auditbeat-*%27))');
  });
  it('redirects from a single host name with a value for query', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_ml_conditional_links.mlHostSingleHostKqlQuery);
    cy.url().should('include', '/app/security/hosts/siem-windows/anomalies?query=(language:kuery,query:%27(process.name:%20%22conhost.exe%22%20or%20process.name:%20%22sc.exe%22)%27)&timerange=(global:(linkTo:!(timeline),timerange:(from:%272019-06-06T06:00:00.000Z%27,kind:absolute,to:%272019-06-07T05:59:59.999Z%27)),timeline:(linkTo:!(global),timerange:(from:%272019-06-06T06:00:00.000Z%27,kind:absolute,to:%272019-06-07T05:59:59.999Z%27)))&sourcerer=(default:!(%27auditbeat-*%27))');
  });
  it('redirects from a multiple host names with null for query', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_ml_conditional_links.mlHostMultiHostNullKqlQuery);
    cy.url().should('include', '/app/security/hosts/anomalies?query=(language:kuery,query:%27(host.name:%20%22siem-windows%22%20or%20host.name:%20%22siem-suricata%22)%27)&timerange=(global:(linkTo:!(timeline),timerange:(from:%272019-06-06T06:00:00.000Z%27,kind:absolute,to:%272019-06-07T05:59:59.999Z%27)),timeline:(linkTo:!(global),timerange:(from:%272019-06-06T06:00:00.000Z%27,kind:absolute,to:%272019-06-07T05:59:59.999Z%27)))&sourcerer=(default:!(%27auditbeat-*%27))');
  });
  it('redirects from a multiple host names with a value for query', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_ml_conditional_links.mlHostMultiHostKqlQuery);
    cy.url().should('include', '/app/security/hosts/anomalies?query=(language:kuery,query:%27(host.name:%20%22siem-windows%22%20or%20host.name:%20%22siem-suricata%22)%20and%20((process.name:%20%22conhost.exe%22%20or%20process.name:%20%22sc.exe%22))%27)&timerange=(global:(linkTo:!(timeline),timerange:(from:%272019-06-06T06:00:00.000Z%27,kind:absolute,to:%272019-06-07T05:59:59.999Z%27)),timeline:(linkTo:!(global),timerange:(from:%272019-06-06T06:00:00.000Z%27,kind:absolute,to:%272019-06-07T05:59:59.999Z%27)))&sourcerer=(default:!(%27auditbeat-*%27))');
  });
  it('redirects from a undefined/null host name with a null for the KQL', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_ml_conditional_links.mlHostVariableHostNullKqlQuery);
    cy.url().should('include', '/app/security/hosts/anomalies?timerange=(global:(linkTo:!(timeline),timerange:(from:%272019-06-06T06:00:00.000Z%27,kind:absolute,to:%272019-06-07T05:59:59.999Z%27)),timeline:(linkTo:!(global),timerange:(from:%272019-06-06T06:00:00.000Z%27,kind:absolute,to:%272019-06-07T05:59:59.999Z%27)))&sourcerer=(default:!(%27auditbeat-*%27))');
  });
  it('redirects from a undefined/null host name but with a value for query', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_ml_conditional_links.mlHostVariableHostKqlQuery);
    cy.url().should('include', '/app/security/hosts/anomalies?query=(language:kuery,query:%27(process.name:%20%22conhost.exe%22%20or%20process.name:%20%22sc.exe%22)%27)&timerange=(global:(linkTo:!(timeline),timerange:(from:%272019-06-06T06:00:00.000Z%27,kind:absolute,to:%272019-06-07T05:59:59.999Z%27)),timeline:(linkTo:!(global),timerange:(from:%272019-06-06T06:00:00.000Z%27,kind:absolute,to:%272019-06-07T05:59:59.999Z%27)))&sourcerer=(default:!(%27auditbeat-*%27))');
  });
});