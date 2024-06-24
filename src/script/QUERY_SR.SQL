CREATE TABLE
    trabill_bsp_docs (
        tbd_id INT PRIMARY KEY AUTO_INCREMENT,
        tbd_agency_id INT DEFAULT NULL,
        tbd_doc varchar(250) default NULL,
        tbd_date TIMESTAMP DEFAULT NULL,
        tbd_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tbd_is_deleted TINYINT DEFAULT 0,
        FOREIGN KEY (tbd_agency_id) REFERENCES trabill_agency_organization_information (org_id)
    );

