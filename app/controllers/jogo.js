module.exports.jogo = function (application, req, res) {
    if (req.session.autorizada) {

        var msg = '';
        if (req.query.msg != '') {
            msg = req.query.msg;
        }


        var casa = req.session.casa;

        var usuario = req.session.usuario;
        var connection = application.config.dbConnection;
        var JogoDAO = new application.app.models.JogoDAO(connection);

        JogoDAO.iniciaJogo(res, usuario, casa, msg);

    } else {
        res.render('index', { validacao: [{ msg: "Usuário precisa fazer login" }], sucesso: {}, dadosForm:{} });
    }
}

module.exports.sair = function (application, req, res) {

    req.session.destroy(function (err) {
        res.render('index', { sucesso: [{ msg: "Saiu." }], validacao: {}, dadosForm:{} });
    });
}

module.exports.suditos = function (application, req, res) {
    if (req.session.autorizada !== true) {
        res.render('index', { validacao: [{ msg: "Usuário precisa fazer login" }], sucesso: {}, dadosForm:{} });
    } else {

        res.render('aldeoes', { validacao: {} });
    }
}

module.exports.pergaminhos = function (application, req, res) {
    if (req.session.autorizada !== true) {
        res.render('index', { validacao: [{ msg: "Usuário precisa fazer login" }], sucesso: {}, dadosForm:{} });
    } else {

        var connection = application.config.dbConnection;
        var JogoDAO = new application.app.models.JogoDAO(connection);
        var usuario = req.session.usuario;

        JogoDAO.getAcoes(usuario, res);

    }
}

module.exports.ordenar_acao_suditos = function (application, req, res) {
    var dadosForm = req.body;

    req.assert('acao', 'Uma ação deve ser tomada').notEmpty()
    req.assert('quantidade', 'Uma quantidade deve ser colocada').notEmpty()

    var erros = req.validationErrors();

    if (erros) {
        res.redirect('jogo?msg=A');
        return;
    }

    var connection = application.config.dbConnection;
    var JogoDAO = new application.app.models.JogoDAO(connection);

    dadosForm.usuario = req.session.usuario;
    JogoDAO.acao(dadosForm);

    res.redirect('jogo?msg=B')

}

module.exports.revogar_acao = function (application, req, res){
    var url_query = req.query;

    var connection = application.config.dbConnection;
    var JogoDAO = new application.app.models.JogoDAO(connection);

    var _id = url_query.id_acao;
    JogoDAO.revogarAcao(_id,res);
}

