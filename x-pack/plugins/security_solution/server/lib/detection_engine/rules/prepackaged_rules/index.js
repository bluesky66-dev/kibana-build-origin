"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rawRules = void 0;

var _credential_access_access_to_browser_credentials_procargs = _interopRequireDefault(require("./credential_access_access_to_browser_credentials_procargs.json"));

var _defense_evasion_tcc_bypass_mounted_apfs_access = _interopRequireDefault(require("./defense_evasion_tcc_bypass_mounted_apfs_access.json"));

var _persistence_enable_root_account = _interopRequireDefault(require("./persistence_enable_root_account.json"));

var _defense_evasion_unload_endpointsecurity_kext = _interopRequireDefault(require("./defense_evasion_unload_endpointsecurity_kext.json"));

var _persistence_account_creation_hide_at_logon = _interopRequireDefault(require("./persistence_account_creation_hide_at_logon.json"));

var _persistence_creation_hidden_login_item_osascript = _interopRequireDefault(require("./persistence_creation_hidden_login_item_osascript.json"));

var _persistence_evasion_hidden_launch_agent_deamon_creation = _interopRequireDefault(require("./persistence_evasion_hidden_launch_agent_deamon_creation.json"));

var _privilege_escalation_local_user_added_to_admin = _interopRequireDefault(require("./privilege_escalation_local_user_added_to_admin.json"));

var _credential_access_keychain_pwd_retrieval_security_cmd = _interopRequireDefault(require("./credential_access_keychain_pwd_retrieval_security_cmd.json"));

var _credential_access_systemkey_dumping = _interopRequireDefault(require("./credential_access_systemkey_dumping.json"));

var _execution_defense_evasion_electron_app_childproc_node_js = _interopRequireDefault(require("./execution_defense_evasion_electron_app_childproc_node_js.json"));

var _execution_revershell_via_shell_cmd = _interopRequireDefault(require("./execution_revershell_via_shell_cmd.json"));

var _persistence_defense_evasion_hidden_launch_agent_deamon_logonitem_process = _interopRequireDefault(require("./persistence_defense_evasion_hidden_launch_agent_deamon_logonitem_process.json"));

var _privilege_escalation_persistence_phantom_dll = _interopRequireDefault(require("./privilege_escalation_persistence_phantom_dll.json"));

var _defense_evasion_privilege_escalation_privacy_pref_sshd_fulldiskaccess = _interopRequireDefault(require("./defense_evasion_privilege_escalation_privacy_pref_sshd_fulldiskaccess.json"));

var _lateral_movement_credential_access_kerberos_bifrostconsole = _interopRequireDefault(require("./lateral_movement_credential_access_kerberos_bifrostconsole.json"));

var _lateral_movement_vpn_connection_attempt = _interopRequireDefault(require("./lateral_movement_vpn_connection_attempt.json"));

var _apm_403_response_to_a_post = _interopRequireDefault(require("./apm_403_response_to_a_post.json"));

var _apm_405_response_method_not_allowed = _interopRequireDefault(require("./apm_405_response_method_not_allowed.json"));

var _apm_null_user_agent = _interopRequireDefault(require("./apm_null_user_agent.json"));

var _apm_sqlmap_user_agent = _interopRequireDefault(require("./apm_sqlmap_user_agent.json"));

var _command_and_control_dns_directly_to_the_internet = _interopRequireDefault(require("./command_and_control_dns_directly_to_the_internet.json"));

var _command_and_control_ftp_file_transfer_protocol_activity_to_the_internet = _interopRequireDefault(require("./command_and_control_ftp_file_transfer_protocol_activity_to_the_internet.json"));

var _command_and_control_irc_internet_relay_chat_protocol_activity_to_the_internet = _interopRequireDefault(require("./command_and_control_irc_internet_relay_chat_protocol_activity_to_the_internet.json"));

var _command_and_control_nat_traversal_port_activity = _interopRequireDefault(require("./command_and_control_nat_traversal_port_activity.json"));

var _command_and_control_port_26_activity = _interopRequireDefault(require("./command_and_control_port_26_activity.json"));

var _command_and_control_port_8000_activity_to_the_internet = _interopRequireDefault(require("./command_and_control_port_8000_activity_to_the_internet.json"));

var _command_and_control_pptp_point_to_point_tunneling_protocol_activity = _interopRequireDefault(require("./command_and_control_pptp_point_to_point_tunneling_protocol_activity.json"));

var _command_and_control_proxy_port_activity_to_the_internet = _interopRequireDefault(require("./command_and_control_proxy_port_activity_to_the_internet.json"));

var _command_and_control_rdp_remote_desktop_protocol_from_the_internet = _interopRequireDefault(require("./command_and_control_rdp_remote_desktop_protocol_from_the_internet.json"));

var _command_and_control_smtp_to_the_internet = _interopRequireDefault(require("./command_and_control_smtp_to_the_internet.json"));

var _command_and_control_sql_server_port_activity_to_the_internet = _interopRequireDefault(require("./command_and_control_sql_server_port_activity_to_the_internet.json"));

var _command_and_control_ssh_secure_shell_from_the_internet = _interopRequireDefault(require("./command_and_control_ssh_secure_shell_from_the_internet.json"));

var _command_and_control_ssh_secure_shell_to_the_internet = _interopRequireDefault(require("./command_and_control_ssh_secure_shell_to_the_internet.json"));

var _command_and_control_telnet_port_activity = _interopRequireDefault(require("./command_and_control_telnet_port_activity.json"));

var _command_and_control_tor_activity_to_the_internet = _interopRequireDefault(require("./command_and_control_tor_activity_to_the_internet.json"));

var _command_and_control_vnc_virtual_network_computing_from_the_internet = _interopRequireDefault(require("./command_and_control_vnc_virtual_network_computing_from_the_internet.json"));

var _command_and_control_vnc_virtual_network_computing_to_the_internet = _interopRequireDefault(require("./command_and_control_vnc_virtual_network_computing_to_the_internet.json"));

var _credential_access_tcpdump_activity = _interopRequireDefault(require("./credential_access_tcpdump_activity.json"));

var _defense_evasion_adding_the_hidden_file_attribute_with_via_attribexe = _interopRequireDefault(require("./defense_evasion_adding_the_hidden_file_attribute_with_via_attribexe.json"));

var _defense_evasion_clearing_windows_event_logs = _interopRequireDefault(require("./defense_evasion_clearing_windows_event_logs.json"));

var _defense_evasion_delete_volume_usn_journal_with_fsutil = _interopRequireDefault(require("./defense_evasion_delete_volume_usn_journal_with_fsutil.json"));

var _defense_evasion_deleting_backup_catalogs_with_wbadmin = _interopRequireDefault(require("./defense_evasion_deleting_backup_catalogs_with_wbadmin.json"));

var _defense_evasion_disable_windows_firewall_rules_with_netsh = _interopRequireDefault(require("./defense_evasion_disable_windows_firewall_rules_with_netsh.json"));

var _defense_evasion_encoding_or_decoding_files_via_certutil = _interopRequireDefault(require("./defense_evasion_encoding_or_decoding_files_via_certutil.json"));

var _defense_evasion_execution_via_trusted_developer_utilities = _interopRequireDefault(require("./defense_evasion_execution_via_trusted_developer_utilities.json"));

var _defense_evasion_misc_lolbin_connecting_to_the_internet = _interopRequireDefault(require("./defense_evasion_misc_lolbin_connecting_to_the_internet.json"));

var _defense_evasion_msbuild_making_network_connections = _interopRequireDefault(require("./defense_evasion_msbuild_making_network_connections.json"));

var _defense_evasion_unusual_network_connection_via_rundll = _interopRequireDefault(require("./defense_evasion_unusual_network_connection_via_rundll32.json"));

var _defense_evasion_unusual_process_network_connection = _interopRequireDefault(require("./defense_evasion_unusual_process_network_connection.json"));

var _defense_evasion_via_filter_manager = _interopRequireDefault(require("./defense_evasion_via_filter_manager.json"));

var _defense_evasion_volume_shadow_copy_deletion_via_wmic = _interopRequireDefault(require("./defense_evasion_volume_shadow_copy_deletion_via_wmic.json"));

var _discovery_process_discovery_via_tasklist_command = _interopRequireDefault(require("./discovery_process_discovery_via_tasklist_command.json"));

var _discovery_whoami_command_activity = _interopRequireDefault(require("./discovery_whoami_command_activity.json"));

var _discovery_whoami_commmand = _interopRequireDefault(require("./discovery_whoami_commmand.json"));

var _endgame_adversary_behavior_detected = _interopRequireDefault(require("./endgame_adversary_behavior_detected.json"));

var _endgame_cred_dumping_detected = _interopRequireDefault(require("./endgame_cred_dumping_detected.json"));

var _endgame_cred_dumping_prevented = _interopRequireDefault(require("./endgame_cred_dumping_prevented.json"));

var _endgame_cred_manipulation_detected = _interopRequireDefault(require("./endgame_cred_manipulation_detected.json"));

var _endgame_cred_manipulation_prevented = _interopRequireDefault(require("./endgame_cred_manipulation_prevented.json"));

var _endgame_exploit_detected = _interopRequireDefault(require("./endgame_exploit_detected.json"));

var _endgame_exploit_prevented = _interopRequireDefault(require("./endgame_exploit_prevented.json"));

var _endgame_malware_detected = _interopRequireDefault(require("./endgame_malware_detected.json"));

var _endgame_malware_prevented = _interopRequireDefault(require("./endgame_malware_prevented.json"));

var _endgame_permission_theft_detected = _interopRequireDefault(require("./endgame_permission_theft_detected.json"));

var _endgame_permission_theft_prevented = _interopRequireDefault(require("./endgame_permission_theft_prevented.json"));

var _endgame_process_injection_detected = _interopRequireDefault(require("./endgame_process_injection_detected.json"));

var _endgame_process_injection_prevented = _interopRequireDefault(require("./endgame_process_injection_prevented.json"));

var _endgame_ransomware_detected = _interopRequireDefault(require("./endgame_ransomware_detected.json"));

var _endgame_ransomware_prevented = _interopRequireDefault(require("./endgame_ransomware_prevented.json"));

var _execution_command_prompt_connecting_to_the_internet = _interopRequireDefault(require("./execution_command_prompt_connecting_to_the_internet.json"));

var _execution_command_shell_started_by_powershell = _interopRequireDefault(require("./execution_command_shell_started_by_powershell.json"));

var _execution_command_shell_started_by_svchost = _interopRequireDefault(require("./execution_command_shell_started_by_svchost.json"));

var _execution_html_help_executable_program_connecting_to_the_internet = _interopRequireDefault(require("./execution_html_help_executable_program_connecting_to_the_internet.json"));

var _execution_psexec_lateral_movement_command = _interopRequireDefault(require("./execution_psexec_lateral_movement_command.json"));

var _execution_register_server_program_connecting_to_the_internet = _interopRequireDefault(require("./execution_register_server_program_connecting_to_the_internet.json"));

var _execution_via_compiled_html_file = _interopRequireDefault(require("./execution_via_compiled_html_file.json"));

var _impact_volume_shadow_copy_deletion_via_vssadmin = _interopRequireDefault(require("./impact_volume_shadow_copy_deletion_via_vssadmin.json"));

var _initial_access_rdp_remote_desktop_protocol_to_the_internet = _interopRequireDefault(require("./initial_access_rdp_remote_desktop_protocol_to_the_internet.json"));

var _initial_access_rpc_remote_procedure_call_from_the_internet = _interopRequireDefault(require("./initial_access_rpc_remote_procedure_call_from_the_internet.json"));

var _initial_access_rpc_remote_procedure_call_to_the_internet = _interopRequireDefault(require("./initial_access_rpc_remote_procedure_call_to_the_internet.json"));

var _initial_access_script_executing_powershell = _interopRequireDefault(require("./initial_access_script_executing_powershell.json"));

var _initial_access_smb_windows_file_sharing_activity_to_the_internet = _interopRequireDefault(require("./initial_access_smb_windows_file_sharing_activity_to_the_internet.json"));

var _initial_access_suspicious_ms_office_child_process = _interopRequireDefault(require("./initial_access_suspicious_ms_office_child_process.json"));

var _initial_access_suspicious_ms_outlook_child_process = _interopRequireDefault(require("./initial_access_suspicious_ms_outlook_child_process.json"));

var _lateral_movement_direct_outbound_smb_connection = _interopRequireDefault(require("./lateral_movement_direct_outbound_smb_connection.json"));

var _lateral_movement_local_service_commands = _interopRequireDefault(require("./lateral_movement_local_service_commands.json"));

var _linux_hping_activity = _interopRequireDefault(require("./linux_hping_activity.json"));

var _linux_iodine_activity = _interopRequireDefault(require("./linux_iodine_activity.json"));

var _linux_mknod_activity = _interopRequireDefault(require("./linux_mknod_activity.json"));

var _linux_netcat_network_connection = _interopRequireDefault(require("./linux_netcat_network_connection.json"));

var _linux_nmap_activity = _interopRequireDefault(require("./linux_nmap_activity.json"));

