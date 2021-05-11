const electron = require('electron');
const { ipcRenderer } = electron;

let newSubstation = false
let newScada = false
let newZone = false
let newVoltage = false
let newGistype = false
function checkboxClick(id) {
    if ($("#" + id).prop('checked') == true) {
        $("#" + id + "-container").html(`
                <input type="text" name="`+ id + `-abb" id="` + id + `-abb"
                        placeholder="Enter new `+ id + ` name">
                `)
        if (id == "substation") {
            newSubstation = true
        }
        if (id == "scada") {
            $("#id-container").html(` <label for="id">&nbsp;ID</label>
            <input type="text" name="id-abb" id="id-abb" placeholder="Enter ID">`)
            newScada = true
        }
        if (id == "zone") {
            newZone = true
        }
        if (id == "voltage") {
            newVoltage = true
        }
        if (id == "gis-type") {
            newGistype = true
        }
    } else {
        if (id == "substation") {
            newSubstation = false
        }
        if (id == "scada") {
            newScada = false
            $("#id-container").html('')
        }
        if (id == "zone") {
            newZone = false
        }
        if (id == "voltage") {
            newVoltage = false
        }
        if (id == "gis-type") {
            newGistype = false
        }
        ipcRenderer.send('getData', id)
    }

}

function submitData() {
    let scadaId = ''
    let substation = document.getElementById('substation-abb').value
    let bay = document.getElementById('bay-abb').value
    let scada = $("#scada-abb").val()
    if (newScada) {
        scadaId = $("#id-abb").val()
    }

    let zone = $("#zone-abb").val()
    let voltage = $("#voltage-abb").val()
    let gistype = $("#gis-type-abb").val()
    if (!substation || substation.trim() == '') {
        alert('Please select or add a substation')
    } else {
        let data = {
            substation: substation.trim(),
            scada: scada.trim(),
            scadaId: scadaId.trim(),
            zone: zone.trim(),
            voltage: voltage.trim(),
            gistype: gistype.trim(),
            bay: bay.trim(),
            newSubstation: newSubstation,
            newScada: newScada,
            newZone: newZone,
            newVoltage: newVoltage,
            newGistype: newGistype
        }
        ipcRenderer.send('submitData', data)
    }
}
ipcRenderer.send('getAllData')
ipcRenderer.on('getAllData', (e, response) => {
    console.log(response)
    for (let i = 0; i < response.length; i++) {
        let data = response[i].data
        let id = response[i].id
        if (data.length > 0) {
            let html = `<select name="` + id + `-abb" id="` + id + `-abb" class="selectpicker" data-live-search="true" title="- Select ` + id + ` -" onchange="loadDropDown('` + id + `')">`
            for (let i = 0; i < data.length; i++) {
                html = html + ` <option value="` + data[i]._id + `">` + data[i].name + `</option>`

            }
            html = html + '</select>'
            $("#" + id + "-container").html(html)
        } else {
            $("#" + id).prop('checked', 'checked')
            console.log(id)
            $("#" + id + "-container").html(` <input type="text" name="` + id + `-abb" id="` + id + `-abb" placeholder="Enter new ` + id + ` name"> `)
            newSubstation = true
        }
    }

    $('.selectpicker').selectpicker('refresh');
})

ipcRenderer.on('getDataRes', (e, data) => {
    let args = data.data
    let id = data.id
    console.log(2)
    if (args.length > 0) {
        let html = `<select name="` + id + `-abb" id="` + id + `-abb" class="selectpicker" data-live-search="true" title="- Select ` + id + ` -" onchange="loadDropDown('` + id + `')">`
        for (let i = 0; i < args.length; i++) {
            html = html + ` <option value="` + args[i]._id + `">` + args[i].name + `</option>`

        }
        html = html + '</select>'
        $("#" + id + "-container").html(html)
    } else {
        alert('No data found. Add new Data')
        $("#" + id).prop('checked', 'checked')
        console.log(id)
        $("#" + id + "-container").html(` <input type="text" name="` + id + `-abb" id="` + id + `-abb" placeholder="Enter new ` + id + ` name"> `)
        newSubstation = true
    }
    $('.selectpicker').selectpicker('refresh');
})


function loadDropDown(id) {
    // alert(id)
    console.log(id)
    // let substationID = $("#" + id + "-abb").val()
    // // console.log(substationID)
    // ipcRenderer.send('loadScada', substationID)

}
ipcRenderer.on('loadScada', (e, data) => {
    if (data.length > 0) {
        let html = ` <select name="scada-abb" id="scada-abb" class="selectpicker" title="- Select Substation -">`
        for (let i = 0; i < data.length; i++) {
            html = html + `<option value="` + data._id + `">` + data.name + `</option>`
        }
        html = html + '</select>'
    } else {
        $("#scada").prop('checked', 'checked')
        $("#id").prop('checked', 'checked')
        $("#zone").prop('checked', 'checked')
        $("#gis-type").prop('checked', 'checked')
        $("#voltage").prop('checked', 'checked')
        $("#scada-container").html(` <input type="text" name="scada-abb" id="scada-abb" placeholder="Enter new Scada name"> `)

        $("#zone-container").html(` <input type="text" name="zone-abb" id="zone-abb" placeholder="Enter new zone"> `)
        $("#voltage-container").html(` <input type="text" name="voltage-abb" id="voltage-abb" placeholder="Enter new Voltage"> `)
        $("#gis-type-container").html(` <input type="text" name="gis-type-abb" id="gis-type-abb" placeholder="Enter new GIS Type"> `)

    }
})