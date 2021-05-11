const electron = require('electron')
const { ipcMain } = electron
const { viData, db } = require('../../db')
const moment = require('moment')
ipcMain.on("removeAllViData", (e, arg) => {
    viData.remove({}, { multi: true }, (err, callback) => {
        if (err) {
            console.log(err)
        } else {
            console.log(callback)
            e.sender.send("removedAllViData", callback)
        }
    })
})
ipcMain.on("updateAddViData", (e, args) => {
    console.log(args)
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
                let i = ""
                if (data[loop].I) {
                    i = data[loop].I
                }

                let insert_data = {
                    boq_ref: b,
                    boq_sequence: c,
                    date: d,
                    substation_name: e,
                    done_by: f,
                    work_order_no: g,
                    zone: h,
                    pdf_link: i
                }
                insertArray.push(insert_data)
                // console.log(insertArray)
                // db.run("INSERT INTO vi (boq_ref,boq_sequence,date,substation_name, done_by, invoice_status,)")

                // if (args.addNew) {
                //     viData.remove({}, { multi: true }, (err, numRemoved) => {
                //         console.log(numRemoved)

                //     })
                // }

                // viData.insert(insert_data)

            }
            // console.log(insertArray)


        }

    }
    viData.insert(insertArray)
    viData.loadDatabase()
    e.sender.send('completeAddViData', { status: true })
})