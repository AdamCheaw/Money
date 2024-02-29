const billModel = require('../../models/bill_model');

async function RenderIndexPage(req, res) {
    try {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const dateRange = {
            startDate: `${year}/${String(month).padStart(2, 0)}/01`,
            endDate: `${year}/${String(month).padStart(2, 0)}/${String(day).padStart(2, 0)}`
        };       
        const result = await billModel.GetBillAndTotalBy_DateRange_UID(year, month, req.user.uid);

        res.render('index_page', { total: result.total, dateRange: dateRange, bill: result.bill, user: req.user.name });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    RenderIndexPage
}
