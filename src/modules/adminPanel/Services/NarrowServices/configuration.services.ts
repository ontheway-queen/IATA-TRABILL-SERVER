import { Request, Response } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import { idType } from '../../../../common/types/common.types';
import {
  IAdminAgencyData,
  IAirportData,
  IClientCategory,
  IDepartmentData,
  IDesignationData,
  INotice,
  IPassportStatusData,
  IProductsData,
  IRoomTypeData,
  ITransportTypeData,
  IVisaTypeData,
} from '../../Interfaces/adminPanel.interfaces';

import archiver from 'archiver';
import { addCSVFileToZip } from '../../../../common/utils/dbBackup/dbBackup';
// import * as archiver from 'archiver';

class AdminConfiguration extends AbstractServices {
  constructor() {
    super();
  }

  public getAllClientCategory = async (req: Request) => {
    const conn = this.models.adminPanel(req);

    const { page, size } = req.query as { page: string; size: string };

    const data = await conn.getAllClientCategory(page, size);

    return {
      success: true,
      message: 'All client category',
      count: data.totalCount,
      data: data.data,
    };
  };
  public getClientCategoryForSelect = async (req: Request) => {
    const { search } = req.query as { search: string };
    const conn = this.models.adminPanel(req);

    const data = await conn.getClientCategoryForSelect(search);

    return {
      success: true,
      message: 'All client category',
      data,
    };
  };

  public insertClientCategory = async (req: Request) => {
    const conn = this.models.adminPanel(req);

    const body = req.body as IClientCategory;

    const data = await conn.insertClientCategory(body);

    return { success: true, message: 'Create client category', data };
  };

  public updateClientCategory = async (req: Request) => {
    const conn = this.models.adminPanel(req);

    const body = req.body as IClientCategory;
    const { category_id } = req.params as { category_id: idType };

    const data = await conn.updateClientCategory(body, category_id);

    return { success: true, message: 'Updated client category', data };
  };
  public deleteClientCate = async (req: Request) => {
    const conn = this.models.adminPanel(req);

    const { category_id } = req.params as { category_id: idType };

    await conn.deleteClientCate(category_id);

    return { success: true, message: 'Delete client permanently' };
  };

  public getAllAirports = async (req: Request) => {
    const conn = this.models.adminPanel(req);

    const { page, size } = req.query as { page: string; size: string };

    const data = await conn.getAllAirports(page, size);

    return {
      success: true,
      message: 'All Airports',
      count: data.totalCount,
      data: data.data,
    };
  };
  public async insertAirports(req: Request) {
    const conn = this.models.adminPanel(req);

    const body = req.body as IAirportData;

    const data = await conn.insertAirports(body);

    return { success: true, message: 'Create Airports Successfully!', data };
  }

  public deleteAirports = async (req: Request) => {
    const { id } = req.params as { id: string };

    const { deleted_by } = req.body as { deleted_by: number };

    const conn = this.models.adminPanel(req);

    const data = await conn.deleteAirports(id, deleted_by);

    return { success: true, message: 'Delete Airport Successfuly', data };
  };
  public updateAirports = async (req: Request) => {
    const { id } = req.params as { id: string };

    const body = req.body as IAirportData;

    const conn = this.models.adminPanel(req);

    const data = await conn.updateAirports(body, id);

    return { success: true, message: 'Update Airport Successfuly', data };
  };

  public getAllProducts = async (req: Request) => {
    const { page, size } = req.query as { page: string; size: string };

    const conn = this.models.adminPanel(req);

    const data = await conn.getAllProducts(page, size);

    return {
      success: true,
      message: 'All Products',
      count: data.totalCount,
      data: data.data,
    };
  };
  public getProductCategoryForSelect = async (req: Request) => {
    const { search } = req.query as { search: string };

    const conn = this.models.adminPanel(req);

    const data = await conn.getProductCategoryForSelect(search);

    return {
      success: true,
      message: 'All Products Category',
      data,
    };
  };

  public insetProducts = async (req: Request) => {
    const body = req.body as IProductsData;

    const conn = this.models.adminPanel(req);

    const data = await conn.insetProducts(body);

    return {
      success: true,
      message: 'Create Product Successfuly',
      data,
    };
  };
  public updateProducts = async (req: Request) => {
    const { product_id } = req.params as { product_id: string };

    const body = req.body as IProductsData;

    const conn = this.models.adminPanel(req);

    const data = await conn.updateProducts(body, product_id);

    return {
      success: true,
      message: 'Update Product Successfuly',
      data,
    };
  };
  public deleteProducts = async (req: Request) => {
    const { product_id } = req.params as { product_id: string };

    const { deleted_by } = req.body as { deleted_by: idType };

    const conn = this.models.adminPanel(req);

    const data = await conn.deleteProducts(product_id, deleted_by);

    return {
      success: true,
      message: 'Delete Product Successfuly',
      data,
    };
  };

