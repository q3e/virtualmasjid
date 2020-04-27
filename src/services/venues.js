import Api from '@/services/api';

function mapSort(sort, invert) {
  let ordering = 'name';

  if (sort === 'name') {
    ordering = 'name';
  } else if (sort === 'brewer') {
    ordering = 'manufacturer__name';
  } else if (sort === 'style') {
    ordering = 'style__name';
  } else if (sort === 'abv') {
    ordering = 'abv';
  } else {
    ordering = 'name';
  }

  if (invert) {
    ordering = `-${ordering}`;
  }
  return ordering;
}

export function getBeers(sort, invert) {
  return Api().get('/beers/', {
    params: {
      on_tap: true,
      o: mapSort(sort, invert),
    },
  });
}

export function searchBeers(query) {
  return Api().get('/beers/', {
    params: {
      on_tap: true,
      search: query,
    },
  });
}

export function getVenues() {
  return Api().get('/venues/');
}

export function getVenueBeers(venueId, sort, invert) {
  return Api().get(`/venues/${venueId}/beers/`, {
    params: {
      o: mapSort(sort, invert),
    },
  },
  );
}
