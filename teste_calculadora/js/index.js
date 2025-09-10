// Seleciona elementos
const visor = document.getElementById("resultado"); // pega o elemento com id "resultado" (onde aparece o valor da conta)
const botoes = document.querySelectorAll("button"); // seleciona todos os botões da calculadora

let valorAtual = "";   // armazena o número que está sendo digitado agora
let valorAnterior = ""; // armazena o número anterior, usado em operações
let operador = null;    // guarda o operador atual (+, -, *, /, etc.)

// Função para arredondar e tratar imprecisão de ponto flutuante
function corrigirPrecisao(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100; 
  // soma uma fração mínima (EPSILON) e arredonda para 2 casas decimais
}

// Formata número no padrão brasileiro
function formatarNumero(num) {
  return new Intl.NumberFormat("pt-BR", { // cria formatador no padrão brasileiro
    minimumFractionDigits: 2, // sempre mostrar 2 casas decimais
    maximumFractionDigits: 2
  }).format(num); // retorna o número formatado (ex: 1234.5 -> "1.234,50")
}

// Exibir mensagem de erro no visor
function mostrarErro(msg) {
  visor.textContent = msg; // mostra a mensagem no visor
  valorAtual = "";         // limpa o valor atual
  valorAnterior = "";      // limpa o valor anterior
  operador = null;         // zera o operador
}

// Função de cálculo
function calcular() {
  const a = parseFloat(valorAnterior.replace(",", ".")); // converte valorAnterior em número
  const b = parseFloat(valorAtual.replace(",", "."));   // converte valorAtual em número

  if (isNaN(a) || isNaN(b)) {            // se algum valor não for número
    mostrarErro("Erro: valor inválido"); // mostra erro
    return;
  }

  let resultado = 0; // guarda o resultado da operação

  switch (operador) { // verifica qual operador foi usado
    case "+":
      resultado = a + b; // soma
      break;
    case "−":
    case "-":
      resultado = a - b; // subtração
      break;
    case "×":
    case "*":
      resultado = a * b; // multiplicação
      break;
    case "÷":
    case "/":
      if (b === 0) {                     // não pode dividir por 0
        mostrarErro("Erro: divisão por 0");
        return;
      }
      resultado = a / b; // divisão
      break;
    case "%":
      resultado = (a * b) / 100; // porcentagem
      break;
    default:
      return; // se não tiver operador válido, não faz nada
  }

  resultado = corrigirPrecisao(resultado);     // arredonda e corrige
  visor.textContent = formatarNumero(resultado); // mostra no visor formatado

  valorAtual = resultado.toString(); // guarda o resultado como próximo valor atual
  valorAnterior = "";                // zera o anterior
  operador = null;                   // zera o operador
}

// Função para processar entrada (tanto clique quanto teclado)
function processarEntrada(valor) {
  if (!isNaN(valor) || valor === ",") { // se for número ou vírgula
    if (valor === "," && valorAtual.includes(",")) return; // impede duas vírgulas no mesmo número
    valorAtual += valor;            // adiciona ao valor atual
    visor.textContent = valorAtual; // mostra no visor
  } 
  else if (["+", "−", "-", "×", "*", "÷", "/", "%"].includes(valor)) { // se for operador
    if (valorAtual === "") {                     // operador sem número antes
      mostrarErro("Erro: insira um número");
      return;
    }
    if (valorAnterior !== "") calcular(); // se já tiver um valorAnterior, calcula primeiro
    operador = valor;        // guarda o operador
    valorAnterior = valorAtual; // passa valorAtual para valorAnterior
    valorAtual = "";         // zera o atual para receber novo número
  } 
  else if (valor === "=" || valor === "Enter") { // se for igual/enter
    if (valorAtual === "" || valorAnterior === "") { // falta número
      mostrarErro("Erro: operação incompleta");
      return;
    }
    calcular(); // executa cálculo
  } 
  else if (valor === "C" || valor === "Escape") { // se for limpar
    valorAtual = "";
    valorAnterior = "";
    operador = null;
    visor.textContent = "0"; // reseta visor
  } 
  else if (valor === "⌫" || valor === "Backspace") { // se for apagar último dígito
    valorAtual = valorAtual.slice(0, -1);        // remove último caractere
    visor.textContent = valorAtual || "0";       // mostra o que restou ou 0
  }
}

// Eventos de clique nos botões
botoes.forEach((btn) => { // percorre todos os botões
  btn.addEventListener("click", () => {          // adiciona evento de clique
    processarEntrada(btn.textContent);           // processa o valor do botão
    soltarEmoji(btn); // 🎉 chama a função pra soltar o emoji no clique
  });
});

// Eventos de teclado físico
document.addEventListener("keydown", (e) => { // escuta teclas pressionadas
  let tecla = e.key;

  if (tecla === ".") tecla = ","; // converte ponto em vírgula para manter padrão BR

  processarEntrada(tecla); // processa a tecla digitada
});

// Lista de emojis aleatórios
const emojis = ["😂", "🤣", "🔥", "🚀", "✨", "😎", "👍", "💀", "💥", "🍕", "🍺", "🎉"];

// Função para soltar emoji
function soltarEmoji(botao) {
  const emoji = document.createElement("span"); // cria um span para o emoji
  emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)]; // escolhe emoji aleatório
  emoji.classList.add("emoji-explode"); // adiciona classe de animação

  const rect = botao.getBoundingClientRect(); // pega posição do botão
  emoji.style.left = rect.left + rect.width / 2 + "px"; // posiciona emoji no centro do botão
  emoji.style.top = rect.top + "px"; // posiciona no topo do botão

  document.body.appendChild(emoji); // adiciona emoji no corpo da página

  setTimeout(() => { 
    emoji.remove(); // remove o emoji depois de 1 segundo
  }, 1000);
}
