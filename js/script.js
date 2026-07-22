// leitura.js

// Verifica se o navegador suporta a API de síntese de voz
if ('speechSynthesis' in window) {
    // Variáveis para controlar o estado da leitura
    let leituraAtiva = false;  // Flag para saber se a leitura está ativa
    let utterance = null;      // Objeto que armazena o texto sendo falado
    let textosParaLer = [];    // Array com todos os textos coletados da página
    let indiceAtual = 0;       // Índice do texto atual sendo lido

    // Seletores CSS dos elementos que devem ser lidos
    const elementosLegiveis = 'h1, h2, h3, p, li, span';

    // Função para coletar todos os textos legíveis da página
    function coletarTextos() {
        // Busca todos os elementos que correspondem aos seletores
        const elementos = document.querySelectorAll(elementosLegiveis);
        textosParaLer = []; // Reseta o array de textos
        
        // Itera sobre cada elemento encontrado
        elementos.forEach(el => {
            // Verifica se o elemento não está dentro de menus
            if (!el.closest('.menu') && !el.closest('.submenu') && !el.closest('nav')) {
                const texto = el.textContent.trim(); // Obtém o texto limpo (sem espaços extras)
                if (texto) {
                    textosParaLer.push(texto); // Adiciona ao array se não estiver vazio
                }
            }
        });
    }

    // Função que lê o próximo texto da lista
    function lerProximo() {
        // Verifica se deve parar a leitura
        if (!leituraAtiva || indiceAtual >= textosParaLer.length) {
            controlarLeitura(); // Desativa a leitura
            return;
        }

        // Cria um novo objeto de fala com o texto atual
        utterance = new SpeechSynthesisUtterance(textosParaLer[indiceAtual]);
        utterance.lang = 'pt-BR';     // Configura o idioma para Português Brasil
        utterance.rate = 1.0;         // Velocidade normal de fala
        
        // Quando terminar de ler este texto
        utterance.onend = function() {
            indiceAtual++;            // Vai para o próximo texto
            lerProximo();             // Chama recursivamente para ler o próximo
        };
        
        // Inicia a fala
        window.speechSynthesis.speak(utterance);
    }

    // Função principal que controla início/parada da leitura
    function controlarLeitura() {
        const botao = document.getElementById('botaoLeitura');
        
        // Se a leitura não está ativa, inicia
        if (!leituraAtiva) {
            leituraAtiva = true;
            botao.textContent = '⏹ Parar Leitura';
            botao.style.backgroundColor = '#f44336'; // Vermelho
            coletarTextos();      // Coleta os textos da página
            indiceAtual = 0;      // Começa do primeiro texto
            lerProximo();         // Inicia a leitura
        } 
        // Se está ativa, para
        else {
            leituraAtiva = false;
            botao.textContent = '🔊 Ler Página';
            botao.style.backgroundColor = '#4CAF50'; // Verde
            window.speechSynthesis.cancel(); // Para a síntese de voz
        }
    }

    // Prepara o botão de leitura na página
    function prepararBotao() {
        // Encontra o botão pelo atributo onmouseover
        const botao = document.querySelector('button[onmouseover*="Ler página"]');
        
        if (botao) {
            botao.id = 'botaoLeitura'; // Adiciona ID para fácil acesso
            botao.textContent = '🔊 Ler Página';
            botao.style.backgroundColor = '#4CAF50'; // Verde
            botao.style.cursor = 'pointer';
            botao.style.transition = 'background-color 0.1s'; // Efeito suave

            // Remove eventos antigos
            botao.removeAttribute('onclick');
            botao.removeAttribute('onmouseover');
            
            // Adiciona o novo evento de clique
            botao.addEventListener('click', controlarLeitura);
        }
    }

    // Quando o DOM estiver carregado, prepara o botão
    document.addEventListener('DOMContentLoaded', function() {
        // Timeout pequeno para garantir que tudo está carregado
        setTimeout(prepararBotao, 1);
    });

} else {
    // Caso o navegador não suporte síntese de voz
    console.warn('Síntese de voz não suportada');
    
    // Quando o DOM carregar, esconde o botão de leitura
    document.addEventListener('DOMContentLoaded', function() {
        const botao = document.querySelector('button[onmouseover*="Ler página"]');
        if (botao) botao.style.display = 'none';
    });
}

// ===================
//    Código do MENU 
// ===================
// Quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do menu
    const menuToggle = document.getElementById('menuToggle'); // Botão que abre/fecha
    const submenu = document.getElementById('submenu');       // Submenu que será mostrado

    // Se ambos elementos existirem
    if (menuToggle && submenu) {
        // Adiciona evento de clique no botão do menu
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault(); // Evita o comportamento padrão
            submenu.classList.toggle('open'); // Alterna a classe 'open' no submenu
        });
    }
});