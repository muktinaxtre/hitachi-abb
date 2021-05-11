const electron = require('electron');
const { ipcRenderer } = electron;
const path = require('path')

$(".loader-container").css("display", "block")
$("#center").css("display", "none")

let processing = true
let changeDropDownTimeout

let totalRecords = 0
let mainDropDownObj = {}
ipcRenderer.send('totalTableRecords')
ipcRenderer.on("totalTableRecords", (e, data) => {
    totalRecords = data;
})

let selectedOption = {}
let defaultTableData = { skip: 0, filter: null }
ipcRenderer.send('loadViTable_', defaultTableData)
ipcRenderer.on("loadViTable_", (e, response) => {

    let data = response.data

    let html = ''
    for (let i = 0; i < data.length; i++) {
        let pdf = ""
        if (data[i].pdf_link == "" || !(data[i].pdf_link)) {
            pdf = `<button class='btn btn-secondary' onclick="uplaodPdf(` + data[i]._id + `)" style="font-size:10px">NA</button>`
        } else {
            // pdf = `<a href= " ../../uploads/` + data[i].pdf_link + `" class='btn btn-secondary' target="blank"  style="font-size:10px" >View</a>`
            // for development

            pdf = `<a href= "../../../../uploads/` + data[i].pdf_link + `" class='btn btn-secondary' target="blank"  style="font-size:10px" >View</a>` // for prodouction
        }
        let slNo = i + 1
        html = html + `
        <tr>
            <th scope="row">`+ slNo + `</th>
            <td>`+ data[i].boq_ref + `</td>
            <td>`+ data[i].boq_sequence + `</td>
            <td>`+ data[i].date + `</td>
            <td>`+ data[i].substation_name + `</td>
            <td>`+ data[i].done_by + `</td>
            <td>`+ data[i].work_order_no + `</td>
            <td>`+ data[i].zone + `</td>
            <td>`+ pdf + `</td>
        </tr>
        `
    }
    $("#vi-filter-table").html(html)
    // let x = { skip: response.skip + 50, filter: response.filter }

    // setTimeout(() => {
    //     ipcRenderer.send('loadViTable_', x)
    // }, 3000)


})

ipcRenderer.on("appendViTable_", (e, response) => {
    let data = response.data
    // console.log(data)
    let html = ''

    for (let i = 0; i < data.length; i++) {
        let pdf = ""
        if (data[i].pdf_link == "" || !(data[i].pdf_link)) {
            pdf = `<button class='btn btn-secondary' onclick="uplaodPdf(` + data[i]._id + `)">Upload PDF</button>`
        } else {
            pdf = `<button class='btn btn-secondary' onclick=viewPdf(` + data[i]._id + `, ` + data[i].pdf_link + `) >Upload PDF</button>`
        }
        let slNo = i + response.skip + 1
        html = html + `
        <tr>
            <th scope="row">`+ slNo + `</th>
            <td>`+ data[i].boq_ref + `</td>
            <td>`+ data[i].boq_sequence + `</td>
            <td>`+ data[i].date + `</td>
            <td>`+ data[i].substation_name + `</td>
            <td>`+ data[i].done_by + `</td>
            <td>`+ data[i].work_order_no + `</td>
            <td>`+ data[i].zone + `</td>
            <td>`+ pdf + `</td>
        </tr>
        `
    }
    $("#vi-filter-table").append(html)

    if (response.skip < totalRecords) {
        let x = { skip: response.skip + 50, filter: response.filter }
        setTimeout(() => {
            ipcRenderer.send('loadViTable_', x)
        }, 3000)
    }
})


let defaultDropDownData = {
    filter: {},
    default: true
}
ipcRenderer.send("LoadViDropDown_", defaultDropDownData)