var _linux_nping_activity = _interopRequireDefault(require("./linux_nping_activity.json"));

var _linux_process_started_in_temp_directory = _interopRequireDefault(require("./linux_process_started_in_temp_directory.json"));

var _linux_socat_activity = _interopRequireDefault(require("./linux_socat_activity.json"));

var _linux_strace_activity = _interopRequireDefault(require("./linux_strace_activity.json"));

var _persistence_adobe_hijack_persistence = _interopRequireDefault(require("./persistence_adobe_hijack_persistence.json"));

var _persistence_kernel_module_activity = _interopRequireDefault(require("./persistence_kernel_module_activity.json"));

var _persistence_local_scheduled_task_commands = _interopRequireDefault(require("./persistence_local_scheduled_task_commands.json"));

var _persistence_priv_escalation_via_accessibility_features = _interopRequireDefault(require("./persistence_priv_escalation_via_accessibility_features.json"));

var _persistence_shell_activity_by_web_server = _interopRequireDefault(require("./persistence_shell_activity_by_web_server.json"));

var _persistence_system_shells_via_services = _interopRequireDefault(require("./persistence_system_shells_via_services.json"));

var _persistence_user_account_creation = _interopRequireDefault(require("./persistence_user_account_creation.json"));

var _persistence_via_application_shimming = _interopRequireDefault(require("./persistence_via_application_shimming.json"));

var _privilege_escalation_unusual_parentchild_relationship = _interopRequireDefault(require("./privilege_escalation_unusual_parentchild_relationship.json"));

var _defense_evasion_modification_of_boot_config = _interopRequireDefault(require("./defense_evasion_modification_of_boot_config.json"));

var _privilege_escalation_uac_bypass_event_viewer = _interopRequireDefault(require("./privilege_escalation_uac_bypass_event_viewer.json"));

var _defense_evasion_msxsl_network = _interopRequireDefault(require("./defense_evasion_msxsl_network.json"));

var _discovery_net_command_system_account = _interopRequireDefault(require("./discovery_net_command_system_account.json"));

var _command_and_control_certutil_network_connection = _interopRequireDefault(require("./command_and_control_certutil_network_connection.json"));

var _defense_evasion_cve_2020_ = _interopRequireDefault(require("./defense_evasion_cve_2020_0601.json"));

var _credential_access_credential_dumping_msbuild = _interopRequireDefault(require("./credential_access_credential_dumping_msbuild.json"));

var _defense_evasion_execution_msbuild_started_by_office_app = _interopRequireDefault(require("./defense_evasion_execution_msbuild_started_by_office_app.json"));

var _defense_evasion_execution_msbuild_started_by_script = _interopRequireDefault(require("./defense_evasion_execution_msbuild_started_by_script.json"));

var _defense_evasion_execution_msbuild_started_by_system_process = _interopRequireDefault(require("./defense_evasion_execution_msbuild_started_by_system_process.json"));

var _defense_evasion_execution_msbuild_started_renamed = _interopRequireDefault(require("./defense_evasion_execution_msbuild_started_renamed.json"));

var _defense_evasion_execution_msbuild_started_unusal_process = _interopRequireDefault(require("./defense_evasion_execution_msbuild_started_unusal_process.json"));

var _defense_evasion_injection_msbuild = _interopRequireDefault(require("./defense_evasion_injection_msbuild.json"));

var _execution_via_net_com_assemblies = _interopRequireDefault(require("./execution_via_net_com_assemblies.json"));

var _ml_linux_anomalous_network_activity = _interopRequireDefault(require("./ml_linux_anomalous_network_activity.json"));

var _ml_linux_anomalous_network_port_activity = _interopRequireDefault(require("./ml_linux_anomalous_network_port_activity.json"));

var _ml_linux_anomalous_network_service = _interopRequireDefault(require("./ml_linux_anomalous_network_service.json"));

var _ml_linux_anomalous_network_url_activity = _interopRequireDefault(require("./ml_linux_anomalous_network_url_activity.json"));

var _ml_linux_anomalous_process_all_hosts = _interopRequireDefault(require("./ml_linux_anomalous_process_all_hosts.json"));

var _ml_linux_anomalous_user_name = _interopRequireDefault(require("./ml_linux_anomalous_user_name.json"));

var _ml_packetbeat_dns_tunneling = _interopRequireDefault(require("./ml_packetbeat_dns_tunneling.json"));

var _ml_packetbeat_rare_dns_question = _interopRequireDefault(require("./ml_packetbeat_rare_dns_question.json"));

var _ml_packetbeat_rare_server_domain = _interopRequireDefault(require("./ml_packetbeat_rare_server_domain.json"));

var _ml_packetbeat_rare_urls = _interopRequireDefault(require("./ml_packetbeat_rare_urls.json"));

var _ml_packetbeat_rare_user_agent = _interopRequireDefault(require("./ml_packetbeat_rare_user_agent.json"));

var _ml_rare_process_by_host_linux = _interopRequireDefault(require("./ml_rare_process_by_host_linux.json"));

var _ml_rare_process_by_host_windows = _interopRequireDefault(require("./ml_rare_process_by_host_windows.json"));

var _ml_suspicious_login_activity = _interopRequireDefault(require("./ml_suspicious_login_activity.json"));

var _ml_windows_anomalous_network_activity = _interopRequireDefault(require("./ml_windows_anomalous_network_activity.json"));

var _ml_windows_anomalous_path_activity = _interopRequireDefault(require("./ml_windows_anomalous_path_activity.json"));

var _ml_windows_anomalous_process_all_hosts = _interopRequireDefault(require("./ml_windows_anomalous_process_all_hosts.json"));

var _ml_windows_anomalous_process_creation = _interopRequireDefault(require("./ml_windows_anomalous_process_creation.json"));

var _ml_windows_anomalous_script = _interopRequireDefault(require("./ml_windows_anomalous_script.json"));

var _ml_windows_anomalous_service = _interopRequireDefault(require("./ml_windows_anomalous_service.json"));

var _ml_windows_anomalous_user_name = _interopRequireDefault(require("./ml_windows_anomalous_user_name.json"));

var _ml_windows_rare_user_runas_event = _interopRequireDefault(require("./ml_windows_rare_user_runas_event.json"));

var _ml_windows_rare_user_type10_remote_login = _interopRequireDefault(require("./ml_windows_rare_user_type10_remote_login.json"));

var _execution_suspicious_pdf_reader = _interopRequireDefault(require("./execution_suspicious_pdf_reader.json"));

var _privilege_escalation_sudoers_file_mod = _interopRequireDefault(require("./privilege_escalation_sudoers_file_mod.json"));

var _defense_evasion_iis_httplogging_disabled = _interopRequireDefault(require("./defense_evasion_iis_httplogging_disabled.json"));

var _execution_python_tty_shell = _interopRequireDefault(require("./execution_python_tty_shell.json"));

var _execution_perl_tty_shell = _interopRequireDefault(require("./execution_perl_tty_shell.json"));

var _defense_evasion_base16_or_base32_encoding_or_decoding_activity = _interopRequireDefault(require("./defense_evasion_base16_or_base32_encoding_or_decoding_activity.json"));

var _defense_evasion_base64_encoding_or_decoding_activity = _interopRequireDefault(require("./defense_evasion_base64_encoding_or_decoding_activity.json"));

var _defense_evasion_hex_encoding_or_decoding_activity = _interopRequireDefault(require("./defense_evasion_hex_encoding_or_decoding_activity.json"));

var _defense_evasion_file_mod_writable_dir = _interopRequireDefault(require("./defense_evasion_file_mod_writable_dir.json"));

var _defense_evasion_disable_selinux_attempt = _interopRequireDefault(require("./defense_evasion_disable_selinux_attempt.json"));

var _discovery_kernel_module_enumeration = _interopRequireDefault(require("./discovery_kernel_module_enumeration.json"));

var _lateral_movement_telnet_network_activity_external = _interopRequireDefault(require("./lateral_movement_telnet_network_activity_external.json"));

var _lateral_movement_telnet_network_activity_internal = _interopRequireDefault(require("./lateral_movement_telnet_network_activity_internal.json"));

var _privilege_escalation_setuid_setgid_bit_set_via_chmod = _interopRequireDefault(require("./privilege_escalation_setuid_setgid_bit_set_via_chmod.json"));

var _defense_evasion_attempt_to_disable_iptables_or_firewall = _interopRequireDefault(require("./defense_evasion_attempt_to_disable_iptables_or_firewall.json"));

var _defense_evasion_kernel_module_removal = _interopRequireDefault(require("./defense_evasion_kernel_module_removal.json"));

var _defense_evasion_attempt_to_disable_syslog_service = _interopRequireDefault(require("./defense_evasion_attempt_to_disable_syslog_service.json"));

var _defense_evasion_file_deletion_via_shred = _interopRequireDefault(require("./defense_evasion_file_deletion_via_shred.json"));

var _discovery_virtual_machine_fingerprinting = _interopRequireDefault(require("./discovery_virtual_machine_fingerprinting.json"));

var _defense_evasion_hidden_file_dir_tmp = _interopRequireDefault(require("./defense_evasion_hidden_file_dir_tmp.json"));

var _defense_evasion_deletion_of_bash_command_line_history = _interopRequireDefault(require("./defense_evasion_deletion_of_bash_command_line_history.json"));

var _impact_cloudwatch_log_group_deletion = _interopRequireDefault(require("./impact_cloudwatch_log_group_deletion.json"));

var _impact_cloudwatch_log_stream_deletion = _interopRequireDefault(require("./impact_cloudwatch_log_stream_deletion.json"));

var _impact_rds_instance_cluster_stoppage = _interopRequireDefault(require("./impact_rds_instance_cluster_stoppage.json"));

var _persistence_attempt_to_deactivate_mfa_for_okta_user_account = _interopRequireDefault(require("./persistence_attempt_to_deactivate_mfa_for_okta_user_account.json"));

var _persistence_rds_cluster_creation = _interopRequireDefault(require("./persistence_rds_cluster_creation.json"));

var _credential_access_attempted_bypass_of_okta_mfa = _interopRequireDefault(require("./credential_access_attempted_bypass_of_okta_mfa.json"));

var _defense_evasion_waf_acl_deletion = _interopRequireDefault(require("./defense_evasion_waf_acl_deletion.json"));

var _impact_attempt_to_revoke_okta_api_token = _interopRequireDefault(require("./impact_attempt_to_revoke_okta_api_token.json"));

var _impact_iam_group_deletion = _interopRequireDefault(require("./impact_iam_group_deletion.json"));

var _impact_possible_okta_dos_attack = _interopRequireDefault(require("./impact_possible_okta_dos_attack.json"));

var _impact_rds_cluster_deletion = _interopRequireDefault(require("./impact_rds_cluster_deletion.json"));

var _initial_access_suspicious_activity_reported_by_okta_user = _interopRequireDefault(require("./initial_access_suspicious_activity_reported_by_okta_user.json"));

var _okta_attempt_to_deactivate_okta_policy = _interopRequireDefault(require("./okta_attempt_to_deactivate_okta_policy.json"));

var _okta_attempt_to_deactivate_okta_policy_rule = _interopRequireDefault(require("./okta_attempt_to_deactivate_okta_policy_rule.json"));

var _okta_attempt_to_modify_okta_network_zone = _interopRequireDefault(require("./okta_attempt_to_modify_okta_network_zone.json"));

var _okta_attempt_to_modify_okta_policy = _interopRequireDefault(require("./okta_attempt_to_modify_okta_policy.json"));

var _okta_attempt_to_modify_okta_policy_rule = _interopRequireDefault(require("./okta_attempt_to_modify_okta_policy_rule.json"));

var _okta_threat_detected_by_okta_threatinsight = _interopRequireDefault(require("./okta_threat_detected_by_okta_threatinsight.json"));

var _persistence_administrator_privileges_assigned_to_okta_group = _interopRequireDefault(require("./persistence_administrator_privileges_assigned_to_okta_group.json"));

var _persistence_attempt_to_create_okta_api_token = _interopRequireDefault(require("./persistence_attempt_to_create_okta_api_token.json"));

var _persistence_attempt_to_reset_mfa_factors_for_okta_user_account = _interopRequireDefault(require("./persistence_attempt_to_reset_mfa_factors_for_okta_user_account.json"));

var _defense_evasion_cloudtrail_logging_deleted = _interopRequireDefault(require("./defense_evasion_cloudtrail_logging_deleted.json"));

var _defense_evasion_ec2_network_acl_deletion = _interopRequireDefault(require("./defense_evasion_ec2_network_acl_deletion.json"));

var _impact_iam_deactivate_mfa_device = _interopRequireDefault(require("./impact_iam_deactivate_mfa_device.json"));

var _defense_evasion_s3_bucket_configuration_deletion = _interopRequireDefault(require("./defense_evasion_s3_bucket_configuration_deletion.json"));

var _defense_evasion_guardduty_detector_deletion = _interopRequireDefault(require("./defense_evasion_guardduty_detector_deletion.json"));

var _okta_attempt_to_delete_okta_policy = _interopRequireDefault(require("./okta_attempt_to_delete_okta_policy.json"));

