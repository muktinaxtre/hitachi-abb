const electron = require("electron");
const { ipcRenderer } = electron
const excelToJson = require('convert-excel-to-json');
let excelData
document.getElementById("mfForm").addEventListener('submit', (e) => {
    e.preventDefault()
    $("#btn-submit-id").attr("disabled", "true")
    $("#processing").css("display", "block")
    let addNew = $("#addNew").prop("checked")
    let file = document.getElementById("mfExcel").files[0]
    let file_name = file.name
    let file_path = file.path
    let result = excelToJson({
        sourceFile: file_path
    });
    excelData = result
    console.log(result)
    if (addNew) {
        $("#deleting-li").css("display", "block")

        ipcRenderer.send("removeAllOcData")
    } else {
        let data = {
            data: result,
            addNew: addNew
        }
        excelData = null
        $("#adding-li").css("display", "block")
        ipcRenderer.send('updateAddOcData', data)
    }


})
ipcRenderer.on('completeAddOcData', (e, arg) => {
    $("#btn-submit-id").text("Completed")
    $("#adding").removeClass("fa-spin fa-spinner")
    $("#adding").addClass("fa-check  text-success")
    $("#adding-li span").text("Added")
    $("#completed-li").css("display", "block")
    $("#redirecting-li").css("display", "block")
    console.log(arg)
    setTimeout(() => {
        ipcRenderer.send("loadNewView", "ocTable.ejs")
    }, 1000)
})
ipcRenderer.on("removedAllOcData", (e, arg) => {
    $("#deleting").removeClass("fa-spin fa-spinner")
    $("#deleting").addClass("fa-check text-success")
    $("#deleting-li span").text(arg + " data removed")


    $("#adding-li").css("display", "block")

    console.log(excelData)
    let data = {
        data: excelData,
        addNew: true
    }
    excelData = null
    ipcRenderer.send('updateAddOcData', data)
})