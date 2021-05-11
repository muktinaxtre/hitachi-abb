const electron = require('electron')
const { ipcRenderer } = electron

ipcRenderer.send('loadIndexData')
ipcRenderer.on('loadIndexData', (e, data) => {
    console.log(data)
    let substation = data.substation
    let bayNo = data.bayNo
    let bay = data.bay
    console.log(bay)
    let substationHtml = `<select name="substation" id="substation" class="selectpicker" data-live-search="true" multiple
    onchange="substationChange()">`
    let bayNoHtml = `<select name="bay-no" id="bay-no" class="selectpicker" data-live-search="true" multiple>`
    let bayHtml = `<select name="bay" id="bay" class="selectpicker" data-live-search="true" multiple>`
    for (let i = 0; i < substation.length; i++) {
        substationHtml = substationHtml + `<option value="` + substation[i]._id + `">` + substation[i].name + `</option>`

    }
    substationHtml = substationHtml + "</select>"

    for (let i = 0; i < bayNo.length; i++) {
        bayNoHtml = bayNoHtml + `<option value="` + bayNo[i] + `">` + bayNo[i] + `</option>`

    }
    bayNoHtml = bayNoHtml + "</select>"

    for (let i = 0; i < bay.length; i++) {
        bayHtml = bayHtml + `<option value="` + bay[i]._id + `">` + bay[i].name + `</option>`

    }
    bayNo = bayNo + "</select>"
    document.getElementById('substation-container').innerHTML = substationHtml
    document.getElementById('bay-no-container').innerHTML = bayNoHtml
    document.getElementById('bay-container').innerHTML = bayHtml
    $('.selectpicker').selectpicker('refresh');
})

function substationChange() {
    let substationId = $("#substation").val()
    ipcRenderer.send('substationChange', substationId)

}