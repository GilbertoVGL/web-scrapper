"use strict";
const realtyScrapper = require('../models/realtyScrapper');

class RealtyScrapperEndpoint {

    get(req, res) {
        realtyScrapper.RealtyScrapper.getRealties().then((data) => {
            res.json({message: data});
        });
    }
}

exports.RealtyScrapperEndpoint = RealtyScrapperEndpoint;