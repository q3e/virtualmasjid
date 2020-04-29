<template>
<div class="event-list">
  <!-- Off-canvas element  -->
  <nav id="my-menu">
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Projects</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>

<div class="my-content-container">
  <div class="header">
    <div class="container-fluid container-header">
      <nav class="navbar navbar-expand-md navbar">
        <router-link class="navbar-brand navbar-logo" to="/">
          <span class="particletext">
            <img class="brand-logo" src="/static/svg/masjid-logo.svg" alt="Virtual Masjid">
          </span>
        </router-link>
      </nav>

      <p class="text-intro lead text-center">Find talks and classes on different subjects from different mosques</p>
      <div id="search" class="search-container" v-bind:class="{active: search_active}">
<!--         <div class="search-icon-container">
          <div class="search-icon dark small">
            <div class="mug-top"></div>
            <div class="mug-sides"></div>
            <div class="mug-bottom"></div>
            <div class="mug-handle">
              <div class="mug-handle-inner"></div>
            </div>
          </div>
        </div>
-->
        <input v-model="query" type="text"
               class="form-control search"
               placeholder="Search titles, speakers, or status"
               aria-label="Search titles, speakers, or status"
               @focus="search_active = true"
               @keyup.enter="onQueryEnter">
          <button class="btn btn-clearsearch" type="button"
              @click="onSearchClose">
            <img src="/static/svg/close.svg" alt="close"/>
          </button>
    </div>

    <div class="taphouse-select-container">
      <vue-chosen v-model="selected_venue_id"
                  :options="venues"
                  label="name"
                  placeholder="Select a location">
      </vue-chosen>
    </div>
  </div>
</div>

