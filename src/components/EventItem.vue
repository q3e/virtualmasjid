<template>
<li class="event" v-bind:class="{ active: visible }">
  <template v-if="event">
    <div class="event-intro">
      <div class="event-logo"><img :src="event.logo_url ? event.logo_url : '/static/img/logonotfound.png'"></div>
      <div class="event-info">
        <a class="event-link" @click="visible = !visible;">
          <h2 class="event-name">{{ event.name }}</h2>
          <div class="event-speaker" v-if="event.frequency == 'None'">{{ event.startDate }} at {{ event.eventTime}}</div>
          <div class="event-speaker" v-else>{{ event.frequency }} from {{ event.eventTime}}</div>
        </a>
        <div class="event-speaker">{{ event.speaker }}</div>
        <div class="event-style srm" v-if="event.is_live == true" v-bind:style="'--background-color':'#FF0000'">Live</div>
        <div class="event-style srm" v-else v-bind:style="'--background-color':'#FFFF00'">Recorded</div>
        <div class="event-style srm">{{ event.language }}</div>
      </div>
    </div>
    <b-collapse class="event-details-container" id="eventDetails" v-model="visible">
      <div class="event-details">
        <div class="find-it">
          <h3 class="find-it-header">Find the event here:</h3>
          <ul class="find-it-list">
            <a target="_blank" :href="event.stream_link">{{ event.stream_medium }}</a></li>
          </ul>
        </div>
      </div>
    </b-collapse>
  </template>
  <template v-else-if="event === false">
  </template>
</li>
</template>

<script>
export default {
  name: 'event-item',
  props: ['event'],
  data() {
    return {
      visible: false,
    };
  },
};
</script>