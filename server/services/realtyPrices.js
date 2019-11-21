const request = require('request');
const cheerio = require('cheerio');
const mimelib = require("mimelib");
const iconv = require('iconv-lite');
const puppeteer = require('puppeteer');
const util = require('util');

async function searchRealtyPrices(params) {
  const filtro = params.query.trim();
  const query = encodeURIComponent(filtro);
  const homeUrl = 'https://go.olx.com.br/grande-goiania-e-anapolis/imoveis/aluguel/apartamentos?pe=1300&sf=1';
  const realtyUrls = [];
  console.log('searchRealtyPrices about to look for =>> ', homeUrl);

  const numOfPages = await getNumOfPages(homeUrl);
  console.log('searchRealtyPrices numOfPages outside =>> ', numOfPages)

  const realtysUrls = await traversePages(numOfPages);
  console.log('searchRealtyPrices realtysUrls.length return =>> ', realtysUrls.length);

  const uniqueUrls = [...new Set(realtysUrls)]
  console.log('uniqueUrls.length =>> ', uniqueUrls.length);

  const data = await getContent(uniqueUrls);
  console.log('data =>> ', data);
  return uniqueUrls;
}

const getContent = async (uniqueUrls) => {
  const realtysDetails = []
  for (let i = 0; i < uniqueUrls.length ; i++) {
    const details = await getRealtyDetails(uniqueUrls[i]);
    if (details) realtysDetails.push(details);
  }
  return realtysDetails;
}

const getRealtyDetails = async (url) => {
  return new Promise ((resolve, reject) => {
    const realtyDetails = {}
    request({
      url: url,
      encoding: null
    }, (err, res, body) => {
      if (!err) {
        const $ = cheerio.load(body);
        $('div[data-testid="ad-properties"] div div').each(function (i, elem) {
          let key = $('dt', elem).text();
          let value = $('a', elem).text();
          // regex to remove accented characters and replace it by unaccented
          key = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          // regex to convert the key string to camelCase
          if (key.match(/\s+/g)) {
            key = key.replace(/(?:[A-Z]|\b\w)/g, (word, index) => {
              return index === 0 ? word.toLowerCase() : word.toUpperCase();
            }).replace(/\s+/g, '');
          } else {
            key = key.toLowerCase();
          }

          realtyDetails[key] = value ? value : null;
        });
      }
      // console.log('realtyDetails => ', realtyDetails);
      resolve(realtyDetails)
    })
  })
}

const traversePages = async (numOfPages) => {
  const urlFragment1 = 'https://go.olx.com.br/grande-goiania-e-anapolis/imoveis/aluguel/apartamentos?o=';
  const urlFragment2 = '\&pe=1300&sf=1';
  const realtys = [];
  for (let i = 1; i <= numOfPages; i++) {
    const url = urlFragment1 + i + urlFragment2;
    console.log('traversePages url =>> ', url)
    const pageContents = await seePage(url);
    if (pageContents) realtys.push(pageContents)
  }
  const allRealtys = realtys.flat();
  return allRealtys
}

const seePage = async (url) => {
  return new Promise((resolve, reject) => {
    const realtys = []
    request({
      url: url,
      encoding: null
    }, (err, res, body) => {
      if (!err) {
        const html = iconv.decode(body, 'iso-8859-1');
        const $ = cheerio.load(html);
        $('li.item a.OLXad-list-link').each(function (i, elem) {
          const url = $(elem).attr('href');
          if (typeof url === "string") {
            realtys.push(url);
          }
        });
      }
      resolve(realtys)
    })
  })
}

const getNumOfPages = async (homeUrl) => {
  return new Promise((resolve, reject) => {
    let numOfPages;
    request({
      url: homeUrl,
      encoding: null
    }, (err, res, body) => {
      if (!err) {
        const html = iconv.decode(body, 'iso-8859-1');
        const $ = cheerio.load(html);

        $('li.item.last a.link').each(function (i, elem) {
          const lastPage = $(this).attr('title');
          if (lastPage === 'Última página') {
            const sliceIn1 = 'o=';
            const sliceIn2 = '\&pe';
            const lastPageUrl = $(this).attr('href');
            numOfPages = Number(lastPageUrl
              .slice((lastPageUrl.indexOf(sliceIn1) + sliceIn1.length), lastPageUrl.indexOf(sliceIn2))
            );
          }
        });
      }
      resolve(numOfPages)
    })
  })
}

module.exports = {
  searchRealtyPrices
}