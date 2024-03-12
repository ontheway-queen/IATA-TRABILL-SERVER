CREATE VIEW trabill.v_airticket_for_refund AS

SELECT 
        invoice.invoice_no AS invoice_no,
        trabill_airlines.airline_name AS airline_name,
        airtickets.airticket_org_agency AS airticket_org_agency,
        invoice.invoice_category_id AS invoice_category_id,
        airtickets.airticket_pnr AS airticket_pnr,
        airtickets.airticket_ticket_no AS airticket_ticket_no,
        airtickets.airticket_discount_total AS airticket_discount_total,
        airtickets.airticket_invoice_id AS airticket_invoice_id,
        airtickets.airticket_id AS airticket_id,
        airtickets.airticket_airline_id AS airticket_airline_id,
        airtickets.airticket_client_price AS airticket_client_price,
        airtickets.airticket_purchase_price AS airticket_purchase_price,
        COALESCE(tc.client_name,
                tcc.combine_name,
                trabill_client_company_information.company_name) AS client_name,
        airtickets.airticket_client_id AS airticket_client_id,
        airtickets.airticket_combined_id AS airticket_combined_id,
        COALESCE(tv.vendor_name,
                tvcc.combine_name) AS vendor_name,
        airtickets.airticket_vendor_id AS airticket_vendor_id,
        airtickets.airticket_vendor_combine_id AS airticket_vendor_combine_id,
        airtickets.airticket_vtrxn_id AS airticket_vtrxn_id,
        airtickets.airticket_is_refund AS airticket_is_refund,
        airtickets.airticket_is_reissued AS airticket_is_reissued,
        airtickets.airticket_return_date AS airticket_return_date,
        airtickets.airticket_journey_date AS airticket_journey_date,
        view_airticket_routes.airticket_routes AS airticket_routes,
        pass.pass_name AS passport_name,
        invoice.invoice_sales_date AS sales_date,
        invoice.invoice_create_date AS create_date
    FROM
        (SELECT 
            airticket.airticket_org_agency AS airticket_org_agency,
                airticket.airticket_pnr AS airticket_pnr,
                airticket.airticket_ticket_no AS airticket_ticket_no,
                airticket.airticket_discount_total AS airticket_discount_total,
                airticket.airticket_invoice_id AS airticket_invoice_id,
                airticket.airticket_id AS airticket_id,
                airticket.airticket_airline_id AS airticket_airline_id,
                airticket.airticket_client_price AS airticket_client_price,
                airticket.airticket_purchase_price AS airticket_purchase_price,
                airticket.airticket_client_id AS airticket_client_id,
                airticket.airticket_combined_id AS airticket_combined_id,
                airticket.airticket_vendor_id AS airticket_vendor_id,
                airticket.airticket_vendor_combine_id AS airticket_vendor_combine_id,
                airticket.airticket_vtrxn_id AS airticket_vtrxn_id,
                airticket.airticket_is_refund AS airticket_is_refund,
                airticket.airticket_return_date AS airticket_return_date,
                airticket.airticket_journey_date AS airticket_journey_date,
                airticket.airticket_is_reissued AS airticket_is_reissued
        FROM
            trabill_invoice_airticket_items airticket
        WHERE
            (airticket.airticket_is_deleted = 0) UNION SELECT 
            airticket.airticket_org_agency AS airticket_org_agency,
                airticket.airticket_pnr AS airticket_pnr,
                airticket.airticket_ticket_no AS airticket_ticket_no,
                'N/A' AS airticket_discount_total,
                airticket.airticket_invoice_id AS airticket_invoice_id,
                airticket.airticket_id AS airticket_id,
                airticket.airticket_airline_id AS airticket_airline_id,
                airticket.airticket_client_price AS airticket_client_price,
                airticket.airticket_purchase_price AS airticket_purchase_price,
                airticket.airticket_client_id AS airticket_client_id,
                airticket.airticket_combined_id AS airticket_combined_id,
                airticket.airticket_vendor_id AS airticket_vendor_id,
                airticket.airticket_vendor_combine_id AS airticket_vendor_combine_id,
                airticket.airticket_vtrxn_id AS airticket_vtrxn_id,
                airticket.airticket_is_refund AS airticket_is_refund,
                airticket.airticket_return_date AS airticket_return_date,
                airticket.airticket_journey_date AS airticket_journey_date,
                airticket.airticket_is_reissued AS airticket_is_reissued
        FROM
            trabill_invoice_noncom_airticket_items airticket
        WHERE
            (airticket.airticket_is_deleted = 0) UNION SELECT 
            airticket.airticket_org_agency AS airticket_org_agency,
                airticket.airticket_pnr AS airticket_pnr,
                airticket.airticket_ticket_no AS airticket_ticket_no,
                NULL AS airticket_discount_total,
                airticket.airticket_invoice_id AS airticket_invoice_id,
                airticket.airticket_id AS airticket_id,
                airticket.airticket_airline_id AS airticket_airline_id,
                COALESCE(airticket.airticket_after_reissue_client_price, airticket.airticket_client_price) AS airticket_client_price,
                COALESCE(airticket.airticket_after_reissue_purchase_price, airticket.airticket_purchase_price) AS airticket_purchase_price,
                airticket.airticket_client_id AS airticket_client_id,
                airticket.airticket_combined_id AS airticket_combined_id,
                airticket.airticket_vendor_id AS airticket_vendor_id,
                airticket.airticket_vendor_combine_id AS airticket_vendor_combine_id,
                airticket.airticket_vtrxn_id AS airticket_vtrxn_id,
                airticket.airticket_is_refund AS airticket_is_refund,
                airticket.airticket_return_date AS airticket_return_date,
                airticket.airticket_journey_date AS airticket_journey_date,
                airticket.airticket_is_reissued AS airticket_is_reissued
        FROM
            trabill_invoice_reissue_airticket_items airticket
        WHERE
            (airticket.airticket_is_deleted = 0)) airtickets
        LEFT JOIN trabill_clients tc ON ((tc.client_id = airtickets.airticket_client_id))
        LEFT JOIN trabill_client_company_information ON ((trabill_client_company_information.company_client_id = airtickets.airticket_client_id))
        LEFT JOIN trabill_combined_clients tcc ON ((tcc.combine_id = airtickets.airticket_combined_id))
        LEFT JOIN trabill_vendors tv ON ((tv.vendor_id = airtickets.airticket_vendor_id))
        LEFT JOIN trabill_combined_clients tvcc ON ((tvcc.combine_id = airtickets.airticket_vendor_combine_id))
        LEFT JOIN trabill_airlines ON ((airtickets.airticket_airline_id = trabill_airlines.airline_id))
        LEFT JOIN (SELECT 
            trabill_invoice_airticket_pax.p_invoice_id AS p_invoice_id,
                trabill_invoice_airticket_pax.p_airticket_id AS p_airticket_id,
                GROUP_CONCAT(trabill_passport_details.passport_name
                    SEPARATOR ',') AS pass_name
        FROM
            (trabill_invoice_airticket_pax
        LEFT JOIN trabill_passport_details ON ((trabill_passport_details.passport_id = trabill_invoice_airticket_pax.p_passport_id)))
        GROUP BY trabill_invoice_airticket_pax.p_airticket_id , trabill_invoice_airticket_pax.p_invoice_id) pass ON (((pass.p_invoice_id = airtickets.airticket_invoice_id)
            AND (airtickets.airticket_id = pass.p_airticket_id)))
        JOIN trabill_invoices invoice ON ((invoice.invoice_id = airtickets.airticket_invoice_id))
        LEFT JOIN view_airticket_routes ON (((view_airticket_routes.airoute_airticket_id = airtickets.airticket_id)
            AND (view_airticket_routes.airoute_invoice_id = airtickets.airticket_invoice_id)))

        GROUP BY airtickets.airticket_invoice_id


      