/** Script que Adiciona Recrutadores no Linkedin com Menu e opção de limite de conexões
  * 
  * @author Fábio M Valente - https://github.com/fabiomvalente
  * @version 1.4
  Versão     | Data       | Descrição
  1.0        | 22-03-2025 | Melhorias para evitar erros quando atinge o limite semanal de conexões
  1.1        | 15-04-2025 | Incluso validação de limite de páginas atingido (não há mais possibilidade de clicar no Next)
  1.2        | 06-06-2025 | Adicionado contador de convites restantes e melhorias na interface
  1.3        | 07-06-2025 | Adicionado suporte para usuários Premium com limite semanal de 200 conexões
  1.4        | 11-07-2025 | Sistema de configuração externa e melhorias de segurança
 */    
// Configurações - Carregadas de variáveis globais definidas no config.js
let MY_NAME, MY_POSITION, POS_SEARCH, CONFIG;

// Função para carregar configurações das variáveis globais
function loadConfig() {
    // Verifica se as configurações foram carregadas (via config.js no console ou extensão)
    if (typeof window.LINKEDIN_CONFIG !== 'undefined') {
        const config = window.LINKEDIN_CONFIG;

        // Carrega informações pessoais
        MY_NAME = config.MY_NAME;
        MY_POSITION = config.MY_POSITION;
        POS_SEARCH = config.POS_SEARCH;

        // Carrega configuração completa
        CONFIG = {
            // Informações pessoais
            MY_NAME: config.MY_NAME,
            MY_POSITION: config.MY_POSITION,
            POS_SEARCH: config.POS_SEARCH,

            // Template de mensagem
            MESSAGE_TEMPLATE: config.MESSAGE_TEMPLATE || {
                TEXT: config.MESSAGE_TEMPLATE_TEXT || `Hi {firstName}, I hope you're doing well!

I'm a {MY_POSITION} from Brazil with experience in {POS_SEARCH}, seeking international opportunities.
I'd love to connect and expand my network.

Best regards,
    {MY_NAME}`,
                INCLUDE_NOTE: true
            },

            // Limites
            DEFAULT_LIMIT: config.DEFAULT_LIMIT || 100,
            PREMIUM_LIMIT: config.PREMIUM_LIMIT || 200,

            // Timing
            MIN_DELAY: config.MIN_DELAY || 1000,
            MAX_DELAY: config.MAX_DELAY || 3000,
            SCROLL_DELAY: config.SCROLL_DELAY || 5000,

            // Configurações de teste
            TEST_MODE: config.TEST_MODE || {
                ENABLED: false,
                PAUSE_BEFORE_SEND: true,
                SHOW_MESSAGE_PREVIEW: true,
                MAX_TEST_CONNECTIONS: 3
            },

            // UI
            UI: config.UI || {
                PANEL_POSITION: 'top-right',
                DETAILED_LOGS: true,
                AUTO_SCROLL: true
            }
        };

        return true;
    }

    // Fallback: verifica variáveis individuais (compatibilidade)
    if (typeof window.MY_NAME !== 'undefined' &&
        typeof window.MY_POSITION !== 'undefined' &&
        typeof window.POS_SEARCH !== 'undefined') {
        MY_NAME = window.MY_NAME;
        MY_POSITION = window.MY_POSITION;
        POS_SEARCH = window.POS_SEARCH;

        // Config básico para compatibilidade
        CONFIG = {
            MY_NAME: MY_NAME,
            MY_POSITION: MY_POSITION,
            POS_SEARCH: POS_SEARCH,
            MESSAGE_TEMPLATE: {
                TEXT: window.MESSAGE_TEMPLATE_TEXT || `Hi {firstName}, I hope you're doing well!

I'm a ${MY_POSITION} from Brazil with experience in ${POS_SEARCH}, seeking international opportunities.
I'd love to connect and expand my network.

Best regards,
    ${MY_NAME}`,
                INCLUDE_NOTE: true
            },
            DEFAULT_LIMIT: 100,
            PREMIUM_LIMIT: 200,
            MIN_DELAY: 1000,
            MAX_DELAY: 3000
        };

        return true;
    }

    return false;
}

