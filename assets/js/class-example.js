

function Apple (type) {
    this.type = type;
    this.color = "red";
    this.getInfo = function() {
        return this.color + ' ' + this.type + ' apple';
    };
}



var apple = new Apple('macintosh');
apple.color = "reddish";
alert(apple.getInfo());

