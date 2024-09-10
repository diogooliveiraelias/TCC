const express = require('express');
const app = express();
const mysql = require('mysql');
const crypto = require('crypto');
const path = require('path');
const bcrypt = require("bcrypt");
const saltRounds = 10;
const formidable = require('formidable');
const bodyParser = require('body-parser');
const cors = require('cors');
const flash = require('express-flash');
const events = require('./events');

var session = require('express-session');

module.exports = app;

app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static("public"));
app.use(express.json());
app.use(flash());

// Sessão
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: false,
    saveUninitialized: true
}));
/*
const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "user_mysql09",
    password: "kjV6Jr6wIZo0",
    database: "db_mysql09"
});
*/
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "teste"
});

// Base de dados - Usuário - Senha MySQL: db_mysql09 - user_mysql09 - kjV6Jr6wIZo0
con.connect(function (err) {
    if (err) throw err;
    console.log("Conectado!");
});

//Rotas

app.post('/events', (req, res) => {
    events.addEvent(req, res);
});

app.get('/events', (req, res) => {
    events.getEvents(req, res);
});

app.get('/', (req, res) => {
    res.render('index.ejs');
});

//Visualizar perfil
app.get('/perfil', function (req, res) {
    if (req.session.logado) {
        var id = req.session.id_usuario;
        var sql = "SELECT * FROM tb_usuario WHERE id_usuario = ?"

        con.query(sql, id, function (err, result) {
            res.render('perfil', { dadosNome: req.session.username, dadosEmail: req.session.email, dadosId: req.session.id_usuario })
        })
    }
});

//Rota para abrir a view atualizar perfil
app.get('/editaPerfil/:id', function (req, res) {
    if (req.session.logado) {
        var id = req.params.id;
        var sql = "SELECT * FROM tb_usuario WHERE id_usuario = ?";

        con.query(sql, id, function (err, result) {
            if (err) throw err;
            res.render('editaPerfil', { dadosNome: req.session.username, dadosEmail: req.session.email, dadosId: req.session.id_usuario });
        });
    } else {
        res.render('login.ejs', { mensagem: "Realize login ou cadastre-se para ter acesso a essa página" })
    }
})

//Rota para atualizar perfil
app.post('/editaPerfil/:id', function (req, res) {
    var id = req.session.id_usuario;
    var sql = "UPDATE tb_usuario SET nome = ?, email = ? where id_usuario = " + id + "";
    var values = [
        [req.body['nome']], [req.body['email']], [id]
    ];
    con.query(sql, values, function (err, result) {
        if (err) throw err;
        var sql = "SELECT * FROM tb_usuario WHERE id_usuario = " + id + "";
        con.query(sql, function (err, result) {
            if (err) throw err;
            req.session.logado = true;
            req.session.username = result[0]['nome'];
            req.session.id_usuario = result[0]['id_usuario'];
            req.session.email = result[0]['email'];
            res.render('perfil', { dadosId: req.session.id_usuario, dadosNome: req.session.username, dadosEmail: req.session.email });
        });
    });
});

//Calendário
app.get('/calendario', function (req, res) {
    if (req.session.logado) {
        res.render('calendario.ejs', { id_usuario: req.session.id_usuario });
    }
    else {
        res.render('login.ejs', { mensagem: "Realize login ou cadastre-se para ter acesso a essa página" })
    }
});

app.get('/deletaEvento/:id', function (req, res) {
    var id_calendario = req.params.id;

    var sql = "DELETE FROM tb_diario where id_calendario_FK = " + id_calendario;
    con.query(sql, id_calendario, function (err, result, fields) {
        if (err) throw err;
        console.log(result.affectedRows + " registro(s) deletado(s)");
    });

    var sql = "DELETE FROM tb_sono where id_calendario_FK = " + id_calendario;
    con.query(sql, id_calendario, function (err, result, fields) {
        if (err) throw err;
        console.log(result.affectedRows + " registro(s) deletado(s)");
    });

    var sql = "DELETE FROM tb_exercicios where id_calendario_FK = " + id_calendario;

    con.query(sql, id_calendario, function (err, result, fields) {
        if (err) throw err;
        console.log(result.affectedRows + " registro(s) deletado(s)");
    });
    var sql = "DELETE FROM tb_calendario where id_calendario = " + id_calendario;

    con.query(sql, id_calendario, function (err, result, fields) {
        if (err) throw err;
        console.log(result.affectedRows + " registro(s) deletado(s)");
    });
    res.render('calendario.ejs', { id_usuario: req.session.id_usuario });

});

//Tela de metas 
app.get('/editaMeta', function (req, res) {
    res.render('editaMeta.ejs');
});

app.get('/metas', function (req, res) {
    if (req.session.logado) {
        var id = req.session.id_usuario;
        var sql = "SELECT * FROM tb_metas WHERE id_usuario_FK = " + id + " AND concluida = 0";
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            dadosMeta1 = result;
        });

        var sql = "SELECT * FROM tb_metas WHERE id_usuario_FK = " + id + " AND concluida = 1";
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            dadosMeta2 = result;
        });

        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.render('metas.ejs', { dadosNome: req.session.username });
        });

    }
    else {
        res.render('login.ejs', { mensagem: "Realize login ou cadastre-se para ter acesso a essa página" })
    }
});

app.post('/addMeta', function (req, res) {
    var id = req.session.id_usuario;
    var descricao = req.body.meta;
    var sql = "INSERT INTO tb_metas (id_usuario_FK, descricao, concluida) VALUES ?"
    var values = [
        [id, descricao, 0]
    ];
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Numero de registros inseridos: " + result.affectedRows);
    });
    res.redirect('/metas');
});

