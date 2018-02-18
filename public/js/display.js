// Hides articles div at first
$('#articles').hide();

// Grab articles on "Scrape" click
$('#scrape').on('click', () => {
  $('#articles').show();
  $.getJSON('/articles', data => {
    for (let i = 0; i < data.length; i++) {
      $('#articles').append(
        "<div class='newArticle'><p data-id='" +
          data[i]._id +
          "'><h3><a class='link' target='_blank' href='" +
          data[i].link +
          "'>" +
          data[i].title +
          "</a></h3><button type='button' id='favorite' data-id='" +
          data[i]._id +
          "' class='btn btn-default'>Add to Favorites</button></p></div>"
      );
    }
  });
});
$('#articles').on('click', '#addNote', function() {
  console.log('Clicked!');
});

// When p tag is clicked
$(this).on('click', () => {
  $('#notes').empty();
  let thisID = $(this).attr('data-id');

  // AJAX call
  $.ajax({
    method: 'GET',
    url: '/articles/' + thisID,
  }).done(data => {
    console.log(data);
    $('#notes').append('<h2>' + data.title + '</h2>');
    $('#notes').append("<input id='titleinput' name='title' >");
    $('#notes').append("<textarea id='bodyinput' name='body'></textarea>");
    $('#notes').append(
      "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
    );

    // Checks for a note
    if (data.note) {
      $('#titleinput').val(data.note.title);
      $('#bodyinput').val(data.note.body);
    }
  });
});

// When clicking Save button
$(document).on('click', '#savenote', () => {
  let thisID = $(this).attr('data-id');
  $.ajax({
    method: 'POST',
    url: '/articles/' + thisID,
    data: {
      title: $('#titleinput').val(),
      body: $('#bodyinput').val(),
    },
  }).done(data => {
    console.log(data);
    $('#notes').empty();
  });
  $('#titleinput').val('');
  $('#bodyinput').val('');
});
