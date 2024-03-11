const express = require('express');
const router = express.Router();
const { CheckIsAllowedAPI } = require('../middleware.js');
const billAPIController = require('../../controllers/api/billAPI_controller');

router.get("/", (req, res) => { res.send('Hello, World!') });

router.post("/AddBill", CheckIsAllowedAPI, billAPIController.AddBill);

router.get("/GetBillMonthly/:year/:month", CheckIsAllowedAPI, billAPIController.GetBillAndTotalByMonthly);

router.post("/DeleteBill/docID/:docID", CheckIsAllowedAPI, billAPIController.DeleteBillByID);

router.post("/EditBill/docID/:docID", CheckIsAllowedAPI, billAPIController.EditBillByID);

module.exports = router;