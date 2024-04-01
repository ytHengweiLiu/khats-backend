// This hasnt been used but this can do the  UBL2.1 schema validation but
// the npm used requires a JAVA run env
var validator = require('xsd-schema-validator');
const fs = require("fs");

var xmlStr = fs.createReadStream('AU Invoice.xml');


async function validate() {
    try {
        const result = await validator.validateXML(xmlStr, 'UBL-Invoice-2.1.xsd');
        console.log(result);
        // result.valid; // true
    } catch (err) {
        console.error('validation error', err);
    }
}

validate();