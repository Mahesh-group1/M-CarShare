function Cars(CarId, CarClass, CarName, CarNumber, CarYear, CarKm, CarLocation){
	this._CarId=CarId;
	this._CarClass=CarClass;
	this._CarName=CarName;
	this._CarNumber=CarNumber;
	this._CarYear=CarYear;
	this._CarKm=CarKm;
	this._CarLocation=CarLocation; 
}

Cars.prototype.getCarId=function(){
	return this._CarId;
};
Cars.prototype.getCarClass=function(){
	return this._CarClass;
};
Cars.prototype.getCarName=function(){
	return this._CarName;
};
Cars.prototype.getCarYear=function(){
	return this._CarYear;
};
Cars.prototype.getCarKm=function(){
	return this._CarKm;
};
Cars.prototype.getCarLocation=function(){
	return this._CarLocation;
};
Cars.prototype.getCarNumber=function(){
	return this._CarNumber;
};

module.exports = Cars;