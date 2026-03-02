const fs = require('fs');
const path = require('path');
const localesDir = 'c:/Users/Deks/Documents/dawno/renderer/i18n/locales';

const translations = {
    'tr': '.gitignore\\'dan Cikar',
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

for (const lang of Object.keys(translations)) {
    const p = path.join(localesDir, lang + '.ts');
    if (!fs.existsSync(p)) continue;
    let content = fs.readFileSync(p, 'utf8');

    // Data fix
    let match = content.match(/addToGitignore:\s*['"].*?['"],?/);
    if (match && !content.includes('removeFromGitignore:')) {
        const trans = translations[lang];
        content = content.replace(match[0], match[0] + "\n        removeFromGitignore: '" + trans + "',");
        fs.writeFileSync(p, content);
    }
}
