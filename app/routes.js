
var Booking            = require('../app/models/Booking');
module.exports = function(app, passport) {
	
	app.get('/', function (req, res) {
		res.render( "index" ,{ message: req.flash('signupMessage') + " " + req.flash('loginMessage') });
		});

	app.get('/index.htm', function (req, res) {
		   res.render( "index",{ message: req.flash('signupMessage') + " " + req.flash('loginMessage') } );
		});
	app.get('/MyHome', function (req, res) {
		res.render('MyHome',{userId: userId});
		});

	app.get('/addCar', function (req, res) {
		res.render('addCar');
		});
	
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

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
	
	app.post('/login', passport.authenticate('local-login',{
	    successRedirect : '/profile', // redirect to the secure profile section
	    failureRedirect : '/index.htm', // redirect back to the signup page if there is an error
	    failureFlash : true // allow flash messages
	}));
	app.post('/signup', passport.authenticate('local-signup',{
	    successRedirect : '/profile', // redirect to the secure profile section
	    failureRedirect : '/index.htm', // redirect back to the signup page if there is an error
	    failureFlash : true // allow flash messages
	}));	

	app.get('/profile', isLoggedIn, function (req, res) {
		res.render('MyHome.ejs',{user: req.user.local.firstName,userId: req.user.local.email});
		});
	
	app.post('/rent_car', function (req, res) {
		res.render('rentCar', {user:req.body.user,userId:req.body.userId});
		});
	
	app.post('/MyHome', function (req, res) {
  		res.render('MyHome',{user: req.body.user,userId: req.body.userId});
	});

	app.post('/confirm.html', function (req, res) {
	   res.sendfile( __dirname + "/" + "confirm.html" );
	});
	
	app.post('/bookCar', function (req, res) {
		var booking_Id ='1';
		var now = new Date();
		var bookingDetails= new Booking();
		var query = Booking.find({}).sort({BookingId:-1}).limit(1);		
		query.populate('_creator', 'BookingId').exec(function (err, bkng) {
			if (err) 
				return handleError(err);
			
			booking_Id=bkng._creator.BookingId;
			console.log(bkng._creator.BookingId);
			bookingDetails.Location=req.body.carLocation;
			bookingDetails.BookingId=parseInt(booking_Id) + 1; 
			bookingDetails.BookingDate=req.body.pickupDate;
			bookingDetails.ReturnDate=req.body.returnDate;
			bookingDetails.BookingTime=now;
			bookingDetails.User=req.body.userId;
			bookingDetails.Car=req.body.setCar;
			bookingDetails.Status="Booked";
			bookingDetails.save(function(err, bookingDetails) {
            if (err)
                throw err;
            res.render('confirm', {booking_dtls:bookingDetails,user:req.user.local.firstName,userId:req.user.local.email});
			});
		})


		});

}



//route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
