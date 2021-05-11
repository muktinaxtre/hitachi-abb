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

    if (addNew) {
        $("#deleting-li").css("display", "block")

        ipcRenderer.send("removeAllCbcmData")
    } else {
        let data = {
            data: result,
            addNew: addNew
        }
        excelData = null
        $("#adding-li").css("display", "block")
        ipcRenderer.send('updateAddCbcmData', data)
    }


})
ipcRenderer.on('completeAddCbcmData', (e, arg) => {
    $("#btn-submit-id").text("Completed")
    $("#adding").removeClass("fa-spin fa-spinner")
    $("#adding").addClass("fa-check  text-success")
    $("#adding-li span").text("Added")
    $("#completed-li").css("display", "block")
    $("#redirecting-li").css("display", "block")

    setTimeout(() => {
        ipcRenderer.send("loadNewView", "cbcmTable.ejs")
    }, 1000)
})
ipcRenderer.on("removedAllCbcmData", (e, arg) => {
    $("#deleting").removeClass("fa-spin fa-spinner")
    $("#deleting").addClass("fa-check text-success")
    $("#deleting-li span").text(arg + " data removed")
    $("#adding-li").css("display", "block")

    let data = {
        data: excelData,
        addNew: true
    }
    excelData = null
    ipcRenderer.send('updateAddCbcmData', data)
})