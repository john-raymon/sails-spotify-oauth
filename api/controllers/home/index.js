module.exports = {


  friendlyName: 'Index',


  description: 'Index home.',

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'pages/beta-landing-page',
    }
  },


  fn: async function (_, exits) {

    // All done.
    return exits.success();
  }


};
