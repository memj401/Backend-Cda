# **Introdução**
Implementação do Back-End do Projeto Interno de CdA da Mecajun.
O Back-End, de forma geral, trabalha com a integração entre os dados presentes no banco de dados da aplicação e o dados provenientes da aplicação em si, além de cuidar da parte de validação; autenticação e implementação das regras de negócio.

**No escopo deste projeto, o Back-End trabalha com os seguintes aspectos:**
- Validação dos Requests da Aplicação
- Comunicação com o Front-End via Requests HTTP
- Autenticação do Usuário, utilizando um sistema simples de login e JWT's
- Leitura e Modificação das informações do Banco de Dados, servindo de ponte entre este e a aplicação
- Criptografia e tratamento de informnações sensíveis, como senha dos usuários, no caso do CdA
- Manutenção do Log de Entradas lidas pelo sensor RFID

 # **Tecnologias Utilizadas**
Dentro do escopo de construção do servidor, optou-se por utilizar [Node.js](https://nodejs.org/en/) em função da sua  maior facilidade em lidar com aplicações Web e servidores, além da experiência prévia com a lingugagem que uma parcela da equipe possuía, assim, facilitando o aprendizado.
Além disso, vale ressaltar que o Front-End também foi desenvolvido em Javascript, logo utilizar Node facilitaria a integração entre ambos.
Em função disso, toda a comunicação entre o Front-End e Back-End é feita por JSON's (JavaScript Object Notation) a fim de facilitar o acesso às informações enviadas tanto pelo Front quanto pelo Back.

Quanto ao Banco de Dados, foi escolhido trabalhar com o [PostgreSQL](https://www.postgresql.org/) em função de experiência prévia de parcela da equipe com a ferramenta e por sua relativa facilidade de manuseio.

 Já na área de Autenticação, optou-se por utilizar JWT's (JSON Web Tokens) por ser um tecnologia bastante implementada em outras aplicações Web e sua compatibilidade natural com Javascript.

Por fim, na parte de Criptografia de Senhas, optou-se por aplicar a técnica de Hashing com Sal por ser uma técnica amplamente utilizada e segura, previnindo contra o  vazamento das senhas dos usuários, mesmo que obtido acesso direto ao Banco de Dados.

# **Estrutura de Desenvolvimento**
Esta seção se dedica a explicar a divisão geral em que os programas e funcionalidades encontram-se dentro do projeto.

O projeto está dividido nas seguintes partes:
- **[Banco de Dados](src/bancoDeDados):** Abstração da conexão entre PostgresSQL e o Node.js.
- **[Controladoras](src/Controladoras):** Responsáveis por estabelecer as regras de negócio da aplicação e realizar a validação dos requests.
- **[Middlewares](src/middlewares):** Funcionalidades intermediárias entre o request da aplicação e a controladora, são aplicadas em múltiplas rotas. 
- **[Repositórios](src/repositorios):** Servem como intermediários entre o Banco de Dados e a Controladora, definindo as formas de interação entre o Back-End e o Banco de Dados. 
- **[App.js](src/app.js):** Descreve as configurações do servidor.
- **[Index.js](src/index.js):** Representa o  servidor do Back-End em si, é o programa executado para checar o funcionamento geral.
- **[Rotas.js](src/rotas.js):** Estabelece as conexões entre a rota fornecida pela aplicação com o respectivo método a ser executado.

# **Módulos Utilizados:**
- [Express](https://github.com/expressjs/express): Módulo utilizado para criação de um servidor HTTP
- [Pg](https://node-postgres.com/): Módulo utilizado para estabelecer a cumunicação entre PostgreSQL e Node.js
- [Nodemon](https://github.com/remy/nodemon): Módulo utilizado para reinicialização automática do servidor sempre que houver mudanças no código
- [Njwt](https://github.com/jwtk/njwt): Módulo utilizado para criação e verificação de JWT's 

**Observação:**
Para utilizar o nodemon basta escrever o comando ``npm run servidor`` no diretório em que se encontra a pasta[src](src)