ipcRenderer.on("LoadViDropDown_", (e, arg) => {
    let id = arg.id
    let documents = arg.data
    let boq_ref = []
    let boq_sequence = []
    let date = []
    let substation_name = []
    let done_by = []
    let work_order_no = []
    let zone = []

    let boq_ref_html = `<select name="boq_ref" id="boq_ref" multiple onchange="viFilterClick('boq_ref')">`
    let boq_sequence_html = `<select name="boq_sequence" id="boq_sequence" multiple onchange="viFilterClick('boq_sequence')">`
    let date_html = `<select name="date" id="date" multiple onchange="viFilterClick('date')">`
    let substation_name_html = `<select name="substation_name" id="substation_name" multiple onchange="viFilterClick('substation_name')">`
    let done_by_html = `<select name="done_by" id="done_by" multiple onchange="viFilterClick('done_by')">`
    let work_order_no_html = `<select name="work_order_no" id="work_order_no" multiple onchange="viFilterClick('work_order_no')">`
    let zone_html = `<select name="zone" id="zone" multiple onchange="viFilterClick('zone')">`
    for (let i = 0; i < documents.length; i++) {
        let selectText = "selected"
        if (!boq_ref.includes(documents[i].boq_ref)) {
            boq_ref_html = boq_ref_html + `<option value="` + documents[i].boq_ref + `" ` + selectText + `>` + documents[i].boq_ref + `</option>`
            boq_ref.push(documents[i].boq_ref)
        }

        if (!boq_sequence.includes(documents[i].boq_sequence)) {
            boq_sequence_html = boq_sequence_html + `<option value="` + documents[i].boq_sequence + `" ` + selectText + `>` + documents[i].boq_sequence + `</option>`
            boq_sequence.push(documents[i].boq_sequence)
        }

        if (!date.includes(documents[i].date)) {
            date_html = date_html + `<option value="` + documents[i].date + `" ` + selectText + `>` + documents[i].date + `</option>`
            date.push(documents[i].date)
        }

        if (!substation_name.includes(documents[i].substation_name)) {
            substation_name_html = substation_name_html + `<option value="` + documents[i].substation_name + `" ` + selectText + `>` + documents[i].substation_name + `</option>`
            substation_name.push(documents[i].substation_name)
        }

        if (!done_by.includes(documents[i].done_by)) {
            done_by_html = done_by_html + `<option value="` + documents[i].done_by + `" ` + selectText + `>` + documents[i].done_by + `</option>`
            done_by.push(documents[i].done_by)
        }

        if (!work_order_no.includes(documents[i].work_order_no)) {
            work_order_no_html = work_order_no_html + `<option value="` + documents[i].work_order_no + `" ` + selectText + `>` + documents[i].work_order_no + `</option>`
            work_order_no.push(documents[i].work_order_no)
        }

        if (!zone.includes(documents[i].zone)) {
            zone_html = zone_html + `<option value="` + documents[i].zone + `" ` + selectText + `>` + documents[i].zone + `</option>`
            zone.push(documents[i].zone)
        }

    }

    boq_ref_html = boq_ref_html + `</select>`
    boq_sequence_html = boq_sequence_html + `</select>`
    date_html = date_html + `</select>`
    substation_name_html = substation_name_html + `</select>`
    done_by_html = done_by_html + `</select>`
    work_order_no_html = work_order_no_html + `</select>`
    zone_html = zone_html + `</select>`

    let multiselectOption = {
        buttonWidth: '160px',
        includeSelectAllOption: true,
        nonSelectedText: 'Empty',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        allSelectedText: 'All'
    }

    if (id !== "boq_ref") {
        $("#boq_ref-container").html(boq_ref_html)
        $("#boq_ref").multiselect(multiselectOption)
    }
    if (id !== "boq_sequence") {
        $("#boq_sequence-container").html(boq_sequence_html)
        $("#boq_sequence").multiselect(multiselectOption)
    }
    if (id !== "date") {
        $("#date-container").html(date_html)
        $("#date").multiselect(multiselectOption)
    }
    if (id !== "substation_name") {
        $("#substation_name-container").html(substation_name_html)
        $("#substation_name").multiselect(multiselectOption)
    }
    if (id !== "work_order_no") {
        $("#work_order_no-container").html(work_order_no_html)
        $("#work_order_no").multiselect(multiselectOption)
    }
    if (id !== "done_by") {
        $("#done_by-container").html(done_by_html)
        $("#done_by").multiselect(multiselectOption)
    }
    if (id !== "work_order_no") {
        $("#work_order_no-container").html(work_order_no_html)
        $("#work_order_no").multiselect(multiselectOption)
    }
    if (id !== "zone") {
        $("#zone-container").html(zone_html)
        $("#zone").multiselect(multiselectOption)
    }
    mainDropDownObj = {
        boq_ref: boq_ref,
        boq_sequence: boq_sequence,
        date: date,
        substation_name: substation_name,
        done_by: done_by,
        work_order_no: work_order_no,
        zone: zone

    }
    $(".loader-container").css("display", "none")
    $("#center").css("display", "block")

})
let filter = {}

