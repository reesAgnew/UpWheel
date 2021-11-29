const express = require('express'),
    app = express(),
    path = require('path'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    unirest = require("unirest"),
    fetch = require("node-fetch"),
    async = require("async");


//*******
// MODELS
//*******
const User = require('./models/user');


//***************** 
// CONNECT TO MONGO
//*****************
//                                          DB Name
// mongoose.connect('mongodb://localhost:27017/watchList', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log("MONGO CONNECTION OPEN!!!")
//     })
//     .catch(err => {
//         console.log("MONGO CONNECTION ERROR!!!!")
//         console.log(err)
//     })

//***********
// EXTENSIONS
//***********
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(__dirname + "/public"));


//************************************************************************************************************************************ */
// APP
//************************************************************************************************************************************ */

// var, let, const
// Search bar
//const getMakes = unirest.get("https://marketcheck-prod.apigee.net/v2/search/car/active?api_key=N61Qecy1U7j98D5QeDA6FfdcpWAbCf9A&rows=0&facets=make|0|60"),
const getMakes = unirest.get("https://853e35a2-260b-480b-9f47-f3b18f5189ed.mock.pstmn.io/v2/makes"),
    allMakes = [];
//**********
// Functions
//**********

// Populate search bar
getMakes.then((res) => {
    JSON.parse(res.raw_body).facets.make.forEach(i => {
        allMakes.push(i.item)
    });
})


//******
//Routes
//******

// Home Route (set to search page)
app.get('/', async (req, res) => {
    searchBar = {
        make: "undefined",
        model: "undefined",
        maxPrice: "undefined",
        location: "undefined",
        radius: "undefined",
        newUsed: "all",
        sellerType: "all"
    }
    res.render('index', { allMakes, searchBar })
})

// Search Route
app.get('/search', async (req, res) => {
    searchBar = {
        make: "undefined",
        model: "undefined",
        maxPrice: "undefined",
        location: "undefined",
        radius: "undefined",
        newUsed: "all",
        sellerType: "all"
    }
    res.render('index', { allMakes, searchBar })
})

// Favorites Route
app.get('/favorites', async (req, res) => {
    res.render('favorites')
})
// About Route
app.get('/about', async (req, res) => {
    res.render('about')
})
// Contact Route
app.get('/contact', async (req, res) => {
    res.render('contact')
})
//Price My Car Route
app.get('/price-my-car', async (req, res) => {
    res.render('price-my-car')
})
//Sign-in Route
app.get('/sign-in', async (req, res) => {
    res.render('sign-in')
})
// Contact Route
app.get('/account', async (req, res) => {
    res.render('account')
})



app.get('/search/results', async (req, resp) => {
    const make = req.query.makeDropDown,
        model = req.query.modelDropDown,
        maxPrice = req.query.maxPriceDropDown,
        location = req.query.locationTextField,
        //locationLat = req.query.cityLat,
        //locationLng = req.query.cityLng,
        searchRadius = req.query.radiusDropDown,
        newUsed = req.query.newUsedRadio,
        sellerType = req.query.sellerTypeRadio;

    searchBar = {
        make: "undefined",
        model: "undefined",
        maxPrice: "undefined",
        location: "undefined",
        radius: "undefined",
        newUsed: "all",
        sellerType: "all"
    }



    //  CHANGE COUTNRY=ALL TO A VARIABLE TO SPLIT USA AND CANADA******************************************************************************************************
    // let apiLink = "https://marketcheck-prod.apigee.net/v2/search/car/active?api_key=N61Qecy1U7j98D5QeDA6FfdcpWAbCf9A&country=all";
    let apiLink = "https://853e35a2-260b-480b-9f47-f3b18f5189ed.mock.pstmn.io";
    if (make != "make") {
        //apiLink += "&make=" + make;
        apiLink += "/make=" + make.toLowerCase();
        searchBar.make = make;
    }
    if (model != undefined) {
        //apiLink += "&model=" + model;
        apiLink += "/model=" + model.toLowerCase();
        searchBar.model = model;
    }
    if (maxPrice != "0") {
        // apiLink += "&price_range=0-" + maxPrice;
        searchBar.maxPrice = maxPrice;
    }
    if (location != undefined) {
        searchBar.location = location;
    }
    // if (locationLng != "") {
    //     apiLink += "&latitude=" + locationLat;
    // }
    // if (locationLat != "") {
    //     apiLink += "&longitude=" + locationLng;
    // }
    if (searchRadius != "0") {
        // apiLink += "&radius=" + searchRadius;
        searchBar.radius = searchRadius;
    }
    if (newUsed != "all") {
        // apiLink += "&car_type=" + newUsed;
        searchBar.newUsed = newUsed;
    }
    if (sellerType != "all") {
        // apiLink += "&dealer_type=" + sellerType;
        searchBar.sellerType = sellerType;
    }
    const search = unirest.get(apiLink)
    const searchResults = [];



    search.end(function (res) {
        console.log(apiLink)
        if (res.error) throw new Error(res.error);
        var data = JSON.parse(res.body);
        // console.log(data);
        let r = {};
        // res.body.listings.forEach(index => {
        data.listings.forEach(index => {
            try {
                r = {
                    id: index.id,
                    vin: index.vin,
                    dealerUrl: index.vdp_url,
                    photo: index.media.photo_links[0],
                    year: index.build.year.toString(),
                    make: index.build.make,
                    model: index.build.model,
                    price: index.price.toString(),
                    location: index.dealer.city + ", " + index.dealer.state
                }
                if (index.build.trim != undefined) {
                    r.trim = index.build.trim;
                } else {
                    r.trim = ""
                }
                if (index.miles != undefined) {
                    r.kilometers = Math.floor(index.miles * 1.60934).toString()
                } else {
                    r.kilometers = Math.floor(index.ref_miles * 1.60934).toString()
                }
            } catch (error) {
                return true;
            }
            searchResults.push(r);
        });
        resp.render(`results`, { searchResults, allMakes, searchBar })
    });
})