<main>
  <div class="container-fluid">
    <div class="results-header">
      <h2 class="results-number">
        <span class="event-total">{{ eventCount }}</span> <span class="d-none">matching</span> events
        <span v-if="selected_venue"> at <a class="header-venue" href="#" data-toggle="modal" data-target="#venueModal">{{ selected_venue.name }}</a></span>
      </h2>
      <div class="sort">
        <a class="sort-button btn btn-outline-light" href="#"></a>
        <div class="sort-options z-3">
          <div class="sort-options-header">Sort by:</div>
          <ul>
            <li v-for="(s, i) in sort" :key="i">
              <a @click="onSortChange(s)" v-bind:class="{selected: s.name === selected_sort.name }">{{ s.name }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="container-list">
      <ul id="event-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy">
        <event-item v-for="event in events" v-bind:key="event.id" v-bind:event="event"></event-item>
      </ul>
    </div>
  </div>
</main>

<footer>
  <div class="container-fluid">
    <ul class="list-inline">
     <!-- <li><router-link to="about">About</router-link></li>
      <li><a href="#" target="_blank">Contact</a></li> -->
    </ul>
  </div>
</footer>

<venue-modal :venue="selected_venue"></venue-modal>

</div>
</div>
</template>

<script>
import $ from 'jquery';
import axios from 'axios';

import 'offside-js/dist/offside.css';
import offside from 'offside-js';

import { getVenues, getEvents, getVenueEvents, searchEvents } from '@/services/venues';

import EventItem from './EventItem';
import VenueModal from './VenueModal';
import VueChosen from './vue-chosen';

const view = {
  name: 'event-list',
  components: {
    EventItem,
    VenueModal,
    VueChosen,
  },
  data() {
    return {
      query: undefined,
      eventCount: 0,
      events: [],
      venues: [{ name: 'Select a location', id: undefined }],
      selected_venue_id: undefined,
      selected_venue: undefined,
      search_active: false,
      sort: [
        { name: 'Title', sort: 'title' },
        { name: 'Speaker', sort: 'speaker' },
        { name: 'Language', sort: 'language' }],
      invert_sort: false,
      selected_sort: { name: 'Title', sort: 'title' },
      showModal: false,
      next: undefined,
      busy: false,
    };
  },
  mounted() {
    function bubbles() {
      $.each($('.particletext.bubbles'),
        function () {
          function rnd(m, n) {
            const mm = parseInt(m, 10);
            const nn = parseInt(n, 10);
            return Math.floor(Math.random() * ((nn - mm) + 1)) + mm;
          }

          const bubblecount = ($(this).width() / 50) * 4;
          for (let i = 0; i <= bubblecount; i += 1) {
            const size = rnd(40, 80) / 10;
            const top = rnd(0, 60);
            const left = rnd(0, 95);
            const delay = rnd(0, 30) / 10;
            $(this).append(`<span class="particle" style="top:${top}%; left:${left}%;width:${size}px; height:${size}px;animation-delay: ${delay}s;"></span>`);
          }
        });
    }
    bubbles();

    offside('#my-menu', {
      slidingElementsSelector: '#my-content-container',
      buttonsSelector: '#my-button, .another-button',
    });

    getVenues().then((response) => {
      this.venues.push(...response.data.results);
    });

    this.updateEvents();
  },
  watch: {
    selected_venue_id() {
      const id = parseInt(this.selected_venue_id, 10);
      this.selected_venue = this.venues.find(obj => obj.id === id);
    },
    selected_venue() {
      if (!this.query) {
        this.updateEvents();
      }
    },
  },
  methods: {
    onQueryEnter() {
      this.selected_venue_id = undefined;
      searchEvents(this.query).then(
        (response) => {
          this.eventCount = response.data.count;
          this.events = response.data.results;
          this.next = response.data.next;
          // this.mungeEvents();
        });
    },
    onSearchClose() {
      this.query = '';
      this.search_active = false;
      this.updateEvents();
    },
    // mungeEvents() {
    //   for (let i = 0; i < this.events.length; i += 1) {
    //     this.events[i].styleObj = {
    //       '--background-color': this.events[i].color_srm_html,
    //     };

    //     if (this.events[i].untappd_metadata) {
    //       if (this.events[i].untappd_metadata.json_data) {
    //         const rating = this.events[i].untappd_metadata.json_data.rating_score;
    //         this.events[i].rating = Number(rating).toFixed(1);
    //         this.events[i].rating_count = this.events[i].untappd_metadata.json_data.rating_count;
    //       }
    //     }
    //     if (this.events[i].abv) {
    //       this.events[i].abv_fixed = Number(this.events[i].abv).toFixed(1);
    //     }
    //   }
    // },
    updateEvents() {
      if (this.selected_venue_id) {
        getVenueEvents(this.selected_venue_id, this.selected_sort.sort, this.invert_sort).then(
          (response) => {
            this.eventCount = response.data.count;
            this.events = response.data.results;
            this.next = response.data.next;
            // this.mungeEvents();
          });
      } else {
        getEvents(this.selected_sort.sort, this.invert_sort).then(
          (response) => {
            this.eventCount = response.data.count;
            this.events = response.data.results;
            this.next = response.data.next;
            console.log(this);
            // this.mungeEvents();
          });
      }
    },
    loadMore() {
      if (this.next) {
        this.busy = true;
        axios.get(this.next).then((response) => {
          this.next = response.data.next;
          this.events = this.events.concat(response.data.results);
          // this.mungeEvents();
          this.busy = false;
        });
      }
    },
    getVenueEvents(val) { this.selected_venue = val; },
    onSortChange(newSort) {
      if (this.selected_sort.sort === newSort.sort) {
        this.invert_sort = !this.invert_sort;
      } else {
        this.selected_sort = newSort;
        this.invert_sort = false;
      }
      this.updateEvents();
    },
  },
};

export default view;
// eslint-disable-next-line
console.log(view.data().events);
</script>

<style>

html, body {
  font-size:14px;
  font-family:'Montserrat', sans-serif;
  font-weight:400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color:#31302c;
}

body {
  background-color:#f5bd00;
  background: linear-gradient(to right, #02ad63 0%,#02de7f 30%,#02de7f 70%,#02ad63 100%);
}

img {
  max-width:100%;
}

.event-speaker, .event-style {
  max-width:100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-family:'Lekton', sans-serif;
}

main {
  background:#fff;
  border-radius:1.25rem;
  padding-bottom:1rem;
  box-shadow: 0 0 8px rgba(0,0,0,0.15);
}

h1, h2, h3, h4, h5, p {
  color:#31302c;
}

h2 a {
  font-weight:bold;
}

a {
  color:#906500;
}

a:hover {
  color:#31302c;
}

hr {
  border-top: 1px solid #ddd;
}

.z-1, .btn.btn-raised {
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: box-shadow 0.3s cubic-bezier(.25,.8,.25,1);
}

.z-1.z-hover:hover, .z-1.z-hover:active, .z-1.z-hover:focus, .btn.btn-raised:hover, .btn.btn-raised:active, .btn.btn-raised:focus {
  box-shadow: 0 8px 16px rgba(0,0,0,0.25), 0 4px 8px rgba(0,0,0,0.22);
}

.z-2 {
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
}

.z-3 {
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
}

.z-4 {
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
}

.z-5 {
  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
}


.list-inline>li {
  display:inline-block;
  padding:0 1rem;
}

.list-inline>li:not(:last-of-type){
  border-right:.5px solid #31302c
}

.btn.btn-raised.btn-primary {
  background-color:#f5bd00;
  color:#31302c;
}

.btn.btn-raised.btn-primary:hover, .btn.btn-raised.btn-primary:focus {
  background-color:#8cf5c8;
  color:#31302c;
}

.btn.btn-outline-primary {
  color:#906500;
  border-color:#906500;
}

.btn.btn-outline-primary:hover, .btn.btn-outline-primary:focus {
  color:#31302c;
  border-color:#31302c;
  background-color:#f5bd00;
}

strong, b {
  font-weight:700;
}

.link-solo {

}

.container-fluid {
  padding-left:1rem;
  padding-right:1rem;
  max-width:980px;
}

.container-list {
  margin:0 -1rem;
}

.container-header {
  color:#31302c;
  padding-bottom:.25rem;
  display:flex;
  flex-wrap:wrap;
}

nav, .text-intro, .search-container, .taphouse-select-container {
  flex:1 1 100%;
}

nav.navbar {
/*  box-shadow: 0 2px 4px rgba(255, 217, 23, 0.4);*/
  box-shadow:none;
}

.navbar-logo {
  margin-left:auto;
  margin-right:auto;
  padding-top:1rem;
  padding-bottom:0;
}

.navbar-logo:hover {
}

.navbar-logo img {
  display:inline-block;
  width:10rem;
  margin: 0 auto;
}

.text-intro {
  padding-bottom:1rem;
}

.search-container {
  position:relative;
  margin-bottom:.5rem;
  max-width:520px;
  margin-left:auto;
  margin-right:auto;
}

.search {
  width:100%;
  padding: .75rem 2.25rem .75rem 3rem;
  font-weight: 400;
  background:#8cf5c8;
  color:#31302c;
  position:relative;
  border-radius:0.5rem;
  height:3rem;
}

.search:focus {
  color:#31302c;
}

.search::placeholder {
  color:#31302c;
}

.search-container .btn-search {
  background-color:#31302c;
  color:#fff;
  margin-bottom:0;
  padding:8px;
}

.search-container .btn-search img {
  width:1.5rem;
  height:1.5rem;
}

.search-container .btn-clearsearch {
  display:none;
  position:absolute;
  top:0;
  right:0;
  padding:.75rem .75rem;
  z-index:10;
  border-radius:.25rem;
  opacity:0.6;
}

.search-container .btn-clearsearch:hover {
  background:#31302c;
  opacity:1;
}

.search-container input.search.filled + .btn-clearsearch, .search-container.active .btn-clearsearch {
  display:block;
}

.search-container .btn-clearsearch img {
  width:.75rem;
  height:.75rem;
}

.search:focus, .search:active, select#taphouseSelect:focus, select#taphouseSelect:active {
  outline:0;
  background: #bbfae0;
}



/* Select Box */
.taphouse-select-container {
  position: relative;
  margin-bottom: 1rem;
  z-index:10;
  max-width:520px;
  margin-left:auto;
  margin-right:auto;
}

select#taphouseSelect {
  font-size: 1.25rem;
  font-weight: 400;
  line-height:1.25;
  width:100%;
  padding: .75rem 2rem .75rem 3rem;
  border: 0;
  background-color: #8cf5c8;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline:0;
  z-index:1;
  border-radius:.5rem;
  color:#31302c;
  height:auto;
  overflow:hidden;
  white-space:nowrap;
}

