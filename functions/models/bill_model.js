const firebase = require('../database/firebase');
const db = firebase.firestore();
const { v1: uuidv1 } = require('uuid');

async function InsertBill(bill) {
    try {
        const collectionRef = db.collection('Bill');
        const documentRef = collectionRef.doc(uuidv1());

        await documentRef.set(bill);
        console.log(`Bill is inserted, id: ${documentRef.id}`);
        return documentRef.id;
    }
    catch (err) {
        throw err;
    }  
}

async function GetBillAndTotalBy_DateRange_UID(year, month, UID) {
    try {
        const startDate = new Date(year, month - 1, 1); // Start of the month
        const endDate = new Date(year, month, 0); // End of the month

        const snapshot = await db.collection('Bill')
            .where('UID', '==', UID)
            .where('Bill_Date', '>=', startDate)
            .where('Bill_Date', '<=', endDate)
            .select('Bill_Date','Insert_Date', 'Name', 'Desc', 'Num', 'SplitBy')
            .orderBy('Bill_Date', 'Desc')
            .orderBy('Insert_Date', 'Desc')
            .get();

        let results = {
            total: 0,
            bill: []
        };
        snapshot.forEach(doc => {
            const data = doc.data();
            const docID = doc.id;
            if (data.SplitBy == 0) {
                results.total += Number(data.Num)
            }
            else {
                results.total += Number((Number(data.Num) / Number(data.SplitBy)).toFixed(2))
            }

            results.bill.push({
                docID: docID,
                billDate: data.Bill_Date.toDate().toISOString().split('T')[0],
                name: data.Name,
                desc: data.Desc,
                num: Number(data.Num),
                splitBy: Number(data.SplitBy)
            });
        });

        return results;
    }
    catch (error) {
        throw error;
    }
}

async function DeleteBillBy_ID(docID) {
    try {
        const docRef = db.collection('Bill').doc(docID);
        await docRef.delete();
        console.log(`Document id: ${docID} , Bill is deleted`);
    }
    catch (error) {
        throw error;
    }
}

async function UpdateBillBy_ID(docID, updateBill) {
    try {
        const docRef = db.collection('Bill').doc(docID);
        await docRef.update(updateBill);

        console.log(`Document id: ${docID} , Bill is update`);
    }
    catch (error) {
        throw error;
    }
}

module.exports = {
    InsertBill, GetBillAndTotalBy_DateRange_UID, DeleteBillBy_ID, UpdateBillBy_ID
}