var _credential_access_iam_user_addition_to_group = _interopRequireDefault(require("./credential_access_iam_user_addition_to_group.json"));

var _persistence_ec2_network_acl_creation = _interopRequireDefault(require("./persistence_ec2_network_acl_creation.json"));

var _impact_ec2_disable_ebs_encryption = _interopRequireDefault(require("./impact_ec2_disable_ebs_encryption.json"));

var _persistence_iam_group_creation = _interopRequireDefault(require("./persistence_iam_group_creation.json"));

var _defense_evasion_waf_rule_or_rule_group_deletion = _interopRequireDefault(require("./defense_evasion_waf_rule_or_rule_group_deletion.json"));

var _collection_cloudtrail_logging_created = _interopRequireDefault(require("./collection_cloudtrail_logging_created.json"));

var _defense_evasion_cloudtrail_logging_suspended = _interopRequireDefault(require("./defense_evasion_cloudtrail_logging_suspended.json"));

var _impact_cloudtrail_logging_updated = _interopRequireDefault(require("./impact_cloudtrail_logging_updated.json"));

var _initial_access_console_login_root = _interopRequireDefault(require("./initial_access_console_login_root.json"));

var _defense_evasion_cloudwatch_alarm_deletion = _interopRequireDefault(require("./defense_evasion_cloudwatch_alarm_deletion.json"));

var _defense_evasion_ec2_flow_log_deletion = _interopRequireDefault(require("./defense_evasion_ec2_flow_log_deletion.json"));

var _defense_evasion_configuration_recorder_stopped = _interopRequireDefault(require("./defense_evasion_configuration_recorder_stopped.json"));

var _exfiltration_ec2_snapshot_change_activity = _interopRequireDefault(require("./exfiltration_ec2_snapshot_change_activity.json"));

var _defense_evasion_config_service_rule_deletion = _interopRequireDefault(require("./defense_evasion_config_service_rule_deletion.json"));

var _okta_attempt_to_modify_or_delete_application_sign_on_policy = _interopRequireDefault(require("./okta_attempt_to_modify_or_delete_application_sign_on_policy.json"));

var _command_and_control_download_rar_powershell_from_internet = _interopRequireDefault(require("./command_and_control_download_rar_powershell_from_internet.json"));

var _initial_access_password_recovery = _interopRequireDefault(require("./initial_access_password_recovery.json"));

var _command_and_control_cobalt_strike_beacon = _interopRequireDefault(require("./command_and_control_cobalt_strike_beacon.json"));

var _command_and_control_fin7_c2_behavior = _interopRequireDefault(require("./command_and_control_fin7_c2_behavior.json"));

var _command_and_control_halfbaked_beacon = _interopRequireDefault(require("./command_and_control_halfbaked_beacon.json"));

var _credential_access_secretsmanager_getsecretvalue = _interopRequireDefault(require("./credential_access_secretsmanager_getsecretvalue.json"));

var _initial_access_via_system_manager = _interopRequireDefault(require("./initial_access_via_system_manager.json"));

var _privilege_escalation_root_login_without_mfa = _interopRequireDefault(require("./privilege_escalation_root_login_without_mfa.json"));

var _privilege_escalation_updateassumerolepolicy = _interopRequireDefault(require("./privilege_escalation_updateassumerolepolicy.json"));

var _impact_hosts_file_modified = _interopRequireDefault(require("./impact_hosts_file_modified.json"));

var _elastic_endpoint_security = _interopRequireDefault(require("./elastic_endpoint_security.json"));

var _external_alerts = _interopRequireDefault(require("./external_alerts.json"));

var _initial_access_login_failures = _interopRequireDefault(require("./initial_access_login_failures.json"));

var _initial_access_login_location = _interopRequireDefault(require("./initial_access_login_location.json"));

var _initial_access_login_sessions = _interopRequireDefault(require("./initial_access_login_sessions.json"));

var _initial_access_login_time = _interopRequireDefault(require("./initial_access_login_time.json"));

var _ml_cloudtrail_error_message_spike = _interopRequireDefault(require("./ml_cloudtrail_error_message_spike.json"));

var _ml_cloudtrail_rare_error_code = _interopRequireDefault(require("./ml_cloudtrail_rare_error_code.json"));

var _ml_cloudtrail_rare_method_by_city = _interopRequireDefault(require("./ml_cloudtrail_rare_method_by_city.json"));

var _ml_cloudtrail_rare_method_by_country = _interopRequireDefault(require("./ml_cloudtrail_rare_method_by_country.json"));

var _ml_cloudtrail_rare_method_by_user = _interopRequireDefault(require("./ml_cloudtrail_rare_method_by_user.json"));

var _credential_access_aws_iam_assume_role_brute_force = _interopRequireDefault(require("./credential_access_aws_iam_assume_role_brute_force.json"));

var _credential_access_okta_brute_force_or_password_spraying = _interopRequireDefault(require("./credential_access_okta_brute_force_or_password_spraying.json"));

var _initial_access_unusual_dns_service_children = _interopRequireDefault(require("./initial_access_unusual_dns_service_children.json"));

var _initial_access_unusual_dns_service_file_writes = _interopRequireDefault(require("./initial_access_unusual_dns_service_file_writes.json"));

var _lateral_movement_dns_server_overflow = _interopRequireDefault(require("./lateral_movement_dns_server_overflow.json"));

var _credential_access_root_console_failure_brute_force = _interopRequireDefault(require("./credential_access_root_console_failure_brute_force.json"));

var _initial_access_unsecure_elasticsearch_node = _interopRequireDefault(require("./initial_access_unsecure_elasticsearch_node.json"));

var _credential_access_domain_backup_dpapi_private_keys = _interopRequireDefault(require("./credential_access_domain_backup_dpapi_private_keys.json"));

var _persistence_gpo_schtask_service_creation = _interopRequireDefault(require("./persistence_gpo_schtask_service_creation.json"));

var _credential_access_credentials_keychains = _interopRequireDefault(require("./credential_access_credentials_keychains.json"));

var _credential_access_kerberosdump_kcc = _interopRequireDefault(require("./credential_access_kerberosdump_kcc.json"));

var _defense_evasion_attempt_del_quarantine_attrib = _interopRequireDefault(require("./defense_evasion_attempt_del_quarantine_attrib.json"));

var _execution_suspicious_psexesvc = _interopRequireDefault(require("./execution_suspicious_psexesvc.json"));

var _execution_via_xp_cmdshell_mssql_stored_procedure = _interopRequireDefault(require("./execution_via_xp_cmdshell_mssql_stored_procedure.json"));

var _privilege_escalation_printspooler_service_suspicious_file = _interopRequireDefault(require("./privilege_escalation_printspooler_service_suspicious_file.json"));

var _privilege_escalation_printspooler_suspicious_spl_file = _interopRequireDefault(require("./privilege_escalation_printspooler_suspicious_spl_file.json"));

var _defense_evasion_azure_diagnostic_settings_deletion = _interopRequireDefault(require("./defense_evasion_azure_diagnostic_settings_deletion.json"));

var _execution_command_virtual_machine = _interopRequireDefault(require("./execution_command_virtual_machine.json"));

var _execution_via_hidden_shell_conhost = _interopRequireDefault(require("./execution_via_hidden_shell_conhost.json"));

var _impact_resource_group_deletion = _interopRequireDefault(require("./impact_resource_group_deletion.json"));

var _persistence_via_telemetrycontroller_scheduledtask_hijack = _interopRequireDefault(require("./persistence_via_telemetrycontroller_scheduledtask_hijack.json"));

var _persistence_via_update_orchestrator_service_hijack = _interopRequireDefault(require("./persistence_via_update_orchestrator_service_hijack.json"));

var _collection_update_event_hub_auth_rule = _interopRequireDefault(require("./collection_update_event_hub_auth_rule.json"));

var _credential_access_iis_apppoolsa_pwd_appcmd = _interopRequireDefault(require("./credential_access_iis_apppoolsa_pwd_appcmd.json"));

var _credential_access_iis_connectionstrings_dumping = _interopRequireDefault(require("./credential_access_iis_connectionstrings_dumping.json"));

var _defense_evasion_event_hub_deletion = _interopRequireDefault(require("./defense_evasion_event_hub_deletion.json"));

var _defense_evasion_firewall_policy_deletion = _interopRequireDefault(require("./defense_evasion_firewall_policy_deletion.json"));

var _defense_evasion_sdelete_like_filename_rename = _interopRequireDefault(require("./defense_evasion_sdelete_like_filename_rename.json"));

var _lateral_movement_remote_ssh_login_enabled = _interopRequireDefault(require("./lateral_movement_remote_ssh_login_enabled.json"));

var _persistence_azure_automation_account_created = _interopRequireDefault(require("./persistence_azure_automation_account_created.json"));

var _persistence_azure_automation_runbook_created_or_modified = _interopRequireDefault(require("./persistence_azure_automation_runbook_created_or_modified.json"));

var _persistence_azure_automation_webhook_created = _interopRequireDefault(require("./persistence_azure_automation_webhook_created.json"));

var _privilege_escalation_uac_bypass_diskcleanup_hijack = _interopRequireDefault(require("./privilege_escalation_uac_bypass_diskcleanup_hijack.json"));

var _credential_access_attempts_to_brute_force_okta_user_account = _interopRequireDefault(require("./credential_access_attempts_to_brute_force_okta_user_account.json"));

var _credential_access_storage_account_key_regenerated = _interopRequireDefault(require("./credential_access_storage_account_key_regenerated.json"));

var _defense_evasion_suspicious_okta_user_password_reset_or_unlock_attempts = _interopRequireDefault(require("./defense_evasion_suspicious_okta_user_password_reset_or_unlock_attempts.json"));

var _defense_evasion_system_critical_proc_abnormal_file_activity = _interopRequireDefault(require("./defense_evasion_system_critical_proc_abnormal_file_activity.json"));

var _defense_evasion_unusual_system_vp_child_program = _interopRequireDefault(require("./defense_evasion_unusual_system_vp_child_program.json"));

var _discovery_blob_container_access_mod = _interopRequireDefault(require("./discovery_blob_container_access_mod.json"));

var _persistence_mfa_disabled_for_azure_user = _interopRequireDefault(require("./persistence_mfa_disabled_for_azure_user.json"));

var _persistence_user_added_as_owner_for_azure_application = _interopRequireDefault(require("./persistence_user_added_as_owner_for_azure_application.json"));

var _persistence_user_added_as_owner_for_azure_service_principal = _interopRequireDefault(require("./persistence_user_added_as_owner_for_azure_service_principal.json"));

var _defense_evasion_dotnet_compiler_parent_process = _interopRequireDefault(require("./defense_evasion_dotnet_compiler_parent_process.json"));

var _defense_evasion_suspicious_managedcode_host_process = _interopRequireDefault(require("./defense_evasion_suspicious_managedcode_host_process.json"));

var _execution_command_shell_started_by_unusual_process = _interopRequireDefault(require("./execution_command_shell_started_by_unusual_process.json"));

var _defense_evasion_masquerading_as_elastic_endpoint_process = _interopRequireDefault(require("./defense_evasion_masquerading_as_elastic_endpoint_process.json"));

var _defense_evasion_masquerading_suspicious_werfault_childproc = _interopRequireDefault(require("./defense_evasion_masquerading_suspicious_werfault_childproc.json"));

var _defense_evasion_masquerading_werfault = _interopRequireDefault(require("./defense_evasion_masquerading_werfault.json"));

var _credential_access_key_vault_modified = _interopRequireDefault(require("./credential_access_key_vault_modified.json"));

var _credential_access_mimikatz_memssp_default_logs = _interopRequireDefault(require("./credential_access_mimikatz_memssp_default_logs.json"));

var _defense_evasion_code_injection_conhost = _interopRequireDefault(require("./defense_evasion_code_injection_conhost.json"));

var _defense_evasion_network_watcher_deletion = _interopRequireDefault(require("./defense_evasion_network_watcher_deletion.json"));

var _initial_access_external_guest_user_invite = _interopRequireDefault(require("./initial_access_external_guest_user_invite.json"));

var _defense_evasion_masquerading_renamed_autoit = _interopRequireDefault(require("./defense_evasion_masquerading_renamed_autoit.json"));

var _impact_azure_automation_runbook_deleted = _interopRequireDefault(require("./impact_azure_automation_runbook_deleted.json"));

var _initial_access_consent_grant_attack_via_azure_registered_application = _interopRequireDefault(require("./initial_access_consent_grant_attack_via_azure_registered_application.json"));

var _persistence_azure_conditional_access_policy_modified = _interopRequireDefault(require("./persistence_azure_conditional_access_policy_modified.json"));

var _persistence_azure_privileged_identity_management_role_modified = _interopRequireDefault(require("./persistence_azure_privileged_identity_management_role_modified.json"));

var _command_and_control_teamviewer_remote_file_copy = _interopRequireDefault(require("./command_and_control_teamviewer_remote_file_copy.json"));

var _defense_evasion_installutil_beacon = _interopRequireDefault(require("./defense_evasion_installutil_beacon.json"));

var _defense_evasion_mshta_beacon = _interopRequireDefault(require("./defense_evasion_mshta_beacon.json"));

