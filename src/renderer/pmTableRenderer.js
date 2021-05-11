const electron = require('electron')
const { ipcRenderer } = electron

$(".loader-container").css("display", "block")
$("#center").css("display", "none")


let processing = true
let changeDropDownTimeout


let dropDownData;
let menuObj = {}
ipcRenderer.send("loadDataPm")
ipcRenderer.on("loadDataPm", (e, arg) => {
    dropDownData = arg.dropDownData
    loadPmDropDown(dropDownData)

})

let selectedId = []
ipcRenderer.on('changedPmDropDown', (e, arg) => {
    let id = arg.id
    if (!selectedId.includes(arg.id)) {
        selectedId.push(arg.id)
    }

    let multiselectOption = {
        buttonWidth: '160px',
        includeSelectAllOption: true,
        nonSelectedText: 'Empty',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        allSelectedText: 'All'
    }

    let dropdownArr = {
        boq_ref: arg.boq_ref,
        boq_sequence: arg.boq_sequence,
        date: arg.date,
        substation_name: arg.substation_name,
        bay_no: arg.bay_no,
        voltage_level: arg.voltage_level,
        done_by: arg.done_by,
        work_order_no: arg.work_order_no,
        zone: arg.zone,
        id: arg.id,
        obj: arg.dataObj
    }

    loadViDataTable({ filterData: dropdownArr })
    let allId = ["boq_ref", "boq_sequence", "date", "substation_name", "bay_no", "voltage_level", "done_by", "work_order_no", "zone"]

    for (let i = 0; i < allId.length; i++) {
        let html = `<select name="` + allId[i] + `" id="` + allId[i] + `" multiple onchange="ocFilterClick('` + allId[i] + `')">`
        let key = allId[i]
        let data = []
        let f_data = []
        let filteredData
        if (key == "boq_ref") {
            data = arg.boq_ref
            f_data = menuObj.boq_ref
            filteredData = f_data.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                data
            );
        }
        if (key == "boq_sequence") {
            data = arg.boq_sequence
            f_data = menuObj.boq_sequence
            filteredData = f_data.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                data
            );
        }
        if (key == "date") {
            data = arg.date
            f_data = menuObj.date
            filteredData = f_data.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                data
            );
        }
        if (key == "substation_name") {
            data = arg.substation_name
            f_data = menuObj.substation_name
            filteredData = f_data.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                data
            );
        }
        if (key == "done_by") {
            data = arg.done_by
            f_data = menuObj.done_by
            filteredData = f_data.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                data
            );
        }
        if (key == "bay_no") {
            data = arg.bay_no
            f_data = menuObj.bay_no
            filteredData = f_data.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                data
            );
        }
        if (key == "voltage_level") {
            data = arg.voltage_level
            f_data = menuObj.voltage_level
            filteredData = f_data.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                data
            );
        }
        if (key == "work_order_no") {
            data = arg.work_order_no
            f_data = menuObj.work_order_no
            filteredData = f_data.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                data
            );
        }
        if (key == "zone") {
            data = arg.zone
            f_data = menuObj.zone
            filteredData = f_data.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                data
            );
        }

        for (let j = 0; j < data.length; j++) {

            html = html + `<option value="` + data[j] + `" selected>` + data[j] + `</option>`

        }

        if (filteredData.length > 0) {
            for (let k = 0; k < filteredData.length; k++) {
                html = html + `<option value="` + filteredData[k] + `">` + filteredData[k] + `</option>`

            }
        }


        html = html + '</select>'
        if (id !== key) {
            $("#" + key + "-container").html(html)
            $("#" + key).multiselect(multiselectOption)
        }

    }

})

