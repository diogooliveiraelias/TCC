const mysql = require('mysql');

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "teste"
});

const events = {
  getEvents: function (req, res) {
    var id_usuario = req.session.id_usuario;
    var sql = "SELECT * FROM tb_calendario WHERE id_usuario_FK = ?";
    con.query(sql, [id_usuario], function (err, results) {
      if (err) {
        console.error("Erro ao obter registros da tabela tb_calendario " + err.stack);
        return res.status(500).json({ error: "Erro ao obter registros da tabela tb_calendario" });
      }

      var id_calendario = results.map((row) => row.id_calendario);
      var sql = "SELECT * FROM tb_diario WHERE id_calendario_FK IN (?)";
      con.query(sql, [id_calendario], function (err, resultsDiario) {
        if (err) {
          console.error("Erro ao obter registros da tabela tb_diario " + err.stack);
          return res.status(500).json({ error: "Erro ao obter registros da tabela tb_diario" });
        }

        var sql = "SELECT * FROM tb_exercicios WHERE id_calendario_FK IN (?)";
        con.query(sql, [id_calendario], function (err, resultsExercicios) {
          if (err) {
            console.error("Erro ao obter registros da tabela tb_exercicios " + err.stack);
            return res.status(500).json({ error: "Erro ao obter registros da tabela tb_exercicios" });
          }

          var sql = "SELECT * FROM tb_sono WHERE id_calendario_FK IN (?)";
          con.query(sql, [id_calendario], function (err, resultsSono) {
            if (err) {
              console.error("Erro ao obter registros da tabela tb_sono " + err.stack);
              return res.status(500).json({ error: "Erro ao obter registros da tabela tb_sono" });
            }

            var diarioMapping = {};
            var exerciciosMapping = {};
            var sonoMapping = {};

            resultsDiario.forEach((diario) => {
              diarioMapping[diario.id_calendario_FK] = {
                humor: diario.humor,
                diario: diario.diario,
              };
            });

            resultsExercicios.forEach((exercicio) => {
              exerciciosMapping[exercicio.id_calendario_FK] = {
                tempoExercicio: exercicio.tempoExercicio,
                descricaoExercicio: exercicio.descricaoExercicio,
              };
            });

            resultsSono.forEach((sono) => {
              sonoMapping[sono.id_calendario_FK] = {
                horaDormiu: sono.horaDormiu,
                horaAcordou: sono.horaAcordou,
              };
            });

            var events = results.map((event) => {
              var diarioEntry = diarioMapping[event.id_calendario];
              var exercicioEntry = exerciciosMapping[event.id_calendario];
              var sonoEntry = sonoMapping[event.id_calendario];
              return {
                id: event.id_calendario,
                start: event.startDate,
                backgroundColor: event.backgroundColor,
                allDay: true,
                extendedProps: {
                  humor: diarioEntry?.humor,
                  diario: diarioEntry?.diario,
                  tempoExercicio: exercicioEntry ? exercicioEntry.tempoExercicio : null,
                  descricaoExercicio: exercicioEntry ? exercicioEntry.descricaoExercicio : null,
                  horaAcordou: sonoEntry ? sonoEntry.horaAcordou : null,
                  horaDormiu: sonoEntry ? sonoEntry.horaDormiu : null,
                },
              };
            });
            console.log(events);
            res.json(events);
          });
        });
      });
    });
  },

  addEvent: function (req, res) {
    var { startDate, id_usuario, backgroundColor } = req.body;
    console.log('ss' + startDate);
    var sql = "INSERT INTO tb_calendario (startDate, id_usuario_FK, backgroundColor) VALUES (?, ?, ?)";
    con.query(sql, [startDate, id_usuario, backgroundColor], (err, result) => {
      if (err) {
        console.error("Erro ao adicionar evento na tabela tb_calendario: " + err.stack);
        return res.status(500).send("Erro ao adicionar evento");
      }
      var id_calendario_FK = result.insertId;
      res.json({ id_calendario_FK });

      var { humor, diario } = req.body;
      var sql = "INSERT INTO tb_diario (humor, diario, id_calendario_FK) VALUES (?, ?, ?)";
      con.query(sql, [humor, diario, id_calendario_FK], (err, result) => {
        if (err) {
          console.error("Erro ao adicionar evento na tabela tb_diario: " + err.stack);
          return res.status(500).send("Erro ao adicionar evento");
        }
      });

      var { tempoExercicio, descricaoExercicio } = req.body;
      if (tempoExercicio && descricaoExercicio) {
        var sql = "INSERT INTO tb_exercicios (tempoExercicio, descricaoExercicio, id_calendario_FK) VALUES (?, ?, ?)";
        con.query(sql, [tempoExercicio, descricaoExercicio, id_calendario_FK], (err, result) => {
          if (err) {
            console.error("Erro ao adicionar evento na tabela tb_exercicios: " + err.stack);
            return res.status(500).send("Erro ao adicionar evento");
          }
        });
      }

      var {horaDormiu, horaAcordou } = req.body;
      if (horaDormiu !== null && horaAcordou !== null) {
        var sql = "INSERT INTO tb_sono (horaDormiu, horaAcordou, id_calendario_FK) VALUES (?, ?, ?)";
        con.query(sql, [horaDormiu, horaAcordou, id_calendario_FK], (err, result) => {
          if (err) {
            console.error("Erro ao adicionar evento na tabela tb_sono: " + err.stack);
            return res.status(500).send("Erro ao adicionar evento");
          }
        });
      }
    });
  },
}
module.exports = events;