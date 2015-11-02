(function(){

    'use strict';
    //var require = require || function(){};
    var LoginPage = require('./login.page.js');
    LoginPage = new LoginPage();

    describe('login route', function() {

    	var emailInput, passwordInput, submitButton;

        beforeEach(function() {
          browser.driver.manage().window().setSize(1280, 1024);
            browser.get('/login');
        });

        it('should have one username text input', function(done) {
            LoginPage.email.then(function(inputs) {
                expect(inputs.length).toBe(1);
                emailInput = inputs[0];
                console.log('emailInput', emailInput);
                done();
            });
        });

        it('should have one password input', function(done) {
            LoginPage.password.then(function(inputs) {
                expect(inputs.length).toBe(1);
                passwordInput = inputs[0];
                done();
            });
        });

        it('should have a submit button', function(done) {
            LoginPage.submitButton.then(function(inputs) {
                expect(inputs.length).toBe(1);
                submitButton = inputs[0];
                done();
            });
        });

        it('should log you in', function(done) {
          browser.pause();
          LoginPage.email.then(function(em) {
            console.log('em', em);
            emailInput = em[0];
            LoginPage.password.then(function(pw) {
              console.log('pw', pw);
              passwordInput = pw[0];
              LoginPage.submitButton.then(function(sb) {
                console.log('sb', sb);
                submitButton = sb[0];
              	browser.get('/login');
              	emailInput.sendKeys('james.m.sherry@googlemail.com');
              	passwordInput.sendKeys('Lich1977');
                submitButton.click();
              	expect(browser.getCurrentUrl()).toMatch('/');
              	done();
              });
            });
          });
        });

        it('should return an error if user not known', function(done) {
          LoginPage.email.then(function(em) {
            emailInput = em[0];
            LoginPage.password.then(function(pw) {
              passwordInput = pw[0];
              LoginPage.submitButton.then(function(sb) {
                submitButton = sb[0];
                browser.get('/login');
              	emailInput.sendKeys('jamesd.m.sherry@googlemail.com');
              	passwordInput.sendKeys('Lich1977');
                submitButton.click();
              	expect(browser.getCurrentUrl()).toMatch('/login');
              	done();
              });
            });
          });
        });

    });

}());
