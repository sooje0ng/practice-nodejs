const http = require("http");
const fs = require("fs");
const url = require("url");

function templateHTML(title, list, body) {
    return `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            ${body}
          </body>
          </html>
          `;
}

function templateList(filelist) {
    const list = "<ul>";

    let i = 0;
    while (i < filelist.length) {
        list =
            list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i++;
    }
    list = list + "</ul>";
    return list;
}

const app = http.createServer(function (request, response) {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;
    if (pathname === "/") {
        if (queryData.id === undefined) {
            fs.readdir("./data", function (error, filelist) {
                let title = "Welcome";
                let description = "Hello, Node.js";
                let list = templateList(filelist);

                let template = templateHTML(
                    title,
                    list,
                    `<h2>${title}</h2>${description}`
                );
                response.writeHead(200);
                response.end(template);
            });
        } else {
            fs.readdir("./data", function (error, filelist) {
                let list = "<ul>";
                let i = 0;
                while (i < filelist.length) {
                    list =
                        list +
                        `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                    i++;
                }
                list = list + "</ul>";
                fs.readFile(
                    `data/${queryData.id}`,
                    "utf-8",
                    function (err, description) {
                        let title = queryData.id;
                        let list = templateList(filelist);
                        let template = templateHTML(
                            title,
                            list,
                            `<h2>${title}</h2>${description}`
                        );
                        response.writeHead(200);
                        response.end(template);
                    }
                );
            });
        }
    } else {
        response.writeHead(404);
        response.end("Not found");
    }
});
app.listen(3000);
