const fs = require('fs');

try {
    let content = fs.readFileSync('client/app/tabs/home.tsx', 'utf8');

    // Replace the main gradient array mapping
    content = content.replace(/colors=\{\["#0F4C81", "#1F7A8C", "#BFDBF7"\]\}/g, "colors={['#2E2A26', '#6B645C', '#B5A993']}");
    
    const mappings = {
        '#0F4C81': '#2E2A26', // Icon color
        '#FF8A80': '#E53935', // Chart red
        '#82B1FF': '#2196F3', // Chart blue
        '#B9F6CA': '#4CAF50', // Chart green
        '#FFE0B2': '#B5A993', // Chart goal
        '#DCFCE7': '#E8F5E9',
        '#DBEAFE': '#E3F2FD',
        '#EDE9FE': '#F6F1E7',
        '#FEF3C7': '#FFF8E1',
        '#FFE4E6': '#FFEBEE',
        '#D1FAE5': '#E8F5E9',
        '#F3F4F6': '#F6F1E7',
        '#DDE6F0': '#D8D0C3',
        '#EEF3F8': '#F6F1E7',
        '#E8EEF4': '#F6F1E7',
        '#D1C4E9': '#D8D0C3',
        '#9CA3AF': '#8C7F6A',
        '#617388': '#6B645C'
    };

    for (const [oldC, newC] of Object.entries(mappings)) {
        content = content.split(oldC).join(newC);
        content = content.split(oldC.toLowerCase()).join(newC);
    }

    fs.writeFileSync('client/app/tabs/home.tsx', content);
    console.log('✅ Final home styles mapped perfectly to MineO colors');
} catch (e) {
    console.error(e);
}