var _defense_evasion_network_connection_from_windows_binary = _interopRequireDefault(require("./defense_evasion_network_connection_from_windows_binary.json"));

var _defense_evasion_rundll32_no_arguments = _interopRequireDefault(require("./defense_evasion_rundll32_no_arguments.json"));

var _defense_evasion_suspicious_scrobj_load = _interopRequireDefault(require("./defense_evasion_suspicious_scrobj_load.json"));

var _defense_evasion_suspicious_wmi_script = _interopRequireDefault(require("./defense_evasion_suspicious_wmi_script.json"));

var _execution_ms_office_written_file = _interopRequireDefault(require("./execution_ms_office_written_file.json"));

var _execution_pdf_written_file = _interopRequireDefault(require("./execution_pdf_written_file.json"));

var _lateral_movement_cmd_service = _interopRequireDefault(require("./lateral_movement_cmd_service.json"));

var _persistence_app_compat_shim = _interopRequireDefault(require("./persistence_app_compat_shim.json"));

var _command_and_control_remote_file_copy_desktopimgdownldr = _interopRequireDefault(require("./command_and_control_remote_file_copy_desktopimgdownldr.json"));

var _command_and_control_remote_file_copy_mpcmdrun = _interopRequireDefault(require("./command_and_control_remote_file_copy_mpcmdrun.json"));

var _defense_evasion_execution_suspicious_explorer_winword = _interopRequireDefault(require("./defense_evasion_execution_suspicious_explorer_winword.json"));

var _defense_evasion_suspicious_zoom_child_process = _interopRequireDefault(require("./defense_evasion_suspicious_zoom_child_process.json"));

var _ml_linux_anomalous_compiler_activity = _interopRequireDefault(require("./ml_linux_anomalous_compiler_activity.json"));

var _ml_linux_anomalous_kernel_module_arguments = _interopRequireDefault(require("./ml_linux_anomalous_kernel_module_arguments.json"));

var _ml_linux_anomalous_sudo_activity = _interopRequireDefault(require("./ml_linux_anomalous_sudo_activity.json"));

var _ml_linux_system_information_discovery = _interopRequireDefault(require("./ml_linux_system_information_discovery.json"));

var _ml_linux_system_network_configuration_discovery = _interopRequireDefault(require("./ml_linux_system_network_configuration_discovery.json"));

var _ml_linux_system_network_connection_discovery = _interopRequireDefault(require("./ml_linux_system_network_connection_discovery.json"));

var _ml_linux_system_process_discovery = _interopRequireDefault(require("./ml_linux_system_process_discovery.json"));

var _ml_linux_system_user_discovery = _interopRequireDefault(require("./ml_linux_system_user_discovery.json"));

var _discovery_post_exploitation_public_ip_reconnaissance = _interopRequireDefault(require("./discovery_post_exploitation_public_ip_reconnaissance.json"));

var _initial_access_zoom_meeting_with_no_passcode = _interopRequireDefault(require("./initial_access_zoom_meeting_with_no_passcode.json"));

var _defense_evasion_gcp_logging_sink_deletion = _interopRequireDefault(require("./defense_evasion_gcp_logging_sink_deletion.json"));

var _defense_evasion_gcp_pub_sub_topic_deletion = _interopRequireDefault(require("./defense_evasion_gcp_pub_sub_topic_deletion.json"));

var _defense_evasion_gcp_firewall_rule_created = _interopRequireDefault(require("./defense_evasion_gcp_firewall_rule_created.json"));

var _defense_evasion_gcp_firewall_rule_deleted = _interopRequireDefault(require("./defense_evasion_gcp_firewall_rule_deleted.json"));

var _defense_evasion_gcp_firewall_rule_modified = _interopRequireDefault(require("./defense_evasion_gcp_firewall_rule_modified.json"));

var _defense_evasion_gcp_logging_bucket_deletion = _interopRequireDefault(require("./defense_evasion_gcp_logging_bucket_deletion.json"));

var _defense_evasion_gcp_storage_bucket_permissions_modified = _interopRequireDefault(require("./defense_evasion_gcp_storage_bucket_permissions_modified.json"));

var _impact_gcp_storage_bucket_deleted = _interopRequireDefault(require("./impact_gcp_storage_bucket_deleted.json"));

var _initial_access_gcp_iam_custom_role_creation = _interopRequireDefault(require("./initial_access_gcp_iam_custom_role_creation.json"));

var _persistence_gcp_iam_service_account_key_deletion = _interopRequireDefault(require("./persistence_gcp_iam_service_account_key_deletion.json"));

var _persistence_gcp_key_created_for_service_account = _interopRequireDefault(require("./persistence_gcp_key_created_for_service_account.json"));

var _defense_evasion_gcp_storage_bucket_configuration_modified = _interopRequireDefault(require("./defense_evasion_gcp_storage_bucket_configuration_modified.json"));

var _exfiltration_gcp_logging_sink_modification = _interopRequireDefault(require("./exfiltration_gcp_logging_sink_modification.json"));

var _impact_gcp_iam_role_deletion = _interopRequireDefault(require("./impact_gcp_iam_role_deletion.json"));

var _impact_gcp_service_account_deleted = _interopRequireDefault(require("./impact_gcp_service_account_deleted.json"));

var _impact_gcp_service_account_disabled = _interopRequireDefault(require("./impact_gcp_service_account_disabled.json"));

var _impact_gcp_virtual_private_cloud_network_deleted = _interopRequireDefault(require("./impact_gcp_virtual_private_cloud_network_deleted.json"));

var _impact_gcp_virtual_private_cloud_route_created = _interopRequireDefault(require("./impact_gcp_virtual_private_cloud_route_created.json"));

var _impact_gcp_virtual_private_cloud_route_deleted = _interopRequireDefault(require("./impact_gcp_virtual_private_cloud_route_deleted.json"));

var _ml_linux_anomalous_metadata_process = _interopRequireDefault(require("./ml_linux_anomalous_metadata_process.json"));

var _ml_linux_anomalous_metadata_user = _interopRequireDefault(require("./ml_linux_anomalous_metadata_user.json"));

var _ml_windows_anomalous_metadata_process = _interopRequireDefault(require("./ml_windows_anomalous_metadata_process.json"));

var _ml_windows_anomalous_metadata_user = _interopRequireDefault(require("./ml_windows_anomalous_metadata_user.json"));

var _persistence_gcp_service_account_created = _interopRequireDefault(require("./persistence_gcp_service_account_created.json"));

var _collection_gcp_pub_sub_subscription_creation = _interopRequireDefault(require("./collection_gcp_pub_sub_subscription_creation.json"));

var _collection_gcp_pub_sub_topic_creation = _interopRequireDefault(require("./collection_gcp_pub_sub_topic_creation.json"));

var _defense_evasion_gcp_pub_sub_subscription_deletion = _interopRequireDefault(require("./defense_evasion_gcp_pub_sub_subscription_deletion.json"));

var _persistence_azure_pim_user_added_global_admin = _interopRequireDefault(require("./persistence_azure_pim_user_added_global_admin.json"));

var _command_and_control_cobalt_strike_default_teamserver_cert = _interopRequireDefault(require("./command_and_control_cobalt_strike_default_teamserver_cert.json"));

var _defense_evasion_enable_inbound_rdp_with_netsh = _interopRequireDefault(require("./defense_evasion_enable_inbound_rdp_with_netsh.json"));

var _defense_evasion_execution_lolbas_wuauclt = _interopRequireDefault(require("./defense_evasion_execution_lolbas_wuauclt.json"));

var _privilege_escalation_unusual_svchost_childproc_childless = _interopRequireDefault(require("./privilege_escalation_unusual_svchost_childproc_childless.json"));

var _lateral_movement_rdp_tunnel_plink = _interopRequireDefault(require("./lateral_movement_rdp_tunnel_plink.json"));

var _privilege_escalation_uac_bypass_winfw_mmc_hijack = _interopRequireDefault(require("./privilege_escalation_uac_bypass_winfw_mmc_hijack.json"));

var _persistence_ms_office_addins_file = _interopRequireDefault(require("./persistence_ms_office_addins_file.json"));

var _discovery_adfind_command_activity = _interopRequireDefault(require("./discovery_adfind_command_activity.json"));

var _discovery_security_software_wmic = _interopRequireDefault(require("./discovery_security_software_wmic.json"));

var _execution_command_shell_via_rundll = _interopRequireDefault(require("./execution_command_shell_via_rundll32.json"));

var _execution_suspicious_cmd_wmi = _interopRequireDefault(require("./execution_suspicious_cmd_wmi.json"));

var _lateral_movement_via_startup_folder_rdp_smb = _interopRequireDefault(require("./lateral_movement_via_startup_folder_rdp_smb.json"));

var _privilege_escalation_uac_bypass_com_interface_icmluautil = _interopRequireDefault(require("./privilege_escalation_uac_bypass_com_interface_icmluautil.json"));

var _privilege_escalation_uac_bypass_mock_windir = _interopRequireDefault(require("./privilege_escalation_uac_bypass_mock_windir.json"));

var _defense_evasion_potential_processherpaderping = _interopRequireDefault(require("./defense_evasion_potential_processherpaderping.json"));

var _privilege_escalation_uac_bypass_dll_sideloading = _interopRequireDefault(require("./privilege_escalation_uac_bypass_dll_sideloading.json"));

var _execution_shared_modules_local_sxs_dll = _interopRequireDefault(require("./execution_shared_modules_local_sxs_dll.json"));

var _privilege_escalation_uac_bypass_com_clipup = _interopRequireDefault(require("./privilege_escalation_uac_bypass_com_clipup.json"));

var _initial_access_via_explorer_suspicious_child_parent_args = _interopRequireDefault(require("./initial_access_via_explorer_suspicious_child_parent_args.json"));

var _execution_from_unusual_directory = _interopRequireDefault(require("./execution_from_unusual_directory.json"));

var _execution_from_unusual_path_cmdline = _interopRequireDefault(require("./execution_from_unusual_path_cmdline.json"));

var _credential_access_kerberoasting_unusual_process = _interopRequireDefault(require("./credential_access_kerberoasting_unusual_process.json"));

var _discovery_peripheral_device = _interopRequireDefault(require("./discovery_peripheral_device.json"));

var _lateral_movement_mount_hidden_or_webdav_share_net = _interopRequireDefault(require("./lateral_movement_mount_hidden_or_webdav_share_net.json"));

var _defense_evasion_deleting_websvr_access_logs = _interopRequireDefault(require("./defense_evasion_deleting_websvr_access_logs.json"));

var _defense_evasion_log_files_deleted = _interopRequireDefault(require("./defense_evasion_log_files_deleted.json"));

var _defense_evasion_timestomp_touch = _interopRequireDefault(require("./defense_evasion_timestomp_touch.json"));

var _lateral_movement_dcom_hta = _interopRequireDefault(require("./lateral_movement_dcom_hta.json"));

var _lateral_movement_execution_via_file_shares_sequence = _interopRequireDefault(require("./lateral_movement_execution_via_file_shares_sequence.json"));

var _privilege_escalation_uac_bypass_com_ieinstal = _interopRequireDefault(require("./privilege_escalation_uac_bypass_com_ieinstal.json"));

var _command_and_control_common_webservices = _interopRequireDefault(require("./command_and_control_common_webservices.json"));

var _command_and_control_encrypted_channel_freesslcert = _interopRequireDefault(require("./command_and_control_encrypted_channel_freesslcert.json"));

var _defense_evasion_process_termination_followed_by_deletion = _interopRequireDefault(require("./defense_evasion_process_termination_followed_by_deletion.json"));

var _lateral_movement_remote_file_copy_hidden_share = _interopRequireDefault(require("./lateral_movement_remote_file_copy_hidden_share.json"));

var _attempt_to_deactivate_okta_network_zone = _interopRequireDefault(require("./attempt_to_deactivate_okta_network_zone.json"));

var _attempt_to_delete_okta_network_zone = _interopRequireDefault(require("./attempt_to_delete_okta_network_zone.json"));

var _lateral_movement_dcom_mmc = _interopRequireDefault(require("./lateral_movement_dcom_mmc20.json"));

var _lateral_movement_dcom_shellwindow_shellbrowserwindow = _interopRequireDefault(require("./lateral_movement_dcom_shellwindow_shellbrowserwindow.json"));

var _okta_attempt_to_deactivate_okta_application = _interopRequireDefault(require("./okta_attempt_to_deactivate_okta_application.json"));

var _okta_attempt_to_delete_okta_application = _interopRequireDefault(require("./okta_attempt_to_delete_okta_application.json"));

var _okta_attempt_to_delete_okta_policy_rule = _interopRequireDefault(require("./okta_attempt_to_delete_okta_policy_rule.json"));

var _okta_attempt_to_modify_okta_application = _interopRequireDefault(require("./okta_attempt_to_modify_okta_application.json"));

var _persistence_administrator_role_assigned_to_okta_user = _interopRequireDefault(require("./persistence_administrator_role_assigned_to_okta_user.json"));

var _lateral_movement_executable_tool_transfer_smb = _interopRequireDefault(require("./lateral_movement_executable_tool_transfer_smb.json"));

