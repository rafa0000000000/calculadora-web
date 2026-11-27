// variaveis para guardar os valores
let atual = "";             // numero que estou digitando (com virgula)
let anterior = "";          // primeiro numero da conta
let operador = "";          // + - * /
let recemCalculou = false;  // true depois de apertar o igual
let historico = [];         // lista das contas feitas

// pega o visor do html
const visor = document.getElementById("visor");


// ---------- trocar virgula e ponto ----------

// o js so entende ponto, entao troca a virgula por ponto antes de calcular
function paraNumero(texto) {
  return parseFloat(texto.replace(",", "."));
}

// depois da conta, troca o ponto por virgula para mostrar na tela
function paraTexto(numero) {
  return String(numero).replace(".", ",");
}


// ---------- numeros e virgula ----------

// quando clica em um numero
function digitar(n) {
  if (recemCalculou) {   // se acabou de calcular, comeca um numero novo
    atual = "";
    recemCalculou = false;
  }
  atual += n;            // adiciona o numero no final
  visor.textContent = atual;
}

// quando clica na virgula
function ponto() {
  if (recemCalculou) {
    atual = "";
    recemCalculou = false;
  }
  if (atual.includes(",")) return;   // nao deixa colocar duas virgulas
  if (atual == "") {
    atual = "0,";                    // se nao tem nada, comeca com 0,
  } else {
    atual = atual + ",";
  }
  visor.textContent = atual;
}


// ---------- operacoes ----------

// quando clica em + - * /
function operacao(op) {
  if (atual == "") return;   // se nao digitou numero, nao faz nada
  anterior = atual;          // guarda o primeiro numero
  operador = op;             // guarda o operador
  atual = "";                // limpa para digitar o segundo numero
  recemCalculou = false;
  visor.textContent = anterior + " " + op;
}

// quando clica no igual
function calcular() {
  if (operador == "") return;   // precisa ter operador
  if (atual == "") return;      // precisa do segundo numero

  // transforma o texto em numero
  const a = paraNumero(anterior);
  const b = paraNumero(atual);
  let resultado;

  // faz a conta
  if (operador == "+") resultado = a + b;
  if (operador == "-") resultado = a - b;
  if (operador == "*") resultado = a * b;
  if (operador == "/") {
    // nao pode dividir por zero
    if (b == 0) {
      limpar();
      visor.textContent = "Divisão por zero!";
      return;
    }
    resultado = a / b;
  }

  // arredonda (evita 0.1 + 0.2 dar 0.30000000000000004)
  resultado = parseFloat(resultado.toFixed(10));

  // salva no historico
  adicionarHistorico(anterior + " " + operador + " " + atual + " = " + paraTexto(resultado));

  // prepara para a proxima conta
  atual = paraTexto(resultado);
  anterior = "";
  operador = "";
  recemCalculou = true;
  visor.textContent = atual;
}


// ---------- opcionais ----------

// porcentagem (divide por 100)
function porcentagem() {
  if (atual == "") return;
  atual = paraTexto(paraNumero(atual) / 100);
  visor.textContent = atual;
}

// raiz quadrada
function raiz() {
  if (atual == "") return;
  const n = paraNumero(atual);

  // nao existe raiz de numero negativo
  if (n < 0) {
    limpar();
    visor.textContent = "Entrada inválida!";
    return;
  }

  const resultado = parseFloat(Math.sqrt(n).toFixed(10));
  adicionarHistorico("√" + atual + " = " + paraTexto(resultado));
  atual = paraTexto(resultado);
  recemCalculou = true;
  visor.textContent = atual;
}

// apaga o ultimo digito
function apagar() {
  if (recemCalculou) return;                       // nao apaga resultado pronto
  atual = atual.slice(0, -1);                      // tira o ultimo caractere
  if (atual == "") {
    visor.textContent = "0";                       // se ficou vazio mostra 0
  } else {
    visor.textContent = atual;
  }
}

// limpa tudo (botao C)
function limpar() {
  atual = "";
  anterior = "";
  operador = "";
  recemCalculou = false;
  visor.textContent = "0";
}


// ---------- historico ----------

// guarda a conta na lista e atualiza a tela
function adicionarHistorico(texto) {
  historico.push(texto);
  mostrarHistorico();
}

// mostra a lista na pagina
function mostrarHistorico() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";                               // limpa a lista antes
  for (let i = historico.length - 1; i >= 0; i--) {   // de tras pra frente, a mais nova fica em cima
    const li = document.createElement("li");          // cria um item
    li.textContent = historico[i];                    // coloca o texto
    lista.appendChild(li);                            // coloca na lista
  }
}

// apaga o historico
function limparHistorico() {
  historico = [];
  mostrarHistorico();
}


// ---------- tema ----------

// liga e desliga a classe "escuro" (o css muda as cores)
function alternarTema() {
  document.body.classList.toggle("escuro");
}


// ---------- teclado ----------

// quando aperta uma tecla
document.addEventListener("keydown", function (e) {
  let tecla = e.key;   // a tecla apertada

  // numeros
  if (tecla == "0") digitar("0");
  if (tecla == "1") digitar("1");
  if (tecla == "2") digitar("2");
  if (tecla == "3") digitar("3");
  if (tecla == "4") digitar("4");
  if (tecla == "5") digitar("5");
  if (tecla == "6") digitar("6");
  if (tecla == "7") digitar("7");
  if (tecla == "8") digitar("8");
  if (tecla == "9") digitar("9");

  // virgula (aceita ponto tambem, por causa do teclado numerico)
  if (tecla == ",") ponto();
  if (tecla == ".") ponto();

  // operadores
  if (tecla == "+") operacao("+");
  if (tecla == "-") operacao("-");
  if (tecla == "*") operacao("*");
  if (tecla == "/") operacao("/");

  // outras teclas
  if (tecla == "Enter") {
    e.preventDefault();   // evita apertar o botao selecionado sem querer
    calcular();
  }
  if (tecla == "=") calcular();
  if (tecla == "Backspace") apagar();
  if (tecla == "Escape") limpar();
  if (tecla == "%") porcentagem();
});