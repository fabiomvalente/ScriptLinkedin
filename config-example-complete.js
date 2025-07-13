/**
 * Exemplo Completo de Configuração LinkedIn
 * 
 * Este é um exemplo mostrando todas as opções disponíveis.
 * COPIE config-master.template.js para config.js e personalize.
 * 
 * @author Fábio M Valente - https://github.com/fabiomvalente
 * @version 1.4
 */

const LINKEDIN_CONFIG = {
    // ==========================================
    // INFORMAÇÕES PESSOAIS (OBRIGATÓRIO)
    // ==========================================
    
    MY_NAME: "João Silva Santos",
    MY_POSITION: "Desenvolvedor Full-Stack",
    POS_SEARCH: "React, Node.js e Tecnologias Cloud",
    
    // ==========================================
    // CONFIGURAÇÃO DE CAMINHOS
    // ==========================================
    
    PATHS: {
        // Sua pasta pessoal (fora do Git)
        PERSONAL_FOLDER: "C:\\MeuLinkedIn",
        
        // Pasta para sincronização GitHub
        ADDON_SYNC_FOLDER: "linkedin-addon",
        
        // Criar pastas automaticamente
        AUTO_CREATE_FOLDERS: true
    },
    
    // ==========================================
    // TEMPLATE DE MENSAGEM PERSONALIZADA
    // ==========================================
    
    MESSAGE_TEMPLATE: {
        TEXT: `Olá {firstName}, espero que esteja bem!

Sou {MY_POSITION} do Brasil com experiência em {POS_SEARCH}, buscando oportunidades internacionais.
Gostaria de me conectar e expandir minha rede profissional.

Atenciosamente,
    {MY_NAME}`,
        
        INCLUDE_NOTE: true,
        ENABLE_VALIDATION_MODE: false
    },
    
    // ==========================================
    // CONFIGURAÇÕES DE AUTOMAÇÃO
    // ==========================================
    
    AUTOMATION: {
        DEFAULT_LIMIT: 50,         // Limite conservador
        PREMIUM_LIMIT: 150,        // Limite premium conservador
        
        MIN_DELAY: 2000,          // 2 segundos mínimo
        MAX_DELAY: 4000,          // 4 segundos máximo
        SCROLL_DELAY: 6000,       // 6 segundos após scroll
        
        TEST_MODE: {
            ENABLED: true,         // Ativar modo teste por padrão
            PAUSE_BEFORE_SEND: true,
            SHOW_MESSAGE_PREVIEW: true,
            MAX_TEST_CONNECTIONS: 5
        }
    },
    
    // ==========================================
    // CONFIGURAÇÕES DA INTERFACE
    // ==========================================
    
    UI: {
        PANEL_POSITION: 'top-right',
        DETAILED_LOGS: true,
        AUTO_SCROLL: true,
        SHOW_ADVANCED_STATS: true
    },
    
    // ==========================================
    // CONFIGURAÇÕES AVANÇADAS
    // ==========================================
    
    ADVANCED: {
        SCRIPT_VERSION: "1.4",
        AUTO_BACKUP: true,
        AUTO_SYNC: true,
        SAFETY_CHECKS: true
    }
};

// ==========================================
// EXPORTAÇÃO E COMPATIBILIDADE
// ==========================================

if (typeof window !== 'undefined') {
    window.LINKEDIN_CONFIG = LINKEDIN_CONFIG;
    window.MY_NAME = LINKEDIN_CONFIG.MY_NAME;
    window.MY_POSITION = LINKEDIN_CONFIG.MY_POSITION;
    window.POS_SEARCH = LINKEDIN_CONFIG.POS_SEARCH;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = LINKEDIN_CONFIG;
}
