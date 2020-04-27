<template>
<li class="beer" v-bind:class="{ active: visible }">
  <template v-if="beer">
    <div class="beer-intro">
      <div class="beer-logo"><img :src="beer.logo_url ? beer.logo_url : '/static/img/beernotfound.jpg'"></div>
      <div class="beer-info">
        <a class="beer-link" @click="visible = !visible;">
          <h2 class="beer-name">{{ beer.name }}</h2>
        </a>
        <div class="beer-brewer">{{ beer.manufacturer.name }}</div>
        <div class="beer-style srm" v-if="beer.style" v-bind:style="beer.styleObj">{{ beer.style.name }}<span v-if="beer.abv_fixed" class="beer-abv">{{ beer.abv_fixed }}%</span></div>
        <div v-if="beer.rating" class="beer-rating">{{ beer.rating }}</div>
      </div>
    </div>
    <b-collapse class="beer-details-container" id="beerDetails" v-model="visible">
      <div class="beer-details">
        <div class="find-it">
          <h3 class="find-it-header">Find it on tap at:</h3>
          <ul class="find-it-list">
            <li v-for="place of beer.venues"><a target="_blank" :href="place.website">{{ place.name }}</a></li>
          </ul>
        </div>
        <div class="learn-more" v-if="beer.untappd_url || beer.taphunter_url">
          <h3 class="learn-more-header">Learn more</h3>
          <a v-if="beer.untappd_url" :href="beer.untappd_url" target="_blank" class="btn btn-outline-primary">untappd</a>
          <a v-if="beer.taphunter_url" :href="beer.taphunter_url" target="_blank" class="btn btn-outline-primary">TapHunter</a>
        </div>
      </div>
    </b-collapse>
  </template>
  <template v-else-if="beer === false">
  </template>
</li>
</template>

<script>
export default {
  name: 'beer-item',
  props: ['beer'],
  data() {
    return {
      visible: false,
    };
  },
};
</script>