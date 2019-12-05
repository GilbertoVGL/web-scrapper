const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RealtySchema = Schema({
  codPublicacao: Number,
  dtPublicacao: String,
  tituloAnuncio: String,
  valorAluguel: Number,
  categoria: String,
  tipo: String,
  areaUtil: String,
  quartos: String,
  banheiros: String,
  vagasNaGaragem: String,
  cep: String,
  municipio: String,
  bairro: String,
  descricao: String
});

module.exports = mongoose.model('Realty', RealtySchema);