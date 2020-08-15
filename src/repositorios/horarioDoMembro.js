const bancoDeDados = require('../bancoDeDados/index')

/**
* Repositório de funções de acesso ao banco de dados de horarios de permanência
* @namespace HorarioDoMembro
*/

const HorarioDoMembro = {
  /**
  * Insere todos os horarios especificados na tabela de Horário de Permanência, representada pela tabela "relacao_membros_horarios" 
  * @memberof HorarioDoMembro
  * @async
  * @method inserir
  * @parameter {Object} horarios - Array de objetos que contém os horários a serem inseridos
  * @returns {Boolean} Retorna verdadeiro com intuito de explicitar o fim do método
  */      
    inserir: async function (horarios) {

        for(let diaChave in horarios){
            const dia = horarios[diaChave]

            for(let horaChave in dia){
                const hora = dia[horaChave]

                for(let membro of hora.membros){
                    idMembro = membro.idMembro
                    idHorario = await HorarioDoMembro.buscarIdHorario(diaChave,horaChave)

                    await bancoDeDados.query(`INSERT INTO "relacao_membros_horarios"("id_membro","id_horario")
                    VALUES(${idMembro}, ${idHorario});`)
                }
            }
        }

        return true
    },
  /**
  * Procura pelo identificador numérico de um determinado horário, na tabela de horários
  * @memberof HorarioDoMembro
  * @async
  * @method buscarIdHorario
  * @parameter {String} dia - dia da semana do horário desejado
  * @parameter {String} horarioEntrada - hora de início do horário desejado 
  * @returns {Integer} Retorna o identificador numérico do horário, caso exista na tabela
  * Do contrário, retorna falso.
  */
    buscarIdHorario: async function (dia,horarioEntrada){
        id = await bancoDeDados.query(`SELECT  * FROM "horarios" WHERE "dia" = '${dia}' AND "entrada" = '${horarioEntrada}';`)
        if (id.rows.length !== 0) {
            return id.rows[0].id_horario
        }
        return false
    },
  /**
  * Procura pelas informações dos membros alocados em determinado horário
  * @memberof HorarioDoMembro
  * @async
  * @method buscarMembro
  * @parameter {Integer} idHorario - identificador numérico do horário
  * @returns {Object} Retorna um array de objetos que contém as informações dos membros alocados
  */
    buscarMembro: async function (idHorario){
        id = await bancoDeDados.query(`SELECT "id_membro" FROM "relacao_membros_horarios" WHERE "id_horario" = ${idHorario}`)
        let grupo  = []
        let bloco = {idHorario: idHorario}
        for(i=0;i<id.rows.length;i++){
            aux = await bancoDeDados.query(`SELECT "nome","id_membro" FROM "membros" WHERE "id_membro" = ${id.rows[i].id_membro}`)
            const membro = {nome : aux.rows[0].nome, idMembro : aux.rows[0].id_membro}
            grupo[i] = membro
        }
        bloco.membros = grupo
        return bloco
    },
  /**
  * Verifica se o membro está ou não alocado em algum horário
  * @memberof HorarioDoMembro
  * @async
  * @method checarMembro
  * @parameter {Integer} idMembro - identificador numérico do membro
  * @returns {Integer} Retorna o id do membro, caso ele esteja alocado em algum horário
   * Do contrário, retorna falso.
  */
    checarMembro: async function(idMembro){
        id = await bancoDeDados.query(`SELECT "id_membro" FROM "relacao_membros_horarios" WHERE "id_membro" = ${idMembro};`)
        if (id.rows.length !== 0) {
           return id.rows[0].id_membro 
        }
        return false
    },
  /**
  * Busca todos os horários e os membros alocados para cada horário
  * @memberof HorarioDoMembro
  * @async
  * @method buscarTudo
  * @returns {Object} Retorna um array com todos os horários e seus respectivos membros
  */
    buscarTudo: async function (){
        const lista = await bancoDeDados.query(`SELECT * FROM "horarios"`)
        var dados = {}
        var horario = {}
        for(i = 0; i <lista.rows.length; i++){
            let dia = lista.rows[i].dia
            let hora = lista.rows[i].entrada
            horario[hora] = {}
            dados[dia] = {...horario}
        }
        for (j = 0; j < lista.rows.length; j++) {
            let dia = lista.rows[j].dia
            let hora = lista.rows[j].entrada
            dados[dia][hora] = await this.buscarMembro(lista.rows[j].id_horario)
        }

        return dados
    },
  /**
  * Retira todos os membros alocados de todos os horários
  * @memberof HorarioDoMembro
  * @async
  * @method remover
  */
    remover: async function (){
        await bancoDeDados.query(`DELETE FROM "relacao_membros_horarios";`)       
        return null
    },
  /**
  * Busca pelo horário que determinado membro está alocado
  * @memberof HorarioDoMembro
  * @async
  * @method buscarMembro
  * @parameter {Integer} idMembro - identificador numérico do membro
  * @returns {Object} Retorna retorna as informações do horário desejado
  */    
    buscarHorarioDoMembro: async function (idMembro) {
        const idHorario = await bancoDeDados.query(`SELECT "id_horario" FROM "relacao_membros_horarios" WHERE "id_membro" = ${idMembro}';`)
        const horario = await bancoDeDados.query(`SELECT  * FROM "horarios" WHERE "id_horario" = ${idHorario.rows[0].id_horario}';`)

        return horario.rows[0]
    }
}

module.exports = HorarioDoMembro