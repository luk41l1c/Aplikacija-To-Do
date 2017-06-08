var http = require("http");
var fs = require("fs");

var zadaci = [];

fs.readFile("zadaci.dat", function read(err, data) {
    if(err) {
        zadaci = [];
    }
    else {
        zadaci = JSON.parse(data);
    }
});

var index = fs.readFileSync("index.html", "utf8");
var style = fs.readFileSync("style.css", "utf8");
var appjs = fs.readFileSync("app.js", "utf8");

function prikaziInterfejs(response) {
    response.writeHead(200, {"Content-type" : "text/html"});
    response.end(index);
}

function greskaURL(response) {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("<h1>Stranica1 nije pronadjena..</h1>");
    response.end();
}

function zadatak_(zadatak) {
    zadaci.push(zadatak);
    fs.writeFile("zadaci.dat", JSON.stringify(zadaci), function(err) {
        if(err) {
            console.log(err);
        }
    });

    return JSON.stringify(zadaci);
}

function odgovorServera(request, response) {
    switch(request.url) {
        case "/":
        case "/index.html":
            prikaziInterfejs(response);
            break;
        case "/style.css":
            response.writeHead(200, {"Content-Type": "text/css"});
            response.end(style);
            break;
        case "/app.js":
            response.writeHead(200, {"Content-Type": "text/pain"});
            response.end(appjs);
            break;
        case "/novi-zadatak":
            var ime = "";
            var zadatak = "";
            request.on("data", function(data) {
                zadatak += data;
            });
            request.on("end", function() {
                zadatak = JSON.parse(zadatak);
                //console.log(zadatak);
                ime = zadatak.ime;
                zadatak_(zadatak);
                var odgovor = [];

                for(var i = 0; i<zadaci.length; i++) {
                    if(zadaci[i].ime == ime) {
                        odgovor.push({"zadatak" : zadaci[i].zadatak});
                    }
                }
                response.end(JSON.stringify(odgovor));
            });
            break;
        case "/brisanje":
            var brisanje = ""; 
            request.on("data", function(data) { 
                brisanje += data; 
            }); 
            request.on("end", function() { 
                brisanje = JSON.parse(brisanje); 
                for(var i = 0; i<zadaci.length; i++) { 
                    if(zadaci[i].ime === brisanje.ime && zadaci[i].zadatak == brisanje.zadatak) {
                        delete zadaci[i].zadatak;
                    } 
                } 
            }); 
            break;
        default:
            greskaURL(response);
            break;
    }
}

var server = http.createServer(odgovorServera);
server.listen(8080);
console.log("Server startovan na portu 8080");