// Função para gerar mensagem a partir do template configurado
function generateMessage(firstName) {
    if (!CONFIG || !CONFIG.MESSAGE_TEMPLATE) {
        // Fallback para template básico se config não estiver disponível
        return `Hi ${firstName}, I hope you're doing well!

I'm a ${MY_POSITION} from Brazil with experience in ${POS_SEARCH}, seeking international opportunities.
I'd love to connect and expand my network.

Best regards,
    ${MY_NAME}`;
    }

    return CONFIG.MESSAGE_TEMPLATE.TEXT
        .replace(/{firstName}/g, firstName)
        .replace(/{MY_NAME}/g, MY_NAME)
        .replace(/{MY_POSITION}/g, MY_POSITION)
        .replace(/{POS_SEARCH}/g, POS_SEARCH);
}


// MESSAGE_TEMPLATE removido - agora usa generateMessage() com configuração do config.js

// Variáveis de controle
let totalSent = 0;
let totalCanceled = 0;
let isRunning = false;
let connectionLimit = 100; // padrão (Não Premium)
let remainingLimit = connectionLimit; // Nova variável para controle de limite restante
let isPremiumUser = false; // Nova variável para controle de usuário premium
let weeklyLimitHitOnce = false; // Nova variável para dupla checagem de limite semanal
const SCRIPT_VERSION = "1.4";

// Funções auxiliares
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const randomDelay = () => {
    const minDelay = CONFIG?.MIN_DELAY || 1000;
    const maxDelay = CONFIG?.MAX_DELAY || 3000;
    const delay = Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay;
    return sleep(delay);
};

