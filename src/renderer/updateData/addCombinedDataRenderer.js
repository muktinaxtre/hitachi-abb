const electron = require("electron");
const { ipcRenderer } = electron
const moment = require("moment")
const excelToJson = require('convert-excel-to-json');
const { Callbacks } = require("jquery");
// let date = "16-Apr-18"
// let datenew = moment(date).format("DD-MMM-YYYY");
// console.log(datenew)
let excelData
document.getElementById("addform").addEventListener('submit', (e) => {
    e.preventDefault()
    $("#btn-submit-id").attr("disabled", "true")
    $("#processing").css("display", "block")
    let addNew = $("#addNew").prop("checked")
    let file = document.getElementById("excel").files[0]
    let file_name = file.name
    let file_path = file.path
    let result = excelToJson({
        sourceFile: file_path
    });
    excelData = result
    console.log(result)
    if (addNew) {
        $("#deleting-li").css("display", "block")

        ipcRenderer.send("removeAllViData")
    } else {
        let data = {
            data: result,
            addNew: addNew
        }
        excelData = null
        $("#adding-li").css("display", "block")
        console.log(data)
        ipcRenderer.send('updateAddViData', data)
    }


})
ipcRenderer.on('completeAddViData', (e, arg) => {
    $("#btn-submit-id").text("Completed")
    $("#adding").removeClass("fa-spin fa-spinner")
    $("#adding").addClass("fa-check  text-success")
    $("#adding-li span").text("Added")
    $("#completed-li").css("display", "block")
    $("#redirecting-li").css("display", "block")
    console.log(arg)
    setTimeout(() => {
        ipcRenderer.send("loadNewView", "viTable2.ejs")
    }, 1000)
})
ipcRenderer.on("removedAllViData", (e, arg) => {
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
    ipcRenderer.send('updateAddViData', data)
})