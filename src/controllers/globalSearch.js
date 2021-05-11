const { ipcMain } = require('electron')
const { allData, viData, ocData, pmData, cbcmData, mfData, mfMonthData, smhData } = require("../db")

ipcMain.on("loadAllDropDown", (e, arg) => {
    let filter = arg.filter
    console.log(filter)
    let filterData = {}

    Object.assign(filterData, { date: { $in: filter } })
    Object.assign(filterData, { substation_name: { $in: filter } })
    Object.assign(filterData, { bay_no: { $in: filter } })
    let regEx = new RegExp(filter, "i")
    let filtering = { $or: [{ substation_name: { $regex: regEx } }, { date: { $regex: regEx } }, { bay_no: { $regex: regEx } }] }
    let viFiltering = { $or: [{ substation_name: { $regex: regEx } }, { date: { $regex: regEx } }] }
    // ocData.find().exec((error, result) => {
    //     // console.log('ok')
    //     if (error) {
    //         console.log(error)
    //     } else {
    //         console.log(result)
    //     }
    // })
    let viPromise = new Promise((resolve, reject) => {
        viData.find(viFiltering).exec((error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
    let ocPromise = new Promise((resolve, reject) => {
        ocData.find(filtering).exec((error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
    let pmPromise = new Promise((resolve, reject) => {
        pmData.find(filtering).exec((error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
    let cbcmPromise = new Promise((resolve, reject) => {
        cbcmData.find(filtering).exec((error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
    let shmPromise = new Promise((resolve, reject) => {
        smhData.find(filtering).exec((error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
    let mfPromise = new Promise((resolve, reject) => {
        mfData.find({}).exec((error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
    let mffPromise = new Promise((resolve, reject) => {
        mfMonthData.find({}).exec((error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
    Promise.all([viPromise, ocPromise, pmPromise, cbcmPromise, smhData]).then(data => {
        console.log(data[1])
        let response = {
            vi: data[0],
            oc: data[1],
            pm: data[2],
            cbcm: data[3],
            smh: data[4],
        }
        e.sender.send("loadAllDropDown", response)
    })
})


ipcMain.on("loadAllSearchingData", (e, arg) => {
    console.log(arg)
    let filter = arg.filter
    let substation_name_filter = new RegExp(filter.substation_name, "i")
    let voltage_level_filter = new RegExp(filter.voltage, "i")
    let bay_no_filter = new RegExp(filter.bay_no, "i")
    let month_filter = new RegExp(filter.month, "i")
    let year_filter = new RegExp(filter.year, "i")

    let viFilterDataArr = []
    let ocFilterDataArr = []
    let pmFilterDataArr = []
    let cbcmFilterDataArr = []
    let smhFilterDataArr = []

    if (filter.substation_name !== "") {
        viFilterDataArr.push({ substation_name: { $regex: substation_name_filter } })
        ocFilterDataArr.push({ substation_name: { $regex: substation_name_filter } })
        pmFilterDataArr.push({ substation_name: { $regex: substation_name_filter } })
        cbcmFilterDataArr.push({ substation_name: { $regex: substation_name_filter } })
        smhFilterDataArr.push({ substation_name: { $regex: substation_name_filter } })
    }


    if (filter.voltage !== "") {
        viFilterDataArr.push({ voltage_level: { $regex: voltage_level_filter } })
        ocFilterDataArr.push({ voltage_level: { $regex: voltage_level_filter } })
        pmFilterDataArr.push({ voltage_level: { $regex: voltage_level_filter } })
        cbcmFilterDataArr.push({ voltage_ratings: { $regex: voltage_level_filter } })
        smhFilterDataArr.push({ voltage_ratings: { $regex: voltage_level_filter } })
    }


    if (filter.bay_no !== "") {
        // viFilterData.push({ bay_no: { $regex: bay_no } })
        ocFilterDataArr.push({ bay_no: { $regex: bay_no_filter } })
        pmFilterDataArr.push({ bay_no: { $regex: bay_no_filter } })
        cbcmFilterDataArr.push({ bay_no: { $regex: bay_no_filter } })
        smhFilterDataArr.push({ bay_no: { $regex: bay_no_filter } })
    }


    if (filter.month !== "") {
        viFilterDataArr.push({ date: { $regex: month_filter } })
        ocFilterDataArr.push({ date: { $regex: month_filter } })
        pmFilterDataArr.push({ date: { $regex: month_filter } })
        cbcmFilterDataArr.push({ date: { $regex: month_filter } })
        smhFilterDataArr.push({ date: { $regex: month_filter } })
    }


    if (filter.year !== "") {
        viFilterDataArr.push({ date: { $regex: year_filter } })
        ocFilterDataArr.push({ date: { $regex: year_filter } })
        pmFilterDataArr.push({ date: { $regex: year_filter } })
        cbcmFilterDataArr.push({ date: { $regex: year_filter } })
        smhFilterDataArr.push({ date: { $regex: year_filter } })
    }

    let viFilterData = { $and: viFilterDataArr }
    let ocFilterData = { $and: ocFilterDataArr }
    let pmFilterData = { $and: pmFilterDataArr }
    let cbcmFilterData = { $and: cbcmFilterDataArr }
    let smhFilterData = { $and: smhFilterDataArr }
    console.log(smhFilterData)


    let viPromise = new Promise((resolve, reject) => {
        viData.find(viFilterData).exec((error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
    let ocPromise = new Promise((resolve, reject) => {

        ocData.find(ocFilterData).exec((error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
    let pmPromise = new Promise((resolve, reject) => {
        pmData.find(pmFilterData).exec((error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
    let cbcmPromise = new Promise((resolve, reject) => {
        cbcmData.find(cbcmFilterData).exec((error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })

    let smhPromise = new Promise((resolve, reject) => {
        smhData.find(smhFilterData).exec((error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })

    Promise.all([viPromise, ocPromise, pmPromise, cbcmPromise, smhPromise]).then(data => {
        // console.log(data[1])
        let response = {
            vi: data[0],
            oc: data[1],
            pm: data[2],
            cbcm: data[3],
            smh: data[4],

        }
        // console.log(response)
        e.sender.send("loadAllDropDown", response)
    })
})