.search, .search::placeholder, select#taphouseSelect {
  font-size:1rem;
  line-height:1.25;
}


.modal-venue .modal-body {
  padding-top:0;
}

.venue-logo {
  width:64px;
  height:auto;
  margin:0 auto;
  display:block;
}

.venue-title {
  font-size:1.75rem;
  text-align:center;
  margin-bottom:2rem;
  margin-top:.5rem;
}

.venue-info {
  display:flex;
  flex-wrap: wrap;
}

.venue-address, .venue-contact, .venue-social {
  flex: 1 1 33.333%;
  min-width:240px;
}

.venue-taps {
  flex: 1 1 100%;
}

.venue-address, .venue-website, .venue-email, .venue-phone {
  display:block;
  position:relative;
  padding:.25rem 0 .25rem 1.5rem;
}

.venue-address:before, .venue-website:before, .venue-email:before, .venue-phone:before {
  width:1rem;
  height:1rem;
  display:block;
  position:absolute;
  left:0;
  top:.375rem;
  opacity:0.7;
}

.venue-address:before {
    content: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/69546/placeholder.svg);
}

.venue-website:before {
    content: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/69546/internet.svg);
}

.venue-email:before {
    content: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/69546/mail.svg);
}

.venue-phone:before {
    content: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/69546/telephone.svg);
}

