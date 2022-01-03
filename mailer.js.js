//Usar el paquete nodemailer para el envío de correos electrónicos. (3 Puntos
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: 'desafiolatamprueba@gmail.com',
        pass: 'Alejandro32',
    }
})
//Crear una función que reciba la lista de correos, asunto y contenido a enviar. Esta función debe retornar una promesa. (1 Punto
async function enviar(to, subject, text){
    return new Promise((resolve, reject) => {
        
        let mailOptions = {
            from: 'ju.quezada.c@gmail.com',
            to,
            subject,
            text,
        }

        transporter.sendMail(mailOptions, (err, data) => {
            if (ree) {
                console.log('error');
                reject(err);
            }
            if (data) {
                console.log('Correo envviado con éxito')
                resolve(data)
            }
        })
    })
}

module.exports = enviar