# UpWheel Demo
UpWheel is a used car search engine designed implementing the Market Check API. This version of UpWheel uses the API mocked using postman with several features altered or disabled. A demonstration of the application can be viewed at youtube.com/linktovideoihaventmadeyet.

# Using The App
# Initial Setup
Download the app and open a command line at the root folder of the app.  
1. Run the following command to install npm packages:  
-  npm install  
2. Run the following command to start the server:  
-  node index.js
3. The app can now be accessed through the browser at: 
-  http://localhost:8080/  

# Searching
- Launching the app will land you at the search screen.  
- The "make" search option is a dropdown populated dynamically with makes of vehicles currently available on the Market Check API, the demo app provides this same list but only the first 6 options [Ford, Chevrolet, Toyota, Nissan, Honda, Jeep] active.  
- After a "make" is selected the "models" dropdown will activate and populate with models of the select make that are currently available on the Market Check API, the demo app provides this same functionality but with only the first 3 options of the dropdown list active. [{F-150, Escape, Explorer},{Silverado 1500, Equinox, Traverse},{Camry, RAV4, Corolla},{CR-V, Accord, Civic},{Rogue, Altima, Sentra},{Grand Cherokee, Cherokee, Wrangler Unlimited}]  
- The rest of the search bar has been disabled for the demo version of the app, though selections can still be made. The "enter a location" option is linked to the Google Maps API and will auto-complete your location, this has no affect on the search in the demo.  

# Results
- After clicking "search" you will be taken to the "results" screen, this screen will show a selection of vehicles matching the make and model selected in the search. These results are from a saved response from the Market Check API matching the same criteria and saved to Postman.  
- These vehicles can be selected and will link to a details page. In the demo version of the app the detail screen is populated with a vehicle that matches the make of the vehicle only, not the model.  
- Additionally, the details screen shows a selection "similar vehicles" to the selected vehicle. These similar vehicles also link to their own details view. 
