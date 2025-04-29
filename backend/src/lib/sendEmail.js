//send email
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

//configre transport

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.GMAIL_USER,
        pass:process.env.GMAIL_PASS
    }
});

//send email
async function sendEmail(to,subject,html) {
    await transporter.sendMail({
        from:`"Image Cleaner Bot" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html
    });
}

export default sendEmail;