  public getAllVisaType = async (req: Request) => {
    const { page, size } = req.query as { page: string; size: string };

    const conn = this.models.adminPanel(req);

    const data = await conn.getAllVisaType(page, size);

    return {
      success: true,
      message: 'All Visa Type',
      count: data.totalCount,
      data: data.data,
    };
  };
  public inserVisaType = async (req: Request) => {
    const body = req.body as IVisaTypeData;

    const conn = this.models.adminPanel(req);

    const [data] = await conn.insertVisaType(body);

    return {
      success: true,
      message: 'Create Visa Type Successfuly',
      data,
    };
  };
  public updateVisaType = async (req: Request) => {
    const { visa_id } = req.params;

    const body = req.body as IVisaTypeData;

    const conn = this.models.adminPanel(req);

    const data = await conn.updateVisaType(body, visa_id);

    return {
      success: true,
      message: 'Update Visa Type Successfuly',
      data,
    };
  };
  public deleteVisaType = async (req: Request) => {
    const { visa_id } = req.params as { visa_id: string };

    const conn = this.models.adminPanel(req);

    const data = await conn.deleteVisaType(visa_id);

    return {
      success: true,
      message: 'Delete Visa Type Successfuly',
      data,
    };
  };

  public getAllDepartment = async (req: Request) => {
    const { page, size } = req.query as { page: string; size: string };

    const conn = this.models.adminPanel(req);

    const data = await conn.getAllDepartment(page, size);

    return {
      success: true,
      message: 'All Department',
      count: data.totalCount,
      data: data.data,
    };
  };
  public inserDepartment = async (req: Request) => {
    const body = req.body as IDepartmentData;

    const conn = this.models.adminPanel(req);

    const [data] = await conn.insertDepartment(body);

    return {
      success: true,
      message: 'Create Department Successfuly',
      data,
    };
  };
  public updateDepartment = async (req: Request) => {
    const { department_id } = req.params as { department_id: string };

    const body = req.body as IDepartmentData;

    const conn = this.models.adminPanel(req);

    const data = await conn.updateDepartment(body, department_id);

    return {
      success: true,
      message: 'Update Department Successfuly',
      data,
    };
  };
  public deleteDepartment = async (req: Request) => {
    const { department_id } = req.params as { department_id: string };

    const { deleted_by } = req.body as { deleted_by: number };

    const conn = this.models.adminPanel(req);

    const data = await conn.deleteDepartment(department_id, deleted_by);

    return {
      success: true,
      message: 'Delete Department Successfuly',
      data,
    };
  };

  public getAllRoomType = async (req: Request) => {
    const { page, size } = req.query as { page: string; size: string };

    const conn = this.models.adminPanel(req);

    const data = await conn.getAllRoomType(page, size);

    return {
      success: true,
      message: 'All Room Type',
      count: data.totalCount,
      data: data.data,
    };
  };
  public inserRoomType = async (req: Request) => {
    const body = req.body as IRoomTypeData;

    const conn = this.models.adminPanel(req);

    const [data] = await conn.insertRoomType(body);

    return {
      success: true,
      message: 'Create Room Type Successfuly',
      data,
    };
  };
  public updateRoomType = async (req: Request) => {
    const { type_id } = req.params as { type_id: string };

    const body = req.body as IRoomTypeData;

    const conn = this.models.adminPanel(req);

    const data = await conn.updateRoomType(body, type_id);

    return {
      success: true,
      message: 'Update Room Type Successfuly',
      data,
    };
  };
  public deleteRoomType = async (req: Request) => {
    const { type_id } = req.params as { type_id: string };
    const { deleted_by } = req.body as { deleted_by: number };

    const conn = this.models.adminPanel(req);

    const data = await conn.deleteRoomType(type_id, deleted_by);

    return {
      success: true,
      message: 'Delete Room Type Successfuly',
      data,
    };
  };

