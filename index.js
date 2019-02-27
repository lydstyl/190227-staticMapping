// <legacy URL> [i] p,[<protocol>],[<host>],<pipeline>[,<locale>][,<parameter name>,<parameter value>]*
//     Search-ShowContent          /produits/pour-lui p,https,,Search-ShowContent,,fdid,Conseils-homme
//     Search-Show                 /pour-elle/coiffure/seche-cheveux-pour-elle/  p,https,,Search-Show,,cgid,seche-cheveux
//     Product-Show                /miroir-lumineux-rond-double-face  p,https,,Product-Show,,pid,8438E
//     CustomerService-ContactUs   /assistance/  p,https,,CustomerService-ContactUs
//     Home-Show                   /bandes-de-cire-froide-pour-jambes-corps-peaux-normales  p,https,,Home-Show
//     Stores-Find                 /points-de-vente/ p,https,,Stores-Find

// read csv
const fs = require('fs')
const csv = require('csvtojson')
const csvFilePath='./csv2.csv'
// Async / await usage
// const jsonArray=await csv().fromFile(csvFilePath);
const types = {
    'CustomerService-ContactUs': 'p,https,,CustomerService-ContactUs',
    'Home-Show': 'p,https,,Home-Show',
    'Product-Show': 'p,https,,Product-Show,,pid,!!ID!!',
    'Search-Show': 'p,https,,Search-Show,,cgid,!!ID!!',
    'Search-ShowContent': 'p,https,,Search-ShowContent,,fdid,!!ID!!',
    'Stores-Find': 'p,https,,Stores-Find'
}

const leftTestUrl = 'https://staging-na-conair.demandware.net/s/es-babyliss' // + /produits/pour-lui
let staticMappings = ''
let testUrls = ''
csv()
.fromFile(csvFilePath)
.then(( obj )=>{
    Object.keys(obj).forEach( key => {
        const line = obj[key]
        const left = line.OLDURL
        let right = types[line.TYPE]
        if ( right.includes( '!!ID!!' ) ) {
            right = right.replace('!!ID!!', line.ID)
        }
        staticMappings += `${left} ${right}\n`
        testUrls += `<div><a target="_blank" href="${leftTestUrl}${left}">${left} ${right}</a></div>\n`
    })
    fs.writeFileSync('./staticMappings.txt', staticMappings, 'utf8')
    fs.writeFileSync('./testUrls.html', testUrls, 'utf8')
})