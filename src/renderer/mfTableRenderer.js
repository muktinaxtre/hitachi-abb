const { ipcRenderer } = require("electron")


ipcRenderer.send("loadMfMonth")
ipcRenderer.on("loadMfMonth", (e, arg) => {
    if (arg.length > 0) {
        let html = ``
        for (let i = 0; i < arg.length; i++) {
            html = html + `<option value="` + arg[i]._id + `">` + arg[i].month + `</option>`

        }
        let month_id = arg[0]._id
        loadAllmfData(month_id)
        $("#mainMonth").html(html)
    } else {
        $("#mainMonth").html(`<option value=""> No Data</option>`)
    }

})

function loadAllmfData(m_id) {
    console.log(m_id)
    ipcRenderer.send("loadAllmfData", { filter: null, month_id: m_id })
}

function loadAllmfDataSelect() {
    let month_id = $("#mainMonth").val()
    loadAllmfData(month_id)
}
// $(".loader-container").css("display", "block")
// $("#center").css("display", "none")

ipcRenderer.on("loadAllmfData", (e, response) => {
    let data = response.data
    console.log(response)
    let html = ''
    for (let i = 0; i < data.length; i++) {
        let pdf = ""
        if (data[i].pdf_link == "" || !(data[i].pdf_link)) {
            pdf = `<button class='btn btn-secondary' onclick="uplaodPdf(` + data[i]._id + `)"  style="font-size:10px">NA</button>`
        } else {
            //pdf = `<a href= " ../../uploads/` + data[i].pdf_link + `" class='btn btn-secondary' target="blank"  style="font-size:10px" >View</a>`// for development

            pdf = `<a href= "../../../../uploads/` + data[i].pdf_link + `" class='btn btn-secondary' target="blank"  style="font-size:10px" >View</a>` // for prodouction
        }
        let slNo = i + 1
        html = html + `
        <tr>
            <th scope="row">`+ slNo + `</th>
            <td>`+ data[i].boq_no + `</td>
            <td>`+ data[i].date + `</td>
            <td>`+ data[i].zone + `</td>
            <td>`+ data[i].substation + `</td>
            <td>`+ data[i].rating + `</td>
            <td>`+ data[i].location + `</td>
            <td>`+ data[i].visual_inspection_major_findings + `</td>
            <td>`+ data[i].recommended_action + `</td>
            <td>`+ data[i].action_taken + `</td>
            <td>`+ data[i].status + `</td>
        </tr>
        `
    }
    $("#oc-filter-table").html(html)
    // let x = { skip: response.skip + 50, filter: response.filter }
    // setTimeout(() => {
    //     console.log(x)
    //     ipcRenderer.send('loadOcTable_', x)
    // }, 3000)


})