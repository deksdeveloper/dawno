const innosetup = require('innosetup-compiler');
const path = require('path');

async function build() {
    const issPath = path.resolve(__dirname, 'DAWNO.iss');
    console.log('Building Inno Setup installer: ' + issPath);

    try {
        await innosetup(issPath, {
            gui: false,
            verbose: true,
        });
        console.log('Installer built successfully! Check scripts/Output/ folder.');
    } catch (err) {
        console.error('Build failed: ' + err.message);
        process.exit(1);
    }
}

build();
