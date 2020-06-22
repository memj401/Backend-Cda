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
    resultado = await bancoDeDados.query(`SELECT * FROM "membros" WHERE "${parametro}" = '${valor}';`)
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
  * @returns {Boolean} Retorno verdadeiro utilizado apenas para determinar o fim da função
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
    return resultado.rows
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
  },
  /**
  * Busca o id associado a um determinado conhecimento no Banco de Dados, sendo que a busca é case insensitive
  * @memberof MembroRepositorio
  * @async
  * @method buscarIdConhecimento
  * @parameter {String} conhecimento - nome do conhecimento pelo qual será feita a busca
  * @returns {Integer}  Retorna o identificador numérico associado ao conhecimento buscado se este existe, do contrário retorna-se falso
  */
 buscarIdConhecimento: async function (conhecimento) {
    resultado = await bancoDeDados.query(`SELECT "id_conhecimento" FROM "conhecimentos" WHERE "conhecimento" ILIKE '${conhecimento}%';`)
    if (Object.keys(resultado.rows).length === 0) {
      return false
    }
    return resultado.rows[0].id_conhecimento
  },
  /**
  * Insere um conhecimento não catalogado no Banco de Dados, mais especificamenta na tabela de Conhecimentos
  * @memberof MembroRepositorio
  * @async
  * @method inserirConhecimento
  * @parameter {String} conhecimento - nome do conhecimento pelo qual será feita a busca
  * @returns {Integer} Retorna o identificador numérico associado ao conhecimento adicionado na tabela
  */
   inserirConhecimento: async function (conhecimento) {
    resultado = await bancoDeDados.query(`INSERT INTO "conhecimentos" ("conhecimento") VALUES ('${conhecimento}') RETURNING "id_conhecimento";`)
    return resultado.rows[0].id_conhecimento
  },
  /**
  * Adiciona um determinado conhecimento ao membro, juntamente com seu nivel de proficiência
  * @memberof MembroRepositorio
  * @async
  * @method inserirConhecimentoDoMembro
  * @parameter {Integer} idMembro - identificador do membro ao qual o conhecimento será adicionado
  * @parameter {Integer} idConhecimento - identificador do conhecimento que será adicionado ao membro
  * @parameter {String} nivel - indica o nível de proficiência do membro, variando entre iniciante; intermediário e avançado
  * @returns {Boolean} Retorno verdadeiro utilizado apenas para determinar o fim da função
  */
   inserirConhecimentoDoMembro: async function (idMembro,idConhecimento, nivel) {
    await bancoDeDados.query(`INSERT INTO "relacao_membros_conhecimentos"("id_membro", "id_conhecimento", "nivel") 
      VALUES (${idMembro}, ${idConhecimento},'${nivel}');`,
      function (erro, resposta) {
        if (erro) {
          console.log(erro)
        }
      })
    return true
  },
  /**
  * Verifica se o conhecimento a ser adicinado ao membro já existe no Banco de Dados
  * @memberof MembroRepositorio
  * @async
  * @method verficarConhecimentoRepetido
  * @parameter {Integer} idMembro - identificador do membro ao qual o conhecimento seria adicionado
  * @parameter {Integer} idConhecimento - identificador do conhecimento que seria adicionado ao membro
  * @returns {Object} Retorna as informações da tabela caso o membro já tenha este conhecimento no Banco de Dados, do contrário retorna-se falso.
  */
  verficarConhecimentoRepetido: async function (idMembro, idConhecimento) {
    resultado = await bancoDeDados.query(`SELECT * FROM "relacao_membros_conhecimentos" WHERE  "id_membro"  = ${idMembro} AND "id_conhecimento" = ${idConhecimento};`)
    if (Object.keys(resultado.rows).length === 0) {
      return false
    }
    return resultado.rows[0] 
  },
  /**
  * Lista os id's e o nível de proficiência de cada conhecimento associado ao membro
  * @memberof MembroRepositorio
  * @async
  * @method listarConhecimentos
  * @parameter {Integer} idMembro - identificador do membro ao qual será feito a listagem
  * @returns {Object} Retorna um array com o id e nível de todos os conhecimentos associados ao membro
  */
  listarConhecimentos: async function (idMembro) {
    resultado = await bancoDeDados.query(`SELECT * FROM "relacao_membros_conhecimentos" WHERE  "id_membro"  = ${idMembro};`)
    return resultado.rows
  },
  /**
  * Procura o nome de determinado conhecimento, dado seu identificador numérico
  * @memberof MembroRepositorio
  * @async
  * @method buscarNomeConhecimento
  * @parameter {Integer} idConhecimento - identificador numérico do conhecimento
  * @returns {String} Retorna o nome do conhecimento associado ao id fornecido
  */
  buscarNomeConhecimento: async function (idConhecimento) {
    resultado = await bancoDeDados.query(`SELECT "conhecimento" FROM "conhecimentos" WHERE  "id_conhecimento"  = ${idConhecimento};`)
    return resultado.rows[0].conhecimento
  }

}

module.exports = MembroRepositorio


