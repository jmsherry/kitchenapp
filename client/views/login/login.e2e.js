(function(){

    'use strict';

    var LoginPage = require('./login.page.js');
    LoginPage = new LoginPage();

    describe('login route', function() {

    	var elements, usernameInput, passwordInput, submitButton;

        beforeEach(function() {
            browser.get('/login');
        });

        it('should have one username text input', function(done) {
            LoginPage.email.then(function(inputs) {
                expect(inputs.length).toBe(1);
                usernameInput = inputs[0];
                done();
            });
        });

        it('should have tone password input', function(done) {
            LoginPage.password.then(function(inputs) {
            	console.log(inputs);
                expect(inputs.length).toBe(1);
                passwordInput = inputs[0];
                done();
            });
        });

        it('should have a submit button', function(done) {
            LoginPage.submitButton.then(function(inputs) {
            	console.log(inputs);
                expect(inputs.length).toBe(1);
                submitButton = inputs[0];
                done();
            });
        });

        it('should log you in', function(done) {
        	browser.get('/login');
        	username.sendKeys('james.m.sherry@googlemail.com');
        	passwordInput.sendKeys('Lich1977');
        	expect(browser.getCurrentUrl()).toMatch('/');
        	done();
        });

        it('should return an error if user not known', function(done) {

        });

    });

}());
