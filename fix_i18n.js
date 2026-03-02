const fs = require('fs');
const path = require('path');
const localesDir = 'c:/Users/Deks/Documents/dawno/renderer/i18n/locales';
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.ts'));

const translations = {
    'en': 'Remove from .gitignore',
    'tr': '.gitignore\\'dan Çıkar',
    'de': 'Aus .gitignore entfernen',
    'ar': 'إزالة من .gitignore',
    'es': 'Eliminar de .gitignore',
    'fr': 'Retirer de .gitignore',
    'it': 'Rimuovi da .gitignore',
    'ja': '.gitignore から削除',
    'ko': '.gitignore에서 제거',
    'pt': 'Remover do .gitignore',
    'ru': 'Удалить из .gitignore',
    'vi': 'Xóa khỏi .gitignore',
    'zh': '从 .gitignore 中移除'
};

files.forEach(file => {
    const lang = file.replace('.ts', '');
    let content = fs.readFileSync(path.join(localesDir, file), 'utf8');

    // Add to interface in en.ts
    if (lang === 'en' && !content.includes('removeFromGitignore: string;')) {
        content = content.replace(/addToGitignore:\s*string;/, 'addToGitignore: string;\n        removeFromGitignore: string;');
    }

    // Add the actual translation strings
    const regex = /addToGitignore:\s*(['\`\"].*?['\`\"])/g;
    if (content.match(regex) && !content.includes('removeFromGitignore:')) {
        content = content.replace(regex, match => \`\${match}, removeFromGitignore: '\${translations[lang] || translations['en']}'\`);
        fs.writeFileSync(path.join(localesDir, file), content, 'utf8');
        console.log('Updated ' + file);
    }
});
