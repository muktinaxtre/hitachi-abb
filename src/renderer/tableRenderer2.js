const electron = require('electron');
const { ipcRenderer } = electron;
$(".loader-container").css("display", "block")
$("#center").css("display", "none")
let dropDownData;
let menuObj = {}

ipcRenderer.send("loadDataGIS")
ipcRenderer.on("loadDataGIS", (e, arg) => {
    dropDownData = arg.dropDownData
    loadDropDown(dropDownData)

})

let selectedId = []
ipcRenderer.on('changedDropDown', (e, arg) => {

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
        substationArr: arg.substation,
        scadaArr: arg.scada,
        scada_id: arg.scada_id,
        zone: arg.zone,
        voltage: arg.voltage,
        bays: arg.bays,
        gis_make: arg.gismake,
        gis_type: arg.gistype,
        id: arg.id,
        obj: arg.dataObj
    }

    loadGisDataTable({ filterData: dropdownArr })
    // console.log(arg)
    let allId = ["substation", "scada", "scada-id", "zone", "voltage", "bays", "gismake", "gistype"]

    for (let i = 0; i < allId.length; i++) {
        let html = `<select name="` + allId[i] + `" id="` + allId[i] + `" multiple onchange="clickFun('` + allId[i] + `')">`
        let key = allId[i]
        // console.log(key)
        let data = []
        let f_data = []
        let filteredData
        if (key == "substation") {
            data = arg.substation
            f_data = menuObj.substation
            filteredData = f_data.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                data
            );
        }
        if (key == "scada") {
            data = arg.scada
            f_data = menuObj.scada
            filteredData = f_data.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                data
            );
        }
        if (key == "scada-id") {
            data = arg.scada_id
            f_data = menuObj.scada_id
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
        if (key == "voltage") {
            data = arg.voltage
            f_data = menuObj.voltage
            filteredData = f_data.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                data
            );
        }
        if (key == "bays") {
            data = arg.bays
            f_data = menuObj.bays
            filteredData = f_data.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                data
            );
        }
        if (key == "gismake") {
            data = arg.gismake
            f_data = menuObj.gismake
            filteredData = f_data.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                data
            );
        }
        if (key == "gistype") {
            data = arg.gistype
            f_data = menuObj.gistype
            filteredData = f_data.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                data
            );
        }
        // console.log(f_data)
        for (let j = 0; j < data.length; j++) {

            html = html + `<option value="` + data[j] + `" selected>` + data[j] + `</option>`
            // $('#' + allId[i] + ' option[value="' + data[j] + '"]').prop('selected', true)

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


function loadDropDown(data) {
    let multiselectOption = {
        buttonWidth: '160px',
        includeSelectAllOption: true,
        nonSelectedText: 'Empty',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        allSelectedText: 'All'
    }
    let substationOptHtml = `<select name="substation" id="substation" multiple onchange="clickFun('substation')">`
    let scadaHtml = `<select name="scada" id="scada" multiple  onchange="clickFun('scada')">`
    let scadaIDHtml = `<select name="scada-id" id="scada-id" multiple  onchange="clickFun('scada-id')">`
    let zoneHtml = `<select name="zone" id="zone" multiple  onchange="clickFun('zone')">`
    let voltageHtml = `<select name="voltage" id="voltage" multiple  onchange="clickFun('voltage')">`
    let baysHtml = `<select name="bays" id="bays" multiple  onchange="clickFun('bays')">`
    let gisMakeHtml = `<select name="gismake" id="gismake" multiple  onchange="clickFun('gismake')">`
    let gisTypeHtml = `<select name="gistype" id="gistype" multiple  onchange="clickFun('gistype')">`

    let substationArr = data.substation
    let scadaArr = data.scada
    let scada_id = data.scada_id
    let zone = data.zone
    let voltage = data.voltage
    let bays = data.bays
    let gis_make = data.gis_make
    let gis_type = data.gis_type


    for (let i = 0; i < substationArr.length; i++) {
        substationOptHtml = substationOptHtml + `<option value="` + substationArr[i] + `">` + substationArr[i] + `</option>`

    }
    for (let i = 0; i < scadaArr.length; i++) {
        scadaHtml = scadaHtml + `<option value="` + scadaArr[i] + `">` + scadaArr[i] + `</option>`

    }

    for (let i = 0; i < scada_id.length; i++) {
        scadaIDHtml = scadaIDHtml + `<option value="` + scada_id[i] + `">` + scada_id[i] + `</option>`

    }
    for (let i = 0; i < zone.length; i++) {
        zoneHtml = zoneHtml + `<option value="` + zone[i] + `">` + zone[i] + `</option>`

    }
    for (let i = 0; i < voltage.length; i++) {
        voltageHtml = voltageHtml + `<option value="` + voltage[i] + `">` + voltage[i] + `</option>`

    }

    for (let i = 0; i < bays.length; i++) {
        baysHtml = baysHtml + `<option value="` + bays[i] + `">` + bays[i] + `</option>`

    }
    for (let i = 0; i < gis_make.length; i++) {
        gisMakeHtml = gisMakeHtml + `<option value="` + gis_make[i] + `">` + gis_make[i] + `</option>`

    }
    for (let i = 0; i < gis_type.length; i++) {
        gisTypeHtml = gisTypeHtml + `<option value="` + gis_type[i] + `">` + gis_type[i] + `</option>`
    }

    substationOptHtml = substationOptHtml + `</select>`
    scadaHtml = scadaHtml + `</select>`
    scadaIDHtml = scadaIDHtml + `</select>`
    zoneHtml = zoneHtml + `</select>`
    voltageHtml = voltageHtml + `</select>`
    baysHtml = baysHtml + `</select>`
    gisMakeHtml = gisMakeHtml + `</select>`
    gisTypeHtml = gisTypeHtml + `</select>`

    $("#substation-container").html(substationOptHtml)
    $("#scada-container").html(scadaHtml)
    $("#scada-id-container").html(scadaIDHtml)
    $("#zone-container").html(zoneHtml)
    $("#voltage-container").html(voltageHtml)
    $("#bays-container").html(baysHtml)
    $("#gismake-container").html(gisMakeHtml)
    $("#gistype-container").html(gisTypeHtml)

    $("#substation").multiselect(multiselectOption).multiselect('selectAll', false).multiselect('updateButtonText');
    $("#scada").multiselect(multiselectOption).multiselect('selectAll', false).multiselect('updateButtonText');
    $("#scada-id").multiselect(multiselectOption).multiselect('selectAll', false).multiselect('updateButtonText');
    $("#zone").multiselect(multiselectOption).multiselect('selectAll', false).multiselect('updateButtonText');
    $("#voltage").multiselect(multiselectOption).multiselect('selectAll', false).multiselect('updateButtonText');
    $("#bays").multiselect(multiselectOption).multiselect('selectAll', false).multiselect('updateButtonText');
    $("#gismake").multiselect(multiselectOption).multiselect('selectAll', false).multiselect('updateButtonText');
    $("#gistype").multiselect(multiselectOption).multiselect('selectAll', false).multiselect('updateButtonText');


    menuObj = {
        substation: substationArr,
        scada: scadaArr,
        scada_id: scada_id,
        zone: zone,
        voltage: voltage,
        bays: bays,
        gismake: gis_make,
        gistype: gis_type
    }

    $(".loader-container").css("display", "none")
    $("#center").css("display", "block")
}
let dataObj = {}
function clickFun(id) {

    let idArr = $("#" + id).val()
    if (idArr.length == 0) {
        idArr = [""]
    }
    if (id == "substation") {
        Object.assign(dataObj, { substation: idArr })
    }
    if (id == "scada") {
        Object.assign(dataObj, { scada: idArr })
    }
    if (id == "scada-id") {
        Object.assign(dataObj, { scada_id: idArr })
    }
    if (id == "zone") {
        Object.assign(dataObj, { zone: idArr })
    }
    if (id == "bays") {
        Object.assign(dataObj, { bays: idArr })
    }
    if (id == "voltage") {
        Object.assign(dataObj, { voltage: idArr })
    }
    if (id == "gismake") {
        Object.assign(dataObj, { gismake: idArr })
    }
    if (id == "gistype") {
        Object.assign(dataObj, { gistype: idArr })
    }
    // console.log(dataObj)
    let arr = {
        id: id,
        arr: idArr,
        dataObj: dataObj
    }

    ipcRenderer.send('changeDropDown', arr)

}
$(document).ready(() => {
    loadGisDataTable({ filterData: "all" })
})
function loadGisDataTable(filter) {
    $('#gis').DataTable({
        "processing": true,
        "serverSide": true,
        "searching": false,
        "order": [1, 'desc'],
        "ajax": {
            "url": "http://localhost:3456/getGisData",
            "type": "POST",
            "data": filter
        },
        "columns": [
            { "data": "sl_no" },
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