app.get("/users", paginatedResults(), (req, res) => {
    res.json(res.paginatedResults);
});

function paginatedResults() {
    return async (req, res, next) => {

        const page = parseInt(req.query.page);
        const limit = 30;
        const skipIndex = (page - 1) * limit;
        const results = {};

        try {
            results.results = await User.find()
                .sort({ _id: 1 })
                .limit(limit)
                .skip(skipIndex)
                .exec();
            res.paginatedResults = results;
            next();
        } catch (e) {
            res.status(500).json({ message: "Error Occured" });
        }
    };
}
// app.get('/search/results/:id', (req, resp) => {
app.get('/search/results/:make', (req, resp) => {
    var vinNumber = 0;
    var carMake = "";
    async.series({
        car: function (callback) {
            //unirest.get("https://marketcheck-prod.apigee.net/v2/listing/car/" + req.query.vehicleId + "?api_key=N61Qecy1U7j98D5QeDA6FfdcpWAbCf9A").then(function (res) {
            unirest.get("https://853e35a2-260b-480b-9f47-f3b18f5189ed.mock.pstmn.io/selection/" + req.query.vehicleMake.toLowerCase()).then(function (res) {
                if (res.error) throw new Error(res.error);
                var data = JSON.parse(res.body);
                //console.log(data)
                vinNumber = data.vin;
                carMake = data.build.make;
                // vehicle = {
                //     id: res.body.id,
                //     vin: res.body.vin,
                //     dealerUrl: res.body.vdp_url,
                //     year: res.body.build.year.toString(),
                //     make: res.body.build.make,
                //     model: res.body.build.model,
                //     trim: res.body.build.trim,
                //     price: res.body.price.toString(),
                //     source: res.body.source,
                //     sellerType: res.body.seller_type,
                //     newOrUsed: res.body.inventory_type,
                //     images: res.body.media.photo_links,
                //     location: res.body.dealer.city + ", " + res.body.dealer.state
                // }                
                vehicle = {
                    id: data.id,
                    vin: data.vin,
                    dealerUrl: data.vdp_url,
                    year: data.build.year.toString(),
                    make: data.build.make,
                    model: data.build.model,
                    trim: data.build.trim,
                    price: data.price.toString(),
                    source: data.source,
                    sellerType: data.seller_type,
                    newOrUsed: data.inventory_type,
                    images: data.media.photo_links,
                    location: data.dealer.city + ", " + data.dealer.state
                }
                try { vehicle.sellerComments = data.extra.seller_comments }
                catch { vehicle.sellerComments = "N/A" }
                if (vehicle.sellerComments == "") {
                    vehicle.sellerComments = "N/A"
                }
                if (data.miles != undefined) {
                    vehicle.kilometers = Math.floor(data.miles * 1.60934).toString()
                } else {
                    vehicle.kilometers = Math.floor(data.ref_miles * 1.60934).toString()
                }
                //************ */
                callback(null, vehicle);
            });
        },
        similarCars: function (callback) {
            //unirest.get("https://marketcheck-prod.apigee.net/v2/search/car/active?api_key=N61Qecy1U7j98D5QeDA6FfdcpWAbCf9A&car_type=used&vins=" + vinNumber + "&include_relevant_links=true").then(function (response) {
            unirest.get("https://853e35a2-260b-480b-9f47-f3b18f5189ed.mock.pstmn.io/similar/" + carMake).then(function (response) {
                let similarCars = [];
                
                var data = JSON.parse(response.raw_body)
                data.listings.forEach(index => {
                    try {
                        r = {
                            id: index.id,
                            vin: index.vin,
                            dealerUrl: index.vdp_url,
                            photo: index.media.photo_links[0],
                            year: index.build.year.toString(),
                            make: index.build.make,
                            model: index.build.model,
                            trim: index.build.trim,
                            price: index.price.toString(),
                            location: index.dealer.city + ", " + index.dealer.state
                        }
                        if (index.miles != undefined) {
                            r.kilometers = Math.floor(index.miles * 1.60934).toString()
                        } else {
                            r.kilometers = Math.floor(index.ref_miles * 1.60934).toString()
                        }
                    } catch (error) {
                        return true;
                    }
                    similarCars.push(r);
                })
                //******************* */
                callback(null, similarCars);
            })

        }
    }, function (err, results) {
        var car = results.car;
        var similar = results.similarCars;
        resp.render('car', { car, allMakes, similar });
    });
});

// app.post('/watchlist', async (req, res) => {
//     const newMovie = new Movie(req.body);
//     await newMovie.save();
//     res.redirect(`back`)
// })

// app.delete('/watchlist/:id', async (req, res) => {
//     const { id } = req.params;
//     const deletedMovie = await Movie.findByIdAndDelete(id);
//     res.redirect('/watchlist');
// })




// Catch all URL
app.get('*', (req, res) => {
    res.send("<h1>Cannot find URL</h1>")
})


//***************************************************************************************************************************
// SERVER CONNECT
//***************************************************************************************************************************
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`APP IS LISTENING ON PORT ${port}!`)
})