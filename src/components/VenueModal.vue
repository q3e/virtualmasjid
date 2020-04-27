<template>
<div class="venue-modal">
  <template v-if="venue">
    <div class="modal modal-venue fade" id="venueModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">

          <section class="venue">
            <div class="venue-logo-title">
              <img class="venue-logo" :src="venue.logo_url" alt="">
              <h1 class="venue-title">{{ venue.name }}</h1>
            </div>
            <div class="venue-info">
              <address class="venue-address">{{ venue.address }}<br>
                {{ venue.city }} {{ venue.state }} {{ venue.postal_code }}<br>
                <a class="venue-gmap" :href="`https://maps.google.com/?q=${venue.address}, ${venue.city}, ${venue.state}, ${venue.postal_code}`" target="_blank">View on Map</a>
              </address>
              <div class="venue-contact">
                <a v-if="venue.website" class="venue-website" :href="venue.website" target="_blank">{{ venue.website }}</a>
                <a v-if="venue.email" class="venue-email" :href="`mailto:${venue.email}`">{{ venue.email }}</a>
                <a v-if="venue.phone_number" class="venue-phone" :href="`tel:${venue.phone_number}`">{{ venue.phone_number }}</a>
              </div>
              <div class="venue-social">
                <a v-if="venue.untappd_url" 
                   class="btn venue-untappd" 
                   :href="venue.untappd_url"
                   target="_blank">
                  <img src="/static/svg/untappd.svg"><span>Untappd</span>
                </a>
                <a v-if="venue.facebook_page" 
                   class="btn venue-facebook" 
                   :href="venue.facebook_page"
                   target="_blank">
                  <img src="/static/svg/facebook.svg"><span>Facebook</span>
                </a>
                <a v-if="venue.instagram_handle" 
                   class="btn venue-instagram" 
                   :href="`https://instagram.com/${venue.instagram_handle}`"
                   target="_blank">
                  <img src="/static/svg/instagram.svg"><span>Instagram</span>
                </a>
                <a v-if="venue.twitter_handle" 
                   class="btn venue-twitter" 
                   :href="`https://twitter.com/${venue.twitter_handle}`"
                   target="_blank">
                   <img src="/static/svg/twitter.svg"><span>Twitter</span>
                </a>
              </div>
            </div>
          </section>
          </div>
        </div>
      </div>
    </div>
  </template>
  <template v-else-if="venue === false">
  </template>
</div>
</template>

<script>
export default {
  name: 'venue-modal',
  props: ['venue'],
};
</script>