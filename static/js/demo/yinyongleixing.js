// function setName(obj) {
//     obj.name = 'Liuli';
//     obj = new Object();
//     obj.name = 'Dgm';
// }
var person = new Object();
person.name = 'Liuli';


var person2 = person;
person2.name = 'Dgm1';
console.log(person.name); //Dgm1

person2 = new Object();
person2.name = 'Dgm2';
console.log(person.name);


//1.person={ }
//2.person={name:"Liuli"}


var obj1 = new Object();
var obj2 = obj1;
obj2 = new Object();
