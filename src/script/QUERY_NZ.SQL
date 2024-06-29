



ALTER TABLE `trabill`.`trabill_invoice_airticket_items` 
ADD COLUMN `airticket_is_void` INT NOT NULL DEFAULT 0 AFTER `airticket_is_reissued`;


ALTER TABLE `trabill`.`trabill_quotations_billing_infos` 
ADD COLUMN `billing_invoice_id` INT NULL AFTER `billing_product_id`,
ADD COLUMN `billing_category_id` INT NULL AFTER `billing_invoice_id`,
CHANGE COLUMN `billing_product_id` `billing_product_id` INT NULL ;


ALTER TABLE `trabill`.`trabill_quotations` 
ADD COLUMN `quotation_inv_payment` DECIMAL(15,2) NULL AFTER `quotation_date`;

ALTER TABLE `trabill`.`trabill_quotations` 
ADD COLUMN `quotation_type` ENUM('ACCUMULATE', 'QUOTATION') NULL AFTER `quotation_no`;




-- MOST IMPORTANT / NEED TO MIGRATE ALL IMAGE INTO S3
set sql_safe_updates = 0;
UPDATE trabill.trabill_agency_organization_information
SET org_logo = REPLACE(org_logo, 'https://trabillteststorage.blob.core.windows.net/trabillcontainer/images/logos', 'https://m360ict.s3.ap-south-1.amazonaws.com/trabill/iata');