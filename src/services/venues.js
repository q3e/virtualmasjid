import Api from '@/services/api';

function mapSort(sort, invert) {
  let ordering = 'title';

  if (sort === 'title') {
    ordering = 'title';
  } else if (sort === 'speaker') {
    ordering = 'speaker';
  } else if (sort === 'language') {
    ordering = 'language';
  } else {
    ordering = 'title';
  }

  if (invert) {
    ordering = `-${ordering}`;
  }
  return ordering;
}

export function getEvents(sort, invert) {
  return Api().get('/events/', {
    params: {
      on_event: true,
      o: mapSort(sort, invert),
    },
  });
}

export function searchEvents(query) {
  return Api().get('/events/', {
    params: {
      on_event: true,
      search: query,
    },
  });
}

export function getVenues() {
  return Api().get('/venues/');
}

export function getVenueEvents(venueId, sort, invert) {
  return Api().get(`/venues/${venueId}/events/`, {
    params: {
      o: mapSort(sort, invert),
    },
  },
  );
}
