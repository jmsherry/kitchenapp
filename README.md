# Kitchenapp

[![Generated with](https://img.shields.io/badge/generated%20with-bangular-blue.svg?style=flat-square)](https://github.com/42Zavattas/generator-bangular)
[ ![Codeship Status for jmsherry/kitchenapp](https://codeship.com/projects/2eabc9b0-2ace-0133-8c51-622b866f1c07/status?branch=master)](https://codeship.com/projects/98338)
[![Codacy Badge](https://www.codacy.com/project/badge/01f2c1ccfd1147f8a7e449c8de41a712)](https://www.codacy.com/app/james-m-sherry/kitchenapp)
[![Dependency Status](https://david-dm.org/jmsherry/kitchenapp.svg?style=flat)](https://david-dm.org/jmsherry/kitchenapp)
[![devDependency Status](https://david-dm.org/jmsherry/kitchenapp/dev-status.svg)](https://david-dm.org/jmsherry/kitchenapp#info=devDependencies)



Kitchenapp is a MEAN (Mongodb [with Mongoose ODM], Express js, Angular and Node) stack demo created using the bangular yeoman template.

Use `gulp` to run in development and `gulp preview` to run the optimised project. (NB: You will need mongodb running locally if you are running this project locally. If you get the error: ECONNREFUSED, it's likely that you've omitted to start mongo. So, [Install it](http://docs.mongodb.org/master/installation/), then open a shell window and type `mongod` into the command line. Open a second tab to run the project as above...)

`gulp test` will allow you to run the tests (which are currently locked to a limited set for demo purposes) and you can specify whether to test the client or server-side code by adding the flag `--server` or `--client`. `gulp e2e` will perform protractor tests. As you can see from the badges the project uses CI service at Codeship (Travis is hooked up for practice) Coverage (istanbul) is used through gulp and reported via Code Climate.

To populate the database with some initial ingredients and recipes type `$ seed` (N.B. it will blow away all the data in your current collections).

## Disclaimer
The app in this repository is a demo, as stated above, and it is worth mentioning that the information is fictional and the images are not my own and I hold no rights to them.
