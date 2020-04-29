const bancoDeDados = require('../bancoDeDados/index')


const MembroRepositorio = {
  
  buscarUm: async function(id) {
    const resultado = await bancoDeDados.query(`SELECT * FROM "membros" WHERE "id" = ${id};`)
    return resultado.rows[0]
  },

  buscarUmPor: async function (parametro, valor) {
    resultado = await bancoDeDados.query(`SELECT * FROM "membros" WHERE "${parametro}" = '${valor}';`)
    return resultado.rows[0]
  },
  
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
  
  inserir: async function (dados)  {
    await bancoDeDados.query(`INSERT INTO "membros" ("nome","cargo","matricula","rfid") VALUES ( '${dados.nome}', '${dados.cargo}', '${dados.matricula}', '${dados.rfid}');`, 
    function (erro,resposta) {
      if (erro) {
      console.log(erro)
      }
   })
    return true
 },
 
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
    console.log(queryFinal)
    queryFinal += ` WHERE "id" = '${id}';`
    await bancoDeDados.query(queryFinal, 
      function (erro, resposta) {
      if (erro) {
        console.log(erro)
      }
    })
    return true
  },

  remover: async function  (id) {
    await bancoDeDados.query(`DELETE from "membros" WHERE "id" = ${id};`, 
    function  (erro, resposta) {
      if (erro) {
        console.log(erro)
      }
    })
  }

}

module.exports = MembroRepositorio


