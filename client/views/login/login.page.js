module.exports = function(){
	this.username = element.all(by.id('username'));
	this.password = element.all(by.css('password'));
	this.submitButton = element.all(bycss('button[type=submit]'));
};
