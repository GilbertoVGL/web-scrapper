import axios from 'axios'

const endpoint = '/api/search'

async function getImages (query) {
  const url = endpoint + '/images'
  return axios.post(url, {query}).then(res => {
    return res.data
  })
}

async function getCarPrices (query) {
  const url = endpoint + '/car-prices'
  return axios.post(url, {query}).then(res => {
    return res.data
  })
}

async function getRealtyPrices (query) {
  const url = endpoint + '/realty-prices'
  return axios.post(url, {query}).then(res => {
    return res.data
  })
}

export default {
  getImages,
  getCarPrices,
  getRealtyPrices
}
