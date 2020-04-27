module.exports = {

  friendlyName: 'Create',

  description: 'Do something after Spotify OAuth 2.0 authorization success/failure redirect',

  exits: {

  },

  fn: async function () {

    // All done.
    return sails.config.custom;

  }


};
