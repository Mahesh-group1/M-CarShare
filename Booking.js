//var method= new Booking.prototype;

function Booking(Location, BookingId, BookingDate, ReturnDate, BookingTime, User, Car){
	this._Location=Location;
	this._BookingId=BookingId;
	this._BookingDate=BookingDate;
	this._ReturnDate=ReturnDate;
	this._BookingTime=BookingTime;
	this._User=User;
	this._Car=Car;
}

Booking.prototype.getBookingId=function(){
	return this._BookingId;
};

Booking.prototype.getLocation=function(){
	return this._Location;
};

Booking.prototype.getBookingDate=function(){
	return this._BookingDate;
};

Booking.prototype.getReturnDate=function(){
	return this._ReturnDate;
};

Booking.prototype.getBookingTime=function(){
	return this._BookingTime;
};

Booking.prototype.getUser=function(){
	return this._User;
};

Booking.prototype.getCar=function(){
	return this._Car;
};

module.exports = Booking;