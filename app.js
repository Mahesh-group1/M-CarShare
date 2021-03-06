// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var http = require('http');
var app      = express();
var port     = process.env.PORT || 3340;
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var bodyParser = require('body-parser');
var fs =require('fs');
var nodemailer = require('nodemailer');
var session = require('express-session');
var configDB = require('./config/db.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

var transporter = nodemailer.createTransport('smtps://mcarshare6091%40gmail.com:"mcarshare"@smtp.gmail.com');
var mailOptions = {
	    from: '"M-Carshare" <mcarshare6091@gmail.com>', // sender address
	    to: '', // list of receivers
	    subject: 'Hello', // Subject line
	    text: 'Hello world', // plaintext body
	    html: '<b>Hello world: </b> <a href="http://localhost:3340/verify"> verify</a>'
	};

app.use(express.static(path.join(__dirname, 'public')));

	// set up our express application
	//app.use(express.logger('dev')); // log every request to the console
var cookieParser = require('cookie-parser');
app.use(cookieParser()); // read cookies (needed for auth)
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session



// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.get('/verify', function (req, res) {
	console.log('req.query.user: ' + req.query.user);
	var jsonData;
	var chck=-1;
	var mssg;
	    fs.readFile(__dirname +'/public/login_details.json', 'utf8', function (err, data) {
		  if (err) throw err;
		   jsonData = JSON.parse(data);
		 // var chck=-1;
		  for (var i = 0; i < jsonData.length; ++i) {
		    if (jsonData[i].user_id===req.query.user){
		    	chck=i;
		    	break;		    	
		    }
		  }
		 if (jsonData[chck].verified==true){
			 mssg='Email Address already verified.';
		 	}
		 else{
			 jsonData[chck].verified=true;
			 mssg='Email Address verified.';
			 var json = JSON.stringify(jsonData); 
		        fs.writeFile(__dirname +'/public/login_details.json', json);
		 }
		 res.render('emailverify',{mssg:mssg});
		 });
	
	});