var _command_and_control_dns_tunneling_nslookup = _interopRequireDefault(require("./command_and_control_dns_tunneling_nslookup.json"));

var _lateral_movement_execution_from_tsclient_mup = _interopRequireDefault(require("./lateral_movement_execution_from_tsclient_mup.json"));

var _lateral_movement_rdp_sharprdp_target = _interopRequireDefault(require("./lateral_movement_rdp_sharprdp_target.json"));

var _defense_evasion_clearing_windows_security_logs = _interopRequireDefault(require("./defense_evasion_clearing_windows_security_logs.json"));

var _persistence_google_workspace_api_access_granted_via_domain_wide_delegation_of_authority = _interopRequireDefault(require("./persistence_google_workspace_api_access_granted_via_domain_wide_delegation_of_authority.json"));

var _execution_suspicious_short_program_name = _interopRequireDefault(require("./execution_suspicious_short_program_name.json"));

var _lateral_movement_incoming_wmi = _interopRequireDefault(require("./lateral_movement_incoming_wmi.json"));

var _persistence_via_hidden_run_key_valuename = _interopRequireDefault(require("./persistence_via_hidden_run_key_valuename.json"));

var _credential_access_potential_ssh_bruteforce = _interopRequireDefault(require("./credential_access_potential_ssh_bruteforce.json"));

var _credential_access_promt_for_pwd_via_osascript = _interopRequireDefault(require("./credential_access_promt_for_pwd_via_osascript.json"));

var _lateral_movement_remote_services = _interopRequireDefault(require("./lateral_movement_remote_services.json"));

var _application_added_to_google_workspace_domain = _interopRequireDefault(require("./application_added_to_google_workspace_domain.json"));

var _domain_added_to_google_workspace_trusted_domains = _interopRequireDefault(require("./domain_added_to_google_workspace_trusted_domains.json"));

var _execution_suspicious_image_load_wmi_ms_office = _interopRequireDefault(require("./execution_suspicious_image_load_wmi_ms_office.json"));

var _execution_suspicious_powershell_imgload = _interopRequireDefault(require("./execution_suspicious_powershell_imgload.json"));

var _google_workspace_admin_role_deletion = _interopRequireDefault(require("./google_workspace_admin_role_deletion.json"));

var _google_workspace_mfa_enforcement_disabled = _interopRequireDefault(require("./google_workspace_mfa_enforcement_disabled.json"));

var _google_workspace_policy_modified = _interopRequireDefault(require("./google_workspace_policy_modified.json"));

var _mfa_disabled_for_google_workspace_organization = _interopRequireDefault(require("./mfa_disabled_for_google_workspace_organization.json"));

var _persistence_evasion_registry_ifeo_injection = _interopRequireDefault(require("./persistence_evasion_registry_ifeo_injection.json"));

var _persistence_google_workspace_admin_role_assigned_to_user = _interopRequireDefault(require("./persistence_google_workspace_admin_role_assigned_to_user.json"));

var _persistence_google_workspace_custom_admin_role_created = _interopRequireDefault(require("./persistence_google_workspace_custom_admin_role_created.json"));

var _persistence_google_workspace_role_modified = _interopRequireDefault(require("./persistence_google_workspace_role_modified.json"));

var _persistence_suspicious_image_load_scheduled_task_ms_office = _interopRequireDefault(require("./persistence_suspicious_image_load_scheduled_task_ms_office.json"));

var _defense_evasion_masquerading_trusted_directory = _interopRequireDefault(require("./defense_evasion_masquerading_trusted_directory.json"));

var _exfiltration_microsoft_365_exchange_transport_rule_creation = _interopRequireDefault(require("./exfiltration_microsoft_365_exchange_transport_rule_creation.json"));

var _initial_access_microsoft_365_exchange_safelinks_disabled = _interopRequireDefault(require("./initial_access_microsoft_365_exchange_safelinks_disabled.json"));

var _microsoft_365_exchange_dkim_signing_config_disabled = _interopRequireDefault(require("./microsoft_365_exchange_dkim_signing_config_disabled.json"));

var _persistence_appcertdlls_registry = _interopRequireDefault(require("./persistence_appcertdlls_registry.json"));

var _persistence_appinitdlls_registry = _interopRequireDefault(require("./persistence_appinitdlls_registry.json"));

var _persistence_registry_uncommon = _interopRequireDefault(require("./persistence_registry_uncommon.json"));

var _persistence_run_key_and_startup_broad = _interopRequireDefault(require("./persistence_run_key_and_startup_broad.json"));

var _persistence_services_registry = _interopRequireDefault(require("./persistence_services_registry.json"));

var _persistence_startup_folder_file_written_by_suspicious_process = _interopRequireDefault(require("./persistence_startup_folder_file_written_by_suspicious_process.json"));

var _persistence_startup_folder_scripts = _interopRequireDefault(require("./persistence_startup_folder_scripts.json"));

var _persistence_suspicious_com_hijack_registry = _interopRequireDefault(require("./persistence_suspicious_com_hijack_registry.json"));

var _persistence_via_lsa_security_support_provider_registry = _interopRequireDefault(require("./persistence_via_lsa_security_support_provider_registry.json"));

var _defense_evasion_microsoft_365_exchange_malware_filter_policy_deletion = _interopRequireDefault(require("./defense_evasion_microsoft_365_exchange_malware_filter_policy_deletion.json"));

var _defense_evasion_microsoft_365_exchange_malware_filter_rule_mod = _interopRequireDefault(require("./defense_evasion_microsoft_365_exchange_malware_filter_rule_mod.json"));

var _defense_evasion_microsoft_365_exchange_safe_attach_rule_disabled = _interopRequireDefault(require("./defense_evasion_microsoft_365_exchange_safe_attach_rule_disabled.json"));

var _exfiltration_microsoft_365_exchange_transport_rule_mod = _interopRequireDefault(require("./exfiltration_microsoft_365_exchange_transport_rule_mod.json"));

var _initial_access_microsoft_365_exchange_anti_phish_policy_deletion = _interopRequireDefault(require("./initial_access_microsoft_365_exchange_anti_phish_policy_deletion.json"));

var _initial_access_microsoft_365_exchange_anti_phish_rule_mod = _interopRequireDefault(require("./initial_access_microsoft_365_exchange_anti_phish_rule_mod.json"));

var _lateral_movement_suspicious_rdp_client_imageload = _interopRequireDefault(require("./lateral_movement_suspicious_rdp_client_imageload.json"));

var _persistence_runtime_run_key_startup_susp_procs = _interopRequireDefault(require("./persistence_runtime_run_key_startup_susp_procs.json"));

var _persistence_suspicious_scheduled_task_runtime = _interopRequireDefault(require("./persistence_suspicious_scheduled_task_runtime.json"));

var _defense_evasion_microsoft_365_exchange_dlp_policy_removed = _interopRequireDefault(require("./defense_evasion_microsoft_365_exchange_dlp_policy_removed.json"));

var _lateral_movement_scheduled_task_target = _interopRequireDefault(require("./lateral_movement_scheduled_task_target.json"));

var _persistence_microsoft_365_exchange_management_role_assignment = _interopRequireDefault(require("./persistence_microsoft_365_exchange_management_role_assignment.json"));

var _persistence_microsoft_365_teams_guest_access_enabled = _interopRequireDefault(require("./persistence_microsoft_365_teams_guest_access_enabled.json"));

var _credential_access_dump_registry_hives = _interopRequireDefault(require("./credential_access_dump_registry_hives.json"));

var _defense_evasion_scheduledjobs_at_protocol_enabled = _interopRequireDefault(require("./defense_evasion_scheduledjobs_at_protocol_enabled.json"));

var _persistence_ms_outlook_vba_template = _interopRequireDefault(require("./persistence_ms_outlook_vba_template.json"));

var _persistence_suspicious_service_created_registry = _interopRequireDefault(require("./persistence_suspicious_service_created_registry.json"));

var _privilege_escalation_named_pipe_impersonation = _interopRequireDefault(require("./privilege_escalation_named_pipe_impersonation.json"));

var _credential_access_cmdline_dump_tool = _interopRequireDefault(require("./credential_access_cmdline_dump_tool.json"));

var _credential_access_copy_ntds_sam_volshadowcp_cmdline = _interopRequireDefault(require("./credential_access_copy_ntds_sam_volshadowcp_cmdline.json"));

var _credential_access_lsass_memdump_file_created = _interopRequireDefault(require("./credential_access_lsass_memdump_file_created.json"));

var _lateral_movement_incoming_winrm_shell_execution = _interopRequireDefault(require("./lateral_movement_incoming_winrm_shell_execution.json"));

var _lateral_movement_powershell_remoting_target = _interopRequireDefault(require("./lateral_movement_powershell_remoting_target.json"));

var _defense_evasion_hide_encoded_executable_registry = _interopRequireDefault(require("./defense_evasion_hide_encoded_executable_registry.json"));

var _defense_evasion_port_forwarding_added_registry = _interopRequireDefault(require("./defense_evasion_port_forwarding_added_registry.json"));

var _lateral_movement_rdp_enabled_registry = _interopRequireDefault(require("./lateral_movement_rdp_enabled_registry.json"));

var _privilege_escalation_printspooler_registry_copyfiles = _interopRequireDefault(require("./privilege_escalation_printspooler_registry_copyfiles.json"));

var _privilege_escalation_rogue_windir_environment_var = _interopRequireDefault(require("./privilege_escalation_rogue_windir_environment_var.json"));

var _initial_access_scripts_process_started_via_wmi = _interopRequireDefault(require("./initial_access_scripts_process_started_via_wmi.json"));

var _command_and_control_iexplore_via_com = _interopRequireDefault(require("./command_and_control_iexplore_via_com.json"));

var _command_and_control_remote_file_copy_scripts = _interopRequireDefault(require("./command_and_control_remote_file_copy_scripts.json"));

var _persistence_local_scheduled_task_scripting = _interopRequireDefault(require("./persistence_local_scheduled_task_scripting.json"));

var _persistence_startup_folder_file_written_by_unsigned_process = _interopRequireDefault(require("./persistence_startup_folder_file_written_by_unsigned_process.json"));

var _command_and_control_remote_file_copy_powershell = _interopRequireDefault(require("./command_and_control_remote_file_copy_powershell.json"));

var _credential_access_microsoft_365_brute_force_user_account_attempt = _interopRequireDefault(require("./credential_access_microsoft_365_brute_force_user_account_attempt.json"));

var _microsoft_365_teams_custom_app_interaction_allowed = _interopRequireDefault(require("./microsoft_365_teams_custom_app_interaction_allowed.json"));

var _persistence_microsoft_365_teams_external_access_enabled = _interopRequireDefault(require("./persistence_microsoft_365_teams_external_access_enabled.json"));

var _credential_access_microsoft_365_potential_password_spraying_attack = _interopRequireDefault(require("./credential_access_microsoft_365_potential_password_spraying_attack.json"));

var _defense_evasion_stop_process_service_threshold = _interopRequireDefault(require("./defense_evasion_stop_process_service_threshold.json"));

var _collection_winrar_encryption = _interopRequireDefault(require("./collection_winrar_encryption.json"));

var _defense_evasion_unusual_dir_ads = _interopRequireDefault(require("./defense_evasion_unusual_dir_ads.json"));

var _discovery_admin_recon = _interopRequireDefault(require("./discovery_admin_recon.json"));

var _discovery_file_dir_discovery = _interopRequireDefault(require("./discovery_file_dir_discovery.json"));

var _discovery_net_view = _interopRequireDefault(require("./discovery_net_view.json"));

var _discovery_query_registry_via_reg = _interopRequireDefault(require("./discovery_query_registry_via_reg.json"));

var _discovery_remote_system_discovery_commands_windows = _interopRequireDefault(require("./discovery_remote_system_discovery_commands_windows.json"));

var _persistence_via_windows_management_instrumentation_event_subscription = _interopRequireDefault(require("./persistence_via_windows_management_instrumentation_event_subscription.json"));

var _execution_scripting_osascript_exec_followed_by_netcon = _interopRequireDefault(require("./execution_scripting_osascript_exec_followed_by_netcon.json"));

var _execution_shell_execution_via_apple_scripting = _interopRequireDefault(require("./execution_shell_execution_via_apple_scripting.json"));

var _persistence_creation_change_launch_agents_file = _interopRequireDefault(require("./persistence_creation_change_launch_agents_file.json"));

var _persistence_creation_modif_launch_deamon_sequence = _interopRequireDefault(require("./persistence_creation_modif_launch_deamon_sequence.json"));

var _persistence_folder_action_scripts_runtime = _interopRequireDefault(require("./persistence_folder_action_scripts_runtime.json"));

var _persistence_login_logout_hooks_defaults = _interopRequireDefault(require("./persistence_login_logout_hooks_defaults.json"));

var _privilege_escalation_explicit_creds_via_scripting = _interopRequireDefault(require("./privilege_escalation_explicit_creds_via_scripting.json"));

var _command_and_control_sunburst_c2_activity_detected = _interopRequireDefault(require("./command_and_control_sunburst_c2_activity_detected.json"));

