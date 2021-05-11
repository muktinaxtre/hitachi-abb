const electron = require('electron')
const { ipcMain } = electron
const { smhData } = require('../../db')
const moment = require('moment')
ipcMain.on("removeAllSmhData", (e, arg) => {
    smhData.remove({}, { multi: true }, (err, callback) => {
        if (err) {
            console.log(err)
        } else {
            console.log(callback)
            e.sender.send("removedAllSmhData", callback)
        }
    })
})
ipcMain.on("updateAddSmhData", (e, args) => {
    // console.log(args)
    let insertArray = []
    let sheetdata = args.data
    // console.log(sheetdata)
    let keys = Object.keys(sheetdata)
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        let data = sheetdata[key]
        for (let loop = 0; loop < data.length; loop++) {
            if (loop !== 0) {

                let a = data[loop].A
                let b = data[loop].B
                let c = data[loop].C
                let d = data[loop].D
                let e
                let eDate = moment(data[loop].E).add(10, 'seconds').format("DD-MM-YYYY")
                if (eDate == "InvaliDate") {
                    e = data[loop].E
                } else {
                    e = eDate
                }
                let f = data[loop].F
                let g = data[loop].G
                let h = data[loop].H
                let i = data[loop].I
                let j = data[loop].J
                let k = data[loop].K
                let l = data[loop].L

                let insert_data = {
                    "sl_no": a,
                    "boq_ref": b,
                    "boq_description": c,
                    "boq_sequence": d,
                    "date": e,
                    "substation_name": f,
                    "bay_no": g,
                    "voltage_ratings": h,
                    "done_by": i,
                    "work_order_no": j,
                    "zone": k,
                    "pdf_link": l
                }
                insertArray.push(insert_data)

            }

        }

    }
    smhData.insert(insertArray)
    smhData.loadDatabase()
    e.sender.send('completeAddSmhData', { status: true })
})