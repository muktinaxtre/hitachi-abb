const e = require('express');
const express = require('express')
const app = express()
app.use(express.urlencoded({ limit: "50mb", parameterLimit: 1000000, extended: true }))
app.use(express.json({ limit: '50mb' }));
const { allData, viData, ocData, pmData, cbcmData, mfData, mfMonthData, smhData } = require('./db')


function gisResponse(data) {
    let response = []
    data.forEach((element, index) => {
        let allBay = element.all_bays
        let allBayArr = allBay.split(',')
        let allBayHtml = `<select class="form-control" style="width:80px">`
        for (let k = 0; k < allBayArr.length; k++) {
            allBayHtml = allBayHtml + `<option value="` + allBayArr[k] + `">` + allBayArr[k] + `</option>`

        }
        allBayHtml = allBayHtml + `</select>`
        let newData = {
            sl_no: index + 1,
            _id: element._id,
            substation: element.substation,
            scada: element.scada,
            scada_id: element.scada_id,
            zone: element.zone,
            voltage: element.voltage,
            bays: element.bays,
            gis_make: element.gis_make,
            gis_type: element.gis_type,
            all_bays: allBayHtml
        }
        response.push(newData)
    });
    return response

}

app.post("/getGisData", async (req, res) => {

    const postData = JSON.parse(JSON.stringify(req.body))
    let draw = postData.draw
    let row = parseInt(postData.start)

    let rowperpage = parseInt(postData.length); // Rows display per page
    let columnIndex = postData.order[0].column;// Column index
    let columnName = postData.columns[columnIndex].data;// Column name

    let columnSortOrder = postData.order[0].dir;// asc or desc

    let searchValue = postData['search[value]']// Search value
    let columnSortOrderVal;
    if (columnSortOrder == "asc") {
        columnSortOrderVal = 1
    }
    if (columnSortOrder == "desc") {
        columnSortOrderVal = -1
    }
    let sortVal = {}
    sortVal[columnName] = columnSortOrderVal

    let args = req.body.filterData
    let totalRecords
    let totalRecordwithFilter

    if (args == "all") {
        await allData.count({}, (err, count) => {
            totalRecords = count
            totalRecordwithFilter = count
        })
        allData.find({}).skip(row).sort(sortVal).limit(rowperpage).exec((error, document) => {
            let data = gisResponse(document)
            res.json({
                "draw": draw,
                "iTotalRecords": totalRecords,
                "iTotalDisplayRecords": totalRecordwithFilter,
                "aaData": data,
            })

        })
    } else {
        if (args.obj) {
            let filter = {}

            let obj = args.obj
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
                if (keys[i] == "gistype") {
                    let x = { gis_type: { $in: obj[keys[i]] } }
                    Object.assign(filter, x)
                }


            }

            await allData.count(filter, (err, count) => {
                totalRecords = count
                totalRecordwithFilter = count
            })
            await allData.find(filter).skip(row).sort(sortVal).limit(rowperpage).exec((err, res1) => {
                if (err) throw err
                let data = gisResponse(res1)
                res.json({
                    "draw": draw,
                    "iTotalRecords": totalRecords,
                    "iTotalDisplayRecords": totalRecordwithFilter,
                    "aaData": data,
                })
            })
        } else {
            await allData.count(filter, (err, count) => {
                totalRecords = count
                totalRecordwithFilter = count
            })
            await allData.find({
                substation: { $in: args.substationArr },
                scada: { $in: args.scadaArr },
                scada_id: { $in: args.scada_id },
                zone: { $in: args.zone },
                voltage: { $in: args.voltage },
                bays: { $in: args.bays },
                gis_make: { $in: args.gis_make },
                gis_type: { $in: args.gis_type }
            }).skip(row).sort(sortVal).limit(rowperpage).exec((err, document) => {
                if (err) throw err
                totalRecordwithFilter = document.length
                let data = gisResponse(document)
                res.json({
                    "draw": draw,
                    "iTotalRecords": totalRecords,
                    "iTotalDisplayRecords": totalRecordwithFilter,
                    "aaData": data,
                })

            })
        }

    }


})


