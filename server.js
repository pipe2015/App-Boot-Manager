const express = require('express');
const util = require('util');
const process = require('child_process');   
const chromeProfileList = require('chrome-profile-list');
const ChromeLauncher = require('chrome-launcher');
const co = require('co');

//config express
const app = express();
const ioServer = require('./sockets')(app);
const port = 3000 || process.env.port;

//module export init

var chromeProfilesInit = () => {
    let execFile = util.promisify(process.execFile);

    var chromeProfiles = chromeProfileList(chromeProfileList.variations.CHROME).filter(e => {
        var nameDir = 'Profile';
        return e.profileDirName.substring(0, nameDir.length) == nameDir;
    }).sort((a, b) => {
        a = a.profileDirName.split(' ')[1];
        b = b.profileDirName.split(' ')[1];
        return a - b; 
    });
    
    co.wrap(function * () {
        //secuencial open chrome profiles
        for (let { profileDirName } of chromeProfiles) {
            yield ChromeLauncher.launch({
                startingUrl: 'https://www.muycomputer.com',
                userDataDir: 'C:\\Users\\Developer\\AppData\\Local\\Google\\Chrome\\User Data',
                chromeFlags: [
                    `--profile-directory=${profileDirName}`,
                    '--start-maximized',
                     '--new-window'
                ]
            });
        }

    })().then((result) => {
        console.log('R', result);
    }).catch((err) => {
        console.log('E', err);
    });
    
}

//chromeProfilesInit();

ioServer.listen(port, () => console.log(`Server running on port: ${port}`));