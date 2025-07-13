/**
 * Configuração Master para LinkedIn Recruiter Script
 * 
 * INSTRUÇÕES DE SETUP:
 * 1. Copie este arquivo para 'config.js'
 * 2. Preencha suas informações pessoais
 * 3. Configure os caminhos conforme sua estrutura
 * 4. Personalize a mensagem e outras opções
 * 
 * @author Fábio M Valente - https://github.com/fabiomvalente
 * @version 1.4
 */

const LINKEDIN_CONFIG = {
    // ==========================================
    // INFORMAÇÕES PESSOAIS (OBRIGATÓRIO)
    // ==========================================
    
    // Seu nome completo como aparece nas mensagens
    MY_NAME: "Seu Nome Completo Aqui",
    
    // Seu cargo/posição atual
    MY_POSITION: "Seu Cargo ou Posição Atual",
    
    // Sua área de especialização/experiência
    POS_SEARCH: "Sua Área de Especialização",
    
    // ==========================================
    // CONFIGURAÇÃO DE CAMINHOS
    // ==========================================
    
    PATHS: {
        // Pasta onde você mantém seus dados pessoais (fora do Git)
        PERSONAL_FOLDER: "C:\\MeuLinkedIn",
        
        // Pasta da extensão para sincronização GitHub
        ADDON_SYNC_FOLDER: "linkedin-addon",
        
        // Criar pastas automaticamente se não existirem
        AUTO_CREATE_FOLDERS: true
    },
    
    // ==========================================
    // TEMPLATE DE MENSAGEM PERSONALIZADA
    // ==========================================
    
    MESSAGE_TEMPLATE: {
        // Use {firstName}, {MY_NAME}, {MY_POSITION}, {POS_SEARCH} como variáveis
        TEXT: `Hi {firstName}, I hope you're doing well!

I'm a {MY_POSITION} from Brazil with experience in {POS_SEARCH}, seeking international opportunities.
I'd love to connect and expand my network.

Best regards,
    {MY_NAME}`,
        
        // Incluir nota personalizada nas conexões
        INCLUDE_NOTE: true,
        
        // Validar mensagem antes de enviar (modo teste)
        ENABLE_VALIDATION_MODE: false
    },
    
    // ==========================================
    // CONFIGURAÇÕES DE AUTOMAÇÃO
    // ==========================================
    
    AUTOMATION: {
        // Limites de conexão
        DEFAULT_LIMIT: 100,        // Usuários não-premium
        PREMIUM_LIMIT: 200,        // Usuários premium
        
        // Timing (em milissegundos)
        MIN_DELAY: 1000,          // Delay mínimo entre ações
        MAX_DELAY: 3000,          // Delay máximo entre ações
        SCROLL_DELAY: 5000,       // Delay após scroll
        
        // Modo de teste/validação
        TEST_MODE: {
            ENABLED: false,        // Ativar modo teste
            PAUSE_BEFORE_SEND: true, // Pausar antes de enviar para validação
            SHOW_MESSAGE_PREVIEW: true, // Mostrar preview da mensagem
            MAX_TEST_CONNECTIONS: 3  // Máximo de conexões em modo teste
        }
    },
    
    // ==========================================
    // CONFIGURAÇÕES DA INTERFACE
    // ==========================================
    
    UI: {
        // Posição do painel de controle
        PANEL_POSITION: 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
        
        // Logs detalhados no console
        DETAILED_LOGS: true,
        
        // Auto-scroll para carregar mais resultados
        AUTO_SCROLL: true,
        
        // Mostrar estatísticas avançadas
        SHOW_ADVANCED_STATS: true
    },
    
    // ==========================================
    // CONFIGURAÇÕES AVANÇADAS
    // ==========================================
    
    ADVANCED: {
        // Versão do script (atualizada automaticamente)
        SCRIPT_VERSION: "1.4",
        
        // Backup automático de configurações
        AUTO_BACKUP: true,
        
        // Sincronização automática com pasta pessoal
        AUTO_SYNC: true,
        
        // Validações de segurança
        SAFETY_CHECKS: true
    }
};

// ==========================================
// EXPORTAÇÃO E COMPATIBILIDADE
// ==========================================

// Para uso em browser/extensão
if (typeof window !== 'undefined') {
    window.LINKEDIN_CONFIG = LINKEDIN_CONFIG;
    
    // Compatibilidade com versões antigas
    window.MY_NAME = LINKEDIN_CONFIG.MY_NAME;
    window.MY_POSITION = LINKEDIN_CONFIG.MY_POSITION;
    window.POS_SEARCH = LINKEDIN_CONFIG.POS_SEARCH;
}

// Para uso em Node.js/scripts Python
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LINKEDIN_CONFIG;
}