/*



app.post('/myAccount', function (req, res) {
	var userObj =  [];
	var rented_cars =[];
	var indx;
	console.log("userId: "+req.body.userId);
	fs.readFile(__dirname +'/public/user_details.json', 'utf8', function (err, data) {
		if (err) throw err;
		userObj = JSON.parse(data);
		for (var i = 0; i < userObj.length; ++i) {
		    if (userObj[i].user_id===req.body.userId){
		    	indx=i;
		    	console.log("userid: "+userObj[indx].user_id);
		    	break;
		    }
		}
		 var custDetails =new Customer(userObj[indx].user_id, userObj[indx].first_name,userObj[indx].last_name,userObj[indx].address,userObj[indx].phone,userObj[indx].user_id); 
		 fs.readFile(__dirname +'/public/bookingDetails.json', 'utf8', function (err, data) {
				if (err) throw err;
				var bookings=JSON.parse(data);
			for (var i = 0; i < bookings.length; ++i) {
			    if (bookings[i].userId==req.body.userId){
			    	console.log(bookings[i].userId);
			    	rented_cars.push(bookings[i]);		    	
			    }
			  }
			
			res.render('MyAccount', {custDetails:custDetails, bookingDetails:rented_cars});
	});
	});
	});

app.post('/bookCar', function (req, res) {
	var booking_Id;
	var now = new Date();
	var bookingDetails= new Booking(req.body.carLocation,-1, req.body.pickupDate, req.body.returnDate,now, req.body.userId, req.body.setCar, "Booked");
	fs.readFile(__dirname +'/public/bookingDetails.json', 'utf8', function (err, data) {
		  if (err) throw err;
		  var bookingData = JSON.parse(data);
		  booking_Id=bookingData.length+1;
		  bookingDetails.setBookingId(booking_Id);
		  bookingData.push({Booking_Id: bookingDetails.getBookingId(),userId:bookingDetails.getUser(), Pickup_location: bookingDetails.getLocation(), Pickup_date:bookingDetails.getBookingDate(), Return_Date: bookingDetails.getReturnDate(), car: bookingDetails.getCar(), booking_time:bookingDetails.getBookingTime(),status:bookingDetails.getStatus()});
		  var json = JSON.stringify(bookingData); 
	        fs.writeFile(__dirname +'/public/bookingDetails.json', json);
	        console.log("booking_Id: " + booking_Id);
	    	res.render('confirm', {booking_dtls:bookingDetails,user:req.body.user,userId:req.body.userId});
		});
	});


app.post('/returnCar', function (req, res) {
	var rented_cars =  [];
	var bookings =  [];
	var no_of_bookings;
	fs.readFile(__dirname +'/public/bookingDetails.json', 'utf8', function (err, data) {
		if (err) throw err;
		bookings=JSON.parse(data);
		console.log('req.body.userid'+ req.body.userId);
	for (var i = 0; i < bookings.length; ++i) {
	    if (bookings[i].userId==req.body.userId &&  bookings[i].status=='Checked Out'){
	    	console.log(bookings[i].userId);
	    	rented_cars.push(bookings[i]);		    	
	    }
	  }
	res.render('returnCar', {bookings:rented_cars,numbrs:rented_cars.length,user:req.body.user,userId:req.body.userId});
	});
});

app.post('/tripDetails', function (req, res) {
	var rented_cars =  [];
	var bookings =  [];
	var kms= Math.floor((Math.random() * 1000) + 1);
	var fuel= Math.floor((Math.random() * 100) + 1);
	var Car_name;
	fs.readFile(__dirname +'/public/bookingDetails.json', 'utf8', function (err, data) {
		if (err) throw err;
		bookings=JSON.parse(data);
		console.log('req.body.bookingId'+ req.body.bookingId);
	for (var i = 0; i < bookings.length; ++i) {
	    if (bookings[i].Booking_Id==req.body.bookingId){
	    	rented_cars=bookings[i];
	    	break;
	    }
	  }
	fs.readFile(__dirname +'/public/cars.json', 'utf8', function (err, data) {
		if (err) throw err;
		car_dtls=JSON.parse(data);
		var car_class ;
		var total_amt;
		var fuel_charge=0;
		for (var i = 0; i < car_dtls.length; ++i) {
		    if (car_dtls[i].Car_Id==rented_cars.car){
		    	car_class=car_dtls[i].Car_Class;
		    	Car_name=car_dtls[i].Car_Name + ' - ' +car_dtls[i].Car_Number;
		    	break;
		    }
		  }
		
		console.log('car_class: '+ car_class);
		var date1_ms =new Date(rented_cars.Pickup_date);
		  var date2_ms = new Date(rented_cars.Return_Date);
		  var noDays = (date2_ms.getTime() - date1_ms.getTime())/(1000*60*60*24);
		  console.log('noDays: '+ (date2_ms.getTime() - date1_ms.getTime())/(1000*60*60*24));
		  if(car_class=='economy'){
			  total_amt=noDays*10;
		  }else if(car_class=='suv'){
			  total_amt=noDays*12;
		  }else if(car_class=='luxury'){
			  total_amt=noDays*18;
		  }else if(car_class=='sporty'){
			  total_amt=noDays*20;
		  }
		  if(fuel>25){
			  fuel_charge=(fuel/4);
		  }
		  console.log('total_amt: '+ total_amt);
		res.render('trip_details', {trp_dtls:Car_name,total_kms:kms,fuel_cnsmd:fuel, no_of_days:noDays,userId:req.body.userId,user:req.body.user,total_amt:total_amt,fuel_charge:fuel_charge,bookingId:req.body.bookingId,dropLocation:req.body.carLocation,car_id:rented_cars.car});
		});
});
});*/


