function Customer(UserName, fName,lName, Address, Phone, Email){
	this._UserName=UserName;
	this._Fname=fName;
	this._Lname=lName;
	this._Address=Address;
	this._Phone=Phone;
	this._Email=Email;

}

Customer.prototype.getUserName=function(){
	return this._UserName;
};

Customer.prototype.getFirstName=function(){
	return this._Fname;
};
Customer.prototype.getLastName=function(){
	return this._Lname;
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