function viResponse(params) {
    let response = []
    params.forEach((element, index) => {
        let pdf_html
        if (!element.pdf_link || element.pdf_link == "") {
            pdf_html = `<button class="btn btn-secondary" onclick="uplaodPdf('${element._id}')" style="font-size:10px">NA</button>`
        } else {
            // pdf_html = `<a href= " ../../public/uploads/visualInspection/` + element.pdf_link + `" class='btn btn-primary' target="blank"  style="font-size:10px" >View</a>`
            // for development

            pdf_html = `<a href= "../../../../public/uploads/` + element.pdf_link + `" class='btn btn-primary' target="blank"  style="font-size:10px" >View</a>` // for prodouction
        }
        let work_order_no
        if (!element.work_order_no || element.work_order_no == "") {
            work_order_no = "NA"
        } else {
            work_order_no = element.work_order_no
        }

        let boq_ref
        if (!element.boq_ref || element.boq_ref == "") {
            boq_ref = "NA"
        } else {
            boq_ref = element.boq_ref
        }

        let boq_sequence
        if (!element.boq_sequence || element.boq_sequence == "") {
            boq_sequence = "NA"
        } else {
            boq_sequence = element.boq_sequence
        }

        let date
        if (!element.date || element.date == "") {
            date = "NA"
        } else {
            date = element.date
        }

        let substation_name
        if (!element.substation_name || element.substation_name == "") {
            substation_name = "NA"
        } else {
            substation_name = element.substation_name
        }

        let done_by
        if (!element.done_by || element.done_by == "") {
            done_by = "NA"
        } else {
            done_by = element.done_by
        }


        let zone
        if (!element.zone || element.zone == "") {
            zone = "NA"
        } else {
            zone = element.zone
        }

        let newData = {
            sl_no: index + 1,
            _id: element._id,
            boq_ref: boq_ref,
            boq_sequence: boq_sequence,
            date: date,
            substation_name: substation_name,
            done_by: done_by,
            work_order_no: work_order_no,
            zone: zone,
            report: pdf_html
        }
        response.push(newData)
    });
    return response
}



app.post("/getViData", async (req, res) => {

    const postData = JSON.parse(JSON.stringify(req.body))

    let draw = postData.draw
    let row = parseInt(postData.start)

    let rowperpage = parseInt(postData.length); // Rows display per page
    let columnIndex = postData.order[0].column;// Column index
    let columnName = postData.columns[columnIndex].data;// Column name

    let columnSortOrder = postData.order[0].dir;// asc or desc
    let searchValue = postData['search[value]']// Search value
    let columnSortOrderVal;
    if (columnSortOrder == "asc") {
        columnSortOrderVal = 1
    }
    if (columnSortOrder == "desc") {
        columnSortOrderVal = -1
    }
    let sortVal = {}
    sortVal[columnName] = columnSortOrderVal

    let args = req.body.filterData
    let totalRecords
    let totalRecordwithFilter

    if (args == "all") {
        await viData.count({}, (err, count) => {
            totalRecords = count
            totalRecordwithFilter = count
        })
        viData.find({}).skip(row).sort(sortVal).limit(rowperpage).exec((error, document) => {
            let data = viResponse(document)
            res.json({
                "draw": draw,
                "iTotalRecords": totalRecords,
                "iTotalDisplayRecords": totalRecordwithFilter,
                "aaData": data,
            })


        })
    } else {
        if (args.obj) {
            let filter = {}

            let obj = args.obj
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

            await viData.count(filter, (err, count) => {
                totalRecords = count
                totalRecordwithFilter = count
            })
            await viData.find(filter).skip(row).sort(sortVal).limit(rowperpage).exec((err, res1) => {
                if (err) throw err
                let data = viResponse(res1)
                res.json({
                    "draw": draw,
                    "iTotalRecords": totalRecords,
                    "iTotalDisplayRecords": totalRecordwithFilter,
                    "aaData": data,
                })
            })
        }
        else {
            await viData.count(filter, (err, count) => {
                totalRecords = count
                totalRecordwithFilter = count
            })
            await viData.find({
                boq_ref: { $in: args.boq_ref },
                boq_sequence: { $in: args.boq_sequence },
                date: { $in: args.date },
                substation_name: { $in: args.substation_name },
                done_by: { $in: args.done_by },
                work_order_no: { $in: args.work_order_no },
                zone: { $in: args.zone }
            }).skip(row).sort(sortVal).limit(rowperpage).exec((err, document) => {
                if (err) throw err
                totalRecordwithFilter = document.length
                let data = viResponse(document)
                res.json({
                    "draw": draw,
                    "iTotalRecords": totalRecords,
                    "iTotalDisplayRecords": totalRecordwithFilter,
                    "aaData": data,
                })

            })
        }

    }


})


