set sql_safe_updates = 0;
update trxn.client_trxn
set ctrxn_particular_type = concat(ctrxn_particular_type, '(' , ctrxn_pay_type, ')')
where ctrxn_pay_type is not null;






-- INCOMPLETE QUERY
create or replace view v_invoices_due AS

SELECT invoices.*, airline_code, airline_name  from (SELECT
invoice_id, invoice_org_agency, invoice_client_id,invoice_combined_id,coalesce(client_name, combine_name) as client_name,
invoice_no, invoice_category_id,invoice_total_vendor_price, invoice_net_total, coalesce(cl_pay.cl_pay, 0) as cl_pay,invoice_net_total - coalesce(cl_pay.cl_pay, 0) as due_amount,   invoice_total_profit, invoice_sales_date ,
coalesce(iat.airticket_airline_id, inc.airticket_airline_id, iri.airticket_airline_id) as airline_id

FROM trabill.trabill_invoices
left join (SELECT invclientpayment_invoice_id as inv_id, sum(invclientpayment_amount) as cl_pay FROM trabill.trabill_invoice_client_payments
where not invclientpayment_is_deleted = 1
group by invclientpayment_invoice_id) as cl_pay on cl_pay.inv_id = invoice_id

left join trabill_invoice_airticket_items as iat on iat.airticket_invoice_id = invoice_id and invoice_category_id = 1
left join trabill_invoice_noncom_airticket_items as inc on inc.airticket_invoice_id = invoice_id and invoice_category_id = 2
left join trabill_invoice_reissue_airticket_items as iri on iri.airticket_invoice_id = invoice_id and invoice_category_id = 3

left join trabill_clients on client_id = invoice_client_id
left join trabill_combined_clients on combine_id = invoice_combined_id



where not invoice_is_deleted = 1
and not invoice_is_refund = 1
and not invoice_is_reissued = 1
and not invoice_is_void = 1
and invoice_net_total - coalesce(cl_pay.cl_pay, 0) > 0
GROUP BY invoice_id
) as invoices
left join trabill_airlines on trabill_airlines.airline_id = invoices.airline_id