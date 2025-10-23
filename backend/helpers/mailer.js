import nodemailer from 'nodemailer';

//Note: try to add credentails static first
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: "sandeep.d4d@gmail.com",
        pass: "xlmh jdvg uhmt oehs",
    }
});

// export const transporter = nodemailer.createTransport({
//     host: "sandbox.smtp.mailtrap.io",
//     port: 2525,
//     secure: false,
//     requireTLS: true,
//     auth: {
//         user: "84a3206c1195d5",
//         pass: "6a2a84f11114d2",
//     }
// });
// export const transporter = nodemailer.createTransport({
//     host: "smtp.mailersend.net",
//     port: 587,
//     secure: false,
//     requireTLS: true,
//     auth: {
//         user: "MS_pWHxSL@test-51ndgwvoo7xlzqx8.mlsender.net",
//         pass: "mssp.EsCI4Ty.yzkq340mvxkld796.hLhX864",
//     }
// });

export const sendMail = async (mail, subject, message) => {
    try {
        let mailOptions = {
            from: "sandeep.d4d@gmail.com",
            to: mail,
            subject: subject,
            html: message
        }
        transporter.sendMail(mailOptions, (err, info)=>{
            console.log("Mail sent:", info?.messageId);
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}