.venue-social {
  display:flex;
  justify-content: space-around;
  flex-wrap:wrap;
  padding:1rem 0;
  margin-top: 1.5rem;
}

.venue-social a {
  padding:.5rem;
  opacity:.6;
  border-radius:4px;
}

.venue-social a:hover {
  background:#e5e5e5;
  opacity:1;
}

.venue-social a span {
  max-width:0;
  overflow:hidden;
  display:inline-block;
  vertical-align: middle;
  margin-left: 0;
  transition: max-width .2s ease .05s, margin .2s ease .05s;
}

.venue-social img {
  width:1.5rem;
  height:1.5rem;
}


.container-results-header {
  border-bottom:1px solid #ddd;
}

.results-header {
  display:flex;
  justify-content: space-between;
  align-items: center;
  text-transform:uppercase;
  padding:.5rem 0;
}

.results-number {
  font-size:1rem;
  margin:0;
}

.event-total {
  font-weight:700;
}

.header-venue {
  display:inline-block;
}

.sort {
  flex:0 1 auto;
  padding-left:1rem;
  position:relative;
}

.sort-button {
  padding:.75rem;
}

.sort-button:before {
  content: "";
  background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/69546/filter-results-button.svg);
  width: 1rem;
  height: 1rem;
  display:block;
  background-size:1rem;
}

.sort-options {
  display:none;
  position:absolute;
  right:0;
  top:2.75rem;
  width:8rem;
  background:#edfcf6;
  z-index:1000;
}

.sort:hover .sort-options {
  display:block;
}

.sort-options-header {
  padding:1rem 1rem .5rem;
  font-weight:700;
}

.sort-options ul {
  list-style:none;
  padding-left:0;
  margin-bottom:0;
}

.sort-options ul li a {
  display:block;
  padding: .5rem 1rem;
}

.sort-options ul li a.selected {
  border-left:.5rem solid #02de7f;
}

.sort-options ul li a:hover {
  background:rgba(0,0,0,0.1);
  text-decoration:none;
}

.main-divider {
  margin:.5rem 0 0;
}



#event-list {
  padding:0;
  list-style:none;
}

.event {
  position:relative;
  transition: all .1s ease-out;
}

.event.active {
  background:#edfcf6;
  box-shadow:0 1px 3px 1px rgba(60,64,67,.2), 0 2px 8px 4px rgba(60,64,67,.1);
  z-index:10;
  padding:.5rem 0 1rem;
}

.event:hover, .event:focus-within {
  background:#edfcf6;
  box-shadow:0 1px 3px 1px rgba(60,64,67,.2), 0 2px 8px 4px rgba(60,64,67,.1);
}

.event.active:hover, .event.active:focus-within {
  box-shadow:0 1px 3px 1px rgba(60,64,67,.2), 0 2px 8px 4px rgba(60,64,67,.1);
}

.event-intro {
  display:flex;
  padding:1.25rem 0 0 1rem;
}


.event-link, .event-link:hover {
  color:#31302c;
  text-decoration:none;
}

