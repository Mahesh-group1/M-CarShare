function Customer(UserName, Name, Address, Phone, Email){
	this._UserName=UserName;
	this._Name=Name;
	this._Address=Address;
	this._Phone=Phone;
	this._Email=Email;

}

Customer.prototype.getUserName=function(){
	return this._UserName;
};

Customer.prototype.getName=function(){
	return this._Name;
};
Customer.prototype.getAddress=function(){
	return this._Address;
};
Customer.prototype.getPhone=function(){
	return this._Phone;
};
Customer.prototype.getEmail=function(){
	return this._Email;
};

module.exports=Customer;