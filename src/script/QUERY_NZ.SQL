-- add         client_id, combine_id, account_id in v_mr







CREATE TABLE
    trabill_bsp_bill(
        bsp_id INT PRIMARY KEY AUTO_INCREMENT,
        bsp_agency_id INT NOT NULL,
        bsp_file_url varchar(25) NOT NULL,
        bsp_file_name varchar(20) NOT NULL,
        bsp_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        bsp_is_deleted TINYINT DEFAULT 0,
        
        FOREIGN KEY (bsp_agency_id) REFERENCES trabill_agency_organization_information(org_id)
    );



set sql_safe_updates = 0;
UPDATE trabill.trabill_agency_organization_information
SET org_logo = REPLACE(org_logo, 'https://trabillteststorage.blob.core.windows.net/trabillcontainer/images/logos', 'https://m360ict.s3.ap-south-1.amazonaws.com/trabill/iata');






-- ==================== TESTING REF TRANS ================== --
ALTER TABLE `trxn`.`client_trxn` 
ADD COLUMN `ctrxn_mr_id` INT NULL AFTER `ctrxn_agency_id`;
ALTER TABLE trxn.client_trxn
ADD COLUMN ctrxn_inv_id  INT NULL AFTER ctrxn_agency_id;

ALTER TABLE `trxn`.`acc_trxn` 
ADD COLUMN `acctrxn_mr_id` INT NULL AFTER `acctrxn_ac_id`;


-- MOST IMPORTANT QU FOR UPDATE TABLE WITH JOIN
UPDATE trxn.client_trxn t
LEFT JOIN trabill_money_receipts m ON t.ctrxn_id= m.receipt_ctrxn_id
SET t.ctrxn_mr_id = m.receipt_id
WHERE receipt_client_id is not null and receipt_ctrxn_id is not null;


UPDATE trxn.client_trxn t
LEFT JOIN trabill.trabill_invoices i ON t.ctrxn_id= i.invoice_cltrxn_id
SET t.ctrxn_inv_id =i.invoice_id
WHERE invoice_client_id is not null and invoice_cltrxn_id is not null






-- REMOVE test_client_amount FROM v_air_ticket_total_summary VIEW;