.event-link::after {
  content:" ";
  position:absolute;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index:5;
}

.event-info {
  flex:1;
  min-width:0;
  padding-bottom:1rem;
  padding-right:.5rem;
  margin-top:-.125rem;
  box-shadow:0 1px 0 #ddd;
  transition: box-shadow 0s .0s ease-out;
}

.event.active .event-info, .event:hover .event-info {
  box-shadow:none;
  transition: box-shadow 0s ease-out;
}

li.event:last-of-type .event-info {
    box-shadow:none;
}

.event-logo {
  overflow:hidden;
  float:left;
  width:4rem;
  min-width:4rem;
  height:4rem;
  margin-right:1rem;
  transition: all .1s ease-out;
  border:1px solid #ddd;
  background: #e5e5e5;
  display:flex;
}

/*
.event.active .event-logo {
  width:6.5rem;
  height:6.5rem;
  margin-top: -2.25rem;
  box-shadow: 0 0 4px rgba(0,0,0,0.3);
}
*/

.event-logo img {
  width:100%;
  height:auto;
  object-fit:cover;
}

.event-name, event-speaker, .event-style {
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

.event-name {
  margin-bottom:.25rem;
  margin-top:-.075rem;
  padding-right:32px;
  font-family: 'Oswald', sans-serif;
  font-weight:500;
  font-size: 1.25rem;
  line-height:1.3;
}

.event-speaker {
  font-size:1.125rem;
  line-height:125%;
  margin-bottom: -0.125rem;
}


.event-style {
  font-size:.85rem;
  color:#606060;
}

.event-style:before {
  content:" ";
  background:#e5e5e5;
  display:inline-block;
  width:.625rem;
  height:.625rem;
  margin-right:.375rem;
  border-radius:50%;
}

.event-abv:before {
  content:" - "
}



.event.active .event-name, .event.active .event-speaker, .event.active .event-style {
  overflow:visible;
  white-space:normal;
}
/*
.event-rating {
position: absolute;
    top: 1.125rem;
    right: .75rem;
    padding: .075rem;
    background: #ffedb7;
    width: 2rem;
    height: 2rem;
    text-align: center;
    line-height: 1.6rem;
    letter-spacing: -.075rem;
    border-radius: 50%;
    transition: background .1s ease-out;
    font-family: "Lekton", courier, monospace;
    font-size: 1rem;
    padding-right: .125rem;
}
*/
.event-rating {
  position: absolute;
  top: .875rem;
  right: .5rem;
  padding: .075rem;
  background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/69546/certificate.svg) no-repeat 50% 50%;
  background-size:2rem;
  width: 2rem;
  height: 2rem;
  text-align: center;
  line-height: 1.6rem;
  letter-spacing: -.125rem;
  transition: background .1s ease-out;
  font-family: "Lekton", courier, monospace;
  font-size: 1rem;
  padding-right: .25rem;
  padding-top:.325rem;
  color: #8F6400;
}
.event-details-container {
  position:relative;
}


.event-details {
  display:flex;
  padding:1rem;
}

.event-details a {
  position:relative;
  z-index:10;
}

.find-it, .learn-more {
  flex:1 1 50%;
}

.find-it {
  padding-right:.5rem;
}

.find-it-list li a, .find-it-list li {
    padding: .25rem 0;
}

.learn-more {
  padding-left:.5rem;
}

.find-it-header, .learn-more-header {
  font-weight: 700;
  font-size:1rem;
}

.find-it-list {
  list-style-type: none;
  padding-left: 0;
}

.collapsing {
  transition: height .1s ease-out;
}

footer {
  padding-top: 1rem;
  padding-bottom: 2rem;
}

footer a {
  color: #31302c;
}


/* Bubble Animation */
body .particletext {
  position: relative;
  z-index:5;
}
body .particletext.bubbles > .particle {
  opacity: 0;
  position: absolute;
  background-color: transparent;
  -webkit-animation: bubbles 3s ease-in infinite;
          animation: bubbles 3s ease-in infinite;
  border-radius: 100%;
  border: 0.75px solid rgba(255,255,255,0.8);
  z-index:-1;
}