/*
app.get('/viewCars', function (req, res) {
	var economy_cars =  [];
	var suv_cars =  [];
	var luxury_cars =  [];
	var sporty_cars =  [];
	fs.readFile(__dirname +'/public/cars.json', 'utf8', function (err, data) {
		if (err) throw err;
		var saved_cars=JSON.parse(data);
		for (var i = 0; i < saved_cars.length; ++i) {
		    if (saved_cars[i].Car_Class=='economy'){
		    	economy_cars.push(saved_cars[i]);
		    }
		    if (saved_cars[i].Car_Class=='suv'){
		    	suv_cars.push(saved_cars[i]);
		    }
		    if (saved_cars[i].Car_Class=='luxury'){
		    	luxury_cars.push(saved_cars[i]);
		    }
		    if (saved_cars[i].Car_Class=='sporty'){
		    	sporty_cars.push(saved_cars[i]);
		    }
		}
	res.render('addCar',{economy_cars: economy_cars,suv_cars:suv_cars,luxury_cars:luxury_cars,sporty_cars:sporty_cars});
	});
});
*/
/*app.post('/addCar', function (req, res) {
	var economy_cars =  [];
	var suv_cars =  [];
	var luxury_cars =  [];
	var sporty_cars =  [];
	fs.readFile(__dirname +'/public/cars.json', 'utf8', function (err, data) {
		if (err) throw err;
		var saved_cars=JSON.parse(data);
		saved_cars.push({Car_Id: saved_cars.length+1, Car_Class:req.body.carClass, Car_Name:req.body.CarName, Car_Number:req.body.car_number, Car_Year:req.body.car_year,Car_Km:req.body.car_km,Car_Location:req.body.carLocation});
		var json = JSON.stringify(saved_cars); 
        fs.writeFile(__dirname +'/public/cars.json', json);
		for (var i = 0; i < saved_cars.length; ++i) {
		    if (saved_cars[i].Car_Class=='economy'){
		    	economy_cars.push(saved_cars[i]);
		    }
		    if (saved_cars[i].Car_Class=='suv'){
		    	suv_cars.push(saved_cars[i]);
		    }
		    if (saved_cars[i].Car_Class=='luxury'){
		    	luxury_cars.push(saved_cars[i]);
		    }
		    if (saved_cars[i].Car_Class=='sporty'){
		    	sporty_cars.push(saved_cars[i]);
		    }
		}
	res.render('addCar',{economy_cars: economy_cars,suv_cars:suv_cars,luxury_cars:luxury_cars,sporty_cars:sporty_cars});
	});
});


app.post('/tripPay', function (req, res) {
	var indx;
	var indx2;
	fs.readFile(__dirname +'/public/cars.json', 'utf8', function (err, data) {
		if (err) throw err;
		carObj = JSON.parse(data);
		for (var i = 0; i < carObj.length; ++i) {
		    if (carObj[i].Car_Id==req.body.car_id){
		    	indx=i;
		    	break;
		    }
		}
		carObj[indx].Car_Location=req.body.dropLocation;
		var json = JSON.stringify(carObj); 
        fs.writeFile(__dirname +'/public/cars.json', json);
	});
	fs.readFile(__dirname +'/public/bookingDetails.json', 'utf8', function (err, data) {
		if (err) throw err;
		bookingObj = JSON.parse(data);
		for (var i = 0; i < bookingObj.length; ++i) {
		    if (bookingObj[i].Booking_Id==req.body.bookingId){
		    	indx2=i;
		    	break;
		    }
		}
		bookingObj[indx2].status="Completed";
		var json = JSON.stringify(bookingObj); 
        fs.writeFile(__dirname +'/public/bookingDetails.json', json);
	});
		res.render('tripFinal',{user:req.body.user,userId: req.body.userId});
});

app.post('/checkedOut', function (req, res) {
	var carsData =  [];
	var bookings =  [];
	var indx;
	var indx2;
	var now = new Date();
	fs.readFile(__dirname +'/public/bookingDetails.json', 'utf8', function (err, data) {
		if (err) throw err;
		bookings=JSON.parse(data);
	for (var i = 0; i < bookings.length; ++i) {
	    if (bookings[i].Booking_Id==req.body.bookingId){
	    	indx=i;	
	    	break;
	    }
	  }
	 bookings[indx].status="Checked Out";
	 fs.readFile(__dirname +'/public/cars.json', 'utf8', function (err, data) {
			if (err) throw err;
			carsData=JSON.parse(data);
			for (var i = 0; i < carsData.length; ++i) {
			    if (carsData[i].Car_Name==bookings[indx].car){
			    	indx2=i;	
			    	break;
			    }
			  }
			bookings[indx].car=carsData[indx2].Car_Id;
			var json = JSON.stringify(bookings); 
			fs.writeFile(__dirname +'/public/bookingDetails.json', json);
	res.render('checkoutConfirm',{checkOut_time:now,car_model:carsData[indx2].Car_Name,car_number:carsData[indx2].Car_Number,start_km:carsData[indx2].Car_Km,user:req.body.user,userId:req.body.userId});
	 });
	});
	
	});
	
app.post('/checkoutCar', function (req, res) {
		var rented_cars =  [];
		var bookings =  [];
		var no_of_bookings;
		fs.readFile(__dirname +'/public/bookingDetails.json', 'utf8', function (err, data) {
			if (err) throw err;
			bookings=JSON.parse(data);
			console.log('req.body.userid'+ req.body.userId);
		for (var i = 0; i < bookings.length; ++i) {
		    if (bookings[i].userId==req.body.userId &&  bookings[i].status=='Booked'){
		    	console.log(bookings[i].userId);
		    	rented_cars.push(bookings[i]);		    	
		    }
		  }
		
		res.render('checkout',{bookings:rented_cars,numbrs:rented_cars.length,user:req.body.user,userId:req.body.userId});
		});
});
*/
http.createServer(app).listen(port, function(){
  console.log('Express server listening on port 3340');
});
