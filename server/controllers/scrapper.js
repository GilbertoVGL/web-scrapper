const scrapper = require('../services/scrapper');

const searchImages = (req, res) => {
  let data = {
    query: req.body.query.query,
    type: req.body.query.type
  };
  scrapper.searchImages(data)
    .then((estatisticas) => {
      res.send(estatisticas)
    })
}

const searchCarPrices = (req, res) => {
  let data = {
    query: req.body.query.query,
    type: req.body.query.type
  };
  scrapper.searchCarPrices(data)
    .then((estatisticas) => {
      res.send(estatisticas)
    })
}

module.exports = {
  searchImages,
  searchCarPrices
}