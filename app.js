window.onload = function() {
    var dugmeDodajZadatak = document.querySelector("#posalji");
    dugmeDodajZadatak.addEventListener("click", dodajZadatak);
}

function AjaxZahtev(options, callback) {
    var req = new XMLHttpRequest();
    req.open(options.metod, options.putanja, true);
    req.addEventListener("load", function() {
        if (req.status < 400) {
            callback(req.responseText);
        }
        else {
            callback(new Error("Request failed: " + req.statusText));
        }
    });
    req.addEventListener("error", function() {
        callback(new Error("Network error"));
    });
    req.send(options.zadatak || null);
}

function dodajZadatak() {
    var prikazi = document.querySelector("#zadatak-prikazi");
    prikazi.innerHTML = "";

    var korisnicko_ime = document.querySelector("#korisnicko-ime").value;
    var zadatak = document.querySelector("#zadatak").value;

    if(!validnostPodataka(korisnicko_ime)) {
        alert("Pogresan unos podataka!");
    }

    var options = {};
    options.metod = "post";
    options.putanja = "novi-zadatak";
    var korisnik = {
        "ime" : korisnicko_ime,
        "zadatak" : zadatak
    };
    options.zadatak = JSON.stringify(korisnik);
    //alert(options)
    AjaxZahtev(options, odgovorServeraP);
}

function Brisanje(odgovor) {
    alert(odgovor);
}

function brisiZadatak(sta) {
	//var a = document.querySelector("#"+sta);
    sta.style.display = "none";
    sta.nextElementSibling.style.display = "none";
    var korisnicko_ime = document.querySelector("#korisnicko-ime").value;
    zadatak = sta.nextElementSibling.innerHTML;
    //alert(zadatak);
    var options = {};
    options.metod = "post";
    options.putanja = "brisanje";
    var brisi = {
        "ime" : korisnicko_ime,
        "zadatak" : zadatak
    };
    options.zadatak = JSON.stringify(brisi);
    AjaxZahtev(options, Brisanje);
}

function odgovorServeraP(odgovor) {
    zadaci = JSON.parse(odgovor);
    var prikazi = document.querySelector("#zadatak-prikazi");
    for(var i = 0; i<zadaci.length; i++) {
        if(zadaci[i].zadatak != "" && zadaci[i].zadatak != undefined) {
            prikazi.innerHTML += "<p><span class='dugme-code' onclick='brisiZadatak(this)'>&#128465;</span><span>"+zadaci[i].zadatak+"</span></p>";
        }
    }
}
    
function validnostPodataka(korisnicko_ime) {
    if(korisnicko_ime == "") {
        return false;
    }
    return true;
}