@keyframes bubbles {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 0.3;
    -webkit-transform: translate(0, -20%);
            transform: translate(0, -20%);
  }
  30% {
    opacity:1;
  }
  100% {
    opacity: 0;
    -webkit-transform: translate(0, -1000%);
            transform: translate(0, -1000%);
  }
}

.srm:before {
  background-color: var(--background-color);
}

/* Mug Search Icon */

.search-icon-container {
  position:absolute;
  z-index:10;
  perspective: 140;
  -webkit-perspective:100;
  perspective-origin: 30% 50%;
  padding:.75rem .75rem;
}

.search-icon {
  position: relative;
  width: 7em;
  height: 7em;
  font-size:12px;
  margin-top:.25em;
  margin-left:1em;
  transform: scale(1.0) scaleZ(1.0) rotateX(-0deg);
  transform-origin: 0% 0%;
  transition: transform .2s ease-out, margin .2s ease-out;
  opacity:0.7;
}

.search-icon.small {
  font-size:3px;
}

/* ALL THE BORDERS */
.mug-handle {
  border:.75px solid #fff;
}
.active .search-icon .mug-handle {
  border-width: 1.45px;
}
.mug-top, .mug-bottom, .mug-top:after {
  border: 1.45px solid #fff;
}
.mug-sides {
  border-left:1.45px solid #fff;
  border-right:1.45px solid #fff;
}
/* END ALL THE BORDERS */

.mug-handle {
  position: absolute;
  top: 2em;
  left: 5em;
  height: .1em;
  width: 1.85em;
  background: #31302c;
  border-left: 0;
  transform: rotate(45deg);
  transform-origin: -150% 100%;
  transition: height .2s ease-out, transform .2s ease-out .2s, top .2s ease-out, border-radius .2s ease-out .2s, background .2s ease-out .2s, border .2s ease-out;
}

.mug-handle:after {
  content:" ";
  position:absolute;
  border:0 solid #fff;
  height:0;
  width:1.25em;
  top:.5em;
  left:0;
  transition: height .2s ease-out, transform .2s ease-out .2s, top .2s ease-out, border-width .2s ease-out;
}

.mug-top, .mug-bottom, .mug-top:after {
  position: absolute;
  top: 0;
  left: 0;
  width: 5em;
  height: 5em;
  border-radius: 50%;
  z-index: 1;
  transition: border .2s ease-out, height .2s ease-out, top .2s ease-out, border-radius .2s ease-out;
}

.mug-top:after {
  content:"";
  top:calc(6em - 2px);
  left:-2px;
  width:5em;
  border:0;
  transition: border .2s ease-out, height .2s ease-out, top .2s ease-out, border-radius .2s ease-out, top .2s ease-out .2s, background .2s ease-out;
}

.mug-sides {
  position:absolute;
  height:0;
  width:5em;
  top:2.5em;
  left:0;
  transition: all .2s ease-out;
}

.active .search-icon {
  margin-top:0;
  margin-bottom:.5em;
  transform: scale(1.0) scaleZ(1.0) rotateX(-10deg);
  transition: transform .2s ease-out .2s, margin .2s ease-out .2s;
}

.active .search-icon .mug-top, .active .mug-bottom {
  height:1em;
  transition: height .2s ease-out .2s;
}

.active .search-icon .mug-top {
  height:1.25em
}

.active .search-icon .mug-top:after {
  top:-.25em;
  height:1em;
  box-shadow:0 1px 0 #fff, 0 2px 0 #fff, 0 3px 0 #fff, 0 4px 0 #fff;
  background:#fff;
  transition: height .2s ease-out .2s, top .2s ease-out, background .2s ease-out .4s, box-shadow .2s ease-out .4s, top .2s ease-out .6s;
}

.active .search-icon .mug-bottom {
  top:calc(6em - 2px);
  height:1.5em;
  transition: height .2s ease-out .2s, top .2s ease-out .2s;
}

.active .search-icon .mug-handle {
  border-radius: 0 .5em .5em 0;
  height:4em;
  top:1.5em;
  background:transparent;
  transform: rotate(0deg);
  transition: height .2s ease-out .2s, border-width .2s ease-out .2s, transform .2s ease-out, top .2s ease-out .2s;
}