function viFilterClick(id) {
    if (processing) {
        console.log('trying to stop')
        clearTimeout(changeDropDownTimeout)
    }

    if (id == "boq_ref") {
        let x = { boq_ref: $("#boq_ref").val() }
        Object.assign(filter, x)
    }

    if (id == "boq_sequence") {
        let x = { boq_sequence: $("#boq_sequence").val() }
        Object.assign(filter, x)
    }

    if (id == "date") {
        let x = { date: $("#date").val() }
        Object.assign(filter, x)
    }

    if (id == "substation_name") {
        let x = { substation_name: $("#substation_name").val() }
        Object.assign(filter, x)
    }

    if (id == "done_by") {
        let x = { done_by: $("#done_by").val() }
        Object.assign(filter, x)
    }

    if (id == "work_order_no") {
        let x = { work_order_no: $("#work_order_no").val() }
        Object.assign(filter, x)
    }

    if (id == "zone") {
        let x = { zone: $("#zone").val() }
        Object.assign(filter, x)
    }

    selectedOption = {
        boq_ref: $("#boq_ref").val(),
        boq_sequence: $("#boq_sequence").val(),
        date: $("#date").val(),
        substation_name: $("#substation_name").val(),
        done_by: $("#done_by").val(),
        work_order_no: $("#work_order_no").val(),
        zone: $("#zone").val(),
    }
    let data = {
        filter: filter,
        skip: 0
    }
    let dropDownData = {
        id: id,
        filter: filter,
        selectedOption: selectedOption,
        default: false
    }
    changeDropDownTimeout = setTimeout(() => {
        console.log('executed')

        ipcRenderer.send("LoadViDropDown_", dropDownData)
        ipcRenderer.send('loadViTable_', data)
    }, 2000)

}

