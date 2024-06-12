-- add         client_id, combine_id, in v_mr






CREATE TABLE
    trabill_bsp_bill(
        bsp_id INT PRIMARY KEY AUTO_INCREMENT,
        bsp_agency_id INT NOT NULL,
        bsp_file_url varchar(25) NOT NULL,
        bsp_file_name varchar(20) NOT NULL,
        bsp_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        bsp_is_deleted TINYINT DEFAULT 0,
        
        FOREIGN KEY (bsp_agency_id) REFERENCES trabill_agency_organization_information(org_id)
    )














-- REMOVE test_client_amount FROM v_air_ticket_total_summary VIEW;
