//var method= new Booking.prototype;
var mongoose = require('mongoose');

var bookingSchema = mongoose.Schema({

	Location : String,
	BookingId : String,
	BookingDate : String,
	ReturnDate : String,
	BookingTime : String,
	User : String,
	Car : String,
	Status : String 
});

module.exports = mongoose.model('Booking', bookingSchema);