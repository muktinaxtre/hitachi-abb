const { ipcMain } = require('electron')
const { mfData, mfMonthData } = require("../db")

ipcMain.on('loadAllmfData', (e, arg) => {
    console.log(arg)
    let filter = { month_id: arg.month_id }
    let filterData = arg.filter
    if (filterData !== null) {
        // console.log(filterData)
        let obj = filterData
        let key = Object.keys(obj)
        for (let i = 0; i < key.length; i++) {
            if (key[i] == "boq_no") {
                let x = { boq_no: { $in: obj[key[i]] } }
                Object.assign(filter, x)
            }

            if (key[i] == "date") {
                let x = { date: { $in: obj[key[i]] } }
                Object.assign(filter, x)
            }

            if (key[i] == "zone") {
                let x = { zone: { $in: obj[key[i]] } }
                Object.assign(filter, x)
            }

            if (key[i] == "substation") {
                let x = { substation: { $in: obj[key[i]] } }
                Object.assign(filter, x)
            }

            if (key[i] == "rating") {
                let x = { rating: { $in: obj[key[i]] } }
                Object.assign(filter, x)
            }

            if (key[i] == "location") {
                let x = { location: { $in: obj[key[i]] } }
                Object.assign(filter, x)
            }

            if (key[i] == "visual_inspection_major_findings") {
                let x = { visual_inspection_major_findings: { $in: obj[key[i]] } }
                Object.assign(filter, x)
            }

            if (key[i] == "recommended_action") {
                let x = { recommended_action: { $in: obj[key[i]] } }
                Object.assign(filter, x)
            }

            if (key[i] == "action_taken") {
                let x = { action_taken: { $in: obj[key[i]] } }
                Object.assign(filter, x)
            }

            if (key[i] == "status") {
                let x = { status: { $in: obj[key[i]] } }
                Object.assign(filter, x)
            }


        }

    }
    mfData.find(filter).sort({ sheetSl_no: 1 }).exec((error, result) => {
        if (error) {
            throw error
        } else {
            let data = {
                data: result,
                filter: filterData
            }
            // console.log(result)
            // if (arg.skip > 0) {
            //     console.log(2)
            //     e.sender.send('appendcbcmTable_', data)
            // } else {
            //     console.log(result)
            //     e.sender.send('loadcbcmTable_', data)
            // }
            e.sender.send('loadAllmfData', data)
        }
    })
})

ipcMain.on("loadMfMonth", (e, arg) => {
    mfMonthData.find({}).exec((err, res) => {
        e.sender.send("loadMfMonth", res)
    })
})