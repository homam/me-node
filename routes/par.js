
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('par', { title: 'Express' });
};