  public getAllTransportType = async (req: Request) => {
    const { page, size } = req.query as { page: string; size: string };

    const conn = this.models.adminPanel(req);

    const data = await conn.getAllTransportType(page, size);

    return {
      success: true,
      message: 'All Transport Type',
      count: data.totalCount,
      data: data.data,
    };
  };
  public inserTransportType = async (req: Request) => {
    const body = req.body as ITransportTypeData;

    const conn = this.models.adminPanel(req);

    const [data] = await conn.insertTransportType(body);

    return {
      success: true,
      message: 'Create Transport Type Successfuly',
      data,
    };
  };
  public updateTransportType = async (req: Request) => {
    const { type_id } = req.params as { type_id: string };

    const body = req.body as ITransportTypeData;

    const conn = this.models.adminPanel(req);

    const data = await conn.updateTransportType(body, type_id);

    return {
      success: true,
      message: 'Update Transport Type Successfuly',
      data,
    };
  };
  public updateTransportTypeStatus = async (req: Request) => {
    const { type_id } = req.params as { type_id: string };

    const body = req.body.ttype_status as number;

    const conn = this.models.adminPanel(req);

    const data = await conn.updateTransportTypeStatus(body, type_id);

    return {
      success: true,
      message: 'Update Transport Type Status Successfuly',
      data,
    };
  };
  public deleteTransportType = async (req: Request) => {
    const { type_id } = req.params as { type_id: string };
    const { deleted_by } = req.body as { deleted_by: number };

    const conn = this.models.adminPanel(req);

    const data = await conn.deleteTransportType(type_id, deleted_by);

    return {
      success: true,
      message: 'Delete Transport Type Successfuly',
      data,
    };
  };

  public getAllDesignation = async (req: Request) => {
    const { page, size } = req.query as { page: string; size: string };

    const conn = this.models.adminPanel(req);

    const data = await conn.getAllDesignation(page, size);

    return {
      success: true,
      message: 'All Designation Type',
      count: data.totalCount,
      data: data.data,
    };
  };
  public inserDesignation = async (req: Request) => {
    const body = req.body as IDesignationData;

    const conn = this.models.adminPanel(req);

    const [data] = await conn.insertDesignation(body);

    return {
      success: true,
      message: 'Create Designation Successfuly',
      data,
    };
  };
  public updateDesignation = async (req: Request) => {
    const { type_id } = req.params as { type_id: string };

    const body = req.body as IDesignationData;

    const conn = this.models.adminPanel(req);

    const data = await conn.updateDesignation(body, type_id);

    return {
      success: true,
      message: 'Update Designation Successfuly',
      data,
    };
  };
  public deleteDesignation = async (req: Request) => {
    const { type_id } = req.params as { type_id: string };

    const { deleted_by } = req.body as { deleted_by: number };

    const conn = this.models.adminPanel(req);

    const data = await conn.deleteDesignation(type_id, deleted_by);

    return {
      success: true,
      message: 'Delete Designation Successfuly',
      data,
    };
  };

  public getAllPassportStatus = async (req: Request) => {
    const { page, size } = req.query as { page: string; size: string };

    const conn = this.models.adminPanel(req);

    const data = await conn.getAllPassportStatus(page, size);

    return {
      success: true,
      message: 'All Passport Status',
      count: data.totalCount,
      data: data.data,
    };
  };
  public inserPassportStatus = async (req: Request) => {
    const body = req.body as IPassportStatusData;

    const conn = this.models.adminPanel(req);

    const [data] = await conn.insertPassportStatus(body);

    return {
      success: true,
      message: 'Create Passport Status Successfuly',
      data,
    };
  };
  public updatePassportStatus = async (req: Request) => {
    const { type_id } = req.params as { type_id: string };

    const body = req.body as IPassportStatusData;

    const conn = this.models.adminPanel(req);

    const data = await conn.updatePassportStatus(body, type_id);

    return {
      success: true,
      message: 'Update Passport Status Successfuly',
      data,
    };
  };
  public deletePassportStatus = async (req: Request) => {
    const { type_id } = req.params as { type_id: string };

    const { deleted_by } = req.body as { deleted_by: number };

    const conn = this.models.adminPanel(req);

    const data = await conn.deletePassportStatus(type_id, deleted_by);

    return {
      success: true,
      message: 'Delete Passport Status Successfuly',
      data,
    };
  };

