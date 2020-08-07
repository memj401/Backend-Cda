const usuarioRepositorio = require('../repositorios/usuario')
const bcrypt = require('bcrypt')

/**
    * Controladora de funções envolvendo informações sobre os usuários e a requisição HTTP
    * @namespace usuarioControladora
*/

const usuarioControladora = {
    /**
        * Lida com a requisição GET respondendo com um vetor contendo todos os usuários ou um erro(404) caso não haja usuários no banco de dados
        * @memberof usuarioControladora
        * @method listarTodos
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Promise} O retorno nessa função é desnecessário e é feito só para não gerar confusão quanto ao fim da função, o que importa é a chamada dos metodos do objeto "resposta", essa chamada seleciona um status para o resposta e prepara o conteudo
    */
	listarTodos: async function(requisicao, resposta) {
    	const usuarios = await usuarioRepositorio.buscarTodos()
    	if (!usuarios) {
       	return resposta.status(404).json({erro: 'Não Há Usuários no Banco de Dados'})
    	} 
      	return resposta.status(200).json(usuarios)
  	},
    /**
        * Lida com a requisição POST recebendo dados sobre um novo usuário e colocando no banco de dados caso tenha permissão, caso não
		* tenha permissão ou o usuário ja tenha sido cadastrado a resposta é um erro(400)
        * @memberof usuarioControladora
        * @method inserir
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Promise} O retorno nessa função é desnecessário e é feito só para não gerar confusão quanto ao fim da função, o que importa é a chamada dos metodos do objeto "resposta", essa chamada seleciona um status para o resposta e prepara o conteudo
    */
	inserir: async function (requisicao, resposta, proximo) {
		const dados = requisicao.body
		const permissaoDoUsuario = requisicao.permissao
		const somenteDigitosPermissao = /^\d+$/.test(dados.permissao)

		if (permissaoDoUsuario > 2) {
			return resposta.status(401).json({erro : 'Acesso Não Autorizado'})
		}
		
		if (!dados.nome || !dados.senha || !dados.permissao) {
			return resposta.status(400).json({erro : 'Estão Faltando Campos'})
		}
		
		const usuarioJaExiste =  await usuarioRepositorio.buscar(dados.nome)
		
		if (usuarioJaExiste) {
			return resposta.status(400).json({erro : 'Usuário Já Cadastrado'})
		}

		if (!somenteDigitosPermissao) {
			return resposta.status(400).json({erro : 'Permissão Inválida'})
		}

		if (dados.permissao < 1 || dados.permissao > 4 ) {
			return resposta.status(400).json({erro : 'Nível de Permissão Inválido'})
		}
		const sal = await bcrypt.genSalt()
		const hash = await bcrypt.hash(dados.senha, sal)
		dados.senha = hash
		await usuarioRepositorio.inserir(dados)
		usuarioCriado = await usuarioRepositorio.buscar(dados.nome)
		delete usuarioCriado.senha
		requisicao.nome = usuarioCriado.nome
		proximo()
		return resposta.status(201).json(usuarioCriado)
	},
    /**
        * Lida com a requisição DELETE recebendo dados sobre um usuário e o removendo do banco de dados caso exista, caso contrário responde com um erro(400)
        * @memberof usuarioControladora
        * @method remover
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Promise} O retorno nessa função é desnecessário e é feito só para não gerar confusão quanto ao fim da função, o que importa é a chamada dos metodos do objeto "resposta", essa chamada seleciona um status para o resposta e prepara o conteudo
    */
	remover: async function (requisicao, resposta, proximo) {
		const nomeDeUsuario = requisicao.params.usuario
		const permissaoDoUsuario = requisicao.permissao
		const usuarioExiste = await usuarioRepositorio.buscar(nomeDeUsuario)

		if (permissaoDoUsuario > 1) {
			return resposta.status(401).json({erro : 'Acesso Não Autorizado'})
		}		
 		
 		if (!usuarioExiste) {
			return resposta.status(404).json({erro : 'Usuário Não Encontrado'})
		}
		
		await usuarioRepositorio.remover(nomeDeUsuario)
		requisicao.nome = usuarioExiste.nome
		proximo()
		return resposta.status(200).json({resultado :'Membro Deletado com Sucesso'})
	},
    /**
        * Lida com a requisição PUT recebendo novos dados sobre um usuário já existente e alterando eles no banco de dados, caso o usuário não exista, nenhum dado foi enviado ou os novos dados já estejam em uso por outro usuário é enviado um erro(400) como resposta
        * @memberof usuarioControladora
        * @method editar
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Promise} O retorno nessa função é desnecessário e é feito só para não gerar confusão quanto ao fim da função, o que importa é a chamada dos metodos do objeto "resposta", essa chamada seleciona um status para o resposta e prepara o conteudo
    */
	editar: async function (requisicao, resposta, proximo) {
		const nomeDeUsuario = requisicao.params.usuario
		const permissaoDoUsuario = requisicao.permissao
		const dados = requisicao.body
		const usuarioExiste = await usuarioRepositorio.buscar(nomeDeUsuario)
		const somenteDigitosPermissao = /^\d+$/.test(dados.permissao)

		if (permissaoDoUsuario > 1) {
			return resposta.status(401).json({erro : 'Acesso Não Autorizado'})
		}
		
		if (!usuarioExiste) {
			return resposta.status(400).json({erro : 'Usuário Não Encontrado'})
		}

		if (Object.keys(dados).length === 0) {
			return resposta.status(400).json({erro: 'Requisição Vazia'})
		}
		
		if(dados.nomeDeUsuario){
			const usuarioJaExiste = await usuarioRepositorio.buscar(dados.nome)
			
			if (usuarioJaExiste) {
				return resposta.status(400).json({erro: 'Nome de Usuário Já Cadastrado'})
			}
		}

		if (dados.permissao || dados.permissao === 0) {
			
			if (!somenteDigitosPermissao) {
				return resposta.status(400).json({erro : 'Permissão Inválida'})
			}

			if (dados.permissao  < 1 || dados.permissao > 4) {
			return resposta.status(400).json({erro : 'Nível de Permissão Inválido'})
			}
		}
		await usuarioRepositorio.editar(dados, nomeDeUsuario)
		
		if (dados.nome) {
			requisicao.nome = usuarioExiste.nome
			proximo()			
			resultado = await usuarioRepositorio.buscar(dados.nome)
			delete resultado.senha
			return resposta.status(200).json(resultado)
		} 
		
		resultado = await usuarioRepositorio.buscar(nomeDeUsuario)
		delete resultado.senha
		requisicao.nome = usuarioExiste.nome
		proximo()
		return resposta.status(200).json(resultado)
	},
    /**
        * Lida com a requisição POST recebendo o valor do rfid e colocando no banco de dados
        * @memberof usuarioControladora
        * @method mudarSenha
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Promise} O retorno nessa função é desnecessário e é feito só para não gerar confusão quanto ao fim da função, o que importa é a chamada dos metodos do objeto "resposta", essa chamada seleciona um status para o resposta e prepara o conteudo
    */
	mudarSenha: async function (requisicao, resposta, proximo) {
		const permissaoDoUsuario = requisicao.permissao
		const usuarioLogado = requisicao.usuario
		const nomeDeUsuario = requisicao.params.usuario
		const senha = requisicao.body.senha
		const usuarioExiste = await usuarioRepositorio.buscar(nomeDeUsuario)

		if (permissaoDoUsuario > 1) {
			
			if (usuarioLogado !== nomeDeUsuario) {
				return resposta.status(401).json({erro : 'Acesso Não Autorizado'})
			}
		}
		
		if (!usuarioExiste) {
			return resposta.status(400).json({erro : 'Usuário Não Encontrado'})
		}

		const sal = await bcrypt.genSalt() 
		const hash = await bcrypt.hash(senha, sal)
		await usuarioRepositorio.mudarSenha(hash,nomeDeUsuario)
		requisicao.nome = usuarioExiste.nome
		proximo()
		return  resposta.status(200).json({resultado: 'Senha Alterada com Sucesso'})
	}
}

module.exports = usuarioControladora