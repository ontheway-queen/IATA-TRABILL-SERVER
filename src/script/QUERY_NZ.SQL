



ALTER TABLE `trabill`.`trabill_invoice_airticket_items` 
ADD COLUMN `airticket_is_void` INT NOT NULL DEFAULT 0 AFTER `airticket_is_reissued`;






-- MOST IMPORTANT / NEED TO MIGRATE ALL IMAGE INTO S3
set sql_safe_updates = 0;
UPDATE trabill.trabill_agency_organization_information
SET org_logo = REPLACE(org_logo, 'https://trabillteststorage.blob.core.windows.net/trabillcontainer/images/logos', 'https://m360ict.s3.ap-south-1.amazonaws.com/trabill/iata');