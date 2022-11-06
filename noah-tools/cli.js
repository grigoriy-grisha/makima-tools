const start = require('./start');
const { program } = require('commander');

(async () => {
    await start({cache: false})
})()

