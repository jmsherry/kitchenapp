(function () {

  'use strict';
  var nodemailer = require('nodemailer');
  var wellknown = require('nodemailer-wellknown');

  function handleError(res, err) {
    console.log(err);
    return res.sendStatus(500).send(err);
  }

  /**
   * Forwards and email.
   *
   * @param req
   * @param res
   */
  exports.forwardMail = function forwardMail(req, res) {
    console.log('in addToCupboard \nreq.params', req.params, '\nreq._params', req._params, '\nreq.body: ', req.body);
    // create reusable transporter object using SMTP transport
    var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'mytime.email@gmail.com',
        pass: 'Tori1977'
      }
    });

    var email = req.body.email;
    var mailOptions = {
      from: email.cc,
      to: 'james.m.sherry@gmail.com',
      subject: email.subject,
      text: email.message
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return handleError(res, error);
      }
      console.log('Message sent: ' + info.response);
      res.send(200);
    });
  };

}());
