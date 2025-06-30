import express from "express";
const routes = express.Router();

import {
    getVouchers,
    addVoucher,
    editVoucher,
    getVouchersById,
    deleteVoucher,
    searchVoucher,
    checkDuplicate,
} from "../../api/v1/voucher/voucher.controller";

routes.get("/vouchers", getVouchers);
routes.get("/vouchers/search", searchVoucher);
routes.get("/vouchers/check", checkDuplicate);
routes.get("/vouchers/:id", getVouchersById);
routes.post("/vouchers", addVoucher);
routes.put("/vouchers/:id", editVoucher);
routes.delete("/vouchers/:id", deleteVoucher);

module.exports = routes;
