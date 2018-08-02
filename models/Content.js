/**
 * Created by xiyang on 2018/7/6 0006.
 */
var mongoose = require('mongoose');

var contentsSchema = require('../schemas/contents');

module.exports = mongoose.model('Content',contentsSchema);