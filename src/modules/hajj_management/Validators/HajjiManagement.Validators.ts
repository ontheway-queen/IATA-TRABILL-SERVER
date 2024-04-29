import { check } from 'express-validator';
import AbstractValidator from '../../../abstracts/abstract.validators';

class HajjimanagementValidators extends AbstractValidator {
  // ===================================== create invoice air ticket
  postClientToClient = [
    this.permissions.check(
      this.resources.hajji_management_client_to_client,
      'create'
    ),

    check('ctransfer_combclient_from')
      .notEmpty()
      .withMessage('From client is required')
      .isString(),
    check('ctransfer_combclient_to')
      .notEmpty()
      .withMessage('To combined client is required')
      .isString(),
    check('ctransfer_note').optional().isString(),
    check('ctransfer_charge').optional().isDecimal(),
    check('ctransfer_job_name').optional().isString(),
    check('ctransfer_tracking_no').optional().isString(),
    check('ctransfer_created_by')
      .notEmpty()
      .withMessage('Created by is required'),
    check('ctrcknumber_number')
      .isArray({ min: 1 })
      .withMessage('At least one tracking number is required'),
  ];

  c2cDelete = [
    this.permissions.check(
      this.resources.hajji_management_client_to_client,
      'delete'
    ),

    check('transfer_deleted_by')
      .notEmpty()
      .withMessage('You must provide user id'),
  ];
  c2cUpdate = [
    this.permissions.check(
      this.resources.hajji_management_client_to_client,
      'update'
    ),
  ];
  c2cRead = [
    this.permissions.check(
      this.resources.hajji_management_client_to_client,
      'update'
    ),
  ];

  c2cList = [
    this.permissions.check(
      this.resources.hajji_management_client_to_client,
      'read'
    ),
  ];

  addGroupTransaction = [
    this.permissions.check(
      this.resources.hajji_management_group_to_group,
      'create'
    ),
    check('gtransfer_from')
      .notEmpty()
      .isNumeric()
      .withMessage('Please provide a valid client id'),
    check('gtransfer_to')
      .notEmpty()
      .isNumeric()
      .withMessage('Please provide a valid client id'),
    check('gtransfer_job_name').isString().optional(),
    check('gtransfer_tracking_no').isString().optional(),
    check('gtransfer_charge').isDecimal().optional(),
    check('gtransfer_created_by')
      .notEmpty()
      .isNumeric()
      .withMessage('Please provide a valid user id'),
    check('ctrcknumber_number')
      .isArray({ min: 1 })
      .withMessage('At least one tracking number is required'),
  ];

  g2gList = [
    this.permissions.check(
      this.resources.hajji_management_group_to_group,
      'read'
    ),
  ];
  g2gRead = [
    this.permissions.check(
      this.resources.hajji_management_group_to_group,
      'read'
    ),
  ];
  g2gUpdate = [
    this.permissions.check(
      this.resources.hajji_management_group_to_group,
      'update'
    ),
  ];
  g2gDelete = [
    this.permissions.check(
      this.resources.hajji_management_group_to_group,
      'delete'
    ),
    check('deleted_by')
      .notEmpty()
      .withMessage('Please provide a valid user id'),
  ];

  addTransferIn = [
    this.permissions.check(
      this.resources.hajji_management_transfer_inout,
      'create'
    ),
    check('transfer_agent_id')
      .notEmpty()
      .isNumeric()
      .withMessage('Please provide a valid client id'),
    check('transfertrack_tracking_no.*.transfertrack_maharam_id')
      .notEmpty()
      .isInt()
      .withMessage('Please provide a valid muharram id'),
    check('transfertrack_tracking_no.*.transfertrack_passport_id')
      .notEmpty()
      .isInt()
      .withMessage('Please provide a valid passport id'),
    check('transfertrack_tracking_no.*.transfertrack_tracking_no')
      .notEmpty()
      .isInt()
      .withMessage('Please provide a valid tracking no'),
    check('transfer_created_by')
      .notEmpty()
      .isNumeric()
      .withMessage('Please provide a valid user id'),
  ];

