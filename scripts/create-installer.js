const installer = require('electron-installer-windows');
const path = require('path');

async function createInstaller() {
    console.log('Creating professional Inno Setup installer, please wait...');

    const options = {
        src: path.join(__dirname, '../dist/DAWNO-win32-x64/'),
        dest: path.join(__dirname, '../dist/installer/'),
        icon: path.join(__dirname, '../assets/icon.ico'),
        authors: ['Deks'],
        description: 'DAWNO Editor - A modern SA-MP PAWN Editor',
        productName: 'DAWNO',
        exe: 'DAWNO.exe',
        setupExe: 'DAWNO-Setup.exe',
        noMsi: true,
    };

    try {
        await installer(options);
        console.log('Installer created successfully at dist/installer/DAWNO-Setup.exe');
    } catch (err) {
        console.error('Installer creation failed:', err.message);
        process.exit(1);
    }
}

createInstaller();
