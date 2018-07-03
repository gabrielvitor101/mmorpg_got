function UsuariosDAO(connection){
	this._connection = connection();
}

UsuariosDAO.prototype.inserirUsuario = function(usuario){
	this._connection.open( function(err, mongoclient){
		mongoclient.collection("usuarios", function(err, collection){
			collection.insert(usuario);

			mongoclient.close();
		});
	});
}

UsuariosDAO.prototype.autenticar = function(usuario, req,res){
	this._connection.open( function(err, mongoclient){
		mongoclient.collection("usuarios", function(err, collection){
			collection.find(usuario).toArray(function(err, result){

				if(result[0] != undefined){

					req.session.autorizada = true;

					req.session.usuario = result[0].usuario;
					req.session.casa = result[0].casa;
				}else{
					req.session.autorizada = false;
				}

				if(req.session.autorizada){
					res.redirect("jogo");
				}else{
					res.render("index", {validacao: {}, sucesso:{}})
				}

			});
			mongoclient.close();
		});
	});
}

module.exports = function(){
	return UsuariosDAO;
}