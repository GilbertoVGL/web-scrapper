const express = require('express')
const router = express.Router()

const sweeper = require('../controllers/scrapper')

router
  .post('/images', sweeper.searchImages)
  .post('/car-prices', sweeper.searchCarPrices)
  .post('/realty-prices', sweeper.searchRealtyPrices)

module.exports = router
