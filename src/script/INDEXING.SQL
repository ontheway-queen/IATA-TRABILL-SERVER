-- LIST OF VIEW FOR UPDATED


-- INDEXING QUERY
CREATE INDEX index_name
ON trabill.trabill_invoices (invoice_no);

CREATE INDEX index_name_accounts
ON trabill.trabill_accounts (account_name, account_number, account_branch_name, account_lbalance);


CREATE INDEX index_name_account_type
ON trabill.trabill_accounts_type (acctype_name);


CREATE INDEX index_nametrabill_advance_return
ON trabill.trabill_advance_return (advr_vouchar_no, advr_amount, advr_payment_date);

CREATE INDEX index_nametrabill_agency
ON trabill.trabill_agency (agency_name);

CREATE INDEX index_nametrabill_agency_notice
ON trabill.trabill_agency_notice (ntc_id, ntc_txt, ntc_txt_colr, ntc_txt_bg, ntc_bg_img, ntc_status, ntc_created_date);

CREATE INDEX index_nametrabill_agency_organization_information
ON trabill.trabill_agency_organization_information (org_name, org_owner_full_name, org_owner_email, org_logo, org_address1, org_address2, org_facebook, org_website, org_dial_code, org_mobile_number, org_currency, org_extra_info, org_sms_api_key, org_sms_client_id, org_module_type, org_logo_width, org_logo_height, org_trabill_salesman_id, org_ota_commission, org_subscription_expired, org_created_date);

CREATE INDEX index_nametrabill_agency_subscription
ON trabill.trabill_agency_subscription (subcript_type, subcript_amount);


CREATE INDEX index_nametrabill_agents_profile
ON trabill.trabill_agents_profile (agent_name, agent_email, agent_mobile, agent_commission_rate, agent_last_balance);

CREATE INDEX index_nametrabill_airlines
ON trabill.trabill_airlines (airline_org_agency, airline_code, airline_name);


CREATE INDEX index_nametrabill_airports
ON trabill.trabill_airports (airline_org_agency, airline_country_id, airline_airport, airline_iata_code);


CREATE INDEX index_nametrabill_airticket_client_refunds
ON trabill.trabill_airticket_client_refunds (crefund_total_amount, crefund_charge_amount,crefund_return_amount, crefund_profit, crefund_date, crefund_payment_type );



CREATE INDEX index_nametrabill_airticket_refunds
ON trabill.trabill_airticket_refunds (atrefund_vouchar_number,atrefund_date);


CREATE INDEX index_nametrabill_airticket_tax_refund
ON trabill.trabill_airticket_tax_refund (client_refund_type, vendor_refund_type, client_total_tax_refund, vendor_total_tax_refund);


CREATE INDEX index_nametrabill_airticket_tax_refund_items
ON trabill.trabill_airticket_tax_refund_items (refund_airticket_id, refund_v_trxn_id, refund_tax_amount);




CREATE INDEX index_nametrabill_airticket_vendor_refunds
ON trabill.trabill_airticket_vendor_refunds (vrefund_airticket_id, vrefund_total_amount, vrefund_charge_amount, vrefund_return_amount, vrefund_date, vrefund_payment_type);


CREATE INDEX index_nametrabill_cities
ON trabill.trabill_cities (city_country_id, city_name, city_org_agency);



CREATE INDEX index_nametrabill_client_categories
ON trabill.trabill_client_categories (category_org_agency, category_title, category_prefix, category_create_date);


CREATE INDEX index_nametrabill_clients
ON trabill.trabill_clients (client_org_agency, client_category_id, client_entry_id, client_type, client_gender, client_name, client_email, client_mobile, client_address, client_designation, client_source, client_trade_license, client_lbalance);


CREATE INDEX index_nametrabill_combined_clients
ON trabill.trabill_combined_clients (combine_org_agency, combine_category_id, combine_entry_id, combine_opening_trxn_id, combine_name, combine_company_name, combine_gender, combine_email, combine_commission_rate, combine_designation, combine_client_status, combine_mobile, combine_address, combine_opening_balance, combine_lbalance);


CREATE INDEX index_nametrabill_countries
ON trabill.trabill_countries (countries_org_agency, country_iso, country_name, country_nicename, country_iso3, country_numcode, country_phonecode);


CREATE INDEX index_nametrabill_designations
ON trabill.trabill_designations (designation_org_agency, designation_name, designation_create_date, designation_update_date, designation_created_by, designation_updated_by);


CREATE INDEX index_nametrabill_employees
ON trabill.trabill_employees (employee_org_agency, employee_card_id, employee_department_id, employee_designation_id, employee_bloodgroup_id, employee_full_name, employee_email, employee_mobile, employee_salary, employee_commission, employee_birth_date, employee_apppoint_date, employee_joining_date, employee_address, employee_status);


CREATE INDEX index_nametrabill_invoice_airticket_items
ON trabill.trabill_invoice_airticket_items (airticket_ticket_type, 
airticket_vtrxn_id, 
airticket_ticket_no, 
airticket_gross_fare, 
airticket_base_fare, 
airticket_classes, 
airticket_commission_percent, 
airticket_commission_percent_total, 
airticket_ait, 
airticket_ait_from, 
airticket_tax, 
airticket_client_price, 
airticket_discount_type, 
airticket_discount_total, 
airticket_extra_fee, 
airticket_purchase_price, 
airticket_other_bonus_type, 
airticket_other_bonus_total, 
airticket_other_expense, 
airticket_vat, 
airticket_profit, 
airticket_pnr, 
airticket_pax_name, 
airticket_net_commssion, 
airticket_gds_id, 
airticket_segment, 
airticket_tax1);


CREATE INDEX index_nametrabill_invoice_airticket_items_flight_details
ON trabill.trabill_invoice_airticket_items_flight_details (fltdetails_flight_no);


CREATE INDEX index_nametrabill_invoice_airticket_pax
ON trabill.trabill_invoice_airticket_pax (p_passport_name,p_passport_type,p_mobile_no,  p_email );


CREATE INDEX index_nametrabill_invoice_categories
ON trabill.trabill_invoice_categories (invcat_parentcat, invcat_title, invcat_created_date);


CREATE INDEX index_nametrabill_invoices
ON trabill.trabill_invoices (invoice_no, invoice_sub_total, invoice_net_total,invoice_client_previous_due );


CREATE INDEX index_nametrabill_invoices_history
ON trabill.trabill_invoices_history (history_activity_type,invoicelog_content , history_invoice_payment_amount);


CREATE INDEX index_nametrabill_users
ON trabill.trabill_users (user_username, user_first_name, user_last_name, user_full_name, user_dial_code, user_mobile, user_email);


CREATE INDEX index_nametrabill_vendor_payments
ON trabill.trabill_vendor_payments (vouchar_no, vpay_payment_to);


CREATE INDEX index_nametrabill_vendors
ON trabill.trabill_vendors (vendor_name, vendor_opening_trxn_id, vendor_email, vendor_mobile, vendor_address, vendor_fixed_advance, vendor_lbalance);


CREATE INDEX index_nametrabill_visa_types
ON trabill.trabill_visa_types (type_name);


CREATE INDEX index_namevoucher_type
ON trabill.voucher_type (voucher_type, voucher_number, voucher_name);
