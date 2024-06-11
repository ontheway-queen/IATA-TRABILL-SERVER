CREATE TABLE
    trabill_bsp_docs (
        tbd_id INT PRIMARY KEY AUTO_INCREMENT,
        tbd_agency_id INT DEFAULT NULL,
        tbd_doc varchar(250) default NULL,
        tbd_date TIMESTAMP DEFAULT NULL,
        tbd_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tbd_is_deleted TINYINT DEFAULT 0,
        FOREIGN KEY (tbd_agency_id) REFERENCES trabill_agency_organization_information (org_id)
    );

alter table trabill.trabill_vendor_payments
add column vpay_payment_by INT DEFAULT NULL after vpay_vtrxn_id,
add FOREIGN key (vpay_payment_by) REFERENCES trabill_employees (employee_id);

alter table trabill.trabill_money_receipts
add column receipt_received_by INT DEFAULT NULL after receipt_ctrxn_id,
add FOREIGN key (receipt_received_by) REFERENCES trabill_employees (employee_id);