// Função para criar o painel de controle
function createControlPanel() {
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.top = '10px';
    panel.style.right = '10px';
    panel.style.background = '#fff';
    panel.style.border = '1px solid #0073b1';
    panel.style.padding = '10px';
    panel.style.zIndex = '9999';
    panel.style.borderRadius = '4px';
    panel.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

    // Criar o título
    const title = document.createElement('h3');
    title.textContent = 'LinkedIn Connect App';
    title.style.marginTop = '0';
    title.style.color = '#0073b1';
    panel.appendChild(title);

    // Criar o elemento de mensagem de status
    const statusDiv = document.createElement('div');
    statusDiv.id = 'script-status';
    statusDiv.textContent = 'Status: Ready';
    panel.appendChild(statusDiv);

    // Criar o elemento de contagem de envios
    const sentDiv = document.createElement('div');
    sentDiv.id = 'sent-count';
    sentDiv.textContent = 'Sent: 0';
    panel.appendChild(sentDiv);

    // Criar o elemento de contagem de cancelamentos
    const canceledDiv = document.createElement('div');
    canceledDiv.id = 'canceled-count';
    canceledDiv.textContent = 'Canceled: 0';
    panel.appendChild(canceledDiv);
    
    // Criar o elemento de contagem restante
    const remainingCount = document.createElement('div');
    remainingCount.id = 'remaining-count';
    remainingCount.textContent = `Remaining: ${remainingLimit}`;
    remainingCount.style.marginBottom = '5px';
    panel.appendChild(remainingCount);

    // Criar o container para checkbox de usuário premium
    const premiumContainer = document.createElement('div');
    premiumContainer.style.marginTop = '10px';
    premiumContainer.style.display = 'flex';
    premiumContainer.style.alignItems = 'center';
    
    // Criar checkbox para usuário premium
    const premiumCheckbox = document.createElement('input');
    premiumCheckbox.id = 'premium-user';
    premiumCheckbox.type = 'checkbox';
    premiumCheckbox.style.margin = '0';
    premiumCheckbox.style.marginRight = '5px';
    premiumContainer.appendChild(premiumCheckbox);
    
    // Criar label para checkbox de usuário premium
    const premiumLabel = document.createElement('label');
    premiumLabel.setAttribute('for', 'premium-user');
    premiumLabel.textContent = 'Premium User (200 weekly limit)';
    premiumLabel.style.fontSize = '14px';
    premiumContainer.appendChild(premiumLabel);
    
    panel.appendChild(premiumContainer);

    // Criar container para modo de teste
    const testContainer = document.createElement('div');
    testContainer.style.marginTop = '10px';
    testContainer.style.display = 'flex';
    testContainer.style.alignItems = 'center';

    // Criar checkbox para modo de teste
    const testCheckbox = document.createElement('input');
    testCheckbox.id = 'test-mode';
    testCheckbox.type = 'checkbox';
    testCheckbox.style.margin = '0';
    testCheckbox.style.marginRight = '5px';
    testContainer.appendChild(testCheckbox);

    // Criar label para checkbox de modo de teste
    const testLabel = document.createElement('label');
    testLabel.setAttribute('for', 'test-mode');
    testLabel.textContent = 'Test Mode (won\'t send invitations)';
    testLabel.style.fontSize = '14px';
    testLabel.style.color = '#e74c3c';
    testContainer.appendChild(testLabel);

    panel.appendChild(testContainer);

    // Criar o elemento de contagem de cancelamentos
    const limitContainer = document.createElement('div');
    limitContainer.style.marginTop = '10px';

    // Cria o elemento de limite de conexões com sucesso
    const limitLabel = document.createElement('label');
    limitLabel.setAttribute('for', 'connection-limit');
    limitLabel.textContent = 'Connection limit:';
    limitContainer.appendChild(limitLabel);

    // Cria o elemento de input para personalizar o limite de conexões
    const limitInput = document.createElement('input');
    limitInput.id = 'connection-limit';
    limitInput.type = 'number';
    limitInput.value = '100';
    limitInput.min = '1';
    limitInput.max = '500';
    limitInput.style.width = '60px';
    limitInput.style.marginLeft = '5px';
    limitContainer.appendChild(limitInput);

    panel.appendChild(limitContainer);

    // Cria o botão de iniciar
    const startButton = document.createElement('button');
    startButton.id = 'start-script';
    startButton.textContent = 'Start';
    startButton.style.background = '#0073b1';
    startButton.style.color = 'white';
    startButton.style.border = 'none';
    startButton.style.padding = '5px 10px';
    startButton.style.marginTop = '10px';
    startButton.style.cursor = 'pointer';
    startButton.style.borderRadius = '4px';
    panel.appendChild(startButton);

    // Cria o botão de parar
    const stopButton = document.createElement('button');
    stopButton.id = 'stop-script';
    stopButton.textContent = 'Stop';
    stopButton.style.background = '#dc3545';
    stopButton.style.color = 'white';
    stopButton.style.border = 'none';
    stopButton.style.padding = '5px 10px';
    stopButton.style.marginTop = '10px';
    stopButton.style.marginLeft = '5px';
    stopButton.style.cursor = 'pointer';
    stopButton.style.borderRadius = '4px';
    panel.appendChild(stopButton);

    // Adiciona o painel ao corpo
    document.body.appendChild(panel);

    const versionDiv = document.createElement('div');
    versionDiv.textContent = `Script version: ${SCRIPT_VERSION}`;
    versionDiv.style.fontSize = '12px';
    versionDiv.style.color = '#888';
    panel.appendChild(versionDiv);


    // Adiciona os event listeners
    startButton.addEventListener('click', startProcess);
    stopButton.addEventListener('click', stopProcess);
    
    // Event listener para o checkbox de usuário premium
    premiumCheckbox.addEventListener('change', function() {
        isPremiumUser = this.checked;
        const defaultLimit = isPremiumUser ?
            (CONFIG?.PREMIUM_LIMIT || 200) :
            (CONFIG?.DEFAULT_LIMIT || 100);
        limitInput.value = defaultLimit;
        connectionLimit = defaultLimit;
        remainingLimit = connectionLimit - totalSent;
        updateStatus(`Premium user set to: ${isPremiumUser ? 'Yes' : 'No'}, limit: ${connectionLimit}`);
        updateCounts();
    });
    
    limitInput.addEventListener('change', function () {
        connectionLimit = parseInt(this.value, 10);
        remainingLimit = connectionLimit - totalSent;
        updateStatus(`Connection limit set to ${connectionLimit}, remaining: ${remainingLimit}`);
        updateCounts();
    });
}

/** Atualiza a mensagem de status no painel de controle.
 * @param {string} status - A mensagem de status a ser exibida.
 */
