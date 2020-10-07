let first = true;
let loaded = false;
let device_id;
let weather_data;
let player;

let loadSteps = {
  shuffled: false,
  skipped: false,
  paused: false,
  volumeUp: false
}

// Get the hash of the url
const hash = window.location.hash
.substring(1)
.split('&')
.reduce(function (initial, item) {
  if (item) {
    var parts = item.split('=');
    initial[parts[0]] = decodeURIComponent(parts[1]);
  }
  return initial;
}, {});
window.location.hash = '';

// Set token
let token = hash.access_token;

const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientID = spotify_id;
const redirectURI = redirect_uri;
const scopes = [
  'streaming',
  'user-read-private',
  'user-modify-playback-state'
];



if (!token) {
  window.location = `${authEndpoint}?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
}


window.onSpotifyWebPlaybackSDKReady = () => {
  this.player = new Spotify.Player({
    name: 'Thunder',
    getOAuthToken: cb => { cb(token); },
    volume: 0
  });

  // Error handling
  this.player.addListener('initialization_error', ({ message }) => { console.error(message); });
  this.player.addListener('authentication_error', ({ message }) => { console.error(message); });
  this.player.addListener('account_error', ({ message }) => { console.error(message); });
  this.player.addListener('playback_error', ({ message }) => { console.error(message); });

  // Playback status updates
  this.player.addListener('player_state_changed', state => {
    console.log(state);

    if(loaded == false) {
      stateChangeHandler();
    }

    updateTrackPhoto(state, playlist);
  });

  // Ready
  this.player.addListener('ready', data => {
    console.log('Ready with Device ID', data.device_id);
    this.device_id = data.device_id;

    setup().then(() => {
      console.log("Playlist set");
    });
  });

  // Not Ready
  this.player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
  });

  // Connect to the player!
  this.player.connect();
};

function toggle() {
  if(loaded) {
    if(first) {
      this.player.togglePlay().then(() => {
        console.log('Toggled playback!');
        startAnimation();
        updateIcon();
        first = false;
      });
    } else {
      this.player.togglePlay().then(() => {
        console.log('Toggled playback!');
        updateIcon();
      });
    } 
  } else {
    console.log('Player not ready. Please wait.');
  }
}

function setup() {
  return new Promise((res, req) => {
    getWeather().then((data) => {
      console.log("Weather data parsed");
      weather_data = data;
  
      getPlaylist(data).then((uri) => {
        console.log("Playlist uri loaded: ", uri);
        
        play(uri).then(() => {
          console.log("Added context uri");
          
          res();
        });
      });
    });
  });
}

// Play a specified track on the Web Playback SDK's device Id
function play(uri) {
  return new Promise((res, req) => {
    $.ajax({
      url: "https://api.spotify.com/v1/me/player/play?device_id=" + this.device_id,
      type: "PUT",
      data: '{"context_uri": "'+uri+'"}',
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token );},
      success: function(data) { 
        res();
      }
    });
  });
}

function pause() {
  return new Promise((res, req) => {
    $.ajax({
      url: "https://api.spotify.com/v1/me/player/pause?device_id="+this.device_id,
      type: "PUT",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token );},
      success: function(data) { 
        res();
      }
    });
  });
} 

function shuffle() {
  return new Promise((res, req) => {
    $.ajax({
      url: "https://api.spotify.com/v1/me/player/shuffle?state=true&device_id="+this.device_id,
      type: "PUT",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token );},
      success: function(data) { 
        res();
      }
    });
  });
}

function getPlaylist(data) {
  return new Promise((res, req) => {
    let url_string = "https://api.spotify.com/v1/search?q="+data.weather+"%20"+data.time+"&type=playlist"

    $.ajax({
      url: url_string,
      type: "GET",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token );},
      success: function(data) { 
        console.log(data)

        playlist = data.playlists.items[0]
        res(playlist.uri);
      }
    });
  })
}

function previous() {
  this.player.previousTrack().then(() => {
    console.log('Set to previous track');
  });
}

function skip() {
  return new Promise((res, req) => {
    this.player.nextTrack().then(() => {
      console.log('Set to next track');

      res();
    });
  })
}

function stateChangeHandler() {
  if(!loadSteps.shuffled) {
    shuffle().then(() => {
      console.log("Shuffled");
      loadSteps.shuffled = true;
    })
  } else if(!loadSteps.skipped) {
    skip().then(() => {
      console.log("Skipped for shuffle");
      loadSteps.skipped = true;
    })
  } else if(!loadSteps.paused) {
    pause().then(() => {
      console.log("Paused");
      loadSteps.paused = true;
    })
  } else if(!loadSteps.volumeUp) {
    this.player.setVolume(1).then(() => {
      console.log("Volume set to 1, ready to play");
      loadSteps.volumeUp = true;
    })
  } else {
    playButtonFade();
    loaded = true;
  }
}