.active .search-icon .mug-handle:after {
  border-width:2px;
  border-left:0;
  height:2.75em;
  transition: height .2s ease-out .2s, border-width 0s ease-out .2s, transform .2s ease-out;
}

.active .search-icon .mug-sides {
  height:6em;
  top:.5em;
  transition: height .2s ease-out .2s, top .2s ease-out .2s;
}







.search-icon.dark .mug-top, .search-icon.dark .mug-bottom, .search-icon.dark .mug-sides, .search-icon.dark .mug-handle {
  border-color:#31302c;
}
.search-icon.dark .mug-top:after {
  content:none;
}



.small .mug-top:after {
  top:calc(6em - 6px)
}
.active .small .mug-handle:after {
  display:none;
}























.chosen-container-single .chosen-single div, .taphouse-select-container:after {
  position: absolute;
  top: 0;
  right: 0;
  display: block;
  width: 3rem;
  height: 100%;
  background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/69546/down-arrow.svg);
  background-size: 1.25rem 1.25rem;
  background-position: 50% 50%;
  background-repeat:no-repeat;
  transition: transform 0.2s ease-out;
  opacity:0.6;
}

.taphouse-select-container:after {
  content:" ";
}

.chosen-container-single .chosen-single:before, .taphouse-select-container:before {
  content:" ";
  display:block;
  position:absolute;
  width:3rem;
  height:3rem;
  top:0;
  left:0;
  background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/69546/placeholder.svg);
  background-size: 1.5rem 1.5rem;
  background-position: 50% 50%;
  background-repeat:no-repeat;
  opacity:0.6;
}

/*!
Chosen, a Box Enhancer for jQuery and Prototype
by Patrick Filler for Harvest, http://getharvest.com

Version 1.8.7
Full source at https://github.com/harvesthq/chosen
Copyright (c) 2011-2018 Harvest http://getharvest.com

MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md
This file is generated by `grunt build`, do not edit it by hand.
*/

/* @group Base */
.chosen-container {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
  color:#31302c;
  width:100% !important;
}

.chosen-container .chosen-drop {
  position: absolute;
  top: 100%;
  z-index: 1010;
  width: 100%;
  background: transparent;
  clip: rect(0, 0, 0, 0);
  -webkit-clip-path: inset(100% 100%);
          clip-path: inset(100% 100%);
}

.chosen-container.chosen-with-drop .chosen-drop {
  clip: auto;
  -webkit-clip-path: none;
          clip-path: none;
}

.chosen-container a {
  cursor: pointer;
}

.chosen-container .search-choice .group-name, .chosen-container .chosen-single .group-name {
  margin-right: 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: normal;
  color: #999999;
}

.chosen-container .search-choice .group-name:after, .chosen-container .chosen-single .group-name:after {
  content: ":";
  padding-left: 2px;
  vertical-align: top;
}

/* @end */
/* @group Single Chosen */
.chosen-container-single .chosen-single {
  position:relative;
  font-size: 1.25rem;
  font-weight: 400;
  line-height:1.25;
  width:100%;
  padding: .75rem 2rem .75rem 3rem;
  border: 0;
  background-color: #8cf5c8;
  outline:0;
  z-index:100;
  border-radius:0.5rem;
  color:#31302c;
  overflow:hidden;
  white-space:nowrap;
  display: block;
  transition: box-shadow 0.3s cubic-bezier(.25,.8,.25,1);
}

.chosen-container-single .chosen-single:hover, .chosen-container-single .chosen-single:active, .chosen-container-single .chosen-single:focus {
  background-color:#bbfae0;
}

.chosen-container-single .chosen-default {
  color: #999;
}

