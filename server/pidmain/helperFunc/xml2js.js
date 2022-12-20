var xml2js = require('xml2js')
const _parseString = require('xml2js').parseString;

const parser = new xml2js.Parser({attrkey: "attrkey"});
async function newParseString(data){

  return new Promise( ( resolve, reject ) => {

    parser.parseString(data, function (err, result) {
      if(err){
        reject(err)
      }else{
        resolve(result)
      }
    })

  })
}

async function parseString(data){
  return new Promise( ( resolve, reject ) => {

    _parseString(data, function (err, result) {
      if(err){
        reject(err)
      }else{
        resolve(result)
      }
    })

  })
}

module.exports = {
  newParseString: newParseString,
  parseString: parseString
}