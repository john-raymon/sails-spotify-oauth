var request = require('request');

module.exports = {

  friendlyName: 'Create',

  description: 'Spotify OAuth 2.0 authorization success/failure redirect, if successful find or create User and start session',

  inputs: {
    error: {
      type: 'string',
    },
    code: {
      type: 'string',
    }
  },

  exits: {
    spotifyError: {
      responseType: 'view',
      viewTemplatePath: 'pages/homepage'
    },
    redirectAfterLogin: {
      description: 'Redirect atfter login',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits) {
    if (inputs.error) {
      return exits.spotifyError({ error: 'Sorry, we weren\'t able to log you into your Spotify account.' });
    } else {
      // make request to authorization server to exchange auth. code for tokens
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          'grant_type': 'authorization_code',
          'code': inputs.code,
          'redirect_uri': sails.config.custom.spotifyRedirectUri,
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer(sails.config.custom.spotifyClientId + ':' + sails.config.custom.spotifyClientSecret).toString('base64'))
        },
        json: true
      };
      request.post(authOptions, (err, res, body) => {
        if (err) {
          return exits.spotifyError({ error: 'Sorry, we weren\'t able to log you into your Spotify account.' });
        }
        if (res.statusCode === 200) {
          const { access_token:accessToken, refresh_token:refreshToken } = body;
          var meSpotifyRequestOptions = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + accessToken },
            json: true
          };
          request.get(meSpotifyRequestOptions, (err, response, body) => {
            if (err) {
              return exits.spotifyError({ error: 'Sorry, we weren\'t  able to log you into your Spotify account.'})
            }
            // attempt to find or create user using Spotify unique user id
            User.findOrCreate({ spotifyUserId: body.id },
            {
              spotifyUserId: body.id,
              spotifyUserExternalUrl: body.external_urls && body.external_urls.spotify,
              spotifyAccessToken: accessToken,
              spotifyRefreshToken: refreshToken,
              spotifyImageUrl: body.images && body.images.length ? body.images[0].url : '',
            })
            .exec(async(err, user, wasCreated)=> {
              if (err) { return res.spotifyError({ error: 'Sorry, we\'re having trouble' }); }

              if(wasCreated) {
                return exits.redirectAfterLogin('/?new-user');
              } else {
                return exits.redirectAfterLogin('/?existing-user');
              }
            });
          });
        }
      });
    }
  }


};
