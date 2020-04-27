module.exports = {


  friendlyName: 'Login',


  description: 'Login user by redirecting to Shopify Auth. Server, initiating OAuth 2.0 auth. code grant flow.',

  exits: {
    redirectToSpotifyAuth: {
      description: 'The requesting user is already logged in.',
      responseType: 'redirect'
    }

  },


  fn: async function () {

    // All done.
    throw { redirectToSpotifyAuth: '/login/shopify-redirect' };

  }


};
