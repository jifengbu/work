var fs = require('fs');
var unzip = require('unzip');
var parseString = require('xml2js').parseString;

function streamToString (stream) {
    const chunks = []
    return new Promise((resolve, reject) => {
        stream.on('data', chunk => chunks.push(chunk))
        stream.on('error', reject)
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    })
}

fs.createReadStream('./blank1.docx')
.pipe(unzip.Parse())
.on('entry', async function (entry) {
    if (entry.path === 'word/document.xml') {
        var xml = await streamToString(entry);
        parseString(xml, function (err, result) {
            console.log(JSON.stringify(result['w:document']['w:body'], null, 2));
        });
    } else {
        entry.autodrain();
    }
});
