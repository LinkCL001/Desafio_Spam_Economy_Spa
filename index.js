const enviar = require("./mailer");
const url = require("url");
const http = require("http");
const fs = require("fs");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const enviarCorreo = require("./mailer");

http
  .createServer(async (req, res) => {
    const obtenerIndicadores = async () => {
      const { data } = await axios.get("https://mindicador.cl/api");
      const dolar = data.dolar.valor;
      const euro = data.euro.valor;
      const uf = data.uf.valor;
      const utm = data.utm.valor;
      const valorIndicadores = {
        dolar: dolar,
        euro: euro,
        uf: uf,
        utm: utm,
      };
      return valorIndicadores;
    };
    const crearTemplate = async (valorIndicadores) => {
      const valores = await obtenerIndicadores();
      const template =`<p> El valor del Dolar el día de hoy es: ${valores.dolar}</p>
    <p>El valor del Euro el día de hoy es: ${valores.euro}</p>
    <p>El valor de la UF el día de hoy es: ${valores.uf}</p>
    <p>El valor de la UTM el día de hoy es: ${valores.utm}</p>`;
      return template;
    };
    const obtenerCorreo = (req) => {
      const { correos, asunto, contenido } = url.parse(req.url, true).query;
      const arrayCorreos = correos.split(",");
      const parametrosCorreo = {
        correos: arrayCorreos,
        asunto,
        contenido,
      };
      const promesaSalida = new Promise((res, rej) => {
        if (correos != "" && asunto && contenido) {
          res(parametrosCorreo);ss
        } else {
          rej("No se puede enviar el correo, porfavor intente nuevamente");
        }
      });
      return promesaSalida;
    };

    if (req.url == "/") {
      fs.readFile("index.html", (err, data) => {
        if (err) {
          console.log(err);
          res.end();
        }
        if (data) {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        }
      });
    }
    if (req.url.startsWith("/mailing")) {
      const valores = await obtenerIndicadores();
      const template = await crearTemplate(valores);
      const correo = obtenerCorreo(req);
      correo
        .then((data) => {
          enviarCorreo.sendMail(
            {
              from: "desafiolatamprueba@gmail.com",
              to: data.correos,
              subject: data.asunto,
              text: data.promesaSalida + template,
            },
            (err, data) => {
              if (err) {
                res.writeHead(500, { "Content-type": "text/html; charset=utf-8" });
                console.log("Error de Envio");
                res.end("Error en el envio, por favor intente nuevamente");
              }
              fs.writeFile(
                `./correos-${uuidv4().slice(0, 6)}.json`,
                JSON.stringify(data),
                () => console.log("Archivo de correo Creado con éxito ")
              );
              console.log("Correo enviado");
              res.end("correo enviado con éxito");
            }
          );
        })
        .catch((err) => {
          console.log(err);
          res.end("error en el envio del correo");
        });
    }
  })
  .listen(3000, () => console.log("Servidor ON"));

// 5. Cada correo debe ser almacenado como un archivo con un nombre identificador único en una carpeta “correos”. Usar el paquete UUID para esto. (2 Puntos)
