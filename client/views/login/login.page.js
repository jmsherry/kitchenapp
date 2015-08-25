(function(){
		"use strict";

		module.exports = function(){
			this.email = element.all(by.id('email'));
			this.password = element.all(by.id('password'));
			this.submitButton = element.all(by.css('button[type=submit]'));
		};
}());
