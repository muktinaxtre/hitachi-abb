const electron = require('electron')
const { ipcMain } = electron
const { mfData, mfMonthData } = require('../db')
const index = require("../index")
const path = require('path')
const moment = require('moment')
ipcMain.on('loadMfDataFromSheet', (e, args) => {
    mfMonthData.find({ month: args.month }).exec((err1, res1) => {
        console.log("find month")
        console.log(res1)
        if (res1.length > 0) {
            e.sender.send('completeInsertion', { status: false })
        } else {
            mfMonthData.insert({ month: args.month }, (err, res) => {
                console.log(res)
                let month_id = res._id
                let sheetdata = args.data
                let keys = Object.keys(sheetdata)

                for (let i = 0; i < keys.length; i++) {
                    let key = keys[i]
                    let data = sheetdata[key]
                    for (let loop = 0; loop < data.length; loop++) {
                        if (loop !== 0) {

                            let a = data[loop].A
                            let b = data[loop].B
                            let c = ''
                            let cDate = moment(data[loop].C).add(10, 'seconds').format("DD-MM-YYYY")
                            if (cDate == "InvaliDate") {
                                c = data[loop].C
                            } else {
                                c = cDate
                            }
                            let d = data[loop].D
                            let e = data[loop].E
                            let f = data[loop].F
                            let g = data[loop].G
                            let h = data[loop].H
                            let i = data[loop].I
                            let j = data[loop].J
                            let k = data[loop].K

                            let insert_data = {
                                month_id: month_id,
                                sheetSl_no: a,
                                boq_no: b,
                                date: c,
                                zone: d,
                                substation: e,
                                rating: f,
                                location: g,
                                visual_inspection_major_findings: h,
                                recommended_action: i,
                                action_taken: j,
                                status: k
                            }

                            mfData.insert(insert_data)


                        }
                        mfMonthData.loadDatabase()
                        mfData.loadDatabase()
                        e.sender.send('completeInsertion', { status: true })
                        // index.loadNewHtml('mfTable.html')

                    }

                }
            })
        }
    })


})
