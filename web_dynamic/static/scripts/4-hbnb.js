const amenities = {};
// Block of code runs after the HTML document has been fully loaded.
$(document).ready(function () {
  // Handle the filters (Amenities) section interaction
  $('input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      addItem($(this));
    } else {
      removeItem($(this));
    }
  });

  // Search button click
  $('button').click(function () {
    placesSearch();
  });
});

// Add Amenity to amenities dictionary
function addItem (checkbox) {
  const dataId = checkbox.attr('data-id');
  const dataName = checkbox.attr('data-name');
  amenities[dataId] = dataName;

  displayFilters();
}

// Remove Amenity from amenities dictionary
function removeItem (checkbox) {
  const id = checkbox.attr('data-id');
  delete amenities[id];

  displayFilters();
}

// Display the list of amenities in the filter section
function displayFilters () {
  const amenitiesNames = Object.values(amenities);
  if (amenitiesNames.length !== 0) {
    $('.amenities h4').text(amenitiesNames.join(', '));
  } else {
    $('.amenities h4').html('&nbsp;');
  }
}

// Check HBNB API status and display the list of places
$.get('http://0.0.0.0:5001/api/v1/status/', function (response) {
  if (response.status === 'OK') {
    $('div#api_status').addClass('available');
    placesSearch();
  } else {
    $('div#api_status').removeClass('available');
  }
});

// Search for places
function placesSearch () {
  $('.places').empty();
  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    contentType: 'application/json',
    data: JSON.stringify({ amenities: Object.keys(amenities) }),
    success: function (response) {
      response.forEach(function (place) {
        // Create <article> element for place
        const placeArticle = $('<article place-id=' + place.id + '>');
        // Create <div> element for place title and price by night
        const placeTitle = $('<div class="title_box">');
        placeTitle.append('<h2>' + place.name + '</h2>');
        placeTitle.append('<div class="price_by_night">' + place.price_by_night + '</div>');
        placeArticle.append(placeTitle);
        // Create <div> element for place informations
        const placeInfo = $('<div class="information">');
        placeInfo.append('<div class="max_guest">' + place.max_guest + ' Guests</div>');
        placeInfo.append('<div class="number_rooms">' + place.number_rooms + ' Bedrooms</div>');
        placeInfo.append('<div class="number_bathrooms">' + place.number_bathrooms + ' Bathrooms</div>');
        placeArticle.append(placeInfo);
        // Create <div> for place Owner
        const placeOwner = $('<div class="owner">');
        placeOwner.append('<h3> Owner: </h3>');
        placeArticle.append(placeOwner);
        // Create <div> element for place description
        placeArticle.append('<div class="description">' + place.description + '</div>');

        $.get('http://0.0.0.0:5001/api/v1/users/' + place.user_id, function (response) {
          const parag = $('<p>' + response.first_name + ' ' + response.last_name + '</p>');
          placeOwner.append(parag);
        });
        // Append <article> place to <div> places
        $('.places').append(placeArticle);
      });
    }
  });
}
