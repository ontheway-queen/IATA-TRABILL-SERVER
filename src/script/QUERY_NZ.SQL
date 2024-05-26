


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