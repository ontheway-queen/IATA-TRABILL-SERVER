ALTER TABLE `trabill`.`trabill_vendors` 
CHANGE COLUMN `vendor_registration_date` `vendor_registration_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ;

ALTER TABLE `trabill`.`trabill_invoice_client_payments` 
ADD COLUMN `invclientpayment_purpose` VARCHAR(45) NULL AFTER `invclientpayment_ticket_number`;

ALTER TABLE `trabill`.`trabill_invoice_client_payments` 
CHANGE COLUMN `invclientpayment_purpose` `invclientpayment_purpose` VARCHAR(45) NULL DEFAULT NULL AFTER `invclientpayment_date`;



ALTER TABLE `trabill`.`trabill_employees` 
ADD COLUMN `employee_creation_sign` VARCHAR(5) NULL AFTER `employee_id`,
ADD UNIQUE INDEX `employee_creation_sign_UNIQUE` (`employee_creation_sign` ASC) VISIBLE;
;



CREATE TABLE trabill_agency_ota_info (
    ota_id INT AUTO_INCREMENT PRIMARY KEY,
    ota_org_id INT,
    ota_api_url VARCHAR(255) NOT NULL,
    ota_token VARCHAR(555) NOT NULL,
    ota_is_deleted TINYINT DEFAULT 0
);


ALTER TABLE `trabill`.`trabill_agency_ota_info` 
CHANGE COLUMN `ota_org_id` `ota_org_id` INT NOT NULL ,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`ota_id`, `ota_org_id`),
ADD INDEX `trabill_agency_ota_info_ifk_1_idx` (`ota_org_id` ASC) VISIBLE;
;
ALTER TABLE `trabill`.`trabill_agency_ota_info` 
ADD CONSTRAINT `trabill_agency_ota_info_ifk_1`
  FOREIGN KEY (`ota_org_id`)
  REFERENCES `trabill`.`trabill_agency_organization_information` (`org_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;



alter table trabill.trabill_invoice_airticket_pax
add  column p_passport_no varchar(20) default null after p_passport_id;



ALTER TABLE `trabill`.`trabill_invoice_client_payments` 
ADD COLUMN `invclientpayment_rf_type` ENUM('OTHER' ,'AIT' ,'PARTIAL' ,'TOUR' ,'TAX') NULL AFTER `invclientpayment_deleted_by`,
ADD COLUMN `invclientpayment_rf_id` INT NULL AFTER `invclientpayment_rf_type`;


ALTER TABLE `trabill`.`trabill_invoice_client_payments` 
CHANGE COLUMN `invclientpayment_date` `invclientpayment_date` TIMESTAMP NULL DEFAULT NULL ;





-- INCOMPLETE QUERY
SELECT 
    invoice_id,
    invoice_no,
    SUM(invoice_net_total) AS net,
    SUM(invclientpayment_amount) AS pay,
    SUM(invoice_net_total) - COALESCE(SUM(invclientpayment_amount), 0) AS due
FROM 
    trabill.trabill_invoices
LEFT JOIN 
    trabill_invoice_client_payments ON invclientpayment_invoice_id = invoice_id AND NOT invclientpayment_is_deleted = 1
WHERE 
    invoice_org_agency = 80
GROUP BY 
    invoice_id
HAVING 
    SUM(invoice_net_total) - COALESCE(SUM(invclientpayment_amount), 0) > 0;