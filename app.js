
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , bodyParser = require('body-parser')
  , formidable = require("formidable")
  , util = require('util')
  , logger = require('morgan')
  , fs =require('fs'),
  Booking =require('./Booking.js'),
  Customer=require('./Customer.js');
//var connect        = require('connect')
//var methodOverride = require('method-override');
var app = express();

var userId;
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/index.htm', function (req, res) {
   res.sendfile( __dirname + "/" + "index.htm" );
});
app.get('/MyHome', function (req, res) {
	res.render('MyHome',{userId: userId});
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
			  if (req.body.password===jsonData[chck].password ){
		  		//res.sendfile(__dirname + "/" + "MyHome.html" )
				  userId=jsonData[i].user_id;
		  		res.render('MyHome',{user: jsonData[chck].user_id});
		  		
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
		  userId=req.body.email_id;
		  jsonData.push({user_id: req.body.email_id, password:req.body.password});
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
	    	   //res.sendfile( __dirname + "/" + "MyHome.html" );
	    	res.render('MyHome',{user: req.body.first_name,userId:req.body.email_id});
	        
	        
	        res.end('User Id created');
		  }
	  else {
		  res.end('User Id already exist');
	  }
    });
	  
	  

	});


app.get('/MyHome.html', function (req, res) {
	   res.sendfile( __dirname + "/" + "MyHome.html" );
	});

app.post('/confirm.html', function (req, res) {
	   res.sendfile( __dirname + "/" + "confirm.html" );
	});
app.get('/rent_car', function (req, res) {
	res.render('rentCar', {userId:userId});
	});

app.get('/myAccount', function (req, res) {
	var userObj =  [];
	var indx;
	fs.readFile(__dirname +'/public/user_details.json', 'utf8', function (err, data) {
		if (err) throw err;
		userObj = JSON.parse(data);
		for (var i = 0; i < userObj.length; ++i) {
		    if (userObj[i].user_id===userId){
		    	indx=i;
		    	console.log("userid: "+userObj[indx].user_id);
		    	break;
		    }
		}
		 var custDetails =new Customer(userObj[indx].user_id, userObj[indx].first_name+userObj[indx].last_name,userObj[indx].address,userObj[indx].phone,userObj[indx].user_id); 

			
			res.render('MyAccount', {custDetails:custDetails});
	});

	});

app.post('/bookCar', function (req, res) {
	var booking_Id;
	var now = new Date();
	var bookingDetails= new Booking(req.body.carLocation,-1, req.body.pickupDate, req.body.returnDate,now, req.body.userId, req.body.setCar);
	fs.readFile(__dirname +'/public/bookingDetails.json', 'utf8', function (err, data) {
		  if (err) throw err;
		  var bookingData = JSON.parse(data);
		  booking_Id=bookingData.length+1;
		  bookingData.push({Booking_Id: booking_Id,userId:bookingDetails.getUser(), Pickup_location: bookingDetails.getLocation(), Pickup_date:bookingDetails.getBookingDate(), Return_Date: bookingDetails.getReturnDate(), car: bookingDetails.getCar(), booking_time:bookingDetails.getBookingTime()});
		  var json = JSON.stringify(bookingData); 
	        fs.writeFile(__dirname +'/public/bookingDetails.json', json);
	        console.log("booking_Id: " + booking_Id);
	    	res.render('confirm', {bookingId:booking_Id});
	});
	
	
	});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