var _defense_evasion_azure_application_credential_modification = _interopRequireDefault(require("./defense_evasion_azure_application_credential_modification.json"));

var _defense_evasion_azure_service_principal_addition = _interopRequireDefault(require("./defense_evasion_azure_service_principal_addition.json"));

var _defense_evasion_solarwinds_backdoor_service_disabled_via_registry = _interopRequireDefault(require("./defense_evasion_solarwinds_backdoor_service_disabled_via_registry.json"));

var _execution_apt_solarwinds_backdoor_child_cmd_powershell = _interopRequireDefault(require("./execution_apt_solarwinds_backdoor_child_cmd_powershell.json"));

var _execution_apt_solarwinds_backdoor_unusual_child_processes = _interopRequireDefault(require("./execution_apt_solarwinds_backdoor_unusual_child_processes.json"));

var _initial_access_azure_active_directory_powershell_signin = _interopRequireDefault(require("./initial_access_azure_active_directory_powershell_signin.json"));

var _collection_email_powershell_exchange_mailbox = _interopRequireDefault(require("./collection_email_powershell_exchange_mailbox.json"));

var _collection_persistence_powershell_exch_mailbox_activesync_add_device = _interopRequireDefault(require("./collection_persistence_powershell_exch_mailbox_activesync_add_device.json"));

var _execution_scheduled_task_powershell_source = _interopRequireDefault(require("./execution_scheduled_task_powershell_source.json"));

var _persistence_docker_shortcuts_plist_modification = _interopRequireDefault(require("./persistence_docker_shortcuts_plist_modification.json"));

var _persistence_evasion_hidden_local_account_creation = _interopRequireDefault(require("./persistence_evasion_hidden_local_account_creation.json"));

var _persistence_finder_sync_plugin_pluginkit = _interopRequireDefault(require("./persistence_finder_sync_plugin_pluginkit.json"));

var _discovery_security_software_grep = _interopRequireDefault(require("./discovery_security_software_grep.json"));

var _credential_access_cookies_chromium_browsers_debugging = _interopRequireDefault(require("./credential_access_cookies_chromium_browsers_debugging.json"));

var _credential_access_ssh_backdoor_log = _interopRequireDefault(require("./credential_access_ssh_backdoor_log.json"));

var _persistence_credential_access_modify_auth_module_or_config = _interopRequireDefault(require("./persistence_credential_access_modify_auth_module_or_config.json"));

var _persistence_credential_access_modify_ssh_binaries = _interopRequireDefault(require("./persistence_credential_access_modify_ssh_binaries.json"));

var _credential_access_collection_sensitive_files = _interopRequireDefault(require("./credential_access_collection_sensitive_files.json"));

var _persistence_ssh_authorized_keys_modification = _interopRequireDefault(require("./persistence_ssh_authorized_keys_modification.json"));

var _defense_evasion_defender_disabled_via_registry = _interopRequireDefault(require("./defense_evasion_defender_disabled_via_registry.json"));

var _defense_evasion_privacy_controls_tcc_database_modification = _interopRequireDefault(require("./defense_evasion_privacy_controls_tcc_database_modification.json"));

var _execution_initial_access_suspicious_browser_childproc = _interopRequireDefault(require("./execution_initial_access_suspicious_browser_childproc.json"));

var _execution_script_via_automator_workflows = _interopRequireDefault(require("./execution_script_via_automator_workflows.json"));

var _persistence_modification_sublime_app_plugin_or_script = _interopRequireDefault(require("./persistence_modification_sublime_app_plugin_or_script.json"));

var _privilege_escalation_applescript_with_admin_privs = _interopRequireDefault(require("./privilege_escalation_applescript_with_admin_privs.json"));

var _credential_access_dumping_keychain_security = _interopRequireDefault(require("./credential_access_dumping_keychain_security.json"));

var _initial_access_azure_active_directory_high_risk_signin = _interopRequireDefault(require("./initial_access_azure_active_directory_high_risk_signin.json"));

var _initial_access_suspicious_mac_ms_office_child_process = _interopRequireDefault(require("./initial_access_suspicious_mac_ms_office_child_process.json"));

var _credential_access_mitm_localhost_webproxy = _interopRequireDefault(require("./credential_access_mitm_localhost_webproxy.json"));

var _persistence_kde_autostart_modification = _interopRequireDefault(require("./persistence_kde_autostart_modification.json"));

var _persistence_user_account_added_to_privileged_group_ad = _interopRequireDefault(require("./persistence_user_account_added_to_privileged_group_ad.json"));

var _defense_evasion_attempt_to_disable_gatekeeper = _interopRequireDefault(require("./defense_evasion_attempt_to_disable_gatekeeper.json"));

var _defense_evasion_sandboxed_office_app_suspicious_zip_file = _interopRequireDefault(require("./defense_evasion_sandboxed_office_app_suspicious_zip_file.json"));

var _persistence_emond_rules_file_creation = _interopRequireDefault(require("./persistence_emond_rules_file_creation.json"));

var _persistence_emond_rules_process_execution = _interopRequireDefault(require("./persistence_emond_rules_process_execution.json"));

var _discovery_users_domain_built_in_commands = _interopRequireDefault(require("./discovery_users_domain_built_in_commands.json"));

var _execution_pentest_eggshell_remote_admin_tool = _interopRequireDefault(require("./execution_pentest_eggshell_remote_admin_tool.json"));

var _defense_evasion_install_root_certificate = _interopRequireDefault(require("./defense_evasion_install_root_certificate.json"));

var _persistence_credential_access_authorization_plugin_creation = _interopRequireDefault(require("./persistence_credential_access_authorization_plugin_creation.json"));

var _persistence_directory_services_plugins_modification = _interopRequireDefault(require("./persistence_directory_services_plugins_modification.json"));

var _defense_evasion_modify_environment_launchctl = _interopRequireDefault(require("./defense_evasion_modify_environment_launchctl.json"));

var _defense_evasion_safari_config_change = _interopRequireDefault(require("./defense_evasion_safari_config_change.json"));

var _defense_evasion_apple_softupdates_modification = _interopRequireDefault(require("./defense_evasion_apple_softupdates_modification.json"));

var _persistence_cron_jobs_creation_and_runtime = _interopRequireDefault(require("./persistence_cron_jobs_creation_and_runtime.json"));

var _credential_access_mod_wdigest_security_provider = _interopRequireDefault(require("./credential_access_mod_wdigest_security_provider.json"));

var _credential_access_saved_creds_vaultcmd = _interopRequireDefault(require("./credential_access_saved_creds_vaultcmd.json"));

var _defense_evasion_file_creation_mult_extension = _interopRequireDefault(require("./defense_evasion_file_creation_mult_extension.json"));

var _execution_enumeration_via_wmiprvse = _interopRequireDefault(require("./execution_enumeration_via_wmiprvse.json"));

var _execution_suspicious_jar_child_process = _interopRequireDefault(require("./execution_suspicious_jar_child_process.json"));

var _persistence_shell_profile_modification = _interopRequireDefault(require("./persistence_shell_profile_modification.json"));

var _persistence_suspicious_calendar_modification = _interopRequireDefault(require("./persistence_suspicious_calendar_modification.json"));

var _persistence_time_provider_mod = _interopRequireDefault(require("./persistence_time_provider_mod.json"));

var _privilege_escalation_exploit_adobe_acrobat_updater = _interopRequireDefault(require("./privilege_escalation_exploit_adobe_acrobat_updater.json"));

var _defense_evasion_sip_provider_mod = _interopRequireDefault(require("./defense_evasion_sip_provider_mod.json"));

var _execution_com_object_xwizard = _interopRequireDefault(require("./execution_com_object_xwizard.json"));

var _privilege_escalation_disable_uac_registry = _interopRequireDefault(require("./privilege_escalation_disable_uac_registry.json"));

var _defense_evasion_unusual_ads_file_creation = _interopRequireDefault(require("./defense_evasion_unusual_ads_file_creation.json"));

var _persistence_loginwindow_plist_modification = _interopRequireDefault(require("./persistence_loginwindow_plist_modification.json"));

var _persistence_periodic_tasks_file_mdofiy = _interopRequireDefault(require("./persistence_periodic_tasks_file_mdofiy.json"));

var _persistence_via_atom_init_file_modification = _interopRequireDefault(require("./persistence_via_atom_init_file_modification.json"));

var _privilege_escalation_lsa_auth_package = _interopRequireDefault(require("./privilege_escalation_lsa_auth_package.json"));

var _privilege_escalation_port_monitor_print_pocessor_abuse = _interopRequireDefault(require("./privilege_escalation_port_monitor_print_pocessor_abuse.json"));

var _credential_access_dumping_hashes_bi_cmds = _interopRequireDefault(require("./credential_access_dumping_hashes_bi_cmds.json"));

var _lateral_movement_mounting_smb_share = _interopRequireDefault(require("./lateral_movement_mounting_smb_share.json"));

var _privilege_escalation_echo_nopasswd_sudoers = _interopRequireDefault(require("./privilege_escalation_echo_nopasswd_sudoers.json"));

var _privilege_escalation_ld_preload_shared_object_modif = _interopRequireDefault(require("./privilege_escalation_ld_preload_shared_object_modif.json"));

var _privilege_escalation_root_crontab_filemod = _interopRequireDefault(require("./privilege_escalation_root_crontab_filemod.json"));

var _defense_evasion_create_mod_root_certificate = _interopRequireDefault(require("./defense_evasion_create_mod_root_certificate.json"));

var _privilege_escalation_sudo_buffer_overflow = _interopRequireDefault(require("./privilege_escalation_sudo_buffer_overflow.json"));

var _execution_installer_spawned_network_event = _interopRequireDefault(require("./execution_installer_spawned_network_event.json"));

var _initial_access_suspicious_ms_exchange_files = _interopRequireDefault(require("./initial_access_suspicious_ms_exchange_files.json"));

var _initial_access_suspicious_ms_exchange_process = _interopRequireDefault(require("./initial_access_suspicious_ms_exchange_process.json"));

var _initial_access_suspicious_ms_exchange_worker_child_process = _interopRequireDefault(require("./initial_access_suspicious_ms_exchange_worker_child_process.json"));

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
// Auto generated file from either:
// - scripts/regen_prepackage_rules_index.sh
// - detection-rules repo using CLI command build-release
// Do not hand edit. Run script/command to regenerate package information instead