.chosen-container-single .chosen-single span {
  display: block;
  overflow: hidden;
  margin-right: 26px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chosen-container-single .chosen-single-with-deselect span {
  margin-right: 38px;
}

.chosen-container-single .chosen-single abbr {
  position: absolute;
  top: 6px;
  right: 26px;
  display: block;
  width: 12px;
  height: 12px;
  background: url("/static/img/chosen-sprite.png") -42px 1px no-repeat;
  font-size: 1px;
}

.chosen-container-single .chosen-single abbr:hover {
  background-position: -42px -10px;
}

.chosen-container-single.chosen-disabled .chosen-single abbr:hover {
  background-position: -42px -10px;
}

.chosen-container-single .chosen-search {
  position: relative;
  z-index: 1010;
  margin: 0;
  padding: 0.125rem 3rem 0.125rem 3rem;
  white-space: nowrap;
}

.chosen-container-single .chosen-search input[type="text"] {
  margin: 1px 0;
  padding: .5rem;
  width: 100%;
  height: auto;
  outline: 0;
  border: 1px solid rgba(255,255,255,0.6);
  background: #bbfae0;
  font-size: 1.25em;
  font-family: sans-serif;
  line-height: normal;
  border-radius: 0;
}

.chosen-container-single .chosen-drop {
  margin-top: -3rem;
  border-radius: .5rem;
  background-clip: padding-box;
}

.chosen-container-single.chosen-container-single-nosearch .chosen-search {
  position: absolute;
  clip: rect(0, 0, 0, 0);
  -webkit-clip-path: inset(100% 100%);
          clip-path: inset(100% 100%);
}

/* @end */
/* @group Results */
.chosen-container .chosen-results {
  color: inherit;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  max-height: 240px;
  background:#8cf5c8;
  -webkit-overflow-scrolling: touch;
}

.chosen-container .chosen-results li {
  display: none;
  font-size:1rem;
  margin: 0;
  padding: .5rem 1rem .5rem 3rem;
  list-style: none;
  word-wrap: break-word;
  -webkit-touch-callout: none;
}

.chosen-container .chosen-results li.active-result {
  display: list-item;
  cursor: pointer;
}

.chosen-container .chosen-results li.disabled-result {
  display: list-item;
  color: #ccc;
  cursor: default;
}

.chosen-container .chosen-results li.highlighted {
  background-color: #bbfae0;
}

.chosen-container .chosen-results li.no-results {
  color: #777;
  display: list-item;
  background: #f4f4f4;
}

.chosen-container .chosen-results li.group-result {
  display: list-item;
  font-weight: bold;
  cursor: default;
}

.chosen-container .chosen-results li.group-option {
  padding-left: 15px;
}

.chosen-container .chosen-results li em {
  font-style: normal;
  text-decoration: underline;
}

/* @end */
/* @group Active  */
.chosen-container-active .chosen-single {

}

.chosen-container-active.chosen-with-drop .chosen-single {
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.chosen-container-active.chosen-with-drop .chosen-single div, .taphouse-select-container:focus-within:after {
  transform: rotate(180deg);
}

.chosen-container-active .chosen-choices {

}

.chosen-container-active .chosen-choices li.search-field input[type="text"] {
  color: #222 !important;
}

/* @end */

@media (min-width: 375px) {
  .search, .search::placeholder, select#taphouseSelect {
    font-size:1.25rem;
  }
}

@media (min-width: 420px) {
  html {
    font-size:16px;
  }
  .container-fluid {
    padding-left:1rem;
    padding-right:1rem;
  }
  .search-container .btn-clearsearch {
    padding: .125rem;
    width:2rem;
    height:2rem;
    margin:.5rem;
  }
  .event-details-container {
  }
  .search-icon.small {
    font-size:4px;
  }
  .search-icon-container {
    padding:.75rem .5rem;
  }
}

@media (min-width: 576px) {
  .container-fluid {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  .modal-dialog {
    max-width: 530px;
  }
  .venue-social a:hover span {
    max-width:100px;
    margin-left: .5rem;
  }
}

@media (min-width:880px) {

  .navbar-logo {
    padding-top:1.25rem;
  }

  .text-intro {
    padding-bottom:1.25rem;
  }

  .search-container {
    flex:0 0 50%;
    padding-right:.5rem;
  }

  .taphouse-select-container {
    flex:0 0 50%;
    padding-left:.5rem;
  }

  .taphouse-select-container:before {
    background-position: 90% 50%;
  }

  .event-info {
    display:flex;
    flex-direction: column;
    flex-wrap: wrap;
    height: 5.5rem;
  }

  .event-link {
    width: 50%;
    flex-basis: 100%;
  }

   .event-speaker, .event-style {
    width: 50%;
    flex-basis: auto;
  }

  .event-speaker {
    padding-right: 2.5rem;
    margin-bottom: .25rem;
  }
}
</style>
