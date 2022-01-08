//Usar el paquete nodemailer para el envío de correos electrónicos. (3 Puntos
const nodemailer = require("nodemailer");

//Crear una función que reciba la lista de correos, asunto y contenido a enviar. Esta función debe retornar una promesa. (1 Punto

const transporter = {
  service: "gmail",
  secure: false,
  auth: {
    user: "desafiolatamprueba@gmail.com",
    pass: "Alejandro32",
  },
};

const enviarCorreo = nodemailer.createTransport(transporter);

module.exports = enviarCorreo;