function updateStatusCP(status) {
    const statusEl = document.getElementById('script-status');
    if (statusEl) statusEl.textContent = `Status: ${status}`;
}

/** Exibe uma mensagem de status no console.
 * @param {string} status - A mensagem de status a ser exibida.
 */
function updateStatus(status) {
    console.log(`${status}`);
}

/** Atualiza as contagens de envios e cancelamentos no painel de controle.
 *
 * Esta função busca os elementos do DOM correspondentes às contagens de
 * envios e cancelamentos (identificados pelos IDs 'sent-count' e
 * 'canceled-count', respectivamente) e atualiza seus conteúdos de texto
 * com os valores atuais de `totalSent` e `totalCanceled`.
*/
function updateCounts() {
    const sentEl = document.getElementById('sent-count');
    const canceledEl = document.getElementById('canceled-count');
    const remainingEl = document.getElementById('remaining-count');
    if (sentEl) sentEl.textContent = `Sent: ${totalSent}`;
    if (canceledEl) canceledEl.textContent = `Canceled: ${totalCanceled}`;
    if (remainingEl) remainingEl.textContent = `Remaining: ${remainingLimit}`;
}

/** Processa um botão de conexão, realizando as seguintes ações:
 * 1. Encontra o nome do perfil antes de clicar no botão;
 * 2. Clica no botão "Connect";
 * 3. Encontra o botão "Add a note" e clica nele;
 * 4. Preenche a mensagem com o template de mensagem;
 * 5. Clica no botão "Send" para enviar a conexão;
 * 6. Atualiza as contagens de envios e cancelamentos;
 * 7. Retorna true se a conexão for enviada com sucesso, false caso contrário.
 * Se o processo não der certo, clica no botão "Cancel" e retorna false.
 * @param {Element} button - O botão de conexão a ser processado.
 * @returns {Promise<boolean>} - Um promise que resolve com true se a conexão for enviada com sucesso, false caso contrário.
 */
