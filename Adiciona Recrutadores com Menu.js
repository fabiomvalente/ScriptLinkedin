javascript: (function () {
    // Configurações
    const MY_NAME = '<Seu Nome>'; 
    const MESSAGE_TEMPLATE = (firstName) => `Hi ${firstName},  
      I hope you're doing well!  
      I'm ${MY_NAME}, a <Seu Cargo>, from Brazil with experience in <Seus destaques, pontos positivos>, seeking international opportunities.  
      I'd love to connect and expand my network.  
      Best regards,  
      ${MY_NAME}`;
      // <Seu Nome> Exemplo: 'José Silva';
      // <Seu Cargo> Exemplo: 'Software Engineer';
      // <Seus destaques, pontos positivos> Exemplo: 'Java, Vue.js, React.js, Node.js etc.'; 
      // ATENÇÃO: A mensagem que vai escrever, não pode ter mais de 300 caracteres contando o [texto] + [seu nome] + [seu cargo] + [seus destaques] e [nome do(a) recrutador(a)].
      // Edite a mensagem acima como quiser, mas tenha em mente que a ela deve ter menos de 300 caracteres (Reforçando porque vai desabilitar o Send e não vai enviar).

    // Variáveis de controle
    let totalSent = 0;
    let totalCanceled = 0;
    let isRunning = false;
    let connectionLimit = 100; // padrão (Não Premium)

    // Funções auxiliares
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const randomDelay = () => sleep(Math.floor(Math.random() * 2000) + 1000);

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

        // Criar o título
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

        // Adiciona os event listeners
        startButton.addEventListener('click', startProcess);
        stopButton.addEventListener('click', stopProcess);
        limitInput.addEventListener('change', function () {
            connectionLimit = parseInt(this.value, 10);
            updateStatus(`Connection limit set to ${connectionLimit}`);
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
        if (sentEl) sentEl.textContent = `Sent: ${totalSent}`;
        if (canceledEl) canceledEl.textContent = `Canceled: ${totalCanceled}`;
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

            // Clica no botão "Connect"
            updateStatus(`Processing ${fullName}`);
            button.click();
            await randomDelay();

            // Encontra o botão "Add a note"
            const addNoteBtn = document.querySelector('button[aria-label="Add a note"]');

            if (addNoteBtn) {
                addNoteBtn.click();
                await randomDelay();

                // Preenche a mensagem
                const textarea = document.querySelector('textarea#custom-message');
                if (textarea) {
                    // updateStatus(`Writing message to ${fullName}`);
                    textarea.value = MESSAGE_TEMPLATE(firstName);
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    await sleep(1000);
                    
                    const sendButton = await waitForButtonEnabled('button[aria-label="Send invitation"]');
                    if (sendButton) {
                        sendButton.click();
                        totalSent++;
                        updateCounts();
                        updateStatus(`✅ Invited: ${fullName}`);
                        await randomDelay();
                        return true;
                    }
                } else {
                    updateStatus(`❌ Could not find message textarea for ${fullName}`);
                }
            } else {
                const sendButton = document.querySelector('button[aria-label="Send invitation"]');
                if (sendButton) {
                    sendButton.click();
                    totalSent++;
                    updateCounts();
                    updateStatus(`✅ Invited: ${fullName} (no note)`);
                    await randomDelay();
                    return true;
                }
            }

            // Clica no botão "Cancel" (Se chegou aqui é porque o processo não deu certo)
            const cancelButton = document.querySelector('button[aria-label="Dismiss"]') ||
                    document.querySelector('button[aria-label="Cancel"]');

            if (cancelButton) {
                cancelButton.click();
                totalCanceled++;
                updateCounts();
                updateStatus(`❌ Canceled invitation to: ${fullName}`);
                await randomDelay();
            }

            return false;
        } catch (error) {
            // Clica no botão "Cancel" (Se chegou aqui é porque o processo não deu certo)
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
            // Valida se atingiu o limite de conexões
            if (totalSent >= connectionLimit) {
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
                if (!isRunning || totalSent >= connectionLimit) break;
                await processButton(connectButtons[i]);
            }

            // Exibe o resumo antes de mover para a próxima página
            updateStatus(`Page summary: ${totalSent} invitations sent, ${totalCanceled} canceled`);
            await sleep(2000);

            // Scroll para chegar no fim da página e clicar no "Next"
            if (isRunning && totalSent < connectionLimit) {
                updateStatus('Scrolling to load more...');
                window.scrollTo(0, document.body.scrollHeight);
                await sleep(3000);

                // Clica no botão "Next"
                const nextButton = document.querySelector('button[aria-label="Next"]');
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
            connectionLimit = parseInt(document.getElementById('connection-limit').value, 10);
            updateStatus('Started');
            updateStatusCP('Processing...');
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
     * já foi criado. Se não existir, chama a função createControlPanel
     * para criar o painel de controle na página.
    */
    function init() {
        if (!document.getElementById('script-status')) {
            createControlPanel();
        }
    }

    init();
    
})();