function ocResponse(params) {
    let response = []
    params.forEach((element, index) => {
        let pdf_html
        if (!element.pdf_link || element.pdf_link == "") {
            pdf_html = `<button class="btn btn-secondary" onclick="uplaodPdf('${element._id}')" style="font-size:10px">NA</button>`
        } else {
            // pdf = `<a href= " ../../uploads/` + data[i].pdf_link + `" class='btn btn-secondary' target="blank"  style="font-size:10px" >View</a>`
            // for development

            pdf_html = `<a href= "../../../../public/uploads/` + element.pdf_link + `" class='btn btn-primary' target="blank"  style="font-size:10px" >View</a>` // for prodouction
        }

        let work_order_no
        if (!element.work_order_no || element.work_order_no == "") {
            work_order_no = "NA"
        } else {
            work_order_no = element.work_order_no
        }

        let boq_ref
        if (!element.boq_ref || element.boq_ref == "") {
            boq_ref = "NA"
        } else {
            boq_ref = element.boq_ref
        }

        let boq_sequence
        if (!element.boq_sequence || element.boq_sequence == "") {
            boq_sequence = "NA"
        } else {
            boq_sequence = element.boq_sequence
        }

        let date
        if (!element.date || element.date == "") {
            date = "NA"
        } else {
            date = element.date
        }

        let substation_name
        if (!element.substation_name || element.substation_name == "") {
            substation_name = "NA"
        } else {
            substation_name = element.substation_name
        }


        let bay_no
        if (!element.bay_no || element.bay_no == "") {
            bay_no = "NA"
        } else {
            bay_no = element.bay_no
        }


        let voltage_level
        if (!element.voltage_level || element.voltage_level == "") {
            voltage_level = "NA"
        } else {
            voltage_level = element.voltage_level
        }

        let done_by
        if (!element.done_by || element.done_by == "") {
            done_by = "NA"
        } else {
            done_by = element.done_by
        }

        let zone
        if (!element.zone || element.zone == "") {
            zone = "NA"
        } else {
            zone = element.zone
        }

        let newData = {
            sl_no: index + 1,
            _id: element._id,
            boq_ref: boq_ref,
            boq_sequence: boq_sequence,
            date: date,
            substation_name: substation_name,
            bay_no: bay_no,
            voltage_level: voltage_level,
            done_by: done_by,
            work_order_no: work_order_no,
            zone: zone,
            report: pdf_html
        }
        response.push(newData)
    });
    return response
}



