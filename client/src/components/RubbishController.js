import api from '@/services/api';
let vm;
export default {
  name: "Rubbish",
  data () {
    return {
      userQuery: null,
      scraps: [],
      gotImageRubbish: false,
      gotPriceRubbish: false,
      typeOfSearch: 'image'
    }
  },
  computed: {
    // uma função "getter" computada (computed getter)
    googleQuery: function () {
      if (vm.userQuery !== null) {
        const query = vm.userQuery.trim().split(' ').join('+')
        const googleUrl1 = 'https://www.google.com/search?q='
        const googleUrl2 = '&oq='
        const googleUrl3 = '&sourceid=chrome&ie=UTF-8'
        const fullQuery = googleUrl1 + query + googleUrl2 + query + googleUrl3

        return fullQuery
      }
    }
  },
  created () {
    vm = this;
  },
  methods: {
    async getRubbish(){
      // if(vm.userQuery) {
        let rubbish;
        const filtros = {
          query: vm.userQuery,
          type: vm.typeOfSearch
        };
        console.log('filtros type =>> ', filtros.type)
        if (filtros.type !== 'carPrice' && filtros.type !== 'realtyPrice') {
          rubbish = await api.sweeper.getImages(filtros);
        } else if (filtros.type === 'realtyPrice'){
          rubbish = await api.sweeper.getRealtyPrices(filtros);
        } else {
          rubbish = await api.sweeper.getCarPrices(filtros);
        }
        console.log('rubbish =>> ', rubbish)
        if (rubbish.length > 0) {
          vm.scraps = rubbish;
          if (filtros.type === 'site' || filtros.type === 'image') {
            vm.gotImageRubbish = true;
          } else {
            vm.gotPriceRubbish = true;
          }
        }
      // }
    }
  }
}