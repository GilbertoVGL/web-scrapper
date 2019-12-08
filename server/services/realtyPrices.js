const request = require('request');
const Realty = require('../db/models/realty')
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
// const mimelib = require("mimelib");
// const puppeteer = require('puppeteer');
// const util = require('util');

async function searchRealtyPrices(params) {
  const filtro = params.query ? params.query.trim() : null;
  // const query = encodeURIComponent(filtro);
  const homeUrl = 'https://go.olx.com.br/grande-goiania-e-anapolis/imoveis/aluguel/apartamentos?pe=1300&sf=1';
  console.log('searchRealtyPrices about to look for =>> ', homeUrl);

  const numOfPages = await getNumOfPages(homeUrl);
  console.log('searchRealtyPrices numOfPages outside =>> ', numOfPages)

  const realtysUrls = await traversePages(numOfPages);
  console.log('searchRealtyPrices realtysUrls.length return =>> ', realtysUrls.length);

  const uniqueUrls = [...new Set(realtysUrls)]
  console.log('uniqueUrls.length =>> ', uniqueUrls.length);

  const data = await getContent(uniqueUrls);
  // saveRealtys(data);
  console.log('data.length =>> ', data.length);
  return data;
}

const getContent = async (uniqueUrls) => {
    const realtysDetails = []
    for (let i = 0; i < uniqueUrls.length ; i++) {
      const details = await getRealtyDetails(uniqueUrls[i]);
      details.advertiser = await getAdvertiserDetails(details);
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
        realtyDetails['url'] = url;
        let codPubli = $('div > ' +
                        'span.sc-bZQynM.sc-16iz3i7-0.cPAPOU')
                        .text()
        realtyDetails['codPublicacao'] = Number(codPubli.substr(codPubli.indexOf(' ')));
        realtyDetails['dtPublicacao'] = $('div.h3us20-2.bdQAUC > ' +
                                          'div > ' +
                                          'span.sc-bZQynM.sc-1oq8jzc-0.dxMPwC').text();
        realtyDetails['tituloAnuncio'] = $('h1[tag="h1"]').text();
        let valorAluguel = $('div > ' +
                            'div.sc-EHOje.sc-dVhcbM.iOixbk > ' +
                            'div.sc-EHOje.sc-dVhcbM.sc-12l420o-0.hHjKok > h2').text();

        realtyDetails['valorAluguel'] = Number(valorAluguel.replace(/\D|\s|\./g, ''))

        $('div[data-testid="ad-properties"] div div').each(function (i, elem) {
          let value
          let key = $('dt', elem).text();
          // regex to remove accented characters and replace it by unaccented.
          key = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          // regex to convert the key string to camelCase.
          if (key.match(/\s+/g)) {
            key = key.replace(/(?:[A-Z]|\b\w)/g, (word, index) => {
              return index === 0 ? word.toLowerCase() : word.toUpperCase();
            }).replace(/\s+/g, '');
          } else {
            key = key.toLowerCase();
          }
          // the value can be contained on a 'a' or 'dd' element, don't know which one.
          if ($('a', elem).text()) value = $('a', elem).text();
          if ($('dd', elem).text()) value = $('dd', elem).text()
          // the value can be a numbered value, if so, I extract only the numbers to store,
          // like number of bedrooms, rent value, area of the realty and so on.
          if (value && value.match(/\d/)) {
            value = Number(value.replace(/\D|\s/g, ''));
          }

          realtyDetails[key] = value;
        });
        realtyDetails['descricao'] = $('div > ' +
                                      'div.sc-1sj3nln-0.eSLnCp > div > p > span').text();
      }
      resolve(realtyDetails)
    })
  })
}

const getAdvertiserDetails = async (realtyDetails) => {
  // the data relative to the advertiser of the realty is loaded through an API, so I go there
  // and get it myself. Each publi advertiser details is gotten through the API url plus the publi code.
  const advertiserApiUrl = 'https://prada-api.olx.com.br/store/v1/accounts/ads/' + realtyDetails.codPublicacao;
  return new Promise ((resolve, reject) => {
    request({
      url: advertiserApiUrl,
      encoding: null
    }, (err, res, body) => {
      if (!err) {
        const advertiserDetails = JSON.parse(body.toString());
        resolve(advertiserDetails)
      }
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

const saveRealtys = (data) => {
  for (let i = 0; i < data.length; i++) {
    const realty = new Realty(data[i])
    realty.save((err)=>{
      if (err) {
        console.log(err);
      }
    })
  }
}

module.exports = {
  searchRealtyPrices
}