async function processButton(button) {
    try {
        if (!button || !button.isConnected) return false;

        // Encontra o nome do perfil antes de clicar no botão
        const listItem = button.closest('li') || button.closest('.entity-result');
        if (!listItem) return false;

        const nameElement = listItem.querySelector('span[aria-hidden="true"]');
        const fullName = nameElement ? nameElement.textContent.trim() : '';
        const firstName = fullName.split(' ')[0] || 'there';


        // Verifica se o popup de limite apareceu
        if (await checkWeeklyLimitReached()) {
            return false;
        }

        // Clica no botão "Connect"
        updateStatus(`Processing ${fullName}`);
        button.click();
        await randomDelay();

        // Encontra o botão "Add a note"
        const addNoteBtn = document.querySelector('button[aria-label="Add a note"]');
        let notaPreenchida = false;
        if (addNoteBtn) {
            addNoteBtn.click();
            await randomDelay();

            // Preenche a mensagem
            const textarea = document.querySelector('textarea#custom-message');
            if (textarea) {
                // updateStatus(`Writing message to ${fullName}`);
                textarea.value = generateMessage(firstName);
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                await sleep(1000);
                notaPreenchida = true;
            } else {
                updateStatus(`❌ Could not find message textarea for ${fullName}`);
            }
        } else {
            await randomDelay();
        }

        const sendButton = await waitForButtonEnabled('button[aria-label="Send invitation"]');
        if (sendButton) {
            // Verificar se modo de teste está ativo
            const testMode = document.getElementById('test-mode')?.checked || false;

            if (testMode) {
                // Mostrar preview da mensagem no console
                const messagePreview = notaPreenchida ? generateMessage(firstName.split(' ')[0]) : "Sem nota personalizada";
                console.log(`📝 [TESTE] Preview da mensagem para ${fullName}:`, messagePreview);

                // Verificar limite de teste configurado
                const limitInput = document.getElementById('connection-limit');
                const testLimit = limitInput ? parseInt(limitInput.value, 10) : 1;

                if (testLimit === 1) {
                    // Limite = 1: Parar execução e deixar janela aberta para validação manual
                    updateStatus(`🧪 MODO TESTE (Limite=1): Janela aberta para validação manual de ${fullName}`);
                    updateStatusCP('Teste - Janela aberta para validação manual');

                    // Mostrar instruções no console
                    console.log(`🧪 MODO TESTE - VALIDAÇÃO MANUAL`);
                    console.log(`Perfil: ${fullName}`);
                    console.log(`Mensagem: ${notaPreenchida ? 'Com nota personalizada' : 'Sem nota'}`);
                    console.log(`📝 Preview da mensagem:`, messagePreview);
                    console.log(`\n🎯 INSTRUÇÕES:`);
                    console.log(`- A janela de convite está ABERTA para você decidir`);
                    console.log(`- Clique "Send" para enviar OU "Cancel" para cancelar`);
                    console.log(`- O script foi PAUSADO - você tem controle total`);
                    console.log(`\n⚠️ IMPORTANTE: Script vai parar AGORA e deixar janela aberta!`);

                    // Para o script e deixa usuário decidir manualmente
                    updateStatus(`🧪 [TESTE] Script pausado - Janela aberta para ${fullName}`);
                    stopProcess();

                    // IMPORTANTE: Retorna true para indicar que processou com sucesso
                    // Isso evita que o código de "cancelar" seja executado
                    return true;
                } else {
                    // Limite > 1: Log no console, cancelar convite e continuar
                    updateStatus(`🧪 [TESTE] Logando e cancelando: ${fullName} (${totalSent + 1}/${testLimit})`);

                    // Cancelar o convite automaticamente
                    const cancelButton = document.querySelector('button[aria-label="Dismiss"]') ||
                            document.querySelector('button[aria-label="Cancel"]');
                    if (cancelButton) {
                        cancelButton.click();
                        totalCanceled++;
                        updateCounts();
                        updateStatus(`📋 [TESTE] Cancelado e logado: ${fullName}`);
                        await randomDelay();
                        return false; // Continua para próximo
                    }
                }
            } else {
                // Modo normal: enviar automaticamente
                sendButton.click();
                totalSent++;
                remainingLimit--;
                updateCounts();
                updateStatus(`✅ Invited: ${fullName} ${notaPreenchida ? "(With note)" : "(No note)"}`);
                await randomDelay();
                return true;
            }
        } else {
            // Se não encontrou botão "Send invitation"
            const testMode = document.getElementById('test-mode')?.checked || false;

            if (testMode) {
                // Modo teste: NÃO fechar janela automaticamente
                updateStatus(`🧪 [TESTE] Botão "Send" não encontrado para ${fullName} - Janela permanece aberta`);
                console.log(`🧪 MODO TESTE: Botão "Send invitation" não encontrado`);
                console.log(`- A janela permanece ABERTA para você analisar`);
                console.log(`- Verifique se a janela de convite está correta`);
                stopProcess();
                return false; // Para o script, deixa janela aberta
            } else {
                // Modo normal: Clica no botão "Cancel"
                const cancelButton = document.querySelector('button[aria-label="Dismiss"]') ||
                        document.querySelector('button[aria-label="Cancel"]');

                if (cancelButton) {
                    cancelButton.click();
                    totalCanceled++;
                    updateCounts();
                    updateStatus(`❌ Canceled invitation to: ${fullName}`);
                    await randomDelay();
                }
            }
        }
        return false;
    } catch (error) {
        // Clica no botão "Cancel" alguma exceção ocorreu e o processo deve ser cancelado!
        const cancelButton = document.querySelector('button[aria-label="Dismiss"]') ||
                document.querySelector('button[aria-label="Cancel"]');

        if (cancelButton) cancelButton.click();

        totalCanceled++;
        updateCounts();
        updateStatus(`❌ Error processing connection`);
        await randomDelay();
        return false;
    }
}

/** Verifica se a mensagem de limite de convites semanais está presente na página
 * @returns {boolean} Verdadeiro se a mensagem de limite for detectada e o processo deve parar
 */
