// define the GrixElement Class
function GrixElement() {
    this.type = "el";
}

GrixElement.prototype.walk = function(){
  alert ('I am walking!');
};
GrixElement.prototype.sayHello = function(){
  alert ('hello');
};





// define the GrixCol class
function GrixCol() {

    // Call the parent constructor
    GrixElement.call(this);


    this.type = 'col';
    // this.units = '12';
    this.boot = {
        xs:"12",
        sm:"12",
        md:"12",
        lg:"12"
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

// add sayGoodBye method
GrixCol.prototype.sayGoodBye = function(){
  alert('goodBye');
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
    // this.units = '12';
    // this.boot = {
    //     xs:12,
    //     sm:12,
    //     md:12,
    //     lg:12
    // };
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


