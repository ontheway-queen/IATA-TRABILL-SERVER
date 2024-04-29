"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../abstracts/abstract.validators"));
class HajjimanagementValidators extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        // ===================================== create invoice air ticket
        this.postClientToClient = [
            this.permissions.check(this.resources.hajji_management_client_to_client, 'create'),
            (0, express_validator_1.check)('ctransfer_combclient_from')
                .notEmpty()
                .withMessage('From client is required')
                .isString(),
            (0, express_validator_1.check)('ctransfer_combclient_to')
                .notEmpty()
                .withMessage('To combined client is required')
                .isString(),
            (0, express_validator_1.check)('ctransfer_note').optional().isString(),
            (0, express_validator_1.check)('ctransfer_charge').optional().isDecimal(),
            (0, express_validator_1.check)('ctransfer_job_name').optional().isString(),
            (0, express_validator_1.check)('ctransfer_tracking_no').optional().isString(),
            (0, express_validator_1.check)('ctransfer_created_by')
                .notEmpty()
                .withMessage('Created by is required'),
            (0, express_validator_1.check)('ctrcknumber_number')
                .isArray({ min: 1 })
                .withMessage('At least one tracking number is required'),
        ];
        this.c2cDelete = [
            this.permissions.check(this.resources.hajji_management_client_to_client, 'delete'),
            (0, express_validator_1.check)('transfer_deleted_by')
                .notEmpty()
                .withMessage('You must provide user id'),
        ];
        this.c2cUpdate = [
            this.permissions.check(this.resources.hajji_management_client_to_client, 'update'),
        ];
        this.c2cRead = [
            this.permissions.check(this.resources.hajji_management_client_to_client, 'update'),
        ];
        this.c2cList = [
            this.permissions.check(this.resources.hajji_management_client_to_client, 'read'),
        ];
        this.addGroupTransaction = [
            this.permissions.check(this.resources.hajji_management_group_to_group, 'create'),
            (0, express_validator_1.check)('gtransfer_from')
                .notEmpty()
                .isNumeric()
                .withMessage('Please provide a valid client id'),
            (0, express_validator_1.check)('gtransfer_to')
                .notEmpty()
                .isNumeric()
                .withMessage('Please provide a valid client id'),
            (0, express_validator_1.check)('gtransfer_job_name').isString().optional(),
            (0, express_validator_1.check)('gtransfer_tracking_no').isString().optional(),
            (0, express_validator_1.check)('gtransfer_charge').isDecimal().optional(),
            (0, express_validator_1.check)('gtransfer_created_by')
                .notEmpty()
                .isNumeric()
                .withMessage('Please provide a valid user id'),
            (0, express_validator_1.check)('ctrcknumber_number')
                .isArray({ min: 1 })
                .withMessage('At least one tracking number is required'),
        ];
        this.g2gList = [
            this.permissions.check(this.resources.hajji_management_group_to_group, 'read'),
        ];
        this.g2gRead = [
            this.permissions.check(this.resources.hajji_management_group_to_group, 'read'),
        ];
        this.g2gUpdate = [
            this.permissions.check(this.resources.hajji_management_group_to_group, 'update'),
        ];
        this.g2gDelete = [
            this.permissions.check(this.resources.hajji_management_group_to_group, 'delete'),
            (0, express_validator_1.check)('deleted_by')
                .notEmpty()
                .withMessage('Please provide a valid user id'),
        ];
        this.addTransferIn = [
            this.permissions.check(this.resources.hajji_management_transfer_inout, 'create'),
            (0, express_validator_1.check)('transfer_agent_id')
                .notEmpty()
                .isNumeric()
                .withMessage('Please provide a valid client id'),
            (0, express_validator_1.check)('transfertrack_tracking_no.*.transfertrack_maharam_id')
                .notEmpty()
                .isInt()
                .withMessage('Please provide a valid muharram id'),
            (0, express_validator_1.check)('transfertrack_tracking_no.*.transfertrack_passport_id')
                .notEmpty()
                .isInt()
                .withMessage('Please provide a valid passport id'),
            (0, express_validator_1.check)('transfertrack_tracking_no.*.transfertrack_tracking_no')
                .notEmpty()
                .isInt()
                .withMessage('Please provide a valid tracking no'),
            (0, express_validator_1.check)('transfer_created_by')
                .notEmpty()
                .isNumeric()
                .withMessage('Please provide a valid user id'),
        ];
        this.transferInRead = [
            this.permissions.check(this.resources.hajji_management_transfer_inout, 'read'),
        ];
        this.transferInUpdate = [
            this.permissions.check(this.resources.hajji_management_transfer_inout, 'update'),
            (0, express_validator_1.check)('transfer_agent_id')
                .optional()
                .isNumeric()
                .withMessage('Please provide a valid client id'),
            (0, express_validator_1.check)('transfertrack_tracking_no.*.transfertrack_maharam_id')
                .optional()
                .isInt()
                .withMessage('Please provide a valid muharram id'),
            (0, express_validator_1.check)('transfertrack_tracking_no.*.transfertrack_passport_id')
                .optional()
                .isInt()
                .withMessage('Please provide a valid passport id'),
            (0, express_validator_1.check)('transfertrack_tracking_no.*.transfertrack_tracking_no')
                .optional()
                .isInt()
                .withMessage('Please provide a valid tracking no'),
            (0, express_validator_1.check)('transfer_created_by')
                .notEmpty()
                .isNumeric()
                .withMessage('Please provide a valid user id'),
        ];
        this.transferInDelete = [
            this.permissions.check(this.resources.hajji_management_transfer_inout, 'delete'),
            (0, express_validator_1.check)('deleted_by')
                .notEmpty()
                .withMessage('Please provide who delete the hajj transfer in')
                .isInt()
                .withMessage('deleted by must an integer value'),
        ];
        this.transferOutCreate = [
            this.permissions.check(this.resources.hajji_management_transfer_inout, 'create'),
            (0, express_validator_1.check)('transfer_agent_id')
                .notEmpty()
                .isNumeric()
                .withMessage('Please provide a valid client id'),
            (0, express_validator_1.check)('transfertrack_tracking_no.*.transfertrack_maharam_id')
                .notEmpty()
                .isInt()
                .withMessage('Please provide a valid muharram id'),
            (0, express_validator_1.check)('transfertrack_tracking_no.*.transfertrack_passport_id')
                .notEmpty()
                .isInt()
                .withMessage('Please provide a valid passport id'),
            (0, express_validator_1.check)('transfertrack_tracking_no.*.transfertrack_tracking_no')
                .notEmpty()
                .isInt()
                .withMessage('Please provide a valid tracking no'),
            (0, express_validator_1.check)('transfer_created_by')
                .notEmpty()
                .isNumeric()
                .withMessage('Please provide a valid user id'),
        ];
        this.transferOutUpdate = [
            this.permissions.check(this.resources.hajji_management_transfer_inout, 'create'),
            (0, express_validator_1.check)('transfer_agent_id')
                .notEmpty()
                .isNumeric()
                .withMessage('Please provide a valid client id'),
            (0, express_validator_1.check)('transfertrack_tracking_no.*.transfertrack_maharam_id')
                .optional()
                .isInt()
                .withMessage('Please provide a valid muharram id'),
            (0, express_validator_1.check)('transfertrack_tracking_no.*.transfertrack_passport_id')
                .optional()
                .isInt()
                .withMessage('Please provide a valid passport id'),
            (0, express_validator_1.check)('transfertrack_tracking_no.*.transfertrack_tracking_no')
                .optional()
                .isInt()
                .withMessage('Please provide a valid tracking no'),
            (0, express_validator_1.check)('transfer_created_by')
                .notEmpty()
                .isNumeric()
                .withMessage('Please provide a valid user id'),
        ];
        this.addCancelPreReg = [
            this.permissions.check(this.resources.hajji_management_cancel_pre_reg, 'create'),
            (0, express_validator_1.check)('arr.*.cancel_tracking_number')
                .notEmpty()
                .withMessage('Please provide tracking number'),
            (0, express_validator_1.check)('cancel_created_by').notEmpty().withMessage('Please provide user id'),
        ];
        this.readCancelPreReg = [
            this.permissions.check(this.resources.hajji_management_cancel_pre_reg, 'read'),
        ];
        this.deleteCancelPreReg = [
            this.permissions.check(this.resources.hajji_management_cancel_pre_reg, 'delete'),
            (0, express_validator_1.check)('deleted_by').notEmpty().isInt(),
        ];
        this.createCancelHajjReg = [
            this.permissions.check(this.resources.hajji_management_cancel_pre_reg, 'create'),
            (0, express_validator_1.check)('tracking_no').isArray().notEmpty(),
            (0, express_validator_1.check)('created_by').notEmpty().isInt(),
            (0, express_validator_1.check)('cl_total_charge').optional().isFloat(),
            (0, express_validator_1.check)('cl_office_charge').optional().isFloat(),
            (0, express_validator_1.check)('cl_govt_charge').optional().isFloat(),
        ];
    }
}
exports.default = HajjimanagementValidators;
//# sourceMappingURL=HajjiManagement.Validators.js.map