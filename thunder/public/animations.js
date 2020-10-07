function startAnimation() {
  $("#buttons").toggleClass("move");

  setTimeout(function() {
    $("#buttons").removeClass("start");
    $("#buttons").toggleClass('move');

    $("#spotify-viewer").css("display", "block");
    $("#current-track").toggleClass("fade");

    $("i.material-icons.prev-skip-buttons").css("display", "block");
    $("i.material-icons.prev-skip-buttons").toggleClass("fade");

    $("#sentence-holder").css("display", "flex");
    $("#sentence-holder").toggleClass("fade");

  }, 2000);
}

function windowLoad() {
  $("#buttons").addClass("start");
}

function playButtonFade() {
  $("#play-button").addClass("fade");
}

function updateTrackPhoto(state, playlist) {
  let track = state.track_window.current_track;

  $('#current-track').attr('src', track.album.images[0].url);
  $('#current-track-name').text(track.name);
  $('#current-track-artist').text(track.artists[0].name);
  $('#sentence').text("Playing " + track.name + " from  ");
  $('#link').text(playlist.name);
  $('#link').attr("href", playlist.external_urls.spotify);  
  $('#spotify-icon').css("display", "block");
}

function updateIcon() {
  $('#play-button').html((index, currentcontent) => {
    if(currentcontent == "play_arrow") {
      $('#play-button').html("pause");
      $('#spotify-viewer').css("animation-play-state", "running");
    } else {
      $('#play-button').html("play_arrow");
      $('#spotify-viewer').css("animation-play-state", "paused");
    }
  });
}
