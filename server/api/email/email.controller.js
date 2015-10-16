(function () {

  'use strict';
  var sendgrid  = require('sendgrid')('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');

  function handleError(res, err) {
    console.log(err);
    return res.status(500).send(err);
  }

  /**
   * Forwards and email.
   *
   * @param req
   * @param res
   */
  exports.forwardMail = function forwardMail(req, res) {
    console.log('in addToCupboard \nreq.params', req.params, '\nreq._params', req._params, '\nreq.body: ', req.body);
    var email = req.body.email;
    var cc = "";
    console.log('ccing', email.cc_self);
    if(email.cc_self){
      cc = email.email;
    }
    console.log('cc', cc);
    var mailOptions = {
      from: email.email,
      to: 'james.m.sherry@gmail.com',
      cc: cc,
      subject: email.subject,
      text: email.body
    };

    sendgrid.send(mailOptions, function(err, json) {
      if (err) { return handleError(res, err); }
      console.log('Mail sent: ', json);
      return res.status(200).send(json);
    });
  };

}());