app.post("/getOcData", async (req, res) => {

    const postData = JSON.parse(JSON.stringify(req.body))

    let draw = postData.draw
    let row = parseInt(postData.start)

    let rowperpage = parseInt(postData.length); // Rows display per page
    let columnIndex = postData.order[0].column;// Column index
    let columnName = postData.columns[columnIndex].data;// Column name

    let columnSortOrder = postData.order[0].dir;// asc or desc
    let searchValue = postData['search[value]']// Search value
    let columnSortOrderVal;
    if (columnSortOrder == "asc") {
        columnSortOrderVal = 1
    }
    if (columnSortOrder == "desc") {
        columnSortOrderVal = -1
    }
    let sortVal = {}
    sortVal[columnName] = columnSortOrderVal

    let args = req.body.filterData
    let totalRecords
    let totalRecordwithFilter

    if (args == "all") {
        await ocData.count({}, (err, count) => {
            totalRecords = count
            totalRecordwithFilter = count
        })
        ocData.find({}).skip(row).sort(sortVal).limit(rowperpage).exec((error, document) => {
            let data = ocResponse(document)
            res.json({
                "draw": draw,
                "iTotalRecords": totalRecords,
                "iTotalDisplayRecords": totalRecordwithFilter,
                "aaData": data,
            })

        })
    } else {
        if (args.obj) {
            let filter = {}

            let obj = args.obj
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
                if (keys[i] == "bay_no") {
                    let x = { bay_no: { $in: obj[keys[i]] } }
                    Object.assign(filter, x)
                }
                if (keys[i] == "voltage_level") {
                    let x = { voltage_level: { $in: obj[keys[i]] } }
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


            await ocData.count(filter, (err, count) => {
                totalRecords = count
                totalRecordwithFilter = count
            })
            await ocData.find(filter).skip(row).sort(sortVal).limit(rowperpage).exec((err, res1) => {
                if (err) throw err
                let data = ocResponse(res1)
                res.json({
                    "draw": draw,
                    "iTotalRecords": totalRecords,
                    "iTotalDisplayRecords": totalRecordwithFilter,
                    "aaData": data,
                })
            })
        }
        else {
            await ocData.count(filter, (err, count) => {
                totalRecords = count
                totalRecordwithFilter = count
            })
            await ocData.find({
                boq_ref: { $in: args.boq_ref },
                boq_sequence: { $in: args.boq_sequence },
                date: { $in: args.date },
                substation_name: { $in: args.substation_name },
                bay_no: { $in: args.bay_no },
                voltage_level: { $in: args.voltage_level },
                done_by: { $in: args.done_by },
                work_order_no: { $in: args.work_order_no },
                zone: { $in: args.zone }
            }).skip(row).sort(sortVal).limit(rowperpage).exec((err, document) => {
                if (err) throw err
                totalRecordwithFilter = document.length
                let data = ocResponse(document)
                res.json({
                    "draw": draw,
                    "iTotalRecords": totalRecords,
                    "iTotalDisplayRecords": totalRecordwithFilter,
                    "aaData": data,
                })

            })
        }

    }


})



function pmResponse(params) {
    let response = []
    params.forEach((element, index) => {
        let pdf_html
        if (!element.pdf_link || element.pdf_link == "") {
            pdf_html = `<button class="btn btn-secondary" onclick="uplaodPdf('${element._id}')" style="font-size:10px">NA</button>`
        } else {
            // pdf = `<a href= " ../../uploads/` + data[i].pdf_link + `" class='btn btn-secondary' target="blank"  style="font-size:10px" >View</a>`
            // for development

            pdf_html = `<a href= "../../../../public/uploads/` + element.pdf_link + `" class='btn btn-primary' target="blank"  style="font-size:10px" >View</a>` // for prodouction
        }

        let work_order_no
        if (!element.work_order_no || element.work_order_no == "") {
            work_order_no = "NA"
        } else {
            work_order_no = element.work_order_no
        }

        let zone
        if (!element.zone || element.zone == "") {
            zone = "NA"
        } else {
            zone = element.zone
        }

        let boq_ref
        if (!element.boq_ref || element.boq_ref == "") {
            boq_ref = "NA"
        } else {
            boq_ref = element.boq_ref
        }

        let boq_sequence
        if (!element.boq_sequence || element.boq_sequence == "") {
            boq_sequence = "NA"
        } else {
            boq_sequence = element.boq_sequence
        }

        let date
        if (!element.date || element.date == "") {
            date = "NA"
        } else {
            date = element.date
        }

        let substation_name
        if (!element.substation_name || element.substation_name == "") {
            substation_name = "NA"
        } else {
            substation_name = element.substation_name
        }

        let bay_no
        if (!element.bay_no || element.bay_no == "") {
            bay_no = "NA"
        } else {
            bay_no = element.bay_no
        }


        let voltage_level
        if (!element.voltage_level || element.voltage_level == "") {
            voltage_level = "NA"
        } else {
            voltage_level = element.voltage_level
        }


        let done_by
        if (!element.done_by || element.done_by == "") {
            done_by = "NA"
        } else {
            done_by = element.done_by
        }


        let newData = {
            sl_no: index + 1,
            _id: element._id,
            boq_ref: boq_ref,
            boq_sequence: boq_sequence,
            date: date,
            substation_name: substation_name,
            bay_no: bay_no,
            voltage_level: voltage_level,
            done_by: done_by,
            work_order_no: work_order_no,
            zone: zone,
            report: pdf_html
        }
        response.push(newData)
    });
    return response
}



app.post("/getPmData", async (req, res) => {

    const postData = JSON.parse(JSON.stringify(req.body))

    let draw = postData.draw
    let row = parseInt(postData.start)

    let rowperpage = parseInt(postData.length); // Rows display per page
    let columnIndex = postData.order[0].column;// Column index
    let columnName = postData.columns[columnIndex].data;// Column name

    let columnSortOrder = postData.order[0].dir;// asc or desc
    let searchValue = postData['search[value]']// Search value
    let columnSortOrderVal;
    if (columnSortOrder == "asc") {
        columnSortOrderVal = 1
    }
    if (columnSortOrder == "desc") {
        columnSortOrderVal = -1
    }
    let sortVal = {}
    sortVal[columnName] = columnSortOrderVal

    let args = req.body.filterData
    let totalRecords
    let totalRecordwithFilter

    if (args == "all") {
        await pmData.count({}, (err, count) => {
            totalRecords = count
            totalRecordwithFilter = count
        })
        pmData.find({}).skip(row).sort(sortVal).limit(rowperpage).exec((error, document) => {
            let data = pmResponse(document)
            res.json({
                "draw": draw,
                "iTotalRecords": totalRecords,
                "iTotalDisplayRecords": totalRecordwithFilter,
                "aaData": data,
            })

        })
    } else {
        if (args.obj) {
            let filter = {}

            let obj = args.obj
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
                if (keys[i] == "bay_no") {
                    let x = { bay_no: { $in: obj[keys[i]] } }
                    Object.assign(filter, x)
                }
                if (keys[i] == "voltage_level") {
                    let x = { voltage_level: { $in: obj[keys[i]] } }
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


            await pmData.count(filter, (err, count) => {
                totalRecords = count
                totalRecordwithFilter = count
            })
            await pmData.find(filter).skip(row).sort(sortVal).limit(rowperpage).exec((err, res1) => {
                if (err) throw err
                let data = pmResponse(res1)
                res.json({
                    "draw": draw,
                    "iTotalRecords": totalRecords,
                    "iTotalDisplayRecords": totalRecordwithFilter,
                    "aaData": data,
                })
            })
        }
        else {
            await pmData.count(filter, (err, count) => {
                totalRecords = count
                totalRecordwithFilter = count
            })
            await pmData.find({
                boq_ref: { $in: args.boq_ref },
                boq_sequence: { $in: args.boq_sequence },
                date: { $in: args.date },
                substation_name: { $in: args.substation_name },
                bay_no: { $in: args.bay_no },
                voltage_level: { $in: args.voltage_level },
                done_by: { $in: args.done_by },
                work_order_no: { $in: args.work_order_no },
                zone: { $in: args.zone }
            }).skip(row).sort(sortVal).limit(rowperpage).exec((err, document) => {
                if (err) throw err
                totalRecordwithFilter = document.length
                let data = pmResponse(document)
                res.json({
                    "draw": draw,
                    "iTotalRecords": totalRecords,
                    "iTotalDisplayRecords": totalRecordwithFilter,
                    "aaData": data,
                })

            })
        }

    }


})



function cbcmResponse(params) {
    let response = []
    params.forEach((element, index) => {
        let pdf_html
        if (!element.pdf_link || element.pdf_link == "") {
            pdf_html = `<button class="btn btn-secondary" onclick="uplaodPdf('${element._id}')" style="font-size:10px">NA</button>`
        } else {
            // pdf = `<a href= " ../../uploads/` + data[i].pdf_link + `" class='btn btn-secondary' target="blank"  style="font-size:10px" >View</a>`
            // for development

            pdf_html = `<a href= "../../../../public/uploads/` + element.pdf_link + `" class='btn btn-primary' target="blank"  style="font-size:10px" >View</a>` // for prodouction
        }

        let work_order_no
        if (!element.work_order_no || element.work_order_no == "") {
            work_order_no = "NA"
        } else {
            work_order_no = element.work_order_no
        }
        let description_of_works
        if (!element.description_of_works || element.description_of_works == "") {
            description_of_works = "NA"
        } else {
            description_of_works = element.description_of_works
        }
        let zone
        if (!element.zone || element.zone == "") {
            zone = "NA"
        } else {
            zone = element.zone
        }

        let bay_no
        if (!element.bay_no || element.bay_no == "") {
            bay_no = "NA"
        } else {
            bay_no = element.bay_no
        }


        let boq_sequence
        if (!element.boq_sequence || element.boq_sequence == "") {
            boq_sequence = "NA"
        } else {
            boq_sequence = element.boq_sequence
        }


        let boq_ref
        if (!element.boq_ref || element.boq_ref == "") {
            boq_ref = "NA"
        } else {
            boq_ref = element.boq_ref
        }


        let substation_name
        if (!element.substation_name || element.substation_name == "") {
            substation_name = "NA"
        } else {
            substation_name = element.substation_name
        }


        let done_by
        if (!element.done_by || element.done_by == "") {
            done_by = "NA"
        } else {
            done_by = element.done_by
        }

        let voltage_ratings
        if (!element.voltage_ratings || element.voltage_ratings == "") {
            voltage_ratings = "NA"
        } else {
            voltage_ratings = element.voltage_ratings
        }
        let date
        if (!element.date || element.date == "") {
            date = "NA"
        } else {
            date = element.date
        }

        let newData = {
            sl_no: index + 1,
            _id: element._id,
            boq_ref: boq_ref,
            description_of_works: description_of_works,
            boq_sequence: boq_sequence,
            date: date,
            substation_name: substation_name,
            bay_no: bay_no,
            voltage_ratings: voltage_ratings,
            done_by: done_by,
            work_order_no: work_order_no,
            zone: zone,
            report: pdf_html
        }
        response.push(newData)
    });
    return response
}



app.post("/getCbcmData", async (req, res) => {

    const postData = JSON.parse(JSON.stringify(req.body))

    let draw = postData.draw
    let row = parseInt(postData.start)

    let rowperpage = parseInt(postData.length); // Rows display per page
    let columnIndex = postData.order[0].column;// Column index
    let columnName = postData.columns[columnIndex].data;// Column name

    let columnSortOrder = postData.order[0].dir;// asc or desc
    let searchValue = postData['search[value]']// Search value
    let columnSortOrderVal;
    if (columnSortOrder == "asc") {
        columnSortOrderVal = 1
    }
    if (columnSortOrder == "desc") {
        columnSortOrderVal = -1
    }
    let sortVal = {}
    sortVal[columnName] = columnSortOrderVal

    let args = req.body.filterData
    let totalRecords
    let totalRecordwithFilter

    if (args == "all") {
        await cbcmData.count({}, (err, count) => {
            totalRecords = count
            totalRecordwithFilter = count
        })
        cbcmData.find({}).skip(row).sort(sortVal).limit(rowperpage).exec((error, document) => {
            let data = cbcmResponse(document)
            res.json({
                "draw": draw,
                "iTotalRecords": totalRecords,
                "iTotalDisplayRecords": totalRecordwithFilter,
                "aaData": data,
            })

        })
    } else {
        if (args.obj) {
            let filter = {}

            let obj = args.obj
            let keys = Object.keys(obj)
            for (let i = 0; i < keys.length; i++) {
                if (keys[i] == "boq_ref") {
                    let x = { boq_ref: { $in: obj[keys[i]] } }
                    Object.assign(filter, x)
                }
                if (keys[i] == "description_of_work") {
                    let x = { description_of_work: { $in: obj[keys[i]] } }
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
                if (keys[i] == "bay_no") {
                    let x = { bay_no: { $in: obj[keys[i]] } }
                    Object.assign(filter, x)
                }
                if (keys[i] == "voltage_level") {
                    let x = { voltage_level: { $in: obj[keys[i]] } }
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


            await cbcmData.count(filter, (err, count) => {
                totalRecords = count
                totalRecordwithFilter = count
            })
            await cbcmData.find(filter).skip(row).sort(sortVal).limit(rowperpage).exec((err, res1) => {
                if (err) throw err
                let data = cbcmResponse(res1)
                res.json({
                    "draw": draw,
                    "iTotalRecords": totalRecords,
                    "iTotalDisplayRecords": totalRecordwithFilter,
                    "aaData": data,
                })
            })
        }
        else {
            await cbcmData.count(filter, (err, count) => {
                totalRecords = count
                totalRecordwithFilter = count
            })
            await cbcmData.find({
                boq_ref: { $in: args.boq_ref },
                description_of_work: { $in: args.description_of_work },
                boq_sequence: { $in: args.boq_sequence },
                date: { $in: args.date },
                substation_name: { $in: args.substation_name },
                bay_no: { $in: args.bay_no },
                voltage_level: { $in: args.voltage_level },
                done_by: { $in: args.done_by },
                work_order_no: { $in: args.work_order_no },
                zone: { $in: args.zone }
            }).skip(row).sort(sortVal).limit(rowperpage).exec((err, document) => {
                if (err) throw err
                totalRecordwithFilter = document.length
                let data = cbcmResponse(document)
                res.json({
                    "draw": draw,
                    "iTotalRecords": totalRecords,
                    "iTotalDisplayRecords": totalRecordwithFilter,
                    "aaData": data,
                })

            })
        }

    }


})



function smhResponse(params) {
    let response = []
    params.forEach((element, index) => {
        let pdf_html
        if (!element.pdf_link || element.pdf_link == "") {
            pdf_html = `<button class="btn btn-secondary" onclick="uplaodPdf('${element._id}')" style="font-size:10px">NA</button>`
        } else {
            // pdf_html = `<a href= " ../../public/uploads/substationMaintenanceHistory/` + element.pdf_link + `" class='btn btn-secondary' target="blank"  style="font-size:10px" >View</a>`  // for development

            pdf_html = `<a href= "../../../../public/uploads/` + element.pdf_link + `" class='btn btn-primary' target="blank"  style="font-size:10px" >View</a>` // for prodouction
        }

        let boq_description
        if (!element.boq_description || element.boq_description == "") {
            boq_description = "NA"
        } else {
            boq_description = element.boq_description
        }
        let voltage_ratings
        if (!element.voltage_ratings || element.voltage_ratings == "") {
            voltage_ratings = "NA"
        } else {
            voltage_ratings = element.voltage_ratings
        }
        let zone
        if (!element.zone || element.zone == "") {
            zone = "NA"
        } else {
            zone = element.zone
        }

        let boq_ref
        if (!element.boq_ref || element.boq_ref == "") {
            boq_ref = "NA"
        } else {
            boq_ref = element.boq_ref
        }

        let boq_sequence
        if (!element.boq_sequence || element.boq_sequence == "") {
            boq_sequence = "NA"
        } else {
            boq_sequence = element.boq_sequence
        }

        let date
        if (!element.date || element.date == "") {
            date = "NA"
        } else {
            date = element.date
        }

        let substation_name
        if (!element.substation_name || element.substation_name == "") {
            substation_name = "NA"
        } else {
            substation_name = element.substation_name
        }


        let bay_no
        if (!element.bay_no || element.bay_no == "") {
            bay_no = "NA"
        } else {
            bay_no = element.bay_no
        }



        let done_by
        if (!element.done_by || element.done_by == "") {
            done_by = "NA"
        } else {
            done_by = element.done_by
        }

        let newData = {
            sl_no: index + 1,
            _id: element._id,
            boq_ref: boq_ref,
            boq_description: boq_description,
            boq_sequence: boq_sequence,
            date: date,
            substation_name: substation_name,
            bay_no: bay_no,
            voltage_ratings: voltage_ratings,
            done_by: done_by,
            zone: zone,
            report: pdf_html
        }
        response.push(newData)
    });
    return response
}



app.post("/getSmhData", async (req, res) => {

    const postData = JSON.parse(JSON.stringify(req.body))
    let draw = postData.draw
    let row = parseInt(postData.start)

    let rowperpage = parseInt(postData.length); // Rows display per page
    let columnIndex = postData.order[0].column;// Column index
    let columnName = postData.columns[columnIndex].data;// Column name

    let columnSortOrder = postData.order[0].dir;// asc or desc
    let searchValue = postData['search[value]']// Search value
    let columnSortOrderVal;
    if (columnSortOrder == "asc") {
        columnSortOrderVal = 1
    }
    if (columnSortOrder == "desc") {
        columnSortOrderVal = -1
    }
    let sortVal = {}
    sortVal[columnName] = columnSortOrderVal

    let args = req.body.filterData
    let totalRecords
    let totalRecordwithFilter

    if (args == "all") {
        await smhData.count({}, (err, count) => {
            totalRecords = count
            totalRecordwithFilter = count
        })
        smhData.find({}).skip(row).sort(sortVal).limit(rowperpage).exec((error, document) => {
            let data = smhResponse(document)
            res.json({
                "draw": draw,
                "iTotalRecords": totalRecords,
                "iTotalDisplayRecords": totalRecordwithFilter,
                "aaData": data,
            })

        })
    } else {
        if (args.obj) {
            let filter = {}

            let obj = args.obj
            let keys = Object.keys(obj)
            for (let i = 0; i < keys.length; i++) {
                if (keys[i] == "boq_ref") {
                    let x = { boq_ref: { $in: obj[keys[i]] } }
                    Object.assign(filter, x)
                }
                if (keys[i] == "boq_description") {
                    let x = { boq_description: { $in: obj[keys[i]] } }
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
                if (keys[i] == "bay_no") {
                    let x = { bay_no: { $in: obj[keys[i]] } }
                    Object.assign(filter, x)
                }
                if (keys[i] == "voltage_ratings") {
                    let x = { voltage_ratings: { $in: obj[keys[i]] } }
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


            await smhData.count(filter, (err, count) => {
                totalRecords = count
                totalRecordwithFilter = count
            })
            await smhData.find(filter).skip(row).sort(sortVal).limit(rowperpage).exec((err, res1) => {
                if (err) throw err
                let data = smhResponse(res1)
                res.json({
                    "draw": draw,
                    "iTotalRecords": totalRecords,
                    "iTotalDisplayRecords": totalRecordwithFilter,
                    "aaData": data,
                })
            })
        }
        else {
            await smhData.count(filter, (err, count) => {
                totalRecords = count
                totalRecordwithFilter = count
            })
            await smhData.find({
                boq_ref: { $in: args.boq_ref },
                boq_description: { $in: args.boq_description },
                boq_sequence: { $in: args.boq_sequence },
                date: { $in: args.date },
                substation_name: { $in: args.substation_name },
                bay_no: { $in: args.bay_no },
                voltage_ratings: { $in: args.voltage_ratings },
                done_by: { $in: args.done_by },
                work_order_no: { $in: args.work_order_no },
                zone: { $in: args.zone }
            }).skip(row).sort(sortVal).limit(rowperpage).exec((err, document) => {
                if (err) throw err
                totalRecordwithFilter = document.length
                let data = smhResponse(document)
                res.json({
                    "draw": draw,
                    "iTotalRecords": totalRecords,
                    "iTotalDisplayRecords": totalRecordwithFilter,
                    "aaData": data,
                })

            })
        }

    }


})


app.listen("3456", () => {
    console.log("app is running at 3456")
})