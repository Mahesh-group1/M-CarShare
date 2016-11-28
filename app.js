
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , bodyParser = require('body-parser')
  //, formidable = require("formidable")
  , util = require('util')
  , fs =require('fs'),
  Booking =require('./Booking.js'),
  Customer=require('./Customer.js'),
  nodemailer = require('nodemailer');
//var connect        = require('connect')
//var methodOverride = require('method-override');
var app = express();
var transporter = nodemailer.createTransport('smtps://mcarshare6091%40gmail.com:"mcarshare"@smtp.gmail.com');

//setup e-mail data with unicode symbols
var mailOptions = {
    from: '"M-Carshare" <mcarshare6091@gmail.com>', // sender address
    to: '', // list of receivers
    subject: 'Hello', // Subject line
    text: 'Hello world', // plaintext body
    html: '<b>Hello world: </b> <a href="http://localhost:3340/verify"> verify</a>'
};
//var userId;
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');


app.get('/', function (req, res) {
	   res.sendFile( __dirname + "/" + "index.htm" );
	});

app.get('/index.htm', function (req, res) {
	   res.sendFile( __dirname + "/" + "index.htm" );
	});
app.get('/MyHome', function (req, res) {
	res.render('MyHome',{userId: userId});
	});

app.get('/addCar', function (req, res) {
	res.render('addCar');
	});

app.post('/login', function (req, res) {
	var jsonData;
	var chck=-1;
	    fs.readFile(__dirname +'/public/login_details.json', 'utf8', function (err, data) {
		  if (err) throw err;
		   jsonData = JSON.parse(data);
		 // var chck=-1;
		  for (var i = 0; i < jsonData.length; ++i) {
		    if (jsonData[i].user_id===req.body.userid){
		    	chck=i;
		    	break;		    	
		    }
		  }
	    
	    
	    console.log(chck);
		  if (chck!=-1 ){
			  if (req.body.password===jsonData[chck].password && jsonData[chck].verified==true){
				  fs.readFile(__dirname +'/public/user_details.json', 'utf8', function (err, data) {
			    		if (err) throw err;
			    		userObj = JSON.parse(data);
			    		var userName;
			    		for (var i = 0; i < userObj.length; ++i) {
			    		    if (userObj[i].user_id===req.body.userid){
			    		    	userName=userObj[i].first_name;
			    		    	break;
			    		    }
			    		  }
			    		res.render('MyHome',{user: userName,userId: jsonData[chck].user_id});
				  });
			  }else if (req.body.password===jsonData[chck].password && jsonData[chck].verified==false){
				  res.end('Emailid Not Verified.');
			  }
			  
			  else {
				  res.end('Invalid password');
			  }
		  }
		  else{
			  
			  res.end('Invalid User Id');
		  }
	    });
		
	
	   
	   console.log(req.body.userid);
	   console.log(req.body.password);
	   //res.end(JSON.stringify(response));
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

app.post('/signup', function (req, res) {
	
	var jsonData;
	var chck=-1;
    fs.readFile(__dirname +'/public/login_details.json', 'utf8', function (err, data) {
	  if (err) throw err;
	   jsonData = JSON.parse(data);
	 // var chck=-1;
	  for (var i = 0; i < jsonData.length; ++i) {
	    if (jsonData[i].user_id===req.body.userid){
	    	chck=i;
	    	break;		    	
	    }
	  }
	  if (chck===-1){
		  var userId=req.body.email_id;
		  jsonData.push({user_id: req.body.email_id, password:req.body.password, verified:false});
	        var json = JSON.stringify(jsonData); 
	        fs.writeFile(__dirname +'/public/login_details.json', json);
	    	var userObj =  [];
	    	fs.readFile(__dirname +'/public/user_details.json', 'utf8', function (err, data) {
	    		if (err) throw err;
	    		userObj = JSON.parse(data);
	    		userObj.push({user_id: req.body.email_id, first_name:req.body.first_name, last_name:req.body.last_name, phone:req.body.phone, address:req.body.address});
	    		var json = JSON.stringify(userObj); 
	            fs.writeFile(__dirname +'/public/user_details.json', json);
	    	})
	    	
	    	mailOptions.to=req.body.email_id;
	    	mailOptions.html='<b>Hello world 🐴: </b> <a href="http://localhost:3340/verify?user='+req.body.email_id+'"> verify</a>';
	    	   //res.sendfile( __dirname + "/" + "MyHome.html" );
	    	transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});
	    	//res.render('MyHome',{user: req.body.first_name,userId:req.body.email_id});
	        
	        
	        res.end('User Id created. Verify your email id from the mail sent.');
		  }
	  else {
		  res.end('User Id already exist');
	  }
    });
	  
	  

	});


app.post('/MyHome', function (req, res) {
  		res.render('MyHome',{user: req.body.user,userId: req.body.userId});
	});

app.post('/confirm.html', function (req, res) {
	   res.sendfile( __dirname + "/" + "confirm.html" );
	});
app.post('/rent_car', function (req, res) {
	res.render('rentCar', {user:req.body.user,userId:req.body.userId});
	});

app.post('/myAccount', function (req, res) {
	var userObj =  [];
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

			
			res.render('MyAccount', {custDetails:custDetails});
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
	console.log('rented_cars.length: '+ rented_cars.length);
	res.render('returnCar', {bookings:rented_cars,numbrs:rented_cars.length,user:req.body.user,userId:req.body.userId});
	});
});

app.post('/tripDetails', function (req, res) {
	var rented_cars =  [];
	var bookings =  [];
	var kms= Math.floor((Math.random() * 1000) + 1);
	var fuel= Math.floor((Math.random() * 100) + 1);
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
	console.log('rented_cars: '+ rented_cars);
	var date1_ms =new Date(rented_cars.Pickup_date);
	  var date2_ms = new Date(rented_cars.Return_Date);
	  var noDays = (date2_ms.getTime() - date1_ms.getTime())/(1000*60*60*24);
	  console.log('noDays: '+ (date2_ms.getTime() - date1_ms.getTime())/(1000*60*60*24));
	res.render('trip_details', {trp_dtls:rented_cars,total_kms:kms,fuel_left:fuel, no_of_days:noDays,userId:req.body.userId,user:req.body.user});
	});
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(3340, function(){
  console.log('Express server listening on port 3340');
});
