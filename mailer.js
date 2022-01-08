const nodemailer = require("nodemailer");   //Usar el paquete nodemailer para el envío de correos electrónicos. (3 Puntos)

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
