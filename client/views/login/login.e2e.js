(function(){

    'use strict';

    var LoginPage = require('./login.page.js');

    describe('login route', function() {

    	var elements, usernameInput, passwordInput, submitButton;

        beforeEach(function() {
            browser.get('/login');
            element(by.Id('username')).then(function(els){
            	console.log(els.length);
            });
        });

        it('should have one username text input', function(done) {
            element.all(by.id('email')).then(function(inputs) {
                expect(inputs.length).toBe(1);
                usernameInput = inputs[0];
                done();
            });
        });

        it('should have tone password input', function(done) {
            element.all(by.css('input[type=password]')).then(function(inputs) {
            	console.log(inputs);
                expect(inputs.length).toBe(1);
                passwordInput = inputs[0];
                done();
            });
        });

        it('should have a submit button', function(done) {
            element.all(by.css('button[type=submit]')).then(function(inputs) {
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