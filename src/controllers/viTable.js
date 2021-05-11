const { ipcMain } = require('electron');
const { viData } = require('../db')
ipcMain.on('loadViTable', (e, arg) => {

    let filter = {}
    if (arg === "all") {
        filter = {}
    } else {
        let obj = arg.selected
        let key = Object.keys(obj)
        for (let i = 0; i < key.length; i++) {
            if (key[i] == "bqq_ref_selected") {
                let x = { bqq_ref: { $in: obj[key[i]] } }
                Object.assign(filter, x)
            }

            if (key[i] == "bqq_sequence_selected") {
                let x = { bqq_sequence: { $in: obj[key[i]] } }
                Object.assign(filter, x)
            }

            if (key[i] == "date_selected") {
                let x = { date: { $in: obj[key[i]] } }
                Object.assign(filter, x)
            }

            if (key[i] == "substation_name_selected") {
                let x = { substation_name: { $in: obj[key[i]] } }
                Object.assign(filter, x)
            }


            if (key[i] == "done_by_selected") {
                let x = { done_by: { $in: obj[key[i]] } }
                Object.assign(filter, x)
            }

            if (key[i] == "work_order_no_selected") {
                let x = { work_order_no: { $in: obj[key[i]] } }
                Object.assign(filter, x)
            }

            if (key[i] == "zone_selected") {
                let x = { zone: { $in: obj[key[i]] } }
                Object.assign(filter, x)
            }

        }
    }
    viData.find(filter).exec((err, documents) => {
        let data = {
            documents: documents,
            // selected: arg.selected
        }
        e.sender.send('loadViTable', data)
    })
})

