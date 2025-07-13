/**
 * Example Configuration for LinkedIn Recruiter Script
 * 
 * This is an EXAMPLE file showing the correct format.
 * DO NOT use these values - they are fake examples!
 * 
 * To use this script:
 * 1. Copy config.template.js to config.js
 * 2. Edit config.js with YOUR real information
 * 3. Never commit config.js to Git (it's in .gitignore)
 */

// Example Configuration - DO NOT USE THESE VALUES
const CONFIG = {
    // Replace with your actual full name
    MY_NAME: "João Silva Santos",
    
    // Replace with your actual position/job title
    MY_POSITION: "Full-Stack Developer",
    
    // Replace with your actual area of expertise
    POS_SEARCH: "React, Node.js, and Cloud Technologies",
    
    // Default connection limits (you can adjust these)
    DEFAULT_LIMIT: 100,        // Default limit for non-premium users
    PREMIUM_LIMIT: 200,        // Limit for premium users
    
    // Message template customization
    MESSAGE_SETTINGS: {
        // Set to true to include a personalized note with connection requests
        INCLUDE_NOTE: true,
        
        // Custom message template
        // Available variables: {firstName}, {MY_NAME}, {MY_POSITION}, {POS_SEARCH}
        TEMPLATE: `Hi {firstName}, I hope you're doing well!  

I'm a {MY_POSITION} from Brazil with experience in {POS_SEARCH}, seeking international opportunities.  
I'd love to connect and expand my network.  

Best regards,  
    {MY_NAME}`
    }
};

// Export configuration for use in main script
if (typeof window !== 'undefined') {
    window.LINKEDIN_CONFIG = CONFIG;
}