const rawRules = [_credential_access_access_to_browser_credentials_procargs.default, _defense_evasion_tcc_bypass_mounted_apfs_access.default, _persistence_enable_root_account.default, _defense_evasion_unload_endpointsecurity_kext.default, _persistence_account_creation_hide_at_logon.default, _persistence_creation_hidden_login_item_osascript.default, _persistence_evasion_hidden_launch_agent_deamon_creation.default, _privilege_escalation_local_user_added_to_admin.default, _credential_access_keychain_pwd_retrieval_security_cmd.default, _credential_access_systemkey_dumping.default, _execution_defense_evasion_electron_app_childproc_node_js.default, _execution_revershell_via_shell_cmd.default, _persistence_defense_evasion_hidden_launch_agent_deamon_logonitem_process.default, _privilege_escalation_persistence_phantom_dll.default, _defense_evasion_privilege_escalation_privacy_pref_sshd_fulldiskaccess.default, _lateral_movement_credential_access_kerberos_bifrostconsole.default, _lateral_movement_vpn_connection_attempt.default, _apm_403_response_to_a_post.default, _apm_405_response_method_not_allowed.default, _apm_null_user_agent.default, _apm_sqlmap_user_agent.default, _command_and_control_dns_directly_to_the_internet.default, _command_and_control_ftp_file_transfer_protocol_activity_to_the_internet.default, _command_and_control_irc_internet_relay_chat_protocol_activity_to_the_internet.default, _command_and_control_nat_traversal_port_activity.default, _command_and_control_port_26_activity.default, _command_and_control_port_8000_activity_to_the_internet.default, _command_and_control_pptp_point_to_point_tunneling_protocol_activity.default, _command_and_control_proxy_port_activity_to_the_internet.default, _command_and_control_rdp_remote_desktop_protocol_from_the_internet.default, _command_and_control_smtp_to_the_internet.default, _command_and_control_sql_server_port_activity_to_the_internet.default, _command_and_control_ssh_secure_shell_from_the_internet.default, _command_and_control_ssh_secure_shell_to_the_internet.default, _command_and_control_telnet_port_activity.default, _command_and_control_tor_activity_to_the_internet.default, _command_and_control_vnc_virtual_network_computing_from_the_internet.default, _command_and_control_vnc_virtual_network_computing_to_the_internet.default, _credential_access_tcpdump_activity.default, _defense_evasion_adding_the_hidden_file_attribute_with_via_attribexe.default, _defense_evasion_clearing_windows_event_logs.default, _defense_evasion_delete_volume_usn_journal_with_fsutil.default, _defense_evasion_deleting_backup_catalogs_with_wbadmin.default, _defense_evasion_disable_windows_firewall_rules_with_netsh.default, _defense_evasion_encoding_or_decoding_files_via_certutil.default, _defense_evasion_execution_via_trusted_developer_utilities.default, _defense_evasion_misc_lolbin_connecting_to_the_internet.default, _defense_evasion_msbuild_making_network_connections.default, _defense_evasion_unusual_network_connection_via_rundll.default, _defense_evasion_unusual_process_network_connection.default, _defense_evasion_via_filter_manager.default, _defense_evasion_volume_shadow_copy_deletion_via_wmic.default, _discovery_process_discovery_via_tasklist_command.default, _discovery_whoami_command_activity.default, _discovery_whoami_commmand.default, _endgame_adversary_behavior_detected.default, _endgame_cred_dumping_detected.default, _endgame_cred_dumping_prevented.default, _endgame_cred_manipulation_detected.default, _endgame_cred_manipulation_prevented.default, _endgame_exploit_detected.default, _endgame_exploit_prevented.default, _endgame_malware_detected.default, _endgame_malware_prevented.default, _endgame_permission_theft_detected.default, _endgame_permission_theft_prevented.default, _endgame_process_injection_detected.default, _endgame_process_injection_prevented.default, _endgame_ransomware_detected.default, _endgame_ransomware_prevented.default, _execution_command_prompt_connecting_to_the_internet.default, _execution_command_shell_started_by_powershell.default, _execution_command_shell_started_by_svchost.default, _execution_html_help_executable_program_connecting_to_the_internet.default, _execution_psexec_lateral_movement_command.default, _execution_register_server_program_connecting_to_the_internet.default, _execution_via_compiled_html_file.default, _impact_volume_shadow_copy_deletion_via_vssadmin.default, _initial_access_rdp_remote_desktop_protocol_to_the_internet.default, _initial_access_rpc_remote_procedure_call_from_the_internet.default, _initial_access_rpc_remote_procedure_call_to_the_internet.default, _initial_access_script_executing_powershell.default, _initial_access_smb_windows_file_sharing_activity_to_the_internet.default, _initial_access_suspicious_ms_office_child_process.default, _initial_access_suspicious_ms_outlook_child_process.default, _lateral_movement_direct_outbound_smb_connection.default, _lateral_movement_local_service_commands.default, _linux_hping_activity.default, _linux_iodine_activity.default, _linux_mknod_activity.default, _linux_netcat_network_connection.default, _linux_nmap_activity.default, _linux_nping_activity.default, _linux_process_started_in_temp_directory.default, _linux_socat_activity.default, _linux_strace_activity.default, _persistence_adobe_hijack_persistence.default, _persistence_kernel_module_activity.default, _persistence_local_scheduled_task_commands.default, _persistence_priv_escalation_via_accessibility_features.default, _persistence_shell_activity_by_web_server.default, _persistence_system_shells_via_services.default, _persistence_user_account_creation.default, _persistence_via_application_shimming.default, _privilege_escalation_unusual_parentchild_relationship.default, _defense_evasion_modification_of_boot_config.default, _privilege_escalation_uac_bypass_event_viewer.default, _defense_evasion_msxsl_network.default, _discovery_net_command_system_account.default, _command_and_control_certutil_network_connection.default, _defense_evasion_cve_2020_.default, _credential_access_credential_dumping_msbuild.default, _defense_evasion_execution_msbuild_started_by_office_app.default, _defense_evasion_execution_msbuild_started_by_script.default, _defense_evasion_execution_msbuild_started_by_system_process.default, _defense_evasion_execution_msbuild_started_renamed.default, _defense_evasion_execution_msbuild_started_unusal_process.default, _defense_evasion_injection_msbuild.default, _execution_via_net_com_assemblies.default, _ml_linux_anomalous_network_activity.default, _ml_linux_anomalous_network_port_activity.default, _ml_linux_anomalous_network_service.default, _ml_linux_anomalous_network_url_activity.default, _ml_linux_anomalous_process_all_hosts.default, _ml_linux_anomalous_user_name.default, _ml_packetbeat_dns_tunneling.default, _ml_packetbeat_rare_dns_question.default, _ml_packetbeat_rare_server_domain.default, _ml_packetbeat_rare_urls.default, _ml_packetbeat_rare_user_agent.default, _ml_rare_process_by_host_linux.default, _ml_rare_process_by_host_windows.default, _ml_suspicious_login_activity.default, _ml_windows_anomalous_network_activity.default, _ml_windows_anomalous_path_activity.default, _ml_windows_anomalous_process_all_hosts.default, _ml_windows_anomalous_process_creation.default, _ml_windows_anomalous_script.default, _ml_windows_anomalous_service.default, _ml_windows_anomalous_user_name.default, _ml_windows_rare_user_runas_event.default, _ml_windows_rare_user_type10_remote_login.default, _execution_suspicious_pdf_reader.default, _privilege_escalation_sudoers_file_mod.default, _defense_evasion_iis_httplogging_disabled.default, _execution_python_tty_shell.default, _execution_perl_tty_shell.default, _defense_evasion_base16_or_base32_encoding_or_decoding_activity.default, _defense_evasion_base64_encoding_or_decoding_activity.default, _defense_evasion_hex_encoding_or_decoding_activity.default, _defense_evasion_file_mod_writable_dir.default, _defense_evasion_disable_selinux_attempt.default, _discovery_kernel_module_enumeration.default, _lateral_movement_telnet_network_activity_external.default, _lateral_movement_telnet_network_activity_internal.default, _privilege_escalation_setuid_setgid_bit_set_via_chmod.default, _defense_evasion_attempt_to_disable_iptables_or_firewall.default, _defense_evasion_kernel_module_removal.default, _defense_evasion_attempt_to_disable_syslog_service.default, _defense_evasion_file_deletion_via_shred.default, _discovery_virtual_machine_fingerprinting.default, _defense_evasion_hidden_file_dir_tmp.default, _defense_evasion_deletion_of_bash_command_line_history.default, _impact_cloudwatch_log_group_deletion.default, _impact_cloudwatch_log_stream_deletion.default, _impact_rds_instance_cluster_stoppage.default, _persistence_attempt_to_deactivate_mfa_for_okta_user_account.default, _persistence_rds_cluster_creation.default, _credential_access_attempted_bypass_of_okta_mfa.default, _defense_evasion_waf_acl_deletion.default, _impact_attempt_to_revoke_okta_api_token.default, _impact_iam_group_deletion.default, _impact_possible_okta_dos_attack.default, _impact_rds_cluster_deletion.default, _initial_access_suspicious_activity_reported_by_okta_user.default, _okta_attempt_to_deactivate_okta_policy.default, _okta_attempt_to_deactivate_okta_policy_rule.default, _okta_attempt_to_modify_okta_network_zone.default, _okta_attempt_to_modify_okta_policy.default, _okta_attempt_to_modify_okta_policy_rule.default, _okta_threat_detected_by_okta_threatinsight.default, _persistence_administrator_privileges_assigned_to_okta_group.default, _persistence_attempt_to_create_okta_api_token.default, _persistence_attempt_to_reset_mfa_factors_for_okta_user_account.default, _defense_evasion_cloudtrail_logging_deleted.default, _defense_evasion_ec2_network_acl_deletion.default, _impact_iam_deactivate_mfa_device.default, _defense_evasion_s3_bucket_configuration_deletion.default, _defense_evasion_guardduty_detector_deletion.default, _okta_attempt_to_delete_okta_policy.default, _credential_access_iam_user_addition_to_group.default, _persistence_ec2_network_acl_creation.default, _impact_ec2_disable_ebs_encryption.default, _persistence_iam_group_creation.default, _defense_evasion_waf_rule_or_rule_group_deletion.default, _collection_cloudtrail_logging_created.default, _defense_evasion_cloudtrail_logging_suspended.default, _impact_cloudtrail_logging_updated.default, _initial_access_console_login_root.default, _defense_evasion_cloudwatch_alarm_deletion.default, _defense_evasion_ec2_flow_log_deletion.default, _defense_evasion_configuration_recorder_stopped.default, _exfiltration_ec2_snapshot_change_activity.default, _defense_evasion_config_service_rule_deletion.default, _okta_attempt_to_modify_or_delete_application_sign_on_policy.default, _command_and_control_download_rar_powershell_from_internet.default, _initial_access_password_recovery.default, _command_and_control_cobalt_strike_beacon.default, _command_and_control_fin7_c2_behavior.default, _command_and_control_halfbaked_beacon.default, _credential_access_secretsmanager_getsecretvalue.default, _initial_access_via_system_manager.default, _privilege_escalation_root_login_without_mfa.default, _privilege_escalation_updateassumerolepolicy.default, _impact_hosts_file_modified.default, _elastic_endpoint_security.default, _external_alerts.default, _initial_access_login_failures.default, _initial_access_login_location.default, _initial_access_login_sessions.default, _initial_access_login_time.default, _ml_cloudtrail_error_message_spike.default, _ml_cloudtrail_rare_error_code.default, _ml_cloudtrail_rare_method_by_city.default, _ml_cloudtrail_rare_method_by_country.default, _ml_cloudtrail_rare_method_by_user.default, _credential_access_aws_iam_assume_role_brute_force.default, _credential_access_okta_brute_force_or_password_spraying.default, _initial_access_unusual_dns_service_children.default, _initial_access_unusual_dns_service_file_writes.default, _lateral_movement_dns_server_overflow.default, _credential_access_root_console_failure_brute_force.default, _initial_access_unsecure_elasticsearch_node.default, _credential_access_domain_backup_dpapi_private_keys.default, _persistence_gpo_schtask_service_creation.default, _credential_access_credentials_keychains.default, _credential_access_kerberosdump_kcc.default, _defense_evasion_attempt_del_quarantine_attrib.default, _execution_suspicious_psexesvc.default, _execution_via_xp_cmdshell_mssql_stored_procedure.default, _privilege_escalation_printspooler_service_suspicious_file.default, _privilege_escalation_printspooler_suspicious_spl_file.default, _defense_evasion_azure_diagnostic_settings_deletion.default, _execution_command_virtual_machine.default, _execution_via_hidden_shell_conhost.default, _impact_resource_group_deletion.default, _persistence_via_telemetrycontroller_scheduledtask_hijack.default, _persistence_via_update_orchestrator_service_hijack.default, _collection_update_event_hub_auth_rule.default, _credential_access_iis_apppoolsa_pwd_appcmd.default, _credential_access_iis_connectionstrings_dumping.default, _defense_evasion_event_hub_deletion.default, _defense_evasion_firewall_policy_deletion.default, _defense_evasion_sdelete_like_filename_rename.default, _lateral_movement_remote_ssh_login_enabled.default, _persistence_azure_automation_account_created.default, _persistence_azure_automation_runbook_created_or_modified.default, _persistence_azure_automation_webhook_created.default, _privilege_escalation_uac_bypass_diskcleanup_hijack.default, _credential_access_attempts_to_brute_force_okta_user_account.default, _credential_access_storage_account_key_regenerated.default, _defense_evasion_suspicious_okta_user_password_reset_or_unlock_attempts.default, _defense_evasion_system_critical_proc_abnormal_file_activity.default, _defense_evasion_unusual_system_vp_child_program.default, _discovery_blob_container_access_mod.default, _persistence_mfa_disabled_for_azure_user.default, _persistence_user_added_as_owner_for_azure_application.default, _persistence_user_added_as_owner_for_azure_service_principal.default, _defense_evasion_dotnet_compiler_parent_process.default, _defense_evasion_suspicious_managedcode_host_process.default, _execution_command_shell_started_by_unusual_process.default, _defense_evasion_masquerading_as_elastic_endpoint_process.default, _defense_evasion_masquerading_suspicious_werfault_childproc.default, _defense_evasion_masquerading_werfault.default, _credential_access_key_vault_modified.default, _credential_access_mimikatz_memssp_default_logs.default, _defense_evasion_code_injection_conhost.default, _defense_evasion_network_watcher_deletion.default, _initial_access_external_guest_user_invite.default, _defense_evasion_masquerading_renamed_autoit.default, _impact_azure_automation_runbook_deleted.default, _initial_access_consent_grant_attack_via_azure_registered_application.default, _persistence_azure_conditional_access_policy_modified.default, _persistence_azure_privileged_identity_management_role_modified.default, _command_and_control_teamviewer_remote_file_copy.default, _defense_evasion_installutil_beacon.default, _defense_evasion_mshta_beacon.default, _defense_evasion_network_connection_from_windows_binary.default, _defense_evasion_rundll32_no_arguments.default, _defense_evasion_suspicious_scrobj_load.default, _defense_evasion_suspicious_wmi_script.default, _execution_ms_office_written_file.default, _execution_pdf_written_file.default, _lateral_movement_cmd_service.default, _persistence_app_compat_shim.default, _command_and_control_remote_file_copy_desktopimgdownldr.default, _command_and_control_remote_file_copy_mpcmdrun.default, _defense_evasion_execution_suspicious_explorer_winword.default, _defense_evasion_suspicious_zoom_child_process.default, _ml_linux_anomalous_compiler_activity.default, _ml_linux_anomalous_kernel_module_arguments.default, _ml_linux_anomalous_sudo_activity.default, _ml_linux_system_information_discovery.default, _ml_linux_system_network_configuration_discovery.default, _ml_linux_system_network_connection_discovery.default, _ml_linux_system_process_discovery.default, _ml_linux_system_user_discovery.default, _discovery_post_exploitation_public_ip_reconnaissance.default, _initial_access_zoom_meeting_with_no_passcode.default, _defense_evasion_gcp_logging_sink_deletion.default, _defense_evasion_gcp_pub_sub_topic_deletion.default, _defense_evasion_gcp_firewall_rule_created.default, _defense_evasion_gcp_firewall_rule_deleted.default, _defense_evasion_gcp_firewall_rule_modified.default, _defense_evasion_gcp_logging_bucket_deletion.default, _defense_evasion_gcp_storage_bucket_permissions_modified.default, _impact_gcp_storage_bucket_deleted.default, _initial_access_gcp_iam_custom_role_creation.default, _persistence_gcp_iam_service_account_key_deletion.default, _persistence_gcp_key_created_for_service_account.default, _defense_evasion_gcp_storage_bucket_configuration_modified.default, _exfiltration_gcp_logging_sink_modification.default, _impact_gcp_iam_role_deletion.default, _impact_gcp_service_account_deleted.default, _impact_gcp_service_account_disabled.default, _impact_gcp_virtual_private_cloud_network_deleted.default, _impact_gcp_virtual_private_cloud_route_created.default, _impact_gcp_virtual_private_cloud_route_deleted.default, _ml_linux_anomalous_metadata_process.default, _ml_linux_anomalous_metadata_user.default, _ml_windows_anomalous_metadata_process.default, _ml_windows_anomalous_metadata_user.default, _persistence_gcp_service_account_created.default, _collection_gcp_pub_sub_subscription_creation.default, _collection_gcp_pub_sub_topic_creation.default, _defense_evasion_gcp_pub_sub_subscription_deletion.default, _persistence_azure_pim_user_added_global_admin.default, _command_and_control_cobalt_strike_default_teamserver_cert.default, _defense_evasion_enable_inbound_rdp_with_netsh.default, _defense_evasion_execution_lolbas_wuauclt.default, _privilege_escalation_unusual_svchost_childproc_childless.default, _lateral_movement_rdp_tunnel_plink.default, _privilege_escalation_uac_bypass_winfw_mmc_hijack.default, _persistence_ms_office_addins_file.default, _discovery_adfind_command_activity.default, _discovery_security_software_wmic.default, _execution_command_shell_via_rundll.default, _execution_suspicious_cmd_wmi.default, _lateral_movement_via_startup_folder_rdp_smb.default, _privilege_escalation_uac_bypass_com_interface_icmluautil.default, _privilege_escalation_uac_bypass_mock_windir.default, _defense_evasion_potential_processherpaderping.default, _privilege_escalation_uac_bypass_dll_sideloading.default, _execution_shared_modules_local_sxs_dll.default, _privilege_escalation_uac_bypass_com_clipup.default, _initial_access_via_explorer_suspicious_child_parent_args.default, _execution_from_unusual_directory.default, _execution_from_unusual_path_cmdline.default, _credential_access_kerberoasting_unusual_process.default, _discovery_peripheral_device.default, _lateral_movement_mount_hidden_or_webdav_share_net.default, _defense_evasion_deleting_websvr_access_logs.default, _defense_evasion_log_files_deleted.default, _defense_evasion_timestomp_touch.default, _lateral_movement_dcom_hta.default, _lateral_movement_execution_via_file_shares_sequence.default, _privilege_escalation_uac_bypass_com_ieinstal.default, _command_and_control_common_webservices.default, _command_and_control_encrypted_channel_freesslcert.default, _defense_evasion_process_termination_followed_by_deletion.default, _lateral_movement_remote_file_copy_hidden_share.default, _attempt_to_deactivate_okta_network_zone.default, _attempt_to_delete_okta_network_zone.default, _lateral_movement_dcom_mmc.default, _lateral_movement_dcom_shellwindow_shellbrowserwindow.default, _okta_attempt_to_deactivate_okta_application.default, _okta_attempt_to_delete_okta_application.default, _okta_attempt_to_delete_okta_policy_rule.default, _okta_attempt_to_modify_okta_application.default, _persistence_administrator_role_assigned_to_okta_user.default, _lateral_movement_executable_tool_transfer_smb.default, _command_and_control_dns_tunneling_nslookup.default, _lateral_movement_execution_from_tsclient_mup.default, _lateral_movement_rdp_sharprdp_target.default, _defense_evasion_clearing_windows_security_logs.default, _persistence_google_workspace_api_access_granted_via_domain_wide_delegation_of_authority.default, _execution_suspicious_short_program_name.default, _lateral_movement_incoming_wmi.default, _persistence_via_hidden_run_key_valuename.default, _credential_access_potential_ssh_bruteforce.default, _credential_access_promt_for_pwd_via_osascript.default, _lateral_movement_remote_services.default, _application_added_to_google_workspace_domain.default, _domain_added_to_google_workspace_trusted_domains.default, _execution_suspicious_image_load_wmi_ms_office.default, _execution_suspicious_powershell_imgload.default, _google_workspace_admin_role_deletion.default, _google_workspace_mfa_enforcement_disabled.default, _google_workspace_policy_modified.default, _mfa_disabled_for_google_workspace_organization.default, _persistence_evasion_registry_ifeo_injection.default, _persistence_google_workspace_admin_role_assigned_to_user.default, _persistence_google_workspace_custom_admin_role_created.default, _persistence_google_workspace_role_modified.default, _persistence_suspicious_image_load_scheduled_task_ms_office.default, _defense_evasion_masquerading_trusted_directory.default, _exfiltration_microsoft_365_exchange_transport_rule_creation.default, _initial_access_microsoft_365_exchange_safelinks_disabled.default, _microsoft_365_exchange_dkim_signing_config_disabled.default, _persistence_appcertdlls_registry.default, _persistence_appinitdlls_registry.default, _persistence_registry_uncommon.default, _persistence_run_key_and_startup_broad.default, _persistence_services_registry.default, _persistence_startup_folder_file_written_by_suspicious_process.default, _persistence_startup_folder_scripts.default, _persistence_suspicious_com_hijack_registry.default, _persistence_via_lsa_security_support_provider_registry.default, _defense_evasion_microsoft_365_exchange_malware_filter_policy_deletion.default, _defense_evasion_microsoft_365_exchange_malware_filter_rule_mod.default, _defense_evasion_microsoft_365_exchange_safe_attach_rule_disabled.default, _exfiltration_microsoft_365_exchange_transport_rule_mod.default, _initial_access_microsoft_365_exchange_anti_phish_policy_deletion.default, _initial_access_microsoft_365_exchange_anti_phish_rule_mod.default, _lateral_movement_suspicious_rdp_client_imageload.default, _persistence_runtime_run_key_startup_susp_procs.default, _persistence_suspicious_scheduled_task_runtime.default, _defense_evasion_microsoft_365_exchange_dlp_policy_removed.default, _lateral_movement_scheduled_task_target.default, _persistence_microsoft_365_exchange_management_role_assignment.default, _persistence_microsoft_365_teams_guest_access_enabled.default, _credential_access_dump_registry_hives.default, _defense_evasion_scheduledjobs_at_protocol_enabled.default, _persistence_ms_outlook_vba_template.default, _persistence_suspicious_service_created_registry.default, _privilege_escalation_named_pipe_impersonation.default, _credential_access_cmdline_dump_tool.default, _credential_access_copy_ntds_sam_volshadowcp_cmdline.default, _credential_access_lsass_memdump_file_created.default, _lateral_movement_incoming_winrm_shell_execution.default, _lateral_movement_powershell_remoting_target.default, _defense_evasion_hide_encoded_executable_registry.default, _defense_evasion_port_forwarding_added_registry.default, _lateral_movement_rdp_enabled_registry.default, _privilege_escalation_printspooler_registry_copyfiles.default, _privilege_escalation_rogue_windir_environment_var.default, _initial_access_scripts_process_started_via_wmi.default, _command_and_control_iexplore_via_com.default, _command_and_control_remote_file_copy_scripts.default, _persistence_local_scheduled_task_scripting.default, _persistence_startup_folder_file_written_by_unsigned_process.default, _command_and_control_remote_file_copy_powershell.default, _credential_access_microsoft_365_brute_force_user_account_attempt.default, _microsoft_365_teams_custom_app_interaction_allowed.default, _persistence_microsoft_365_teams_external_access_enabled.default, _credential_access_microsoft_365_potential_password_spraying_attack.default, _defense_evasion_stop_process_service_threshold.default, _collection_winrar_encryption.default, _defense_evasion_unusual_dir_ads.default, _discovery_admin_recon.default, _discovery_file_dir_discovery.default, _discovery_net_view.default, _discovery_query_registry_via_reg.default, _discovery_remote_system_discovery_commands_windows.default, _persistence_via_windows_management_instrumentation_event_subscription.default, _execution_scripting_osascript_exec_followed_by_netcon.default, _execution_shell_execution_via_apple_scripting.default, _persistence_creation_change_launch_agents_file.default, _persistence_creation_modif_launch_deamon_sequence.default, _persistence_folder_action_scripts_runtime.default, _persistence_login_logout_hooks_defaults.default, _privilege_escalation_explicit_creds_via_scripting.default, _command_and_control_sunburst_c2_activity_detected.default, _defense_evasion_azure_application_credential_modification.default, _defense_evasion_azure_service_principal_addition.default, _defense_evasion_solarwinds_backdoor_service_disabled_via_registry.default, _execution_apt_solarwinds_backdoor_child_cmd_powershell.default, _execution_apt_solarwinds_backdoor_unusual_child_processes.default, _initial_access_azure_active_directory_powershell_signin.default, _collection_email_powershell_exchange_mailbox.default, _collection_persistence_powershell_exch_mailbox_activesync_add_device.default, _execution_scheduled_task_powershell_source.default, _persistence_docker_shortcuts_plist_modification.default, _persistence_evasion_hidden_local_account_creation.default, _persistence_finder_sync_plugin_pluginkit.default, _discovery_security_software_grep.default, _credential_access_cookies_chromium_browsers_debugging.default, _credential_access_ssh_backdoor_log.default, _persistence_credential_access_modify_auth_module_or_config.default, _persistence_credential_access_modify_ssh_binaries.default, _credential_access_collection_sensitive_files.default, _persistence_ssh_authorized_keys_modification.default, _defense_evasion_defender_disabled_via_registry.default, _defense_evasion_privacy_controls_tcc_database_modification.default, _execution_initial_access_suspicious_browser_childproc.default, _execution_script_via_automator_workflows.default, _persistence_modification_sublime_app_plugin_or_script.default, _privilege_escalation_applescript_with_admin_privs.default, _credential_access_dumping_keychain_security.default, _initial_access_azure_active_directory_high_risk_signin.default, _initial_access_suspicious_mac_ms_office_child_process.default, _credential_access_mitm_localhost_webproxy.default, _persistence_kde_autostart_modification.default, _persistence_user_account_added_to_privileged_group_ad.default, _defense_evasion_attempt_to_disable_gatekeeper.default, _defense_evasion_sandboxed_office_app_suspicious_zip_file.default, _persistence_emond_rules_file_creation.default, _persistence_emond_rules_process_execution.default, _discovery_users_domain_built_in_commands.default, _execution_pentest_eggshell_remote_admin_tool.default, _defense_evasion_install_root_certificate.default, _persistence_credential_access_authorization_plugin_creation.default, _persistence_directory_services_plugins_modification.default, _defense_evasion_modify_environment_launchctl.default, _defense_evasion_safari_config_change.default, _defense_evasion_apple_softupdates_modification.default, _persistence_cron_jobs_creation_and_runtime.default, _credential_access_mod_wdigest_security_provider.default, _credential_access_saved_creds_vaultcmd.default, _defense_evasion_file_creation_mult_extension.default, _execution_enumeration_via_wmiprvse.default, _execution_suspicious_jar_child_process.default, _persistence_shell_profile_modification.default, _persistence_suspicious_calendar_modification.default, _persistence_time_provider_mod.default, _privilege_escalation_exploit_adobe_acrobat_updater.default, _defense_evasion_sip_provider_mod.default, _execution_com_object_xwizard.default, _privilege_escalation_disable_uac_registry.default, _defense_evasion_unusual_ads_file_creation.default, _persistence_loginwindow_plist_modification.default, _persistence_periodic_tasks_file_mdofiy.default, _persistence_via_atom_init_file_modification.default, _privilege_escalation_lsa_auth_package.default, _privilege_escalation_port_monitor_print_pocessor_abuse.default, _credential_access_dumping_hashes_bi_cmds.default, _lateral_movement_mounting_smb_share.default, _privilege_escalation_echo_nopasswd_sudoers.default, _privilege_escalation_ld_preload_shared_object_modif.default, _privilege_escalation_root_crontab_filemod.default, _defense_evasion_create_mod_root_certificate.default, _privilege_escalation_sudo_buffer_overflow.default, _execution_installer_spawned_network_event.default, _initial_access_suspicious_ms_exchange_files.default, _initial_access_suspicious_ms_exchange_process.default, _initial_access_suspicious_ms_exchange_worker_child_process.default];
exports.rawRules = rawRules;