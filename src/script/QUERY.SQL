-- VIEW :
/* 

v_all_inv : invoice_is_reissued
view_all_airticket_details : airticket_is_reissued

 */


ALTER TABLE `trabill`.`trabill_invoice_reissue_airticket_items` 
ADD COLUMN `airticket_existing_airticket_id` INT NULL AFTER `airticket_existing_invoiceid`;


ALTER TABLE `trabill`.`trabill_invoice_reissue_airticket_items` 
CHANGE COLUMN `airticket_sales_date` `airticket_sales_date` TIMESTAMP NULL DEFAULT NULL ,
CHANGE COLUMN `airticket_issue_date` `airticket_issue_date` TIMESTAMP NULL DEFAULT NULL ;


ALTER TABLE `trabill`.`trabill_invoices` 
ADD COLUMN `invoice_is_reissued` TINYINT NULL AFTER `invoice_is_refund`;

ALTER TABLE `trabill`.`trabill_invoice_reissue_airticket_items` 
ADD COLUMN `airticket_is_reissued` TINYINT NULL DEFAULT 0 AFTER `airticket_is_refund`;


ALTER TABLE `trabill`.`trabill_invoice_airticket_items` 
ADD COLUMN `airticket_is_reissued` TINYINT NULL AFTER `airticket_is_refund`;


ALTER TABLE `trabill`.`trabill_invoice_noncom_airticket_items` 
ADD COLUMN `airticket_is_reissued` TINYINT NULL AFTER `airticket_is_refund`;

ALTER TABLE `trabill`.`trabill_invoice_airticket_items` 
CHANGE COLUMN `airticket_is_reissued` `airticket_is_reissued` TINYINT NULL DEFAULT 0 ;
ALTER TABLE `trabill`.`trabill_invoice_noncom_airticket_items` 
CHANGE COLUMN `airticket_is_reissued` `airticket_is_reissued` TINYINT NULL DEFAULT 0 ;










