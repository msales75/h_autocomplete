# h_autocomplete
Contextual autocomplete example

1. For a quick and dirty solution with JQuery see quick.index.html

2. For a more testable and integratable solution with angular, see index.html

This still uses JQuery but it compartmentalizes it inside an angular
directive so that the damage to testing/integration with other angular modules
is not too bad.

Because the components inside the autocomplete function are still in JQuery,
it can't be easily unit-tested, so I instead do DOM-testing for the directive
as a whole.  This is not ideal, but it gets some testing done without having
to refactor the JQuery plugin into testable objects.

Installation:
git clone https://github.com/msales75/h_autocomplete.git
cd h_autocomplete

# install all dependencies for preexisting webserver
npm install

# Run karma tests to webserver at http://localhost:9876
npm test

# Load app to webserver at http://localhost:8000
npm start


For a preinstalled demo, see:
http://stormweaver.com/h_autocomplete/
