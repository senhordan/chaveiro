const fs = require('fs')
const cheerio = require('cheerio')

module.exports = (chaves)=>{

  html = fs.readFileSync('./publico/inventario.html', 'utf-8');

  const $ = cheerio.load(html);

  $('#chaves').replaceWith(`<div id="chaves">${chaves}</div>`);

  // console.log($.html())
  fs.writeFileSync('./publico/inventario.html', $.html());

}