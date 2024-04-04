
--  CREATE DATE: 04/04/2024
CREATE VIEW v_all_refunds AS

SELECT 
atrefund_id, 
atrefund_org_agency, 
atrefund_invoice_id, 
atrefund_client_id, 
atrefund_combined_id, 
atrefund_vouchar_number, 
"AIRTICKET" AS refund_type,
coalesce(client_name, combine_name) as client_name,
crefund_total_amount, 
crefund_charge_amount, 
crefund_return_amount, 
sum(vrefund_total_amount) as vrefund_total_amount, 
sum(vrefund_charge_amount) as vrefund_charge_amount, 
sum(vrefund_return_amount) as vrefund_return_amount,
atrefund_date
 FROM trabill.trabill_airticket_refunds
left join trabill_airticket_client_refunds on atrefund_id = crefund_refund_id
left join trabill.trabill_airticket_vendor_refunds on atrefund_id = vrefund_refund_id
left join trabill_clients on client_id= atrefund_client_id
left join trabill_combined_clients on combine_id = atrefund_combined_id
where not atrefund_is_deleted = 1
group by vrefund_refund_id


UNION ALL
SELECT refund_id, 
refund_org_agency, 
refund_invoice_id, 
refund_client_id, 
refund_combined_id, 
refund_vouchar_number, 
"OTHERS" AS refund_type,
coalesce(client_name, combine_name) as client_name,
crefund_total_amount, 
crefund_charge_amount, 
crefund_return_amount, 
sum(vrefund_amount) as vrefund_amount, 
sum(vrefund_charge) as vrefund_charge, 
sum(vrefund_return_amount) as vrefund_return_amount,
crefund_date FROM trabill.trabill_other_refunds
left join trabill_other_refunds_to_clients on refund_id = crefund_refund_id
left join trabill_other_refunds_to_vendors on refund_id = vrefund_refund_id
left join trabill_clients on client_id= refund_client_id
left join trabill_combined_clients on combine_id = refund_combined_id
where not refund_org_agency = 1
group by vrefund_refund_id

UNION ALL
SELECT 
refund_id, 
refund_org_agency, 
refund_invoice_id, 
crefund_client_id, 
crefund_combined_id, 
refund_vouchar_number,
"TOUR" AS refund_type, 
coalesce(client_name, combine_name) as client_name,
crefund_total_amount, 
crefund_charge_amount, 
crefund_return_amount, 
SUM(vrefund_total_amount) AS vrefund_total_amount, 
SUM(vrefund_charge_amount) AS vrefund_charge_amount, 
SUM(vrefund_return_amount) AS vrefund_return_amount,
refund_date
 FROM trabill.trabill_tour_refunds
LEFT JOIN trabill_tour_refunds_to_clients on refund_id = crefund_refund_id
left join trabill_tour_refunds_to_vendors on refund_id = vrefund_refund_id
left join trabill_clients on client_id= crefund_client_id
left join trabill_combined_clients on combine_id = crefund_combined_id
where not refund_is_deleted = 1
group by vrefund_refund_id

UNION ALL
SELECT 
prfnd_id, 
prfnd_org_agency, 
prfnd_invoice_id, 
prfnd_client_id, 
prfnd_combine_id, 
CONVERT(prfnd_vouchar_number USING utf8)  AS prfnd_vouchar_number, 
"PARTIAL" AS refund_type, 
coalesce(client_name, combine_name) as client_name,
prfnd_total_amount, 
prfnd_charge_amount, 
prfnd_return_amount, 
SUM(vprfnd_total_amount) AS vprfnd_total_amount, 
SUM(vprfnd_charge_amount) AS vprfnd_charge_amount, 
SUM(vprfnd_return_amount) AS vprfnd_return_amount ,
prfnd_date
FROM trabill.trabill_pershial_refund
LEFT JOIN trabill_pershial_vendor_refund ON prfnd_id = vprfnd_refund_id
left join trabill_clients on client_id= prfnd_client_id
left join trabill_combined_clients on combine_id = prfnd_combine_id
WHERE NOT prfnd_is_deleted = 1
GROUP BY vprfnd_refund_id


