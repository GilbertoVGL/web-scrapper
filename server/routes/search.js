const express = require('express')
const router = express.Router()

const scrapper = require('../controllers/scrapper');
const realtyPrices = require('../controllers/realtyScrapper');

router
  .post('/images', scrapper.searchImages)
  .post('/car-prices', scrapper.searchCarPrices)
  .post('/realty-prices', realtyPrices.searchRealtyPrices)

module.exports = router
