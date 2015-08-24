# Kitchenapp [![Generated with](https://img.shields.io/badge/generated%20with-bangular-blue.svg?style=flat-square)](https://github.com/42Zavattas/generator-bangular)

[ ![Codeship Status for jmsherry/kitchenapp](https://codeship.com/projects/2eabc9b0-2ace-0133-8c51-622b866f1c07/status?branch=master)](https://codeship.com/projects/98338)

Kitchenapp is a MEAN (Mongodb [with Mongoose ODM], Express js, Angular and Node) stack demo created using the bangular yeoman template.

Use `gulp` to run in development and `gulp preview` to run the optimised project. `gulp test` will allow you to run the tests (which are currently locked to a limited set for demo purposes) and you can specify whether to test the client or server-side code by adding the flag `--server` or `--client`. `gulp e2e` will perform protractor tests. All tests are set to one suite for demo purposes.

To populate the database with some initial ingredients and recipes type ```$ seed``` (N.B. it will blow away all the data in your current collections)
