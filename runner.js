// git repo - https://gist.github.com/EmmanuelOga/5f4cc30f73d7b09398349b48382d3514
// The understanding an use of promises-trycatch blocks in JS comes from the github repo above
const SaxonJS = require("saxon-js");
const { parseString } = require('xml2js');

async function validateUBL(filename) {

  const saxonOptions = {
    stylesheetFileName: "UBLsheet.sef.json",
    sourceFileName: filename,
    destination: "serialized",
  };

  try {
    const { principalResult } = await SaxonJS.transform(
      saxonOptions,
      "async"
    );
    return parseOutput(principalResult);

  } catch (e) {
    throw e;
  };

}

async function validatePEPPOL(filename) {
  const saxonOptions2 = {
    stylesheetFileName: "PEPPOLsheet.sef.json",
    sourceFileName: filename,
    destination: "serialized",
  };

  try {
    const { principalResult } = await SaxonJS.transform(saxonOptions2, "async");
    return await parseOutput(principalResult);
  } catch (e) {
    throw e;
  }
}

function parseOutput(principalResult) {
  return new Promise((resolve, reject) => {
    parseString(principalResult, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      const failedAsserts = result['svrl:schematron-output']['svrl:failed-assert'];
      if (failedAsserts) {
        const errorDetails = failedAsserts.map(assert => ({
          location: assert.$.location,
          text: assert['svrl:text'][0]
        }));
        resolve(errorDetails); // fulfill promise with the specified value, no pending
      } else {
        resolve([]);
      }
    });
  });
}

module.exports = {
  validateUBL,
  validatePEPPOL
};