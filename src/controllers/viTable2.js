const { ipcMain } = require('electron');
const { viData } = require('../db')


ipcMain.on("loadDataVi", (e, arg) => {
    viData.find({}).exec((error, document) => {
        if (error) {
            console.log(error)
        } else {
            let boq_ref = []
            let boq_sequence = []
            let date = []
            let substation_name = []
            let done_by = []
            let work_order_no = []
            let zone = []
            let _id = []
            for (let i = 0; i < document.length; i++) {
                if (!boq_ref.includes(document[i].boq_ref)) {
                    boq_ref.push(document[i].boq_ref)
                }

                if (!boq_sequence.includes(document[i].boq_sequence)) {
                    boq_sequence.push(document[i].boq_sequence)
                }

                if (!date.includes(document[i].date)) {
                    date.push(document[i].date)
                }
                if (!substation_name.includes(document[i].substation_name)) {
                    substation_name.push(document[i].substation_name)
                }

                if (!done_by.includes(document[i].done_by)) {
                    done_by.push(document[i].done_by)
                }

                if (!work_order_no.includes(document[i].work_order_no)) {
                    work_order_no.push(document[i].work_order_no)
                }


                if (!zone.includes(document[i].zone)) {
                    zone.push(document[i].zone)
                }


                if (!_id.includes(document[i]._id)) {
                    _id.push(document[i]._id)
                }

            }
            let dropDownData = {
                _id: _id,
                boq_ref: boq_ref,
                boq_sequence: boq_sequence,
                date: date,
                substation_name: substation_name,
                done_by: done_by,
                work_order_no: work_order_no,
                zone: zone,

            }
            let data = { data: document, dropDownData: dropDownData }
            e.sender.send("loadDataVi", data)
            // e.sender.send('loadTableDropDown', dropDownData)

        }
    })
})

ipcMain.on('changeViDropDown', (e, args) => {

    let filter = {}
    let obj = args.dataObj
    let keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
        if (keys[i] == "boq_ref") {
            let x = { boq_ref: { $in: obj[keys[i]] } }
            Object.assign(filter, x)
        }
        if (keys[i] == "boq_sequence") {
            let x = { boq_sequence: { $in: obj[keys[i]] } }
            Object.assign(filter, x)
        }
        if (keys[i] == "date") {
            let x = {
                date: { $in: obj[keys[i]] }
            }
            Object.assign(filter, x)
        }
        if (keys[i] == "substation_name") {
            let x = { substation_name: { $in: obj[keys[i]] } }
            Object.assign(filter, x)
        }
        if (keys[i] == "done_by") {
            let x = { done_by: { $in: obj[keys[i]] } }
            Object.assign(filter, x)
        }
        if (keys[i] == "work_order_no") {
            let x = { work_order_no: { $in: obj[keys[i]] } }
            Object.assign(filter, x)
        }
        if (keys[i] == "zone") {
            let x = { zone: { $in: obj[keys[i]] } }
            Object.assign(filter, x)
        }


    }
    if (args.id == "boq_ref") {
        Object.assign(filter, { boq_ref: { $in: args.arr } })
    }
    if (args.id == "boq_sequence") {
        Object.assign(filter, { boq_sequence: { $in: args.arr } })
    }
    if (args.id == "date") {
        Object.assign(filter, { date: { $in: args.arr } })
    }
    if (args.id == "substation_name") {
        Object.assign(filter, { substation_name: { $in: args.arr } })
    }
    if (args.id == "done_by") {
        Object.assign(filter, { done_by: { $in: args.arr } })
    }
    if (args.id == "work_order_no") {
        Object.assign(filter, { work_order_no: { $in: args.arr }, })
    }
    if (args.id == "zone") {
        Object.assign(filter, { zone: { $in: args.arr } })
    }

    viData.find(filter).exec((err, document) => {

        if (err) throw err
        let boq_ref = []
        let boq_sequence = []
        let date = []
        let substation_name = []
        let done_by = []
        let work_order_no = []
        let zone = []
        let _id = []

        for (let i = 0; i < document.length; i++) {
            if (!boq_ref.includes(document[i].boq_ref)) {
                boq_ref.push(document[i].boq_ref)
            }

            if (!boq_sequence.includes(document[i].boq_sequence)) {
                boq_sequence.push(document[i].boq_sequence)
            }

            if (!date.includes(document[i].date)) {
                date.push(document[i].date)
            }
            if (!substation_name.includes(document[i].substation_name)) {
                substation_name.push(document[i].substation_name)
            }

            if (!done_by.includes(document[i].done_by)) {
                done_by.push(document[i].done_by)
            }

            if (!work_order_no.includes(document[i].work_order_no)) {
                work_order_no.push(document[i].work_order_no)
            }


            if (!zone.includes(document[i].zone)) {
                zone.push(document[i].zone)
            }


            if (!_id.includes(document[i]._id)) {
                _id.push(document[i]._id)
            }

        }
        let dropDownData = {
            _id: _id,
            boq_ref: boq_ref,
            boq_sequence: boq_sequence,
            date: date,
            substation_name: substation_name,
            done_by: done_by,
            work_order_no: work_order_no,
            zone: zone,
            id: args.id,
            dataObj: args.dataObj
        }
        // console.log(dropDownData)
        e.sender.send('changedViDropDown', dropDownData)

    })
})