const bancoDeDados = require('../bancoDeDados/index')

/**
* Repositório de funções de acesso ao banco de dados de membros
* @namespace MembroRepositorio
*/

const MembroRepositorio = {
  /**
  * Busca no banco de dados por dados de um membro armazenados através de sua identificação no sistema
  * @memberof MembroRepositorio
  * @method buscarUm
  * @parameter {Number} id - Identificação numérica do membro a ser pesquisado no banco de dados
  * @returns {Object} Uma linha da tabela referente ao membro pesquisado
  */
 buscarUm: async function(id) {
    const resultado = await bancoDeDados.query(`SELECT * FROM "membros" WHERE "id_membro" = ${id};`)
    
    if (resultado.rows.length !== 0) {
      const conhecimentos = await bancoDeDados.query(`SELECT * FROM "relacao_membros_conhecimentos" 
        WHERE "id_membro" = ${id}`)
      for (i = 0; i <  conhecimentos.rows.length; i++) {
        nomeConhecimento = await bancoDeDados.query(`SELECT "nome" FROM "conhecimentos" 
          WHERE id_conhecimento = ${conhecimentos.rows[i].id_conhecimento}`)
        conhecimentos.rows[i].nome = nomeConhecimento.rows[0].nome
        delete conhecimentos.rows[i].id_membro  
      }
      resultado.rows[0].conhecimentos = conhecimentos.rows
    }
    
    return resultado.rows[0]
  },
  /**
  * Busca no banco de dados por um parametro igual a um valor específico e retorna o primeiro membro que se encaixa nele
  * @memberof MembroRepositorio
  * @async
  * @method buscarUmPor
  * @parameter {String} parametro - Parâmetro da tabela a ser comparado
  * @parameter {String} valor - Valor do parâmetro da tabela a ser pesquisado
  * @returns {Object} Uma linha da tabela referente ao membro pesquisado
  */
  buscarUmPor: async function (parametro, valor) {
    const resultado = await bancoDeDados.query(`SELECT * FROM "membros" WHERE "${parametro}" = '${valor}';`)
    return resultado.rows[0]
  },
  /**
  * Busca no banco de dados por um parametro igual a um valor específico e retorna um array com todos os membros que se encaixam.
  * Se não houver uma entrada válida de parametro ou valor, ele retorna todo os membros da tabela. Para os parâmetros 'cargo' e 'nome'
  * A pesquisa é case insensitive
  * @memberof MembroRepositorio
  * @async
  * @method buscarTodos
  * @parameter {String} parametro - Parâmetro da tabela a ser comparado
  * @parameter {String} valor - Valor do parâmetro da tabela a ser pesquisado
  * @returns {Object} Um array da tabela referente aos membros pesquisados
  */ 
  buscarTodos: async function(parametro, valor) {
    let resultado;
    if (parametro && valor) {
      if (parametro === 'cargo' || parametro === 'nome') {
        resultado = await bancoDeDados.query(`SELECT * FROM "membros" WHERE "${parametro}" ILIKE '${valor}%';`)
      } else {
        resultado = await bancoDeDados.query(`SELECT * FROM "membros" WHERE "${parametro}" = '${valor}';`)
      }
    } else {
      resultado = await bancoDeDados.query('SELECT * FROM "membros";')
    }
    if (resultado.rows.length !== 0) {
      for (let i = 0; i < resultado.rows.length; i++) {
        let conhecimentos = await bancoDeDados.query(`SELECT * FROM "relacao_membros_conhecimentos" 
          WHERE "id_membro" = ${resultado.rows[i].id_membro}`)
        for (let j = 0; j < conhecimentos.rows.length; j++) {
          nomeConhecimento = await bancoDeDados.query(`SELECT "nome" FROM "conhecimentos" 
            WHERE id_conhecimento = ${conhecimentos.rows[j].id_conhecimento}`)
          conhecimentos.rows[j].nome = nomeConhecimento.rows[0].nome
          delete conhecimentos.rows[j].id_membro
        }
        resultado.rows[i].conhecimentos = conhecimentos.rows
      }
    }
    return resultado.rows
  },
  /**
  * Insere um novo membro no banco de dados
  * @memberof MembroRepositorio
  * @async
  * @method inserir
  * @parameter {Object} dados - Informações do membro a ser adicionado na tabela contendo: nome,cargo,matricula e código rfid
  * @returns {Boolean} Retorno verdadeiro utilizado apenas para determinar o fim da função
  */
  inserir: async function (dados)  {
    await bancoDeDados.query(`INSERT INTO "membros" ("nome","cargo","matricula","rfid") VALUES ( '${dados.nome}', '${dados.cargo}', '${dados.matricula}', '${dados.rfid}');`, 
    function (erro,resposta) {
      if (erro) {
      console.log(erro)
      }
   })
    return true
 },
  /**
  * Edita, ou substitui, conteúdo de um membro já cadastrado no banco de dados
  * @memberof MembroRepositorio
  * @async
  * @method editar
  * @parameter {Object} dados - Novos dados do membro a serem atualizados
  * @parameter {Number} id - Identificação numérica do membro a ser pesquisado no banco de dados
  * @returns {Object} Retorna as informações atualizadas do membro
  */
  editar: async function (dados, id)  {
    const parametros = ['nome','cargo','matricula', 'rfid']
    let queryFinal = 'UPDATE "membros" SET '
    let parametroAnteriorFoiAtualizado = false
    
    for (i = 0; i < parametros.length; ++i) {
      if (dados[parametros[i]]) {
        if (parametroAnteriorFoiAtualizado) {
          queryFinal += ', '
        }
        queryFinal += `"${parametros[i]}" = '${dados[parametros[i]]}'`
        parametroAnteriorFoiAtualizado = true
      }
    }
    queryFinal += ` WHERE "id_membro" = ${id} RETURNING *;`
    const resultado = await bancoDeDados.query(queryFinal)
    return resultado.rows[0]
  },
  /**
  * Remove um membro já cadastrado no banco de dados através de sua identificação numérica
  * @memberof MembroRepositorio
  * @async
  * @method remover
  * @parameter {Integer} id - Identificação numérica do membro a ser pesquisado no banco de dados
  */
  remover: async function  (id) {
    await bancoDeDados.query(`DELETE from "membros" WHERE "id_membro" = ${id};`, 
    function  (erro, resposta) {
      if (erro) {
        console.log(erro)
      }
    })
  }
}

module.exports = MembroRepositorio