ipcMain.on('loadViDropDown', (e, args) => {

    let filter = {}
    let bqq_ref_selected = []
    let bqq_sequence_selected = []
    let date_selected = []
    let substation_name_selected = []
    let done_by_selected = []
    let invoice_status_selected = []
    let work_order_no_selected = []
    let zone_selected = []
    if (args === "default") {
        // console.log('default ')



        let bqq_ref = []
        let bqq_sequence = []
        let date = []
        let substation_name = []
        let done_by = []
        let invoice_status = []
        let work_order_no = []
        let season_cycle = []
        let work_order_created_date = []
        let zone = []
        let _id = []

        let bqq_ref_html = `<select name="bqq_ref" id="bqq_ref" multiple onchange="viFilterClick('bqq_ref')">`
        let bqq_sequence_html = `<select name="bqq_sequence" id="bqq_sequence" multiple onchange="viFilterClick('bqq_sequence')">`
        let date_html = `<select name="date" id="date" multiple onchange="viFilterClick('date')">`
        let substation_name_html = `<select name="substation_name" id="substation_name" multiple onchange="viFilterClick('substation_name')">`
        let done_by_html = `<select name="done_by" id="done_by" multiple onchange="viFilterClick('done_by')">`
        let invoice_status_html = `<select name="invoice_status" id="invoice_status" multiple onchange="viFilterClick('invoice_status')">`
        let work_order_no_html = `<select name="work_order_no" id="work_order_no" multiple onchange="viFilterClick('work_order_no')">`
        let season_cycle_html = `<select name="season_cycle" id="season_cycle" multiple onchange="viFilterClick('season_cycle')">`
        let work_order_created_date_html = `<select name="work_order_created_date" id="work_order_created_date" multiple onchange="viFilterClick('work_order_created_date')">`
        let zone_html = `<select name="zone" id="zone" multiple onchange="viFilterClick('zone')">`
        let selectText = "selected"
        viData.find({}).exec((err, documents) => {
            for (let i = 0; i < documents.length; i++) {
                if (!bqq_ref.includes(documents[i].bqq_ref)) {
                    bqq_ref_html = bqq_ref_html + `<option value="` + documents[i].bqq_ref + `" ` + selectText + `>` + documents[i].bqq_ref + `</option>`
                    bqq_ref.push(documents[i].bqq_ref)
                }

                if (!bqq_sequence.includes(documents[i].bqq_sequence)) {
                    bqq_sequence_html = bqq_sequence_html + `<option value="` + documents[i].bqq_sequence + `" ` + selectText + `>` + documents[i].bqq_sequence + `</option>`
                    bqq_sequence.push(documents[i].bqq_sequence)
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

                if (!_id.includes(documents[i]._id)) {
                    _id.push(documents[i]._id)
                }

            }
            bqq_ref_html = bqq_ref_html + `</select>`
            bqq_sequence_html = bqq_sequence_html + `</select>`
            date_html = date_html + `</select>`
            substation_name_html = substation_name_html + `</select>`
            done_by_html = done_by_html + `</select>`
            invoice_status_html = invoice_status_html + `</select>`
            work_order_no_html = work_order_no_html + `</select>`
            zone_html = zone_html + `</select>`


            let dropDownSelectedData = {
                bqq_ref_selected: bqq_ref,
                bqq_sequence_selected: bqq_sequence,
                date_selected: date,
                substation_name_selected: substation_name,
                done_by_selected: done_by,
                invoice_status_selected: invoice_status,
                work_order_no_selected: work_order_no,
                zone_selected: zone

            }

            let dropDownData = {
                bqq_ref: bqq_ref_html,
                bqq_sequence: bqq_sequence_html,
                date: date_html,
                substation_name: substation_name_html,
                done_by: done_by_html,
                invoice_status: invoice_status_html,
                work_order_no: work_order_no_html,
                zone: zone_html

            }
            let data = {
                dropdownSelected: dropDownSelectedData,
                dropdownData: dropDownData,
                id: 'default'
            }
            e.sender.send('loadViDropDown', data)
            e.sender.send('allDropDown', dropDownSelectedData)
        })


    } else {
        let selected = args.selected
        let all = args.all
        filter = {}
        bqq_ref_selected = selected.bqq_ref_selected
        bqq_sequence_selected = selected.bqq_sequence_selected
        date_selected = selected.date_selected
        substation_name_selected = selected.substation_name_selected
        invoice_status_selected = selected.invoice_status_selected
        done_by_selected = selected.done_by_selected
        work_order_no_selected = selected.work_order_no_selected
        zone_selected = selected.zone_selected


        let obj = args.selected
        let key = Object.keys(obj)
        for (let i = 0; i < key.length; i++) {
            if (key[i] == "bqq_ref_selected") {
                let x = { bqq_ref: { $in: obj[key[i]] } }
                Object.assign(filter, x)
            }

            if (key[i] == "bqq_sequence_selected") {
                let x = { bqq_sequence: { $in: obj[key[i]] } }
                Object.assign(filter, x)
            }

            if (key[i] == "date_selected") {
                let x = { date: { $in: obj[key[i]] } }
                Object.assign(filter, x)
            }

            if (key[i] == "substation_name_selected") {
                let x = { substation_name: { $in: obj[key[i]] } }
                Object.assign(filter, x)
            }

            if (key[i] == "done_by_selected") {
                let x = { done_by: { $in: obj[key[i]] } }
                Object.assign(filter, x)
            }

            if (key[i] == "work_order_no_selected") {
                let x = { work_order_no: { $in: obj[key[i]] } }
                Object.assign(filter, x)
            }

            if (key[i] == "zone_selected") {
                let x = { zone: { $in: obj[key[i]] } }
                Object.assign(filter, x)
            }

        }

        let bqq_ref = []
        let bqq_sequence = []
        let date = []
        let substation_name = []
        let done_by = []
        let invoice_status = []
        let work_order_no = []
        let season_cycle = []
        let work_order_created_date = []
        let zone = []
        let _id = []

        let bqq_ref_html = `<select name="bqq_ref" id="bqq_ref" multiple onchange="viFilterClick('bqq_ref')">`
        let bqq_sequence_html = `<select name="bqq_sequence" id="bqq_sequence" multiple onchange="viFilterClick('bqq_sequence')">`
        let date_html = `<select name="date" id="date" multiple onchange="viFilterClick('date')">`
        let substation_name_html = `<select name="substation_name" id="substation_name" multiple onchange="viFilterClick('substation_name')">`
        let done_by_html = `<select name="done_by" id="done_by" multiple onchange="viFilterClick('done_by')">`
        let invoice_status_html = `<select name="invoice_status" id="invoice_status" multiple onchange="viFilterClick('invoice_status')">`
        let work_order_no_html = `<select name="work_order_no" id="work_order_no" multiple onchange="viFilterClick('work_order_no')">`
        let season_cycle_html = `<select name="season_cycle" id="season_cycle" multiple onchange="viFilterClick('season_cycle')">`
        let work_order_created_date_html = `<select name="work_order_created_date" id="work_order_created_date" multiple onchange="viFilterClick('work_order_created_date')">`
        let zone_html = `<select name="zone" id="zone" multiple onchange="viFilterClick('zone')">`

        viData.find(filter).exec((err, documents) => {
            for (let i = 0; i < documents.length; i++) {
                if (!bqq_ref.includes(documents[i].bqq_ref)) {
                    let selectText = ""
                    if (bqq_ref_selected.includes(documents[i].bqq_ref)) {
                        selectText = "selected"
                    }
                    bqq_ref_html = bqq_ref_html + `<option value="` + documents[i].bqq_ref + `" ` + selectText + `>` + documents[i].bqq_ref + `</option>`
                    bqq_ref.push(documents[i].bqq_ref)
                }

                if (!bqq_sequence.includes(documents[i].bqq_sequence)) {
                    let selectText = ""
                    if (bqq_sequence_selected.includes(documents[i].bqq_sequence)) {
                        selectText = "selected"
                    }
                    bqq_sequence_html = bqq_sequence_html + `<option value="` + documents[i].bqq_sequence + `" ` + selectText + `>` + documents[i].bqq_sequence + `</option>`
                    bqq_sequence.push(documents[i].bqq_sequence)
                }

                if (!date.includes(documents[i].date)) {
                    let selectText = ""
                    if (date_selected.includes(documents[i].date)) {
                        selectText = "selected"
                    }
                    date_html = date_html + `<option value="` + documents[i].date + `" ` + selectText + `>` + documents[i].date + `</option>`
                    date.push(documents[i].date)
                }

                if (!substation_name.includes(documents[i].substation_name)) {
                    let selectText = ""
                    if (substation_name_selected.includes(documents[i].substation_name)) {
                        selectText = "selected"
                    }
                    substation_name_html = substation_name_html + `<option value="` + documents[i].substation_name + `" ` + selectText + `>` + documents[i].substation_name + `</option>`
                    substation_name.push(documents[i].substation_name)
                }

                if (!done_by.includes(documents[i].done_by)) {
                    let selectText = ""
                    if (done_by_selected.includes(documents[i].done_by)) {
                        selectText = "selected"
                    }
                    done_by_html = done_by_html + `<option value="` + documents[i].done_by + `" ` + selectText + `>` + documents[i].done_by + `</option>`
                    done_by.push(documents[i].done_by)
                }


                if (!work_order_no.includes(documents[i].work_order_no)) {
                    let selectText = ""
                    if (work_order_no_selected.includes(documents[i].work_order_no)) {
                        selectText = "selected"
                    }
                    work_order_no_html = work_order_no_html + `<option value="` + documents[i].work_order_no + `" ` + selectText + `>` + documents[i].work_order_no + `</option>`
                    work_order_no.push(documents[i].work_order_no)
                }

                if (!zone.includes(documents[i].zone)) {
                    let selectText = ""
                    if (zone_selected.includes(documents[i].zone)) {
                        selectText = "selected"
                    }
                    zone_html = zone_html + `<option value="` + documents[i].zone + `" ` + selectText + `>` + documents[i].zone + `</option>`
                    zone.push(documents[i].zone)
                }

            }

            let f_bqq_ref = all.bqq_ref_selected
            let f_bqq_sequence = all.bqq_sequence_selected
            let f_date = all.date_selected
            let f_substation_name = all.substation_name_selected
            let f_done_by = all.done_by_selected
            let f_invoice_status = all.invoice_status_selected
            let f_work_order_no = all.work_order_no_selected
            let f_zone = all.zone_selected

            /*let bqq_ref_filtered = f_bqq_ref.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                bqq_ref_selected
            );*/

            let bqq_ref_filtered = f_bqq_ref.filter(function (obj) { return bqq_ref_selected.indexOf(obj) == -1; });

            for (let i = 0; i < bqq_ref_filtered.length; i++) {
                bqq_ref_html = bqq_ref_html + `<option value="` + bqq_ref_filtered[i] + `" >` + bqq_ref_filtered[i] + `</option>`
            }

            let bqq_sequence_filtered = f_bqq_sequence.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                bqq_sequence_selected
            );
            for (let i = 0; i < bqq_sequence_filtered.length; i++) {

                bqq_sequence_html = bqq_sequence_html + `<option value="` + bqq_sequence_filtered[i] + `" >` + bqq_sequence_filtered[i] + `</option>`
            }

            let date_filtered = f_date.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                date_selected
            );
            for (let i = 0; i < date_filtered.length; i++) {
                date_html = date_html + `<option value="` + date_filtered[i] + `" >` + date_filtered[i] + `</option>`
            }


            let substation_name_filtered = f_substation_name.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                substation_name_selected
            );
            for (let i = 0; i < substation_name_filtered.length; i++) {
                substation_name_html = substation_name_html + `<option value="` + substation_name_filtered[i] + `" >` + substation_name_filtered[i] + `</option>`
            }


            let done_by_filtered = f_done_by.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                done_by_selected
            );
            for (let i = 0; i < done_by_filtered.length; i++) {
                done_by_html = done_by_html + `<option value="` + done_by_filtered[i] + `" >` + done_by_filtered[i] + `</option>`
            }


            let invoice_status_filtered = f_invoice_status.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                invoice_status_selected
            );

            for (let i = 0; i < invoice_status_filtered.length; i++) {
                invoice_status_html = invoice_status_html + `<option value="` + invoice_status_filtered[i] + `" >` + invoice_status_filtered[i] + `</option>`
            }


            let work_order_no_filtered = f_work_order_no.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                work_order_no_selected
            );

            for (let i = 0; i < work_order_no_filtered.length; i++) {
                work_order_no_html = work_order_no_html + `<option value="` + work_order_no_filtered[i] + `" >` + work_order_no_filtered[i] + `</option>`
            }
            let zone_filtered = f_zone.filter(
                function (e) {
                    return this.indexOf(e) < 0;
                },
                zone_selected
            );

            for (let i = 0; i < zone_filtered.length; i++) {
                zone_html = zone_html + `<option value="` + zone_filtered[i] + `" >` + zone_filtered[i] + `</option>`
            }

            bqq_ref_html = bqq_ref_html + `</select>`
            bqq_sequence_html = bqq_sequence_html + `</select>`
            date_html = date_html + `</select>`
            substation_name_html = substation_name_html + `</select>`
            done_by_html = done_by_html + `</select>`
            invoice_status_html = invoice_status_html + `</select>`
            work_order_no_html = work_order_no_html + `</select>`
            zone_html = zone_html + `</select>`



            let dropDownSelectedData = args.selected

            let dropDownData = {
                bqq_ref: bqq_ref_html,
                bqq_sequence: bqq_sequence_html,
                date: date_html,
                substation_name: substation_name_html,
                done_by: done_by_html,
                invoice_status: invoice_status_html,
                work_order_no: work_order_no_html,
                zone: zone_html

            }
            let data = {
                dropdownSelected: dropDownSelectedData,
                dropdownData: dropDownData,
                id: args.id
            }
            e.sender.send('loadViDropDown', data)
        })


    }

})