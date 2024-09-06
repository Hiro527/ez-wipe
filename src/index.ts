require('v8-compile-cache');

import { app, BrowserWindow } from 'electron';
import log from 'electron-log/main';
import Store from 'electron-store';
import path from 'path';

// 初期化
log.initialize();
log.info(`EZ-Caster by Hiro527`);

const store = new Store<Config>();

// シングルインスタンスロック
if (!app.requestSingleInstanceLock()) {
    log.error('Other process(es) existing. Quit.');
    app.quit();
}

app.on('ready', () => {
    const window = new BrowserWindow({
        width: 300,
        height: 200,
        x: Number(store.get('window.x', undefined)),
        y: Number(store.get('window.y', undefined)),
        resizable: false,
        maximizable: false,
        show: false,
        title: 'EZ-Caster',
        webPreferences: {
            preload: path.join(__dirname, './preload.js'),
        },
    });

    window.setMenu(null);

    window.on('page-title-updated', (event) => {
        event.preventDefault();
    });

    window.on('close', () => {
        const position = window.getPosition();
        store.set('window.x', position[0]);
        store.set('window.y', position[1]);
        window.destroy();
        app.quit();
    });

    window.once('ready-to-show', () => {
        window.show();
    });

    window.loadFile(path.join(__dirname, '../public/index.html'));
});
