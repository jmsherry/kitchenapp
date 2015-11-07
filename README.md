# Kitchenapp

[![Generated with](https://img.shields.io/badge/generated%20with-bangular-blue.svg?style=flat-square)](https://github.com/42Zavattas/generator-bangular)

[ ![Codeship Status for jmsherry/kitchenapp](https://codeship.com/projects/2eabc9b0-2ace-0133-8c51-622b866f1c07/status?branch=master)](https://codeship.com/projects/98338)
[![Codacy Badge](https://www.codacy.com/project/badge/01f2c1ccfd1147f8a7e449c8de41a712)](https://www.codacy.com/app/james-m-sherry/kitchenapp)
[![Dependency Status](https://david-dm.org/jmsherry/kitchenapp.svg?style=flat)](https://david-dm.org/jmsherry/kitchenapp)
[![devDependency Status](https://david-dm.org/jmsherry/kitchenapp/dev-status.svg)](https://david-dm.org/jmsherry/kitchenapp#info=devDependencies)

## App description
Kitchenapp is a MEAN (Mongodb [with Mongoose ODM], Expressjs, Angular and Node) stack demo created using the [bangular yeoman template](https://github.com/42Zavattas/generator-bangular).

## Getting started
1. In your console, run `git clone git@github.com:jmsherry/kitchenapp.git`
2. Run `npm install`
3. Use `gulp` to run in development and `gulp preview` to run the optimised project. (NB: You will need mongodb running locally if you are running this project locally. If you get the error: ECONNREFUSED, it's likely that you've omitted to start mongo. So, [Install it](http://docs.mongodb.org/master/installation/), then open a shell window and type `mongod` into the command line. Open a second tab to run the project as above...)

4. [optional] `gulp test` will allow you to run the tests (which are currently locked to a limited set for demo purposes) and you can specify whether to test the client or server-side code by adding the flag `--server` or `--client`. `gulp e2e` will perform protractor tests. As you can see from the badges the project uses CI service at Codeship (Travis is hooked up for practice) Coverage (istanbul) is used through gulp and reported via Code Climate.

5. [optional] To populate the database with some initial ingredients and recipes type `$ npm install -g node-mongo-seeds && seed` (N.B. it will blow away all the data in your current collections).

**The app is a demo and will have bugs and breaks as it was worked up from experiments. The bugs you may spot are likely known about - please check the [issues log](https://github.com/jmsherry/kitchenapp/issues) for more detail. (And hey, if you spot something then submit a bug report!)**

## Internationalisation and localisation
There are controls to enable you to pick your preferred language and your current locale, in the footer bar (under settings). Changing these *should* change time/currency, etc. in various parts of the app, but the language will only change in the first content column on the homepage.

## Live demo - [HERE](https://kitchenapp2.herokuapp.com/)
 The app is viewable live on heroku. (Please be aware the A/B testing is live on the site and that's why it may have a red heading on the first page. You can confirm this by clearing your cookies and storages, and reloading a few times).

### Live Testing
Various types of testing have been used on the live app, including:

* Load testing with [Loader.io](https://loader.io/)
* Server performance testing with [newrelic](http://newrelic.com/)
* Browser performance testing with [newrelic browser](http://newrelic.com/browser-monitoring)
* Geo performance testing with [newrelic synthetics](http://newrelic.com/synthetics)
* A/B testing using [Optimizely](https://app.optimizely.com)

## Documentation
Apidoc and Sassdoc are employed within the project. To get the current copy of the docs run `gulp apidoc sassdoc` and open the `index.html` files in `docs/sass` and `docs/api`.

## Disclaimer
The app in this repository is a demo, as stated above, and it is worth mentioning that the information is fictional and the images are not my own and I hold no rights to them.
