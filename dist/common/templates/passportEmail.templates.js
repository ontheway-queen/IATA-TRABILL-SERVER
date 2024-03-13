"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completePassportStatus = exports.updatePassportStatus = exports.createPassport = void 0;
const createPassport = (passport_no, org_name, org_owner_email, org_mobile_number, org_logo, org_address1) => {
    return `
  <div style="width: 100%; height: auto; font-family: Arial, sans-serif; font-size: 14px;">
  <p>Dear Business Associates,</p>
  <p>
    We have received your passport no ${passport_no} and it is sending to
    India for visa stamping.
  </p>
  <p>Thanks</p>
  <div style="display: block; margin-top: 20px">
    <img style="width: 150px; height: auto"
      src="${org_logo}"
      alt="Organization logo" />

    <p style="margin: 2px; font-size: 12px">
      <strong>${org_name}</strong>
    </p>
    <p style="margin: 2px; font-size: 12px">
      <strong>Email:</strong> ${org_owner_email}
    </p>
    <p style="margin: 2px; font-size: 12px">
      <strong>Mobile:</strong> ${org_mobile_number}
    </p>
    <p style="margin: 2px; font-size: 12px">
      <strong>Address:</strong> ${org_address1}
    </p>
  </div>
</div>
    `;
};
exports.createPassport = createPassport;
const updatePassportStatus = (passport_no, org_name, org_owner_email, org_mobile_number, org_logo, org_address1) => {
    return `
  <div style="width: 100%; height: auto; font-family: Arial, sans-serif; font-size: 14px;">
  <p>Dear Business Associates,</p>
  <p>Your passport no ${passport_no} is in India for visa stamping and it is under process.</p>
  <p>Thanks</p>
  <div style="display: block; margin-top: 20px">
    <img style="width: 150px; height: auto"
      src="${org_logo}"
      alt="Organization logo" />

    <p style="margin: 2px; font-size: 12px">
      <strong>${org_name}</strong>
    </p>
    <p style="margin: 2px; font-size: 12px">
      <strong>Email:</strong> ${org_owner_email}
    </p>
    <p style="margin: 2px; font-size: 12px">
      <strong>Mobile:</strong> ${org_mobile_number}
    </p>
    <p style="margin: 2px; font-size: 12px">
      <strong>Address:</strong> ${org_address1}
    </p>
  </div>
</div>
    `;
};
exports.updatePassportStatus = updatePassportStatus;
const completePassportStatus = (passport_no, org_name, org_owner_email, org_mobile_number, org_logo, org_address1) => {
    return `
    <div style="width: 100%; height: auto; font-family: Arial, sans-serif; font-size: 14px">
    <p>Dear Business Associates,</p>
    <p>Your passport no ${passport_no} is ready for collection from Dhaka office, please collect your passport within office period.</p>
    <p>Thanks</p>
    <div style="display: block; margin-top: 20px">
      <img style="width: 150px; height: auto"
        src="${org_logo}"
        alt="Organization logo" />
  
      <p style="margin: 2px; font-size: 12px">
        <strong>${org_name}</strong>
      </p>
      <p style="margin: 2px; font-size: 12px">
        <strong>Email:</strong> ${org_owner_email}
      </p>
      <p style="margin: 2px; font-size: 12px">
        <strong>Mobile:</strong> ${org_mobile_number}
      </p>
      <p style="margin: 2px; font-size: 12px">
        <strong>Address:</strong> ${org_address1}
      </p>
    </div>
  </div>
      `;
};
exports.completePassportStatus = completePassportStatus;
//# sourceMappingURL=passportEmail.templates.js.map