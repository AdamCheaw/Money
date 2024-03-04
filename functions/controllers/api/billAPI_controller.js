const billModel = require('../../models/bill_model');
const firebase = require('firebase-admin');
const { FilterXSS, CheckRegex } = require('../../utils/validate-helpers');
const logger = require("firebase-functions/logger");

async function AddBill(req, res) {
    try {
        const { name, desc, num, splitBy, billDate } = req.body;
        if (!CheckRegex(FilterXSS(name), /\S/) ||
            !CheckRegex(num, /^\d+$/) ||
            !CheckRegex(splitBy, /^\d+$/) ||
            !CheckRegex(billDate, /^\d{4}-\d{2}-\d{2}$/)) {
            res.json({ status: false, error: "param is not valid" });
            return;
        }

        const [year, month, day] = billDate.split('-').map(Number);
        const bill = {
            Name: FilterXSS(name),
            Desc: FilterXSS(desc),
            Num: Number(num),
            SplitBy: Number(splitBy),
            Bill_Date: new Date(year, month - 1, day, 0, 0, 0),
            Insert_Date: new Date(),
            UID: req.user.uid
        };
        await billModel.InsertBill(bill);

        res.json({ status: true });
    }
    catch (error) {
        logger.error(`billApi_controller 'AddBill' failed. Error: ${error}`);
        res.status(500).send('Internal Server Error');
    }
}

async function GetBillAndTotalByMonthly(req, res) {
    try {
        const { year, month } = req.params;
        if (!CheckRegex(year, /^\d+$/) || !CheckRegex(month, /^\d+$/)) {
            res.json({ status: false, error: "Param is Not Valid" });
            return;
        }

        const result = await billModel.GetBillAndTotalBy_DateRange_UID(year, month, req.user.uid);

        res.json({ status: true, result: result });
    }
    catch (error) {
        logger.error(`billApi_controller 'GetBillAndTotalByMonthly' failed. Error: ${error}`);
        res.status(500).send('Internal Server Error');
    }
}

async function DeleteBillByID(req, res) {
    try {
        const { docID } = req.params;
        if (!CheckRegex(docID, /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
            res.json({ status: false, error: "Param is Not Valid" });
            return;
        }

        await billModel.DeleteBillBy_ID(docID);

        res.json({ status: true });
    }
    catch (error) {
        logger.error(`billApi_controller 'DeleteBillByID' failed. Error: ${error}`);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    AddBill, GetBillAndTotalByMonthly, DeleteBillByID
}