async function checkWeeklyLimitReached() {
    const divs = document.querySelectorAll('div');
    const limitMessageDiv = Array.from(divs).find(div => {
        const text = div.textContent.toLowerCase();
        return (
            text.includes('weekly invitation limit') ||
            text.includes('you\'ve reached the weekly limit') ||
            text.includes('limite semanal') ||
            text.includes('convites semanais')
        );
    });

    // Se achou mensagem de limite
    if (limitMessageDiv) {
        // Se for usuário premium, verifica a dupla checagem
        if (isPremiumUser) {
            // Se já atingiu o limite uma vez, para o processo
            if (weeklyLimitHitOnce) {
                updateStatus('⚠️ Weekly invitation limit reached twice! Stopping process for Premium user.');
                stopProcess();
                
                // Clica no botão "Got it" se existir
                const buttons = document.querySelectorAll('button');
                const gotItButton = Array.from(buttons).find(btn =>
                    btn.textContent.toLowerCase().includes('got it') ||
                    btn.textContent.toLowerCase().includes('entendi') ||
                    btn.textContent.toLowerCase().includes('ok')
                );
                
                if (gotItButton) {
                    gotItButton.click();
                }
                
                return true; // Para o processo
            } else {
                // Marca que atingiu o limite pela primeira vez
                weeklyLimitHitOnce = true;
                updateStatus('⚠️ LinkedIn warning about weekly limit, continuing as Premium user (first warning)');
                
                // Clica no botão "Got it" se existir
                const buttons = document.querySelectorAll('button');
                const gotItButton = Array.from(buttons).find(btn =>
                    btn.textContent.toLowerCase().includes('got it') ||
                    btn.textContent.toLowerCase().includes('entendi') ||
                    btn.textContent.toLowerCase().includes('ok')
                );
                
                if (gotItButton) {
                    gotItButton.click();
                    await sleep(1000);
                }
                
                return false; // Continua o processo
            }
        } else {
            // Comportamento padrão para usuários não premium
            updateStatus('⚠️ Weekly invitation limit reached! Stopping process.');
            stopProcess();

            // Clica no botão "Got it" se existir
            const buttons = document.querySelectorAll('button');
            const gotItButton = Array.from(buttons).find(btn =>
                btn.textContent.toLowerCase().includes('got it') ||
                btn.textContent.toLowerCase().includes('entendi') ||
                btn.textContent.toLowerCase().includes('ok')
            );

            if (gotItButton) {
                gotItButton.click();
            }

            return true; // Para o processo
        }
    }

    return false; // Não encontrou mensagem de limite, continua normalmente
}

/** Espera um determinado botão ser habilitado
 * 
 * @param {string} selector Seletor CSS do botão
 * @param {number} [maxAttempts=5] Número de tentativas antes de desistir
 * @returns {HTMLElement | null} O botão habilitado ou null se a espera foi cancelada
 */
async function waitForButtonEnabled(selector, maxAttempts = 5) {
    for (let i = 0; i < maxAttempts; i++) {
        const button = document.querySelector(selector);
        if (button && !button.disabled && !button.classList.contains('artdeco-button--disabled')) {
        return button;
        }
        await sleep(1000);
    }
    return null;
}

/** Função principal para gerenciar o processo automatizado de envio de conexões.
 * 
 * Esta função verifica se o script está em execução e se o limite de conexões
 * foi atingido. Se não, ela procura por botões de conexão na página, processa
 * cada um deles, e atualiza o status e as contagens de envios e cancelamentos.
 * 
 * Após processar os botões, a função rola a página para carregar mais resultados
 * e tenta clicar no botão "Next" para ir para a próxima página, repetindo o
 * processo. Em caso de erro, a função espera 5 segundos e tenta novamente, 
 * caso o script ainda esteja em execução.
 */
