/**
 * Created by xiyang on 2018/7/4 0004.
 */
var mongoose = require('mongoose');

var usersSchema = require('../schemas/users');

module.exports = mongoose.model('User',usersSchema);