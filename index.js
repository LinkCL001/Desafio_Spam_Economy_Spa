const url = require("url");
const http = require("http");
const fs = require("fs");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const enviarCorreo = require("./mailer");

http
  .createServer(async (req, res) => {
    const obtenerIndicadores = async () => {  //Realizar una petición a la api demindicador.clyprepararuntemplatequeincluyalosvalores del dólar, euro, uf y utm. Este template debe ser concatenado al mensaje descrito por el usuario en el formulario HTML. (2 Puntos)
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
      const template =`<h3>Hola! los indicadores económicos de hoy son los siguientes:</h3>
                      <p> El valor del Dolar el día de hoy es: ${valores.dolar}</p>
                      <p>El valor del Euro el día de hoy es: ${valores.euro}</p>
                      <p>El valor de la UF el día de hoy es: ${valores.uf}</p>
                      <p>El valor de la UTM el día de hoy es: ${valores.utm}</p>`;
      return template;
    };
    const obtenerCorreo = (req) => {    //Crear una función que reciba la lista de correos, asunto y contenido a enviar. Esta función debe retornar una promesa. (1 Punto)
      const { correos, asunto, contenido } = url.parse(req.url, true).query;
      const arrayCorreos = correos.split(",");
      const parametrosCorreo = {
        correos: arrayCorreos,
        asunto,
        contenido,
      };
      const promesaSalida = new Promise((res, rej) => {
        if (correos != "" && asunto && contenido) {
          res(parametrosCorreo);
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
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
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
              html: data.promesaSalida + template,
            },
            (err, data) => {
              if (err) {
                res.writeHead(500, { "Content-type": "text/html; charset=utf-8" });
                console.log("Error de Envio");
                res.end("Error en el envio, por favor intente nuevamente"); //Enviar un mensaje de éxito o error por cada intento de envío de correos electrónicos.(2 Puntos)
              }
              fs.writeFile(       // Cada correo debe ser almacenado como un archivo con un nombre identificador único en una carpeta “correos”. Usar el paquete UUID para esto. (2 Puntos)
                `./correos/correos-${uuidv4().slice(0, 6)}.json`,
                JSON.stringify(data),
                () => console.log("Archivo de correo Creado con éxito ")
              );
              console.log("Correo enviado");
              res.end("Correo enviado con éxito");//Enviar un mensaje de éxito o error por cada intento de envío de correos electrónicos.(2 Puntos)
            }
          );
        })
        .catch((err) => {
          console.log(err);
          res.end("Error en el envio del correo");
        });
    }
  })
  .listen(3000, () => console.log("Servidor ON"));


