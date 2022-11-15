const fs = require('fs');

(async () => {
    const html = fs.readFileSync('./dist/index.html', 'utf8' )
    fs.writeFileSync('./index.html', html)

})()