  public getAllAdminAgency = async (req: Request) => {
    const { page, size } = req.query as { page: string; size: string };

    const conn = this.models.adminPanel(req);

    const data = await conn.getAllAdminAgency(page, size);

    return {
      success: true,
      message: 'All Passport Status',
      count: data.totalCount,
      data: data.data,
    };
  };
  public inserAdminAgency = async (req: Request) => {
    const body = req.body as IAdminAgencyData;

    const conn = this.models.adminPanel(req);

    const [data] = await conn.insertAdminAgency(body);

    return {
      success: true,
      message: 'Create Passport Status Successfuly',
      data,
    };
  };
  public updateAdminAgency = async (req: Request) => {
    const { type_id } = req.params as { type_id: string };

    const body = req.body as IAdminAgencyData;

    const conn = this.models.adminPanel(req);

    const data = await conn.updateAdminAgency(body, type_id);

    return {
      success: true,
      message: 'Update Passport Status Successfuly',
      data,
    };
  };
  public deleteAdminAgency = async (req: Request) => {
    const { type_id } = req.params as { type_id: string };
    const { deleted_by } = req.body as { deleted_by: number };

    const conn = this.models.adminPanel(req);

    const data = await conn.deleteAdminAgency(type_id, deleted_by);

    return {
      success: true,
      message: 'Delete Passport Status Successfuly',
      data,
    };
  };

  public getAllNotice = async (req: Request) => {
    const { page, size } = req.query as { page: string; size: string };

    const conn = this.models.adminPanel(req);

    const data = await conn.getAllNotice(Number(page) || 1, Number(size) || 20);

    return {
      success: true,
      message: 'All Notice',
      count: data.count,
      data: data.data,
    };
  };

  public getActiveNotice = async (req: Request) => {
    const conn = this.models.adminPanel(req);

    const data = await conn.getActiveNotice();

    return {
      success: true,
      message: 'Active Notice',
      data,
    };
  };

  public addNotice = async (req: Request) => {
    interface IImageName {
      ntc_bg_img: string;
    }

    const body = req.body as INotice;
    const imageList = req.imgUrl as string[];

    const ImgUrlObj: IImageName = Object.assign({}, ...imageList);

    const conn = this.models.adminPanel(req);

    const [data] = await conn.addNotice({
      ...body,
      ntc_bg_img: ImgUrlObj.ntc_bg_img,
    });

    return {
      success: true,
      message: 'Notice Created Successfuly Done',
      data,
    };
  };

  public editNotice = async (req: Request) => {
    interface IImageName {
      ntc_bg_img: string;
    }

    const body = req.body as INotice;
    const imageList = req.imgUrl as string[];

    const ImgUrlObj: IImageName = Object.assign({}, ...imageList);

    const conn = this.models.adminPanel(req);

    if (ImgUrlObj.ntc_bg_img) {
      const PREV_IMG_URL = await conn.getNoticeImageURL(body.ntc_id);
      await this.deleteFile.delete_image(PREV_IMG_URL?.ntc_bg_img);
    }

    const data = await conn.editNotice(
      {
        ...body,

        ...(ImgUrlObj.ntc_bg_img && {
          ntc_bg_img: ImgUrlObj.ntc_bg_img,
        }),
      },
      body.ntc_id
    );

    return {
      success: true,
      message: 'Notice Created Successfuly Done',
      data,
    };
  };

  downloadDB = async (req: Request, res: Response) => {
    const conn = this.models.adminPanel(req);

    try {
      const accountList = await conn.bk_account();
      const clientList = await conn.bk_client();
      const clientTrnxList = await conn.bk_client_trnx();
      const comClientList = await conn.bk_com_client();
      const comClientTrnxList = await conn.bk_com_client_trnx();
      const vendorList = await conn.bk_vendor();
      const vendorTrnxList = await conn.bk_vendor_trnx();
      const zipFileName = 'data_archive.zip';
      const zipStream = archiver('zip');

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${zipFileName}`
      );

      zipStream.pipe(res);

      await addCSVFileToZip(zipStream, 'accountList.csv', accountList);

      await addCSVFileToZip(zipStream, 'clientList.csv', clientList);
      await addCSVFileToZip(zipStream, 'clientTrnxList.csv', clientTrnxList);

      await addCSVFileToZip(zipStream, 'comClientList.csv', comClientList);
      await addCSVFileToZip(
        zipStream,
        'comClientTrnxList.csv',
        comClientTrnxList
      );

      await addCSVFileToZip(zipStream, 'vendorList.csv', vendorList);
      await addCSVFileToZip(zipStream, 'vendorTrnxList.csv', vendorTrnxList);

      zipStream.finalize();
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error during backup',
      });
    }
  };
}

export default AdminConfiguration;
