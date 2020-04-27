<template>
<div class="about">
  <div class="header">
    <div class="container-fluid container-header">
      <nav class="navbar navbar-expand-md navbar">
      <router-link class="navbar-brand navbar-logo" to="/">
          <span class="particletext bubbles">
            <img class="brand-logo" src="/static/svg/hsv-beer-logo.svg" alt="hsv.beer">
          </span>
        </router-link>
      </nav>
      <p class="text-intro lead text-center">What's on tap in Huntsville</p>
    </div>
  </div>
  <main>
    <div class="container-fluid">
      <h1>About HSV.beer</h1>

      <p class="lead">HSV.beer is an open-source project helping Rocket City residents and visitors find draft beer at the many excellent breweries, bars, and retailers in the Huntsville area.</p>
      <p>Taprooms are constantly rotating kegs. This can make it difficult to find out who's serving your favorite beer.  And once you arrive, those novel-length menus can be daunting when you're looking for a particular style or brewer.</p>
      <p>HSV.beer allows you to easily search the draft beer inventory of retailers all across the Huntsville area.  See what's available at a particular taproom, or search all of Huntsville for a particular beer, manufacturer, or style.</p>
      
      <!--
      <div class="card bg-light mb-4">
        <div class="card-body">
          <h5 class="card-title">Tip Jar</h5>
          <p class="card-text">In addition to ongoing maintenance and hosting costs, launching this project required a significant amount of design and development. <strong>Help us keep HSV.beer chugging.</strong></p>
          <a href="/tip-jar" class="btn btn-primary btn-raised">Buy us a beer</a>
        </div>
      </div>
      -->
    
      <div class="alert alert-primary" role="alert">
        <strong>HSV.beer is currently in beta.</strong>
      </div>
    
      <h2>How it works</h2>
      <p>Most taprooms (retailers that serve draft beer) manage their inventory using software such as DigitalPour or Untappd. HSV.beer uses the APIs provided by these services, as well as custom-built parsers, to query the inventory of each taproom and return the results in one easy to read, searchable, sortable database, regardless of the inventory platform used.</p>
      
      <h3 class="h4">Don't see your favorite taproom?</h3>
      <p>We are only able to track the inventory of taprooms that make their taplist available online. If a Huntsville-area taproom does use digital inventory software and isn't listed on HSV.beer, it's likely because we don't yet have access to their taplist.</p>
      <p><a href="mailto:getlisted@hsv.beer">List your taproom on hsv.beer</a></p>
      <h2 id="contactUs">Contact Us</h2>
      <p>HSV.beer is an open-source project hosted on <a href="https://github.com/hsv-dot-beer" target="_blank">Github</a> with multiple contributors. The founding contributors are Huntsville residents and craft beer lovers Michael Carroll, Drew Winstel, and Drew McDowell.</p>
      <p>If you want to join the conversation, find us at #hsv-dot-beer on <a href="https://tech256.com" target="_blank">Tech256</a></p>

      <div class="row text-center founders">
        <div class="col mb-4"><img class="mb-2" src="/static/img/carroll.jpeg" alt=""><br>Michael Carroll<br><a href="mailto:michael@hsv.beer">michael@hsv.beer</a>
        </div>
        <div class="col mb-4"><img class="mb-2" src="/static/img/winstel.jpeg" alt=""><br>Drew Winstel<br><a href="mailto:drew@hsv.beer">drew@hsv.beer</a>
        </div>
        <div class="col mb-4"><img class="mb-2" src="/static/img/mcdowell.jpeg" alt=""><br>Drew McDowell<br><a href="mailto:mcd@hsv.beer">mcd@hsv.beer</a>
        </div>
      </div>
      <p class="text-center"><a class="btn btn-primary" href="https://twitter.com/hsvdotbeer" target="_blank">@hsvdotbeer</a></p>
      <hr class="my-5">
      <p class="text-muted">HSV.beer is meant as a reference only and is not responsible for innaccurate information.</p>
      <p class="text-muted">Please drink responsibly.  Don't forget Lyft and Uber are available in Huntsville. :)
      </p>
    </div>
  </main>

  <footer>
    <div class="container-fluid">
      <ul class="list-inline">
        <li><router-link to="about">About</router-link></li>
      <li><a href="https://twitter.com/hsvdotbeer" target="_blank">Contact</a></li>
      </ul>
    </div>
  </footer>
</div>
</template>

<script>
export default {
  name: 'about',
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
  },
};
</script>

<style>
html, body {
  font-size:14px;
  font-family:'Montserrat', sans-serif;
  font-weight:400;
  line-height:1.75;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color:#31302c;
}

body {
  background-color:#f5bd00;
  background: linear-gradient(to right, #fcad0e 0%,#febf01 30%,#febf01 70%,#fcad0e 100%);
}

img {
  max-width:100%;
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

h1, h2, h3, h4, h5, .h1, .h2, .h3, .h4, .h5 {
  padding-top:.75em;
  padding-bottom:.125em;
}

h2:first-child, h3:first-child, h4:first-child, h5:first-child {
  padding-top:0;
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

.btn.btn-primary {
  color:906500;
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

.list-inline>li:first-of-type {
  padding-left:0;
}

.list-inline>li:not(:last-of-type){
  border-right:.5px solid #31302c
}

.btn.btn-raised.btn-primary {
  background-color:#f5bd00;
  color:#31302c;
}

.btn.btn-raised.btn-primary:hover, .btn.btn-raised.btn-primary:focus {
  background-color:#ffd34f;
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

.founders img {
  max-width:200px;
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

.sort:hover .sort-options {
  display:block;
}

.main-divider {
  margin:.5rem 0 0;
}

.beer-details {
  display:flex;
  padding:1rem;
}

.beer-details a {
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

@media (min-width: 375px) {
  .search, .search::placeholder, select#taphouseSelect {
    font-size:1.25rem;
  }
}

@media (min-width: 420px) {
  html, body {
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
  .beer-details-container {
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
}

</style>
