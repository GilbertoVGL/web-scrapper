const request = require('request');
const cheerio = require('cheerio');
const mimelib = require("mimelib");
const iconv = require('iconv-lite');
const puppeteer = require('puppeteer');
const util = require('util');


async function searchImages(params) {
  const query = params.query;
  const regex = /\bhttps*/g;
  let url

  if (params.type === 'image') {
    url = "https://www.google.com/search?tbm=isch&q=";
    url = url + query.trim().split(' ').join('+')
  }
  if (params.type === 'site') {
    if (query.search(regex) === -1) {
      url = "https://" + query;
    } else {
      url = query;
    }
  }

  const imagens = [];
  
  console.log('about to look for =>> ', url);
  await (() => {
    return new Promise ((resolve, reject) => {
      request(url, (err, res, body) => {
          if (!err) {
            const $ = cheerio.load(body);
            $('img').each(function (i, elem) {
              const url = $(this).attr('src');
              if (typeof url === "string") {
                if (url.search(regex) >= 0) {
                  imagens.push(url);
                }
              }
            });
          }
          resolve(body)
        })
    })
  })();
  const uniqueUrls = [...new Set(imagens)]
  // console.log('uniqueUrls =>> ', util.inspect(uniqueUrls, {'maxArrayLength': null}))
  // console.log('uniqueUrls.length =>> ', uniqueUrls.length);
  return uniqueUrls;
}

async function searchCarPrices(params) {
  const filtro = params.query.trim();
  console.log('teste ', filtro)
  console.log('teste encodeURIComponent ', encodeURIComponent(filtro))
  const query = encodeURIComponent(filtro)
  const url = "https://www.olx.com.br/autos-e-pecas?q=" + query;
  const prices = [];

  console.log('about to look for =>> ', url);
  await (() => {
    return new Promise ((resolve, reject) => {
      request(url, (err, res, body) => {
          if (!err) {
            const $ = cheerio.load(body);
            $('li.item a.OLXad-list-link').each(function (i, elem) {
              const url = $(this).attr('href');
              if (typeof url === "string") {
                prices.push(url);
              }
            });
          }
          resolve(body)
        })
    })
  })();
  const uniqueUrls = [...new Set(prices)]
  console.log('uniqueUrls =>> ', uniqueUrls);
  return uniqueUrls;
}

module.exports = {
  searchImages,
  searchCarPrices
}