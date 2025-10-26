const express = require("express");
const app = express();
const port = 3000;

// Servir arquivos estáticos (CSS)
app.use(express.static("public"));

app.get("/", (req, res) => {
  const { idade, sexo, salario_base, anoContratacao, matricula } = req.query;

  // Validação básica
  if (
    !idade || !sexo || !salario_base || !anoContratacao || !matricula ||
    isNaN(idade) || isNaN(salario_base) || isNaN(anoContratacao) || isNaN(matricula) ||
    idade <= 16 || salario_base <= 0 || anoContratacao <= 1960 || matricula <= 0
  ) {
    return res.send(`
      <html>
        <head><link rel="stylesheet" href="/style.css"></head>
        <body>
          <h1>Dados inválidos!</h1>
          <p>Verifique se os valores informados são válidos:</p>
          <ul>
            <li>Idade > 16</li>
            <li>Salário base > 0</li>
            <li>Ano de contratação > 1960</li>
            <li>Matrícula > 0</li>
          </ul>
          <p>Exemplo de uso:<br>
          <code>http://localhost:3000/?idade=30&sexo=M&salario_base=2000&anoContratacao=2010&matricula=123</code></p>
        </body>
      </html>
    `);
  }

  const idadeNum = parseInt(idade);
  const salario = parseFloat(salario_base);
  const anoAtual = new Date().getFullYear();
  const tempoEmpresa = anoAtual - parseInt(anoContratacao);
  const sexoUpper = sexo.toUpperCase();

  // Determinar faixa etária
  let faixa, reajuste, desconto, acrescimo;
  if (idadeNum >= 18 && idadeNum <= 39) {
    faixa = "18 - 39";
    reajuste = sexoUpper === "M" ? 0.10 : 0.08;
    desconto = sexoUpper === "M" ? 10 : 11;
    acrescimo = sexoUpper === "M" ? 17 : 16;
  } else if (idadeNum >= 40 && idadeNum <= 69) {
    faixa = "40 - 69";
    reajuste = sexoUpper === "M" ? 0.08 : 0.10;
    desconto = sexoUpper === "M" ? 5 : 7;
    acrescimo = sexoUpper === "M" ? 15 : 14;
  } else if (idadeNum >= 70 && idadeNum <= 99) {
    faixa = "70 - 99";
    reajuste = sexoUpper === "M" ? 0.15 : 0.17;
    desconto = sexoUpper === "M" ? 15 : 17;
    acrescimo = sexoUpper === "M" ? 13 : 12;
  } else {
    return res.send("<h1>Idade fora da faixa válida (18 a 99 anos)</h1>");
  }

  // Calcular novo salário
  const reajusteValor = salario * reajuste;
  let novoSalario;

  if (tempoEmpresa <= 10) {
    novoSalario = salario + reajusteValor - desconto;
  } else {
    novoSalario = salario + reajusteValor + acrescimo;
  }

  // Gera página de resposta
  res.send(`
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Resultado do Reajuste</title>
        <link rel="stylesheet" href="/style.css">
      </head>
      <body>
        <div class="container">
          <h1> Reajuste Salarial</h1>
          <p><strong>Matrícula:</strong> ${matricula}</p>
          <p><strong>Sexo:</strong> ${sexoUpper}</p>
          <p><strong>Idade:</strong> ${idadeNum} anos (Faixa ${faixa})</p>
          <p><strong>Ano de Contratação:</strong> ${anoContratacao}</p>
          <p><strong>Tempo de Empresa:</strong> ${tempoEmpresa} anos</p>
          <p><strong>Salário Base:</strong> R$ ${salario.toFixed(2)}</p>
          <p><strong>Percentual de Reajuste:</strong> ${(reajuste * 100).toFixed(1)}%</p>
          <p><strong>${tempoEmpresa <= 10 ? "Desconto" : "Acréscimo"}:</strong> R$ ${tempoEmpresa <= 10 ? desconto : acrescimo}</p>
          <h2 class="resultado"> Novo Salário: R$ ${novoSalario.toFixed(2)}</h2>
        </div>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
