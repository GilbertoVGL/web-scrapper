<template>
  <div class="boards">
    <div>
      <!-- <h1>Insert your query:</h1>
      <input v-model="userQuery" placeholder="Enter your search here!"> -->
      <h3>Type of search</h3>
      <!-- <input type="radio" id="image" value="image" v-model="typeOfSearch">
      <label for="image">Image</label>
      <input type="radio" id="site" value="site" v-model="typeOfSearch">
      <label for="site">Site</label>
      <input type="radio" id="carPrice" value="carPrice" v-model="typeOfSearch">
      <label for="carPrice">Car Price</label> -->
      <input type="radio" id="realtyPrice" value="realtyPrice" v-model="typeOfSearch">
      <label for="realtyPrice">Realty Price</label>
      <br>
      <button v-on:click="getRubbish()">search</button>
      <br>
    </div>
    <br>
    <div v-if="gotImageRubbish">
      <div v-for="image in scraps">
        <img :src="image">
      </div>
    </div>
    <div v-if="gotPriceRubbish">
      <div v-for="price in scraps">
        <a :href="price">
          <p> link</p>
        </a>
      </div>
    </div>
  </div>
</template>
<script src="./RubbishController.js"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.boards {
  width: 80%;
  margin: 0 auto;
  padding-top: 100px;
  display: flex;
  flex-wrap: wrap;
}
.board {
  border-radius: 3px;
  color: #FFFFFF;
  display: block;
  text-decoration: none;
  width: 15%;
  min-width: 150px;
  min-height: 80px;
  padding: 10px;
  background-color: rgb(198, 205, 250);
  margin: 0 15px 15px 0;
}
</style>
