ALTER TABLE `trabill`.`trabill_vendors` 
CHANGE COLUMN `vendor_registration_date` `vendor_registration_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ;

ALTER TABLE `trabill`.`trabill_invoice_client_payments` 
ADD COLUMN `invclientpayment_purpose` VARCHAR(45) NULL AFTER `invclientpayment_ticket_number`;

ALTER TABLE `trabill`.`trabill_invoice_client_payments` 
CHANGE COLUMN `invclientpayment_purpose` `invclientpayment_purpose` VARCHAR(45) NULL DEFAULT NULL AFTER `invclientpayment_date`;












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