ipcRenderer.on('LoadViDropDownOnChange_', (e, arg) => {
    console.log(arg.id)
    let id = arg.id
    let documents = arg.data
    let boq_ref = []
    let boq_sequence = []
    let date = []
    let substation_name = []
    let done_by = []
    let work_order_no = []
    let zone = []

    let boq_ref_html = `<select name="boq_ref" id="boq_ref" multiple onchange="viFilterClick('boq_ref')">`
    let boq_sequence_html = `<select name="boq_sequence" id="boq_sequence" multiple onchange="viFilterClick('boq_sequence')">`
    let date_html = `<select name="date" id="date" multiple onchange="viFilterClick('date')">`
    let substation_name_html = `<select name="substation_name" id="substation_name" multiple onchange="viFilterClick('substation_name')">`
    let done_by_html = `<select name="done_by" id="done_by" multiple onchange="viFilterClick('done_by')">`
    let work_order_no_html = `<select name="work_order_no" id="work_order_no" multiple onchange="viFilterClick('work_order_no')">`
    let zone_html = `<select name="zone" id="zone" multiple onchange="viFilterClick('zone')">`
    for (let i = 0; i < documents.length; i++) {
        let selectText = "selected"
        if (!boq_ref.includes(documents[i].boq_ref)) {
            boq_ref_html = boq_ref_html + `<option value="` + documents[i].boq_ref + `" ` + selectText + `>` + documents[i].boq_ref + `</option>`
            boq_ref.push(documents[i].boq_ref)
        }

        if (!boq_sequence.includes(documents[i].boq_sequence)) {
            boq_sequence_html = boq_sequence_html + `<option value="` + documents[i].boq_sequence + `" ` + selectText + `>` + documents[i].boq_sequence + `</option>`
            boq_sequence.push(documents[i].boq_sequence)
        }

        if (!date.includes(documents[i].date)) {
            date_html = date_html + `<option value="` + documents[i].date + `" ` + selectText + `>` + documents[i].date + `</option>`
            date.push(documents[i].date)
        }

        if (!substation_name.includes(documents[i].substation_name)) {
            substation_name_html = substation_name_html + `<option value="` + documents[i].substation_name + `" ` + selectText + `>` + documents[i].substation_name + `</option>`
            substation_name.push(documents[i].substation_name)
        }

        if (!done_by.includes(documents[i].done_by)) {
            done_by_html = done_by_html + `<option value="` + documents[i].done_by + `" ` + selectText + `>` + documents[i].done_by + `</option>`
            done_by.push(documents[i].done_by)
        }

        if (!work_order_no.includes(documents[i].work_order_no)) {
            work_order_no_html = work_order_no_html + `<option value="` + documents[i].work_order_no + `" ` + selectText + `>` + documents[i].work_order_no + `</option>`
            work_order_no.push(documents[i].work_order_no)
        }

        if (!zone.includes(documents[i].zone)) {
            zone_html = zone_html + `<option value="` + documents[i].zone + `" ` + selectText + `>` + documents[i].zone + `</option>`
            zone.push(documents[i].zone)
        }

    }


    let f_boq_ref = mainDropDownObj.boq_ref
    let f_boq_sequence = mainDropDownObj.boq_sequence
    let f_date = mainDropDownObj.date
    let f_substation_name = mainDropDownObj.substation_name
    let f_done_by = mainDropDownObj.done_by
    let f_invoice_status = mainDropDownObj.invoice_status
    let f_work_order_no = mainDropDownObj.work_order_no
    let f_zone = mainDropDownObj.zone

    /*let boq_ref_filtered = f_boq_ref.filter(
        function (e) {
            return this.indexOf(e) < 0;
        },
        boq_ref_selected
    );*/

    let boq_ref_filtered = f_boq_ref.filter(function (obj) { return boq_ref.indexOf(obj) == -1; });

    for (let i = 0; i < boq_ref_filtered.length; i++) {
        boq_ref_html = boq_ref_html + `<option value="` + boq_ref_filtered[i] + `" >` + boq_ref_filtered[i] + `</option>`
    }

    let boq_sequence_filtered = f_boq_sequence.filter(
        function (e) {
            return this.indexOf(e) < 0;
        },
        boq_sequence
    );
    for (let i = 0; i < boq_sequence_filtered.length; i++) {
        boq_sequence_html = boq_sequence_html + `<option value="` + boq_sequence_filtered[i] + `" >` + boq_sequence_filtered[i] + `</option>`
    }

    let date_filtered = f_date.filter(
        function (e) {
            return this.indexOf(e) < 0;
        },
        date
    );
    for (let i = 0; i < date_filtered.length; i++) {
        date_html = date_html + `<option value="` + date_filtered[i] + `" >` + date_filtered[i] + `</option>`
    }


    let substation_name_filtered = f_substation_name.filter(
        function (e) {
            return this.indexOf(e) < 0;
        },
        substation_name
    );
    for (let i = 0; i < substation_name_filtered.length; i++) {
        substation_name_html = substation_name_html + `<option value="` + substation_name_filtered[i] + `" >` + substation_name_filtered[i] + `</option>`
    }


    let done_by_filtered = f_done_by.filter(
        function (e) {
            return this.indexOf(e) < 0;
        },
        done_by
    );
    for (let i = 0; i < done_by_filtered.length; i++) {
        done_by_html = done_by_html + `<option value="` + done_by_filtered[i] + `" >` + done_by_filtered[i] + `</option>`
    }

    let work_order_no_filtered = f_work_order_no.filter(
        function (e) {
            return this.indexOf(e) < 0;
        },
        work_order_no
    );

    for (let i = 0; i < work_order_no_filtered.length; i++) {
        work_order_no_html = work_order_no_html + `<option value="` + work_order_no_filtered[i] + `" >` + work_order_no_filtered[i] + `</option>`
    }
    let zone_filtered = f_zone.filter(
        function (e) {
            return this.indexOf(e) < 0;
        },
        zone
    );

    for (let i = 0; i < zone_filtered.length; i++) {
        zone_html = zone_html + `<option value="` + zone_filtered[i] + `" >` + zone_filtered[i] + `</option>`
    }


    boq_ref_html = boq_ref_html + `</select>`
    boq_sequence_html = boq_sequence_html + `</select>`
    date_html = date_html + `</select>`
    substation_name_html = substation_name_html + `</select>`
    done_by_html = done_by_html + `</select>`
    work_order_no_html = work_order_no_html + `</select>`
    zone_html = zone_html + `</select>`

    let multiselectOption = {
        buttonWidth: '160px',
        includeSelectAllOption: true,
        nonSelectedText: 'Empty',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        allSelectedText: 'All'
    }

    if (id !== "boq_ref") {
        $("#boq_ref-container").html(boq_ref_html)
        $("#boq_ref").multiselect(multiselectOption)
    }
    if (id !== "boq_sequence") {
        $("#boq_sequence-container").html(boq_sequence_html)
        $("#boq_sequence").multiselect(multiselectOption)
    }
    if (id !== "date") {
        $("#date-container").html(date_html)
        $("#date").multiselect(multiselectOption)
    }
    if (id !== "substation_name") {
        $("#substation_name-container").html(substation_name_html)
        $("#substation_name").multiselect(multiselectOption)
    }
    if (id !== "work_order_no") {
        $("#work_order_no-container").html(work_order_no_html)
        $("#work_order_no").multiselect(multiselectOption)
    }
    if (id !== "done_by") {
        $("#done_by-container").html(done_by_html)
        $("#done_by").multiselect(multiselectOption)
    }
    if (id !== "work_order_no") {
        $("#work_order_no-container").html(work_order_no_html)
        $("#work_order_no").multiselect(multiselectOption)
    }
    if (id !== "zone") {
        $("#zone-container").html(zone_html)
        $("#zone").multiselect(multiselectOption)
    }

})


function uplaodPdf(id) {
    alert(id)
}

function viewPdf(id, name) {
    window.location.href = path.join(__dirname, "./uploads/" + name)
}

$(document).ready(() => {
    loadViDataTable({ filterData: "all" })
})
function loadViDataTable(filter) {
    $('#gis').DataTable({
        "processing": true,
        "serverSide": true,
        "searching": false,
        "order": [0, 'desc'],
        "ajax": {
            "url": "http://localhost:3456/getViData",
            "type": "POST",
            "data": filter
        },
        "columns": [
            { "data": "_id" },
            { "data": "substation" },
            { "data": "scada" },
            { "data": "scada_id" },
            { "data": "zone" },
            { "data": "voltage" },
            { "data": "bays" },
            { "data": "gis_make" },
            { "data": "gis_type" },
            { "data": "all_bays" }
        ],
        "bDestroy": true
    });
    $(".loader-container").css("display", "none")
    $("#center").css("display", "block")
}