function loadPmDropDown(data) {
    let multiselectOption = {
        buttonWidth: '160px',
        includeSelectAllOption: true,
        nonSelectedText: 'Empty',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        allSelectedText: 'All'
    }

    let boq_ref_html = `<select name="boq_ref" id="boq_ref" multiple onchange="ocFilterClick('boq_ref')">`
    let boq_sequence_html = `<select name="boq_sequence" id="boq_sequence" multiple onchange="ocFilterClick('boq_sequence')">`
    let date_html = `<select name="date" id="date" multiple onchange="ocFilterClick('date')">`
    let substation_name_html = `<select name="substation_name" id="substation_name" multiple onchange="ocFilterClick('substation_name')">`
    let bay_no_html = `<select name="bay_no" id="bay_no" multiple onchange="ocFilterClick('bay_no')">`
    let voltage_level_html = `<select name="voltage_level" id="voltage_level" multiple onchange="ocFilterClick('voltage_level')">`
    let done_by_html = `<select name="done_by" id="done_by" multiple onchange="ocFilterClick('done_by')">`
    let work_order_no_html = `<select name="work_order_no" id="work_order_no" multiple onchange="ocFilterClick('work_order_no')">`
    let zone_html = `<select name="zone" id="zone" multiple onchange="ocFilterClick('zone')">`
    // let allBaysHtml = `<select name="scada" id="scada" multiple >`


    let boq_ref = data.boq_ref
    let boq_sequence = data.boq_sequence
    let date = data.date
    let substation_name = data.substation_name
    let bay_no = data.bay_no
    let voltage_level = data.voltage_level
    let done_by = data.done_by
    let work_order_no = data.work_order_no
    let zone = data.zone


    for (let i = 0; i < boq_ref.length; i++) {
        boq_ref_html = boq_ref_html + `<option value="` + boq_ref[i] + `">` + boq_ref[i] + `</option>`

    }
    for (let i = 0; i < boq_sequence.length; i++) {
        boq_sequence_html = boq_sequence_html + `<option value="` + boq_sequence[i] + `">` + boq_sequence[i] + `</option>`

    }

    for (let i = 0; i < date.length; i++) {
        date_html = date_html + `<option value="` + date[i] + `">` + date[i] + `</option>`

    }
    for (let i = 0; i < substation_name.length; i++) {
        substation_name_html = substation_name_html + `<option value="` + substation_name[i] + `">` + substation_name[i] + `</option>`

    }

    for (let i = 0; i < bay_no.length; i++) {
        bay_no_html = bay_no_html + `<option value="` + bay_no[i] + `">` + bay_no[i] + `</option>`

    }
    for (let i = 0; i < voltage_level.length; i++) {
        voltage_level_html = voltage_level_html + `<option value="` + voltage_level[i] + `">` + voltage_level[i] + `</option>`

    }
    for (let i = 0; i < done_by.length; i++) {
        done_by_html = done_by_html + `<option value="` + done_by[i] + `">` + done_by[i] + `</option>`

    }
    for (let i = 0; i < work_order_no.length; i++) {
        work_order_no_html = work_order_no_html + `<option value="` + work_order_no[i] + `">` + work_order_no[i] + `</option>`

    }

    for (let i = 0; i < zone.length; i++) {
        zone_html = zone_html + `<option value="` + zone[i] + `">` + zone[i] + `</option>`

    }


    boq_ref_html = boq_ref_html + `</select>`
    boq_sequence_html = boq_sequence_html + `</select>`
    date_html = date_html + `</select>`
    substation_name_html = substation_name_html + `</select>`
    bay_no_html = bay_no_html + `</select>`
    voltage_level_html = voltage_level_html + `</select>`
    done_by_html = done_by_html + `</select>`
    work_order_no_html = work_order_no_html + `</select>`
    zone_html = zone_html + `</select>`


    $("#boq_ref-container").html(boq_ref_html)
    $("#boq_ref").multiselect(multiselectOption).multiselect('selectAll', false).multiselect('updateButtonText');

    $("#boq_sequence-container").html(boq_sequence_html)
    $("#boq_sequence").multiselect(multiselectOption).multiselect('selectAll', false).multiselect('updateButtonText');

    $("#date-container").html(date_html)
    $("#date").multiselect(multiselectOption).multiselect('selectAll', false).multiselect('updateButtonText');

    $("#substation_name-container").html(substation_name_html)
    $("#substation_name").multiselect(multiselectOption).multiselect('selectAll', false).multiselect('updateButtonText');

    $("#bay_no-container").html(bay_no_html)
    $("#bay_no").multiselect(multiselectOption).multiselect('selectAll', false).multiselect('updateButtonText');

    $("#voltage_level-container").html(voltage_level_html)
    $("#voltage_level").multiselect(multiselectOption).multiselect('selectAll', false).multiselect('updateButtonText');

    $("#work_order_no-container").html(work_order_no_html)
    $("#work_order_no").multiselect(multiselectOption).multiselect('selectAll', false).multiselect('updateButtonText');

    $("#done_by-container").html(done_by_html)
    $("#done_by").multiselect(multiselectOption).multiselect('selectAll', false).multiselect('updateButtonText');

    $("#work_order_no-container").html(work_order_no_html)
    $("#work_order_no").multiselect(multiselectOption).multiselect('selectAll', false).multiselect('updateButtonText');

    $("#zone-container").html(zone_html)
    $("#zone").multiselect(multiselectOption).multiselect('selectAll', false).multiselect('updateButtonText');


    menuObj = {
        boq_ref: boq_ref,
        boq_sequence: boq_sequence,
        date: date,
        substation_name: substation_name,
        bay_no: bay_no,
        voltage_level: voltage_level,
        done_by: done_by,
        work_order_no: work_order_no,
        zone: zone
    }

    $(".loader-container").css("display", "none")
    $("#center").css("display", "block")
}
let dataObj = {}
function ocFilterClick(id) {
    if (processing) {
        console.log('trying to stop')
        clearTimeout(changeDropDownTimeout)
    }
    let idArr = $("#" + id).val()
    if (idArr.length == 0) {
        idArr = [""]
    }

    if (id == "boq_ref") {
        Object.assign(dataObj, { boq_ref: idArr })
    }
    if (id == "boq_sequence") {
        Object.assign(dataObj, { boq_sequence: idArr })
    }
    if (id == "date") {
        Object.assign(dataObj, { date: idArr })
    }
    if (id == "substation_name") {
        Object.assign(dataObj, { substation_name: idArr })
    }
    if (id == "done_by") {
        Object.assign(dataObj, { done_by: idArr })
    }
    if (id == "bay_no") {
        Object.assign(dataObj, { bay_no: idArr })
    }
    if (id == "voltage_level") {
        Object.assign(dataObj, { voltage_level: idArr })
    }
    if (id == "work_order_no") {
        Object.assign(dataObj, { work_order_no: idArr })
    }
    if (id == "zone") {
        Object.assign(dataObj, { zone: idArr })
    }

    let arr = {
        id: id,
        arr: idArr,
        dataObj: dataObj
    }
    changeDropDownTimeout = setTimeout(() => {
        console.log('executed')

        ipcRenderer.send('changePmDropDown', arr)
    }, 2000)


}
$(document).ready(() => {
    loadViDataTable({ filterData: "all" })
})
function loadViDataTable(filter) {
    $('#pmData').DataTable({
        "processing": true,
        "serverSide": true,
        "searching": false,
        "order": [0, 'desc'],
        "ajax": {
            "url": "http://localhost:3456/getPmData",
            "type": "POST",
            "data": filter
        },
        "columns": [
            { "data": "sl_no", orderable: false },
            { "data": "boq_ref" },
            { "data": "boq_sequence" },
            { "data": "date" },
            { "data": "substation_name" },
            { "data": "bay_no" },
            { "data": "voltage_level" },
            { "data": "done_by" },
            { "data": "work_order_no" },
            { "data": "zone" },
            { "data": "report", orderable: false }
        ],
        "bDestroy": true
    });
    $(".loader-container").css("display", "none")
    $("#center").css("display", "block")
}
