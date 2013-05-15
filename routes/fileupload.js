/*
 * GET home page.
 */
var assert = require('assert')
    , constant = require('./util/Constant');

exports.upload = function (req, res) {

    //var name=req.body.userid;

    var fileDesc = req.files;

    var imgname = fileDesc.Filedata.name;

    var path = fileDesc.Filedata.path;

    var index = path.indexOf(constant.uploadFile);

    var name = path.substring(index+constant.uploadFile.length+1);

    var imgurl = constant.DomainUrl + ":" + constant.DomainPort + "/"+constant.uploadFile+"/" + name;

    //console.log(imgurl);

    res.send(imgurl);
};
