/**
 * Configuration Template for LinkedIn Recruiter Script
 *
 * INSTRUCTIONS:
 * 1. Copy this file to 'config.js'
 * 2. Replace the placeholder values with your personal information
 * 3. Never commit config.js to version control (it's in .gitignore)
 *
 * @author Fábio M Valente - https://github.com/fabiomvalente
 * @version 1.4
 */

// ⚠️ REPLACE THESE VALUES WITH YOUR PERSONAL INFORMATION ⚠️

// Configuration object for the script
const LINKEDIN_CONFIG = {
    // ==========================================
    // INFORMAÇÕES PESSOAIS (OBRIGATÓRIO)
    // ==========================================

    // Your full name as it should appear in messages
    MY_NAME: "Your Full Name Here",

    // Your current position/job title
    MY_POSITION: "Your Current Position or Job Title",

    // Your area of expertise or specialization
    POS_SEARCH: "Your Area of Expertise or Specialization",

    // ==========================================
    // TEMPLATE DE MENSAGEM
    // ==========================================

    MESSAGE_TEMPLATE: {
        // Message template (customize as needed)
        // Available variables: {firstName}, {MY_NAME}, {MY_POSITION}, {POS_SEARCH}
        TEXT: `Hi {firstName}, I hope you're doing well!

I'm a {MY_POSITION} from Brazil with experience in {POS_SEARCH}, seeking international opportunities.
I'd love to connect and expand my network.

Best regards,
    {MY_NAME}`,

        // Include personalized note with connection requests
        INCLUDE_NOTE: true
    },

    // ==========================================
    // CONFIGURAÇÕES DE AUTOMAÇÃO
    // ==========================================

    // Connection limits
    DEFAULT_LIMIT: 100,        // Default limit for non-premium users
    PREMIUM_LIMIT: 200,        // Limit for premium users

    // Timing settings (in milliseconds)
    MIN_DELAY: 1000,          // Minimum delay between actions
    MAX_DELAY: 3000,          // Maximum delay between actions
    SCROLL_DELAY: 5000,       // Delay after scrolling

    // Test mode settings
    TEST_MODE: {
        ENABLED: false,        // Enable test mode by default
        PAUSE_BEFORE_SEND: true, // Pause before sending for validation
        SHOW_MESSAGE_PREVIEW: true, // Show message preview in console
        MAX_TEST_CONNECTIONS: 3  // Maximum connections in test mode
    },

    // ==========================================
    // CONFIGURAÇÕES DA INTERFACE
    // ==========================================

    UI: {
        PANEL_POSITION: 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
        DETAILED_LOGS: true,         // Show detailed console logs
        AUTO_SCROLL: true            // Automatically scroll to load more results
    }
};

// ==========================================
// EXPORTAÇÃO E COMPATIBILIDADE
// ==========================================

// Make configuration available globally
if (typeof window !== 'undefined') {
    window.LINKEDIN_CONFIG = LINKEDIN_CONFIG;

    // Backward compatibility with older versions
    window.MY_NAME = LINKEDIN_CONFIG.MY_NAME;
    window.MY_POSITION = LINKEDIN_CONFIG.MY_POSITION;
    window.POS_SEARCH = LINKEDIN_CONFIG.POS_SEARCH;
    window.MESSAGE_TEMPLATE_TEXT = LINKEDIN_CONFIG.MESSAGE_TEMPLATE.TEXT;
}
