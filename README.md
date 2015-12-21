# h_autocomplete
Contextual autocomplete example

1. For a quick and dirty solution with JQuery see quick.index.html

2. For a more testable and integratable solution with angular, see index.html

This still uses JQuery but it compartmentalizes it inside an angular
directive so that the damage to testing/integration with other angular modules
is not too bad.

However, because the components inside the autocomplete function are still in 
JQuery, those can't be easily unit-tested. So I instead do DOM-testing for the 
directive as a whole.  This is not ideal, but it gets some testing done without 
having to refactor the JQuery plugin into testable objects.  We can discuss
the pros and cons of this approach.

The UI approach uses two types of autcomplete, one when the user types '@',
and one when they don't.  The motivation is to minimize the intrusiveness of
popups by encouraging the user to type '@' to initiate autocomplete, but
also to help the learning curve by letting the user see autocomplete without 
having to do this.  If they don't type the '@' they have to type the entire 
first-name or username before autocomplete appears.  

Installation:

git clone https://github.com/msales75/h_autocomplete.git

cd h_autocomplete

### install all dependencies for preexisting webserver
npm install

### Run karma tests to webserver at http://localhost:9876
npm test

### Load app to webserver at http://localhost:8000
npm start


For a preinstalled demo, see:

http://stormweaver.com/h_autocomplete/

