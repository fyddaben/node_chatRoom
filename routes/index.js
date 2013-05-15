
/*
 * GET home page.
 */
var assert= require('assert');

exports.index = function(req, res){
  //assert.equal('1', '2', ['1和2是不相等的']);
    var a='adsfasd';
   res.render('index', { title: 'Express' });
};
//静态页面
exports.sta=function(req,res){
	var pageName= req.params.id;
	res.render(pageName);
}
