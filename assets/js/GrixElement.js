
// define the GrixElement Class
function GrixElement() {
	this.type = "el";
	this.margin = {
		xs:"",
		sm:"",
		md:"",
		lg:""
	};
}


GrixElement.prototype.sayHello = function(){
  alert ('hello');
};





// define the GrixCol class
function GrixCol() {

	// Call the parent constructor
	GrixElement.call(this);

	this.type = 'col';
	
	this.width = {
		xs:"12",
		sm:"",
		md:"",
		lg:""
	};
	this.offset = {
		xs:"",
		sm:"",
		md:"",
		lg:""
	};	
	this.push = {
		xs:"",
		sm:"",
		md:"",
		lg:""
	};
	this.pull = {
		xs:"",
		sm:"",
		md:"",
		lg:""
	};
	this.classes = '';
	this.elements = [];
}

// inherit GrixElement
GrixCol.prototype = Object.create(GrixElement.prototype);

// correct the constructor pointer because it points to GrixElement
GrixCol.prototype.constructor = GrixCol;

// replace the sayHello method
GrixCol.prototype.sayHello = function(){
  alert('hi, I am a GrixCol');
}







// define the GrixRow class
function GrixRow() {

	// Call the parent constructor
	GrixElement.call(this);

	this.type = 'row';
	this.unitsConf = {
		xs:"12",
		sm:"12",
		md:"12",
		lg:"12"
	};

	this.classes = '';
	this.elements = [];
}

// inherit GrixElement
GrixRow.prototype = Object.create(GrixElement.prototype);

// correct the constructor pointer because it points to GrixElement
GrixRow.prototype.constructor = GrixRow;


// replace the sayHello method
GrixRow.prototype.addCol = function(obCol){
	this.elements.push(obCol);
}





// define the GrixCE class
function GrixCE() {

	// Call the parent constructor
	GrixElement.call(this);

	this.type = 'ce';


	this.classes = '';
	
}

// inherit GrixElement
GrixCE.prototype = Object.create(GrixElement.prototype);

// correct the constructor pointer because it points to GrixElement
GrixCE.prototype.constructor = GrixCE;



