var _ = require('underscore');
var student = {
    score: 111,
    teacher: new Teacher('match')
};
_.extend(student, require('./pepole'));



function Teacher(teach) {
	_.extend(this, require('./pepole'));
    this.teach = teach;
}
module.exports = student;