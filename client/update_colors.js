const fs = require('fs');

try {
    let content = fs.readFileSync('client/app/tabs/home.tsx', 'utf8');

    // Replace the main gradient array mapping
    content = content.replace(/colors=\{\['#1F3C5E', '#4C6D8D', '#A0B8CD'\]\}/g, "colors={['#8C7F6A', '#B5A993', '#F6F1E7']}");
    content = content.replace(/colors=\{\['#21416B', '#4870A0'\]\}/g, "colors={['#8C7F6A', '#B5A993']}");
    content = content.replace(/colors=\{\["#1F3C5E", "#4C6D8D", "#A0B8CD"\]\}/g, "colors={['#8C7F6A', '#B5A993', '#F6F1E7']}");
    content = content.replace(/colors=\{\["#21416B", "#4870A0"\]\}/g, "colors={['#8C7F6A', '#B5A993']}");
    content = content.replace(/rgba\(31, 60, 94, 0.15\)/g, "rgba(140, 127, 106, 0.15)");


    const mappings = {
        '#FFFFFF': '#FFFFFF',
        '#f8f9fa': '#F6F1E7',
        '#e5e7eb': '#E5DFD3',
        '#F2F6FA': '#F6F1E7',
        
        // Dark text => Darker Brown/Charcoal
        '#1A2E40': '#2E2A26',
        '#1F3447': '#2E2A26',
        '#223B52': '#2E2A26',
        '#2C4359': '#2E2A26',
        '#2D4358': '#2E2A26',
        '#333': '#2E2A26',
        '#333333': '#2E2A26',
        '#444': '#2E2A26',

        // Muted text => Muted Brown
        '#3D556B': '#6B645C',
        '#5C6F82': '#6B645C',
        '#6C7D8F': '#6B645C',
        '#6F8295': '#6B645C',
        '#7A8A9B': '#6B645C',
        '#aaa': '#8C7F6A',

        // Action / Accents
        '#2EA97D': '#4CAF50',
        '#FFC107': '#F6F1E7',
        
        // Borders & Highlights
        '#E2EAF2': '#D8D0C3',
        '#EEF2F7': '#F6F1E7',
        
        // Milestones
        '#81C784': '#4CAF50',
        '#64B5F6': '#B5A993',
        '#FF8A65': '#E53935',
        '#E0E0E0': '#E5DFD3',

        // Generic
        '#e8e8e8': '#E5DFD3',
        '#f0f0f0': '#F6F1E7'
    };

    for (const [oldC, newC] of Object.entries(mappings)) {
        content = content.split(oldC).join(newC);
        content = content.split(oldC.toLowerCase()).join(newC);
    }
    
    // Add custom styling overrides directly in content
    content = content.replace(/backgroundColor: "#F2F6FA"/g, 'backgroundColor: "#F6F1E7"');
    content = content.replace(/backgroundColor: "#fff"/g, 'backgroundColor: "#FFFFFF"');

    fs.writeFileSync('client/app/tabs/home.tsx', content);
    console.log('✅ Home styles mapped perfectly to MineO colors');
} catch (e) {
    console.error(e);
}