async function mainProcess() {
    if (!isRunning) return;

    try {
        if (await checkWeeklyLimitReached()) {
            return false;
        }

        // Valida se atingiu o limite de conexões
        if (remainingLimit <= 0) {
            updateStatus(`Connection limit of ${connectionLimit} reached!`);
            stopProcess();
            return;
        }

        // Filtra os botões "Connect"
        const connectButtons = Array.from(document.querySelectorAll('button')).filter(
            button => button.textContent.includes('Connect') &&
                !button.textContent.includes('Pending') &&
                button.isConnected &&
                button.offsetParent !== null 
        );

        updateStatus(`Found ${connectButtons.length} connect buttons`);

        // Processa cada botão
        for (let i = 0; i < connectButtons.length; i++) {
            if (!isRunning || remainingLimit <= 0) break;
            await processButton(connectButtons[i]);
        }

        // Exibe o resumo antes de mover para a próxima página
        updateStatus(`Page summary: ${totalSent} invitations sent, ${totalCanceled} canceled`);
        await sleep(2000);

        // Scroll para chegar no fim da página e clicar no "Next"
        if (isRunning && remainingLimit > 0) {
            updateStatus('Scrolling to load more...');
            window.scrollTo(0, document.body.scrollHeight);
            await sleep(5000);

            // Se não for mais possível clicar no botão "Next", parar o processo
            const nextButton = await waitForButtonEnabled('button[aria-label="Next"]', 5);
            if (!nextButton) { 
                updateStatus(`Pages limit reached! Process completed.`);
                updateStatusCP('Completed - No more pages');
                stopProcess();
                return;
            }

            // Clica no botão "Next"
            if (nextButton && isRunning) {
                updateStatus(`Moving to next page... (${totalSent} invitations sent so far)`);
                nextButton.click();
                await sleep(5000);
            }

            if (isRunning) {
                mainProcess();
            }
        }
    } catch (error) {
        updateStatus('Error encountered, retrying...');
        console.error('Error in main process:', error);

        // Se houver erro, aguarda 5 segundos e tenta novamente
        if (isRunning) {
            await sleep(5000);
            mainProcess();
        }
    }
}


/** Inicia o processo de envio de conexões.
 * 
 * Este método verifica se o script está parado e, se sim, inicia o processo de
 * envio de conexões. Ele lê o valor do campo de texto "connection-limit" e
 * atualiza o estado do painel de controle, antes de chamar o método
 * mainProcess() para iniciar o processo de envio de conexões.
 */
function startProcess() {
    if (!isRunning) {
        isRunning = true;
        isPremiumUser = document.getElementById('premium-user').checked;
        connectionLimit = parseInt(document.getElementById('connection-limit').value, 10);
        remainingLimit = connectionLimit - totalSent;
        weeklyLimitHitOnce = false; // Reseta a variável de dupla checagem
        updateStatus(`Started with ${remainingLimit} connections remaining. Premium user: ${isPremiumUser ? 'Yes' : 'No'}`);
        updateStatusCP('Processing...');
        updateCounts();
        mainProcess();
    }
}

/** Para o processo de envio de conexões.
 * 
 * Este método é chamado quando o botão "Stop" é clicado. Ele seta a variável
 * isRunning para false, atualiza a mensagem de status para "Stopped" e
 * atualiza o painel de controle para o estado "Ready".
 */
function stopProcess() {
    isRunning = false;
    updateStatus('Stopped');
    updateStatusCP('Ready');
}

/** Inicializa o script criando o painel de controle.
 *
 * Esta função verifica se o elemento com o ID 'script-status'
 * já existe no documento, indicando que o painel de controle
 * já foi criado. Se não existir, carrega as configurações e
 * chama a função createControlPanel para criar o painel de controle na página.
*/
function init() {
    if (!document.getElementById('script-status')) {
        // Carrega as configurações do arquivo config.js
        if (!loadConfig()) {
            alert("⚠️ Configurações não encontradas!\n\nPor favor:\n1. Copie o arquivo 'config.template.js' para 'config.js'\n2. Preencha suas informações pessoais no arquivo 'config.js'\n3. Inclua o arquivo config.js antes deste script");
            return;
        }

        // Valida se as configurações foram preenchidas
        if (!MY_NAME || MY_NAME === "Your Full Name Here" ||
            !MY_POSITION || MY_POSITION === "Your Current Position or Job Title" ||
            !POS_SEARCH || POS_SEARCH === "Your Area of Expertise or Specialization") {
            alert("⚠️ Configurações não preenchidas!\n\nPor favor, edite o arquivo 'config.js' e preencha suas informações pessoais.");
            return;
        }

        // Atualiza limites baseados na configuração
        if (CONFIG) {
            connectionLimit = CONFIG.DEFAULT_LIMIT || 100;
            remainingLimit = connectionLimit;
        }

        createControlPanel();
    }
}

init();