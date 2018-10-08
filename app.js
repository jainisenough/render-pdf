'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const url_1 = require("url");
const fs_1 = require("fs");
http_1.createServer((req, res) => {
    if (req.method === 'GET') {
        const pieces = url_1.parse(req.url, true);
        if (Object.keys(pieces.query).length && pieces.query.q && pieces.query.q.length) {
            try {
                let query = JSON.parse(pieces.query.q);
                if (query.name) {
                    let { name } = query;
                    if (Array.isArray(name) && name.length) {
                        name = 'archive.zip';
                        res.end('Array param needs to implement');
                    }
                    else {
                        fs_1.stat(`${__dirname}/pdf/${name}`, (e, stats) => {
                            if (e) {
                                res.end('Invalid file');
                            }
                            else {
                                const file = fs_1.createReadStream(`${__dirname}/pdf/${name}`);
                                res.setHeader('Content-Length', stats.size);
                                res.setHeader('Content-Type', 'application/pdf');
                                res.setHeader('Content-Disposition', `attachment; filename=${name}`);
                                file.pipe(res);
                            }
                        });
                    }
                }
                else {
                    res.end('Filename missing');
                }
            }
            catch (e) {
                res.end('Inappropriate info');
            }
        }
        else {
            res.end('File info missing');
        }
    }
    else {
        res.end('Incorrect method');
    }
}).listen(process.env.PORT || 3000, () => {
    console.log('Server fireup');
});