  transferInRead = [
    this.permissions.check(
      this.resources.hajji_management_transfer_inout,
      'read'
    ),
  ];
  transferInUpdate = [
    this.permissions.check(
      this.resources.hajji_management_transfer_inout,
      'update'
    ),
    check('transfer_agent_id')
      .optional()
      .isNumeric()
      .withMessage('Please provide a valid client id'),
    check('transfertrack_tracking_no.*.transfertrack_maharam_id')
      .optional()
      .isInt()
      .withMessage('Please provide a valid muharram id'),
    check('transfertrack_tracking_no.*.transfertrack_passport_id')
      .optional()
      .isInt()
      .withMessage('Please provide a valid passport id'),
    check('transfertrack_tracking_no.*.transfertrack_tracking_no')
      .optional()
      .isInt()
      .withMessage('Please provide a valid tracking no'),
    check('transfer_created_by')
      .notEmpty()
      .isNumeric()
      .withMessage('Please provide a valid user id'),
  ];
  transferInDelete = [
    this.permissions.check(
      this.resources.hajji_management_transfer_inout,
      'delete'
    ),
    check('deleted_by')
      .notEmpty()
      .withMessage('Please provide who delete the hajj transfer in')
      .isInt()
      .withMessage('deleted by must an integer value'),
  ];

  transferOutCreate = [
    this.permissions.check(
      this.resources.hajji_management_transfer_inout,
      'create'
    ),
    check('transfer_agent_id')
      .notEmpty()
      .isNumeric()
      .withMessage('Please provide a valid client id'),
    check('transfertrack_tracking_no.*.transfertrack_maharam_id')
      .notEmpty()
      .isInt()
      .withMessage('Please provide a valid muharram id'),
    check('transfertrack_tracking_no.*.transfertrack_passport_id')
      .notEmpty()
      .isInt()
      .withMessage('Please provide a valid passport id'),
    check('transfertrack_tracking_no.*.transfertrack_tracking_no')
      .notEmpty()
      .isInt()
      .withMessage('Please provide a valid tracking no'),
    check('transfer_created_by')
      .notEmpty()
      .isNumeric()
      .withMessage('Please provide a valid user id'),
  ];
  transferOutUpdate = [
    this.permissions.check(
      this.resources.hajji_management_transfer_inout,
      'create'
    ),
    check('transfer_agent_id')
      .notEmpty()
      .isNumeric()
      .withMessage('Please provide a valid client id'),
    check('transfertrack_tracking_no.*.transfertrack_maharam_id')
      .optional()
      .isInt()
      .withMessage('Please provide a valid muharram id'),
    check('transfertrack_tracking_no.*.transfertrack_passport_id')
      .optional()
      .isInt()
      .withMessage('Please provide a valid passport id'),
    check('transfertrack_tracking_no.*.transfertrack_tracking_no')
      .optional()
      .isInt()
      .withMessage('Please provide a valid tracking no'),
    check('transfer_created_by')
      .notEmpty()
      .isNumeric()
      .withMessage('Please provide a valid user id'),
  ];
  addCancelPreReg = [
    this.permissions.check(
      this.resources.hajji_management_cancel_pre_reg,
      'create'
    ),
    check('arr.*.cancel_tracking_number')
      .notEmpty()
      .withMessage('Please provide tracking number'),
    check('cancel_created_by').notEmpty().withMessage('Please provide user id'),
  ];
  readCancelPreReg = [
    this.permissions.check(
      this.resources.hajji_management_cancel_pre_reg,
      'read'
    ),
  ];
  deleteCancelPreReg = [
    this.permissions.check(
      this.resources.hajji_management_cancel_pre_reg,
      'delete'
    ),
    check('deleted_by').notEmpty().isInt(),
  ];

  public createCancelHajjReg = [
    this.permissions.check(
      this.resources.hajji_management_cancel_pre_reg,
      'create'
    ),
    check('tracking_no').isArray().notEmpty(),
    check('created_by').notEmpty().isInt(),
    check('cl_total_charge').optional().isFloat(),
    check('cl_office_charge').optional().isFloat(),
    check('cl_govt_charge').optional().isFloat(),
  ];
}

export default HajjimanagementValidators;
