//Bibliotecas
const fs = require('fs');
var pdf = require('html-pdf');
const path = require('path');

//Caminho treta para funcionar o html-pdf
let _path = "file:\\\ " + __dirname;
_path = _path.split(' ').join('');

//Lê o arquivo gerado pela main.c
fs.readFile('../calendario.txt', function read(err, data) {
    if (err) {
        console.log("Erro ao abrir o arquivo ../calendario.txt.");
        console.log("Tenha certeza que o mesmo existe e está no local correto.");
        console.log(err.message);
    }
    data = data.toString(); //Converter o arquivo lido para texto
    let str = data.split('\r\n').slice(0); //Separa o arquivo por linha
    let idioma = str[0]; //A primeira linha é o idioma
    let mes = parseInt(str[1]) - 1; //A segunda linha é o mês e o ano, sendo primeiro o mês
    let ano = parseInt(str[1].slice(str[1].indexOf(' ') + 1)); //Divide a linha do mês e ano por espaço e pega o segundo elemento

    let eventos = data.split('\r\n').slice(2); //Pega os eventos dividindo o arquivo por \r\n e pegando a partir da segunda ocorrencia

    let eventDays = []; //Dias dos eventos
    let eventType = []; //Tipos dos eventos
    let eventName = []; //Nomes dos eventos

    eventos.forEach((el, index) => {
        let splited = el.split(' ').slice(0, 2);
        if (!isNaN(parseInt(splited[0]))) {
            eventDays[index] = splited[0];
            eventType[index] = splited[1];
            eventName[index] = el.slice(el.indexOf(eventType[index]) + 1);
        }
    });

    fs.readFile('calendarioIn.html', function (err, data) {
        if (err) {
            console.log("Erro ao abrir o arquivo .calendarioIn.html.");
            console.log("Tenha certeza que o mesmo existe e está no local correto.");
            console.log(err.message);
        }
        data = data.toString();
        let mesAtual = mes;
        let anoAtual = ano;
        let mesAnterior = (mesAtual == 0) ? 11 : mesAtual - 1;
        let mesProximo = (mesAtual == 11) ? 0 : mesAtual + 1;
        let anoAnterior = (mesAtual == 0) ? anoAtual - 1 : anoAtual;
        let anoProximo = (mesAtual == 11) ? anoAtual + 1 : anoAtual;

        //Mes principal
        let firstDay = new Date(anoAtual, mesAtual, 1);
        let days = [];
        
        let indexer;
        let lastDay = new Date(anoAtual, mesAtual + 1, 0);

        if ((firstDay.getDay() + lastDay.getDate()) <= 35) {
            indexer = 34;
            let lastWeek = data.slice(data.indexOf('mlwi'), data.indexOf('mlwf') + 4);
            data = data.replace(lastWeek, '');
        } else {
            indexer = 41;
            data = data.replace('mlwi', '');
            data = data.replace('mlwf', '');
        }

        for (let i = 0; i <= indexer; i++) {
            days[i] = new Date(anoAtual, mesAtual, -firstDay.getDay() + 1 + i);
            let instantMonth = days[i].getMonth();
            days[i] = days[i].getDate();

            if (instantMonth != mesAtual) {
                if (i < 10) {
                    data = data.replace('0' + i + 'c', 'dateold');
                } else {
                    data = data.replace(i + 'c', 'dateold');
                }
            } else {
                if (i < 10) {
                    data = data.replace('0' + i + 'c', 'date');
                } else {
                    data = data.replace(i + 'c', 'date');
                }
            }

            if (i < 10) {
                data = data.replace('0' + i + 'h', days[i]);
            } else {
                data = data.replace(i + 'h', days[i]);
            }

            if (instantMonth == mesAtual && eventDays.includes(days[i].toString())) {
                let eventsAtThisDay = '';
                eventDays.forEach(function (el, index) {
                    if (days[i].toString() == el) {
                        eventsAtThisDay += eventParse2HTML(eventType[index], eventName[index]);
                    }
                });
                if (i < 10) {
                    data = data.replace('even0' + i, eventsAtThisDay);
                } else {
                    data = data.replace('even' + i, eventsAtThisDay);
                }
            } else {
                if (i < 10)
                    data = data.replace('even0' + i, '');
                else
                    data = data.replace('even' + i, '');
            }
        }

        //Mes anterior
        firstDay = new Date(anoAnterior, mesAnterior, 1);
        days = [];

        indexer;
        lastDay = new Date(anoAnterior, mesAnterior + 1, 0);

        if ((firstDay.getDay() + lastDay.getDate()) <= 35) {
            indexer = 34;
            lastWeek = data.slice(data.indexOf('llwi'), data.indexOf('llwf') + 4);
            data = data.replace(lastWeek, '');
        } else {
            indexer = 41;
            data = data.replace('llwi', '');
            data = data.replace('llwf', '');
        }

        for (let i = 0; i <= indexer; i++) {
            days[i] = new Date(anoAnterior, mesAnterior, -firstDay.getDay() + 1 + i);
            let instantMonth = days[i].getMonth();
            days[i] = days[i].getDate();

            if (instantMonth != mesAnterior) {
                if (i < 10) {
                    data = data.replace('0' + i + 'lc', 'dateold');
                } else {
                    data = data.replace(i + 'lc', 'dateold');
                }
            } else {
                if (i < 10) {
                    data = data.replace('0' + i + 'lc', 'date');
                } else {
                    data = data.replace(i + 'lc', 'date');
                }
            }

            if (i < 10) {
                data = data.replace('0' + i + 'lh', days[i]);
            } else {
                data = data.replace(i + 'lh', days[i]);
            }
        }

        //Mes posterior
        firstDay = new Date(anoProximo, mesProximo, 1);
        days = [];

        indexer;
        lastDay = new Date(anoProximo, mesProximo + 1, 0);

        if ((firstDay.getDay() + lastDay.getDate()) <= 35) {
            indexer = 34;
            lastWeek = data.slice(data.indexOf('rlwi'), data.indexOf('rlwf') + 4);
            data = data.replace(lastWeek, '');
        } else {
            indexer = 41;
            data = data.replace('rlwi', '');
            data = data.replace('rlwf', '');
        }

        for (let i = 0; i <= indexer; i++) {
            days[i] = new Date(anoProximo, mesProximo, -firstDay.getDay() + 1 + i);
            let instantMonth = days[i].getMonth();
            days[i] = days[i].getDate();

            if (instantMonth != mesProximo) {
                if (i < 10) {
                    data = data.replace('0' + i + 'rc', 'dateold');
                } else {
                    data = data.replace(i + 'rc', 'dateold');
                }
            } else {
                if (i < 10) {
                    data = data.replace('0' + i + 'rc', 'date');
                } else {
                    data = data.replace(i + 'rc', 'date');
                }
            }

            if (i < 10) {
                data = data.replace('0' + i + 'rh', days[i]);
            } else {
                data = data.replace(i + 'rh', days[i]);
            }

        }

        //Parse month
        switch (mesAtual) {
            case 0:
                mesAnterior = (idioma == 'ingles') ? 'December' : 'Dezembro';
                mesAtual = (idioma == 'ingles') ? 'January' : 'Janeiro';
                mesProximo = (idioma == 'ingles') ? 'February' : 'Fevereiro';
                break;
            case 1:
                mesAnterior = (idioma == 'ingles') ? 'January' : 'Janeiro';
                mesAtual = (idioma == 'ingles') ? 'February' : 'Fevereiro';
                mesProximo = (idioma == 'ingles') ? 'March' : 'Março';
                break;
            case 2:
                mesAnterior = (idioma == 'ingles') ? 'February' : 'Fevereiro';
                mesAtual = (idioma == 'ingles') ? 'March' : 'Março';
                mesProximo = (idioma == 'ingles') ? 'April' : 'Abril';
                break;
            case 3:
                mesAnterior = (idioma == 'ingles') ? 'March' : 'Março';
                mesAtual = (idioma == 'ingles') ? 'April' : 'Abril';
                mesProximo = (idioma == 'ingles') ? 'May' : 'Maio';
                break;
            case 4:
                mesAnterior = (idioma == 'ingles') ? 'April' : 'Abril';
                mesAtual = (idioma == 'ingles') ? 'May' : 'Maio';
                mesProximo = (idioma == 'ingles') ? 'June' : 'Junho';
                break;
            case 5:
                mesAnterior = (idioma == 'ingles') ? 'May' : 'Maio';
                mesAtual = (idioma == 'ingles') ? 'June' : 'Junho';
                mesProximo = (idioma == 'ingles') ? 'July' : 'Julho';
                break;
            case 6:
                mesAnterior = (idioma == 'ingles') ? 'June' : 'Junho';
                mesAtual = (idioma == 'ingles') ? 'July' : 'Julho';
                mesProximo = (idioma == 'ingles') ? 'August' : 'Agosto';
                break;
            case 7:
                mesAnterior = (idioma == 'ingles') ? 'July' : 'Julho';
                mesAtual = (idioma == 'ingles') ? 'August' : 'Agosto';
                mesProximo = (idioma == 'ingles') ? 'September' : 'Setembro';
                break;
            case 8:
                mesAnterior = (idioma == 'ingles') ? 'August' : 'Agosto';
                mesAtual = (idioma == 'ingles') ? 'September' : 'Setembro';
                mesProximo = (idioma == 'ingles') ? 'October' : 'Outubro';
                break;
            case 9:
                mesAnterior = (idioma == 'ingles') ? 'September' : 'Setembro';
                mesAtual = (idioma == 'ingles') ? 'October' : 'Outubro';
                mesProximo = (idioma == 'ingles') ? 'November' : 'Novembro';
                break;
            case 10:
                mesAnterior = (idioma == 'ingles') ? 'October' : 'Outubro';
                mesAtual = (idioma == 'ingles') ? 'November' : 'Novembro';
                mesProximo = (idioma == 'ingles') ? 'December' : 'Dezembro';
                break;
            case 11:
                mesAnterior = (idioma == 'ingles') ? 'November' : 'Novembro';
                mesAtual = (idioma == 'ingles') ? 'December' : 'Dezembro';
                mesProximo = (idioma == 'ingles') ? 'January' : 'Janeiro';
                break;
        }

        //Calendario principal
        data = data.replace("Januarym", mesAtual);
        data = data.replace("2019m", anoAtual.toString());
        //Calendario da esquerda
        data = data.replace("Januaryl", mesAnterior);
        data = data.replace("2019l", anoAnterior.toString());
        //Calendario da direita
        data = data.replace("Januaryr", mesProximo);
        data = data.replace("2019r", anoProximo.toString());

        if (idioma.includes('portugues')) {
            //Calendario principal
            data = data.replace('Sunm', 'Dom');
            data = data.replace('Monm', 'Seg');
            data = data.replace('Tuem', 'Ter');
            data = data.replace('Wedm', 'Qua');
            data = data.replace('Thum', 'Qui');
            data = data.replace('Frim', 'Sex');
            data = data.replace('Satm', 'Sab');
            //Calendario da esquerda
            data = data.replace('Sunlh', 'Dom');
            data = data.replace('Monlh', 'Seg');
            data = data.replace('Tuelh', 'Ter');
            data = data.replace('Wedlh', 'Qua');
            data = data.replace('Thulh', 'Qui');
            data = data.replace('Frilh', 'Sex');
            data = data.replace('Satlh', 'Sab');
            //Calendario da direita
            data = data.replace('Sunrh', 'Dom');
            data = data.replace('Monrh', 'Seg');
            data = data.replace('Tuerh', 'Ter');
            data = data.replace('Wedrh', 'Qua');
            data = data.replace('Thurh', 'Qui');
            data = data.replace('Frirh', 'Sex');
            data = data.replace('Satrh', 'Sab');
        } else {
            //Calendario principal
            data = data.replace('Sunm', 'Sun');
            data = data.replace('Monm', 'Mon');
            data = data.replace('Tuem', 'Tue');
            data = data.replace('Wedm', 'Wed');
            data = data.replace('Thum', 'Thu');
            data = data.replace('Frim', 'Fri');
            data = data.replace('Satm', 'Sat');
            //Calendario da esquerda
            data = data.replace('Sunlh', 'Sun');
            data = data.replace('Monlh', 'Mon');
            data = data.replace('Tuelh', 'Tue');
            data = data.replace('Wedlh', 'Wed');
            data = data.replace('Thulh', 'Thu');
            data = data.replace('Frilh', 'Fri');
            data = data.replace('Satlh', 'Sat');
            //Calendario da direita
            data = data.replace('Sunrh', 'Sun');
            data = data.replace('Monrh', 'Mon');
            data = data.replace('Tuerh', 'Tue');
            data = data.replace('Wedrh', 'Wed');
            data = data.replace('Thurh', 'Thu');
            data = data.replace('Frirh', 'Fri');
            data = data.replace('Satrh', 'Sat');
        }

        fs.writeFileSync("calendarioOut.html", data);
        createPDF();
    });
});

function eventParse2HTML(type, name) {
    if (type.includes('A')) {
        return '<p class = "event"><img src="' + _path + '\\cake.png" height="20px"> ' + name + '</p>';
    } else if (type.includes('V')) {
        return '<p class = "event"><img src="' + _path + '\\plane.png" height="20px"> ' + name + '</p>';
    } else if (type.includes('F')) {
        return '<p class = "event"><img src="' + _path + '\\holiday.png" height="20px"> ' + name + '</p>';
    } else {
        return '<p class = "event">' + name + '</p>';
    }
}

function createPDF() {
    let html = fs.readFileSync("calendarioOut.html", 'utf8');
    var options = {
        format: 'Letter'
    };

    pdf.create(html, options).toFile('../calendar.pdf', function (err, res) {
        if (err) return console.log(err);
    });
}