const scrapper = require('../services/realtyPrices');

const searchRealtyPrices = (req, res) => {
  let data = {
    query: req.body.query.query,
    type: req.body.query.type
  };

  scrapper.searchRealtyPrices(data)
    .then((realtys) => {
      res.send(realtys)
    })
}

module.exports = {
  searchRealtyPrices
}