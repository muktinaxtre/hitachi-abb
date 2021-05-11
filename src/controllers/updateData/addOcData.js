const electron = require('electron')
const { ipcMain } = electron
const { ocData } = require('../../db')
const moment = require('moment')
ipcMain.on("removeAllOcData", (e, arg) => {
    ocData.remove({}, { multi: true }, (err, callback) => {
        if (err) {
            console.log(err)
        } else {
            console.log(callback)
            e.sender.send("removedAllOcData", callback)
        }
    })
})
ipcMain.on("updateAddOcData", (e, args) => {
    // console.log(args)
    let insertArray = []
    let sheetdata = args.data
    let keys = Object.keys(sheetdata)
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        let data = sheetdata[key]
        for (let loop = 0; loop < data.length; loop++) {
            if (loop !== 0) {

                let a = data[loop].A
                let b = data[loop].B
                let c = data[loop].C
                let d = ''
                let dDate = moment(data[loop].D).add(10, 'seconds').format("DD-MM-YYYY")
                if (dDate == "InvaliDate") {
                    d = data[loop].D
                } else {
                    d = dDate
                }
                let e = data[loop].E
                let f = data[loop].F
                let g = data[loop].G
                let h = data[loop].H
                let i = data[loop].I
                let j = data[loop].J
                let k = data[loop].K

                let insert_data = {
                    sl_no: a,
                    boq_ref: b,
                    boq_sequence: c,
                    date: d,
                    substation_name: e,
                    bay_no: f,
                    voltage_level: g,
                    done_by: h,
                    work_order_no: i,
                    zone: j,
                    pdf_link: k
                }
                insertArray.push(insert_data)

            }


        }

    }
    ocData.insert(insertArray)
    ocData.loadDatabase()
    e.sender.send('completeAddOcData', { status: true })
})