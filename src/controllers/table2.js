
const { app, BrowserWindow, Menu, ipcMain, ipcRenderer } = require('electron');
const path = require('path');
const { allData } = require('../db')

ipcMain.on("loadDataGIS", (e, arg) => {
    allData.find({}).exec((error, document) => {
        if (error) {
            console.log(error)
        } else {

            let substation = []
            let scada = []
            let scada_id = []
            let zone = []
            let voltage = []
            let bays = []
            let gis_make = []
            let gis_type = []
            let all_bays = []
            let _id = []
            for (let i = 0; i < document.length; i++) {
                if (!substation.includes(document[i].substation)) {
                    substation.push(document[i].substation)
                }

                if (!scada.includes(document[i].scada)) {
                    scada.push(document[i].scada)
                }

                if (!scada_id.includes(document[i].scada_id)) {
                    scada_id.push(document[i].scada_id)
                }

                if (!zone.includes(document[i].zone)) {
                    zone.push(document[i].zone)
                }

                if (!voltage.includes(document[i].voltage)) {
                    voltage.push(document[i].voltage)
                }

                if (!bays.includes(document[i].bays)) {
                    bays.push(document[i].bays)
                }

                if (!gis_make.includes(document[i].gis_make)) {
                    gis_make.push(document[i].gis_make)
                }

                if (!gis_type.includes(document[i].gis_type)) {
                    gis_type.push(document[i].gis_type)
                }

                if (!all_bays.includes(document[i].all_bays)) {
                    all_bays.push(document[i].all_bays)
                }

                if (!_id.includes(document[i]._id)) {
                    _id.push(document[i]._id)
                }

            }
            let dropDownData = {
                _id: _id,
                substation: substation,
                scada: scada,
                scada_id: scada_id,
                zone: zone,
                voltage: voltage,
                bays: bays,
                gis_make: gis_make,
                gis_type: gis_type,
                all_bays: all_bays,

            }
            let data = { data: document, dropDownData: dropDownData }
            e.sender.send("loadDataGIS", data)
            // e.sender.send('loadTableDropDown', dropDownData)

        }
    })
})

ipcMain.on('changeDropDown', (e, args) => {
    let filter = {}
    let obj = args.dataObj
    let keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
        if (keys[i] == "substation") {
            let x = { substation: { $in: obj[keys[i]] } }
            Object.assign(filter, x)
        }
        if (keys[i] == "scada") {
            let x = { scada: { $in: obj[keys[i]] } }
            Object.assign(filter, x)
        }
        if (keys[i] == "scada_id") {
            let x = {
                scada_id: { $in: obj[keys[i]] }
            }
            Object.assign(filter, x)
        }
        if (keys[i] == "zone") {
            let x = { zone: { $in: obj[keys[i]] } }
            Object.assign(filter, x)
        }
        if (keys[i] == "voltage") {
            let x = { voltage: { $in: obj[keys[i]] } }
            Object.assign(filter, x)
        }
        if (keys[i] == "bays") {
            let x = { bays: { $in: obj[keys[i]] } }
            Object.assign(filter, x)
        }
        if (keys[i] == "gismake") {
            let x = { gis_make: { $in: obj[keys[i]] } }
            Object.assign(filter, x)
        }
        if (keys[i] == "gis_type") {
            let x = { gistype: { $in: obj[keys[i]] } }
            Object.assign(filter, x)
        }


    }
    if (args.id == "substation") {
        Object.assign(filter, { substation: { $in: args.arr } })
    }
    if (args.id == "scada") {
        Object.assign(filter, { scada: { $in: args.arr } })
    }
    if (args.id == "scada-id") {
        Object.assign(filter, { scada_id: { $in: args.arr } })
    }
    if (args.id == "zone") {
        Object.assign(filter, { zone: { $in: args.arr } })
    }
    if (args.id == "voltage") {
        Object.assign(filter, { voltage: { $in: args.arr } })
    }
    if (args.id == "bays") {
        Object.assign(filter, { bays: { $in: args.arr } })
    }
    if (args.id == "gismake") {
        Object.assign(filter, { gis_make: { $in: args.arr }, })
    }
    if (args.id == "gistype") {
        Object.assign(filter, { gis_type: { $in: args.arr } })
    }

    allData.find(filter).exec((err, document) => {
        if (err) throw err
        let substation = []
        let scada = []
        let scada_id = []
        let zone = []
        let voltage = []
        let bays = []
        let gis_make = []
        let gis_type = []
        let all_bays = []
        let _id = []

        for (let i = 0; i < document.length; i++) {
            if (!substation.includes(document[i].substation)) {
                substation.push(document[i].substation)
            }

            if (!scada.includes(document[i].scada)) {
                scada.push(document[i].scada)
            }

            if (!scada_id.includes(document[i].scada_id)) {
                scada_id.push(document[i].scada_id)
            }

            if (!zone.includes(document[i].zone)) {
                zone.push(document[i].zone)
            }

            if (!voltage.includes(document[i].voltage)) {
                voltage.push(document[i].voltage)
            }

            if (!bays.includes(document[i].bays)) {
                bays.push(document[i].bays)
            }

            if (!gis_make.includes(document[i].gis_make)) {
                gis_make.push(document[i].gis_make)
            }

            if (!gis_type.includes(document[i].gis_type)) {
                gis_type.push(document[i].gis_type)
            }

            if (!all_bays.includes(document[i].all_bays)) {
                all_bays.push(document[i].all_bays)
            }

            if (!_id.includes(document[i]._id)) {
                _id.push(document[i]._id)
            }

        }
        let dropDownData = {
            _id: _id,
            substation: substation,
            scada: scada,
            scada_id: scada_id,
            zone: zone,
            voltage: voltage,
            bays: bays,
            gismake: gis_make,
            gistype: gis_type,
            allbays: all_bays,
            id: args.id,
            dataObj: args.dataObj
        }
        e.sender.send('changedDropDown', dropDownData)

    })
})