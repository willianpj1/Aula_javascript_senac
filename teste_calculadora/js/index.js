// Seleciona elementos
const visor = document.getElementById("resultado");
const botoes = document.querySelectorAll("button");

let valorAtual = "";
let valorAnterior = "";
let operador = null;

// Função para arredondar e tratar imprecisão de ponto flutuante
function corrigirPrecisao(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

// Formata número no padrão brasileiro
function formatarNumero(num) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}

// Exibir mensagem de erro no visor
function mostrarErro(msg) {
  visor.textContent = msg;
  valorAtual = "";
  valorAnterior = "";
  operador = null;
}

// Função de cálculo
function calcular() {
  const a = parseFloat(valorAnterior.replace(",", "."));
  const b = parseFloat(valorAtual.replace(",", "."));

  if (isNaN(a) || isNaN(b)) {
    mostrarErro("Erro: valor inválido");
    return;
  }

  let resultado = 0;

  switch (operador) {
    case "+":
      resultado = a + b;
      break;
    case "−":
    case "-":
      resultado = a - b;
      break;
    case "×":
    case "*":
      resultado = a * b;
      break;
    case "÷":
    case "/":
      if (b === 0) {
        mostrarErro("Erro: divisão por 0");
        return;
      }
      resultado = a / b;
      break;
    case "%":
      resultado = (a * b) / 100;
      break;
    default:
      return;
  }

  resultado = corrigirPrecisao(resultado);
  visor.textContent = formatarNumero(resultado);

  valorAtual = resultado.toString();
  valorAnterior = "";
  operador = null;
}

// Função para processar entrada (tanto clique quanto teclado)
function processarEntrada(valor) {
  if (!isNaN(valor) || valor === ",") {
    if (valor === "," && valorAtual.includes(",")) return;
    valorAtual += valor;
    visor.textContent = valorAtual;
  } 
  else if (["+", "−", "-", "×", "*", "÷", "/", "%"].includes(valor)) {
    if (valorAtual === "") {
      mostrarErro("Erro: insira um número");
      return;
    }
    if (valorAnterior !== "") calcular();
    operador = valor;
    valorAnterior = valorAtual;
    valorAtual = "";
  } 
  else if (valor === "=" || valor === "Enter") {
    if (valorAtual === "" || valorAnterior === "") {
      mostrarErro("Erro: operação incompleta");
      return;
    }
    calcular();
  } 
  else if (valor === "C" || valor === "Escape") {
    valorAtual = "";
    valorAnterior = "";
    operador = null;
    visor.textContent = "0";
  } 
  else if (valor === "⌫" || valor === "Backspace") {
    valorAtual = valorAtual.slice(0, -1);
    visor.textContent = valorAtual || "0";
  }
}


// Eventos de clique nos botões
botoes.forEach((btn) => {
  btn.addEventListener("click", () => {
    processarEntrada(btn.textContent);
    soltarEmoji(btn); // 🎉 chama a função pra soltar o emoji
  });
});


// Eventos de teclado físico
document.addEventListener("keydown", (e) => {
  let tecla = e.key;

  if (tecla === ".") tecla = ","; // converte ponto em vírgula

  processarEntrada(tecla);
});
// Lista de emojis aleatórios
const emojis = ["😂", "🤣", "🔥", "🚀", "✨", "😎", "👍", "💀", "💥", "🍕", "🍺", "🎉"];

// Função para soltar emoji
function soltarEmoji(botao) {
  const emoji = document.createElement("span");
  emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  emoji.classList.add("emoji-explode");

  const rect = botao.getBoundingClientRect();
  emoji.style.left = rect.left + rect.width / 2 + "px";
  emoji.style.top = rect.top + "px";

  document.body.appendChild(emoji);

  setTimeout(() => {
    emoji.remove();
  }, 1000);
}
