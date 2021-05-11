const Datastore = require('nedb')


const allData = new Datastore('public/data/alldata.db')
const viData = new Datastore('public/data/visual_inspection.db')
const ocData = new Datastore('public/data/operational_checks.db')
const pmData = new Datastore('public/data/periodic_maintenance.db')
const cbcmData = new Datastore('public/data/cbcm.db')
const mfData = new Datastore('public/data/mf/major_findings.db')
const mfMonthData = new Datastore('public/data/mf/mf_month.db')
// const smhData = new Datastore("data/history.db")
const smhData = new Datastore("public/data/substationMaintenanceHistory.db")


allData.loadDatabase()
viData.loadDatabase()
ocData.loadDatabase()
pmData.loadDatabase()
cbcmData.loadDatabase()
mfData.loadDatabase()
mfMonthData.loadDatabase()
smhData.loadDatabase()

module.exports = { allData, viData, ocData, pmData, cbcmData, mfData, mfMonthData, smhData }