const enviar = require('./mailer');
const url = require('url');
const http = require('http');
const fs = require('fs');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
// 3. Realizar una petición a la api de mindicador.cl y preparar un template que incluya los  valores del dólar, euro, uf y utm. Este template debe ser concatenado al mensaje descrito por el usuario en el formulario HTML. (2 Puntos)

function crearTexto(dolar, euro, uf, utm) {
    return `
    <p>El valor del dolar el dia de hoy es: ${dolar}</p>
    <p>El valor del euro el dia de hoy es: ${euro}</p>
    <p>El valor de la uf el dia de hoy es: ${uf}</p>
    <p>El valor de la utm el dia de hoy es: ${utm}</p>
    `
}

http.createServer((req, res) => {
    let { correos, asunto, contenido } = url.parse(req.url, true).query;

    if (req.url == '/') {
        res.setHeader('Content-Type', 'text/html')
        fs.readFile('index.html', 'utf8', (err, data) => {
            res.end(data)
        })
    }
// 4. Enviar un mensaje de éxito o error por cada intento de envío de correos electrónicos.(2 Puntos)

    if (req.url.includes('/mailing')) {
        axios.get('https://mindicador.cl/api').then(response => {

            let dolar = response.data.dolar.valor;
            let euro = response.data.euro.valor;
            let uf = response.data.uf.valor;
            let utm = response.data.utm.valor;

            let texto = crearTexto(dolar, euro, uf, utm)
            contenido = contenido + texto
            enviar(correos.split(','), asunto, contenido)
                .then(response => {
                    res.end('Correo enviado con exito')
                    const correoId = uuidv4()
                    fs.writeFile(`./correos/${correoId}.txt`, contenido, 'utf8', (err) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                })
                .catch(err => res.end('error en el envio del correo'))
        })
    }
}).listen(3000, () => console.log('Servidor ON'))


// 5. Cada correo debe ser almacenado como un archivo con un nombre identificador único en una carpeta “correos”. Usar el paquete UUID para esto. (2 Puntos)