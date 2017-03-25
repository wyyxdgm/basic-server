// var c = 0;

// function print(c) {
//     console.log(c);
// }

// function plus(callback) {
//     setTimeout(function() {
//         c += 1;
//         callback(c);
//     }, 1000);
// }

// plus(print);

function Pet(words) {
    this.words = words;
    this.speak = function() {
        console.log('Speak ' + words);
    }
}

function Cat(words) {
    Pet.call(this, words);
}

var cat = new Cat('miao');
cat.speak();
