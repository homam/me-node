
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.whatsapp = function(req, res) {

    res.render('whatsapp', {});
}