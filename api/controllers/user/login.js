const querystring = require('querystring');

module.exports = {

  friendlyName: 'Login',

  description: 'Login user by redirecting to Spotify Auth. server, initiating OAuth 2.0 auth. code grant flow.',

  exits: {
    redirectToSpotifyAuth: {
      description: 'Redirect to Spotify Auth. server',
      responseType: 'redirect'
    }

  },

  fn: async function (input, exits) {
    const queryParams = querystring.stringify({
      'client_id': sails.config.custom.spotifyClientId,
      'response_type': 'code', // oauth 2.0 authorization code grant flow
      'redirect_uri': sails.config.custom.spotifyRedirectUri,
      'scope': 'user-read-private user-read-email',
      'show_diaglog': true,
    });
    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${queryParams}`;
    // All done.
    return exits.redirectToSpotifyAuth(spotifyAuthUrl);

  }

};
