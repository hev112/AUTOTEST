import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Explicitly load .env from the server directory
// This ensures it works whether you run 'node server/server.js' or 'cd server && node server.js'
dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allows cross-origin requests
app.use(express.json());

// Logging middleware to debug requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 1. Configure Gmail SMTP Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('❌ SMTP Connection Error:', error);
  } else {
    console.log('✅ Server is ready to take our messages');
  }
});

// 2. Verification Endpoint
app.post('/api/send-code', async (req, res) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  console.log(`Attempting to send email to: ${email}`);

  // 3. Generate 6-digit code on the server side
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // 4. Define Email Content
  const mailOptions = {
    from: `"AutoLuxe Security" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Votre code de vérification AutoLuxe',
    text: `Bonjour ${name}, votre code de vérification est : ${code}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; background-color: #f9fafb;">
        <div style="max-width: 500px; margin: 0 auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="background-color: #0b0b0f; padding: 24px; text-align: center;">
            <h2 style="color: #8b5cf6; margin: 0; letter-spacing: 1px;">AutoLuxe</h2>
          </div>
          <div style="padding: 32px;">
            <p style="color: #374151; margin-top: 0;">Bonjour <strong>${name || 'Client'}</strong>,</p>
            <p style="color: #4b5563; line-height: 1.5;">Pour sécuriser votre compte et finaliser votre inscription, veuillez utiliser le code de confirmation ci-dessous :</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 12px; margin: 24px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111827; display: block;">${code}</span>
            </div>
            
            <p style="font-size: 13px; color: #9ca3af; margin-bottom: 0;">Ce code est valide pendant 15 minutes. Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet email.</p>
          </div>
          <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 11px; color: #9ca3af; margin: 0;">&copy; ${new Date().getFullYear()} AutoLuxe. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    // 5. Send Real Email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent: %s', info.messageId);

    res.status(200).json({ success: true, message: 'Email sent', code: code });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email. Check server logs.', 
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});