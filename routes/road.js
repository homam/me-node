
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('road', { title: 'Road' });
};