app.get('/delete/:id_meta', function (req, res) {
    if (req.session.logado) {
        var idMeta = req.params.id_meta;

        var sql = "DELETE FROM tb_metas WHERE id_meta = ?";
        con.query(sql, idMeta, function (err, result) {
            if (err) throw err;
            console.log(result.affectedRows + " registro(s) deletado(s)");
        });
        res.redirect('/metas');
    } else {
        res.render('login.ejs', { mensagem: "Realize login ou cadastre-se para ter acesso a essa página" })
    }
});

app.post('/editaMeta/:id_meta', function (req, res) {
    var id = req.session.id_usuario
    var idMeta = req.params.id_meta;
    var sql = "UPDATE tb_metas SET id_usuario_FK = ?, descricao = ? WHERE id_meta = ?";
    var values = [
        [id], [req.body['nome']], [idMeta]
    ];

    con.query(sql, values, function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " registro(s) alterado(s)");;
        res.redirect('/metas');
    });
});

app.get('/editaMeta/:id', function (req, res) {
    if (req.session.logado) {
        var idMeta = req.params.id;
        var sql = "SELECT * FROM tb_metas where id_meta = " + idMeta + "";
        con.query(sql, function (err, result) {
            if (err) throw err;
            var nomeMeta = result[0].descricao;
            res.render('editaMeta.ejs', { dadosId: idMeta, nomeMeta: nomeMeta });
        });
    } else {
        res.render('login.ejs', { mensagem: "Realize login ou cadastre-se para ter acesso a essa página" })
    };
});

app.get('/meta/:id_meta', (req, res) => {

    var id = req.session.id_usuario
    var idMeta = req.params.id_meta;

    var sql = "SELECT * FROM tb_metas where id_meta = " + idMeta + "";
    con.query(sql, function (err, result) {
        if (err) throw err;
        var descricao = result[0]['descricao'];
        var concluida = result[0]['concluida'];

        if (concluida == 0) {
            var sql = "UPDATE tb_metas SET id_usuario_FK = ?, descricao = ?, concluida = ? WHERE id_meta = " + idMeta + "";;
            var values = [
                [id], [descricao], [1]
            ];

            con.query(sql, values, function (err, result) {
                console.log("concluida = 0");
                if (err) throw err;
                console.log(result.affectedRows + " registro(s) alterado(s)");;
                res.redirect('/metas');
            });
        } else {
            if (concluida == 1) {
                var sql = "UPDATE tb_metas SET id_usuario_FK = ?, descricao = ?, concluida = ? WHERE id_meta = " + idMeta + "";;
                var values = [
                    [id], [descricao], [0]
                ];

                con.query(sql, values, function (err, result) {
                    console.log("concluida = 1");
                    if (err) throw err;
                    console.log(result.affectedRows + " registro(s) alterado(s)");;
                    res.redirect('/metas');
                });
            }
        }
    });
});

//Cadastro, login e logout
app.get('/login', function (req, res) {
    res.render('login.ejs', { mensagem: req.flash('error') });
});

app.post('/login', function (req, res) {
    var senha = req.body['senha']
    var email = req.body['email']
    var sql = "SELECT * FROM tb_usuario where email = ?";
    con.query(sql, [email], function (err, result) {
        if (err) throw err;
        if (result.length) {
            bcrypt.compare(senha, result[0]['senha'], function (err, resultado) {
                if (err) throw err;
                if (resultado) {
                    req.session.logado = true;
                    req.session.username = result[0]['nome'];
                    req.session.id_usuario = result[0]['id_usuario'];
                    req.session.email = result[0]['email'];
                    res.render('calendario.ejs', { id_usuario: req.session.id_usuario });
                    res.end();
                }
                else { res.render('login', { mensagem: "Senha inválida" }) }
            });
        }
        else { res.render('login.ejs', { mensagem: "Usuário inexistente" }) }
    });
});

app.get('/logout', function (req, res) {
    req.session.logado = false;
    res.render('login.ejs', { mensagem: "Realize login ou cadastre-se para ter acesso a essa página" })
});

app.get('/cadastro', function (req, res) {
    res.render('cadastro.ejs', { mensagem: req.flash('error') });
});

app.post('/cadastro', function (req, res) {
    bcrypt.hash(req.body['senha'], saltRounds, function (err, hash) {
        var id_usuario
        var nome = req.body['nome']
        var senha = req.body['senha']
        var confSenha = req.body['confSenha']
        var email = req.body['email']

        if (senha.length >= 8) { //Verifica se a senha tem mais de 8 caracteres
            if (senha === confSenha) { //Verifica se a senha e a confirmação de senha são iguais
                var sql = "SELECT * FROM tb_usuario where email = ?";
                con.query(sql, [email], function (err, result) {
                    if (err) throw err;
                    if (result.length > 0) { //Verifica se o email já foi cadastrado
                        req.flash('error', 'Email já cadastrado');
                        res.redirect('/cadastro');
                    } else {
                        var sql = "INSERT INTO tb_usuario (nome, email, senha) VALUES ?";
                        var values = [
                            [req.body['nome'], req.body['email'], hash]
                        ];
                        con.query(sql, [values], function (err, result) {
                            if (err) throw err;
                            console.log("Numero de registros inseridos: " + result.affectedRows);
                        });
                        res.redirect('/login');
                    }
                });
            } else {
                req.flash('error', 'As duas senhas não coincidem');
                res.redirect('/cadastro');
            }
        } else {
            req.flash('error', 'A senha precisa ter ao menos 8 caracteres');
            res.redirect('/cadastro');
        }
    });
});

app.listen(3116, function () {
    console.log("Servidor escutando na porta 3116");
});