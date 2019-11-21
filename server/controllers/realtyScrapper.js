const scrapper = require('../services/realtyPrices');

const searchRealtyPrices = (req, res) => {
  let data = {
    query: req.body.query.query,
    type: req.body.query.type
  };
  scrapper.searchRealtyPrices(data)
    .then((estatisticas) => {
      res.send(estatisticas)
    })
}

module.exports = {
  searchRealtyPrices
}