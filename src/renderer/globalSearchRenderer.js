const electron = require('electron')
const { ipcRenderer } = electron
const fs = require('fs')
const json2xls = require('json2xls')
$(".loader-container").css("display", "none")
$("#center").css("display", "none")
let processing = true
let getData
let renderedData
function findData(field) {
    if ($("#" + field).val().trim() == "") {
        return false
    }
    $(".loader-container").css("display", "block")
    $("#center").css("display", "none")
    // let inputData = []
    let substation_name = $("#substation_name").val()
    let voltage = $("#voltage").val().trim()
    let bay_no = $("#bay_no").val().trim()
    let month = $("#month").val().trim()
    let year = $("#year").val().trim()
    let data = {
        substation_name: substation_name,
        voltage: voltage,
        bay_no: bay_no,
        month: month,
        year: year
    }


    if (processing) {
        console.log('trying to stop')
        clearTimeout(getData)
    }

    getData = setTimeout(() => {
        console.log('executed')
        ipcRenderer.send("loadAllSearchingData", { filter: data })
    }, 2000)
}


ipcRenderer.on('loadAllDropDown', (e, arg) => {

    let argKeys = Object.keys(arg)
    let html = ""
    let index = 0
    renderedData = arg
    // console.log(arg)
    for (let i = 0; i < argKeys.length; i++) {
        let keyVal = arg[argKeys[i]]
        if (argKeys[i] == "vi") {
            html = html + `<tr style="background: dimgray; color: #ffffff; font-weight: 600; font-size: larger;"><td colspan="12">Visual Inspection</td></tr>`

        }
        if (argKeys[i] == "oc") {
            html = html + `<tr style="background: dimgray; color: #ffffff; font-weight: 600; font-size: larger;"><td colspan="12">Operational Check</td></tr>`

        }
        if (argKeys[i] == "pm") {
            html = html + `<tr style="background: dimgray; color: #ffffff; font-weight: 600; font-size: larger;"><td colspan="12">Periodic Maintenance</td></tr>`

        }
        if (argKeys[i] == "cbcm") {
            html = html + `<tr style="background: dimgray; color: #ffffff; font-weight: 600; font-size: larger;"><td colspan="12">CBCM</td></tr>`

        }
        if (argKeys[i] == "smh") {
            html = html + `<tr style="background: dimgray; color: #ffffff; font-weight: 600; font-size: larger;"><td colspan="12">Substation Maintenance History</td></tr>`

        }
        keyVal.forEach(element => {
            let pdf = ""
            if (element.pdf_link == "" || !(element.pdf_link)) {
                pdf = `<button class='btn btn-secondary' onclick="uplaodPdf(` + element._id + `)"  style="font-size:10px" disabled>NA</button>`
            } else {
                //pdf = `<a href= " ../../uploads/` + element.pdf_link + `" class='btn btn-secondary' target="blank"  style="font-size:10px" >View</a>`// for development

                pdf = `<a href= "../../../../public/uploads/` + element.pdf_link + `" class='btn btn-primary' target="blank"  style="font-size:10px" >View</a>` // for prodouction
            }
            let bay = '<p>NA</p>'
            if (element.bay_no) {
                bay = element.bay_no
            }
            let voltage = '<p>NA</p>'
            if (element.voltage_level) {
                voltage = element.voltage_level
            }
            if (element.voltage_ratings) {
                voltage = element.voltage_ratings
            }
            index = index + 1
            html = html + `
                    <tr>
                    <th scope="row">`+ index + `</th>
                        <td>` + argKeys[i].toUpperCase() + `</td>
                        <td>`+ element.boq_ref + `</td>
                        <td>`+ element.boq_sequence + `</td>
                        <td style="width:120px">`+ element.date + `</td>
                        <td>`+ element.substation_name + `</td>
                        <td>`+ bay + `</td>
                        <td>`+ voltage + `</td>
                        <td>`+ element.done_by + `</td>
                        <td>`+ element.work_order_no + `</td>
                        <td>`+ element.zone + `</td>
                        <td>`+ pdf + `</td>
                    </tr>
                    `

        });

    }
    $("#all-filter-table").html(html)
    $(".loader-container").css("display", "none")
    $("#center").css("display", "block")

})

function downloadSheet() {
    let sheetData = []
    let argKeys = Object.keys(renderedData)

    // console.log(renderedData)
    for (let i = 0; i < argKeys.length; i++) {
        let dept
        if (argKeys[i] == "vi") {
            dept = "VI"
        }
        if (argKeys[i] == "oc") {
            dept = "OC"
        }
        if (argKeys[i] == "pm") {
            dept = "PM"
        }
        if (argKeys[i] == "smh") {
            dept = "SMH"
        }
        let keyVal = renderedData[argKeys[i]]
        keyVal.forEach(item => {
            let data = {
                "": dept,
                "BOQ Ref": item.boq_ref,
                "BOQ Sequence": item.boq_sequence,
                "Date": item.date,
                "Substation Name": item.substation_name,
                "Bay No": item.bay_no,
                "Voltage": item.voltage_ratings,
                "Done By": item.done_by,
                "Work Order No": item.work_order_no,
                "Zone": item.zone,
            }
            sheetData.push(data)

        })
    }
    // console.log(sheetData)
    let xls = json2xls(sheetData);

    fs.writeFileSync('hitachi-abb-search-extract.xlsx', xls, 'binary');
    download()


}
const download = () => {
    window.location.href = "../../hitachi-abb-search-extract.xlsx"
    setTimeout(() => {
        fs.unlinkSync('hitachi-abb-search-extract.xlsx')
    }, 1000)
}