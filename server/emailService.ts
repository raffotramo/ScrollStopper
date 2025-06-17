// Email service per gestire notifiche utenti
export interface EmailData {
  to: string;
  subject: string;
  text: string;
  html: string;
}

// Invio email di benvenuto per nuovi utenti Shopify
export async function sendShopifyWelcomeEmail(userEmail: string, tempPassword: string, username: string) {
  const emailData: EmailData = {
    to: userEmail,
    subject: "Benvenuto in ScrollStop - Il tuo account è pronto!",
    text: `
Ciao ${username}!

Grazie per aver acquistato ScrollStop dal nostro negozio Shopify.

Il tuo account è stato creato automaticamente:
• Email: ${userEmail}
• Password temporanea: ${tempPassword}

Accedi all'app per iniziare la tua sfida di 30 giorni:
${process.env.NODE_ENV === 'production' ? 'https://scrollstop.replit.app' : 'http://localhost:5000'}

Ti consigliamo di cambiare la password dopo il primo accesso.

Inizia oggi stesso il tuo percorso verso una vita digitale più consapevole!

Il team ScrollStop
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Benvenuto in ScrollStop</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">⚡ ScrollStop</h1>
        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">La tua sfida di 30 giorni inizia ora</p>
    </div>
    
    <h2 style="color: #667eea;">Ciao ${username}!</h2>
    
    <p>Grazie per aver acquistato ScrollStop. Il tuo account è stato creato automaticamente e sei pronto per iniziare la trasformazione digitale.</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #495057;">🔑 Le tue credenziali di accesso:</h3>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Password temporanea:</strong> <code style="background: #e9ecef; padding: 2px 6px; border-radius: 4px;">${tempPassword}</code></p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NODE_ENV === 'production' ? 'https://scrollstop.replit.app' : 'http://localhost:5000'}" 
           style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            🚀 Accedi all'App
        </a>
    </div>
    
    <div style="border-left: 4px solid #ffc107; padding-left: 15px; margin: 20px 0; background: #fff3cd; padding: 15px; border-radius: 4px;">
        <p style="margin: 0;"><strong>💡 Consiglio:</strong> Cambia la password dopo il primo accesso per maggiore sicurezza.</p>
    </div>
    
    <h3>🎯 Cosa ti aspetta:</h3>
    <ul style="padding-left: 20px;">
        <li>30 giorni di attività guidate per ridurre lo scrolling compulsivo</li>
        <li>Strumenti anti-scrolling per emergenze</li>
        <li>Sistema di tracciamento progresso e achievement</li>
        <li>Comunità di supporto per il tuo percorso</li>
    </ul>
    
    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #dee2e6;">
        <p style="color: #6c757d; font-size: 14px;">
            Il team ScrollStop<br>
            La tua trasformazione digitale inizia oggi
        </p>
    </div>
</body>
</html>
    `
  };

  // Se SendGrid è disponibile, invia email reale
  if (process.env.SENDGRID_API_KEY) {
    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@scrollstop.app';
      
      await sgMail.send({
        to: emailData.to,
        from: fromEmail, // Configurabile tramite variabile ambiente
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html
      });
      
      console.log(`Welcome email sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error('SendGrid email error:', error);
      return false;
    }
  } else {
    // Log email per sviluppo
    console.log('=== EMAIL BENVENUTO SHOPIFY ===');
    console.log(`To: ${emailData.to}`);
    console.log(`Subject: ${emailData.subject}`);
    console.log(emailData.text);
    console.log('================================');
    return true;
  }
}

// Invio email di conferma registrazione standard
export async function sendRegistrationConfirmationEmail(userEmail: string, username: string) {
  const emailData: EmailData = {
    to: userEmail,
    subject: "Benvenuto in ScrollStop - Registrazione completata!",
    text: `
Ciao ${username}!

La tua registrazione a ScrollStop è stata completata con successo.

Sei pronto per iniziare la tua sfida di 30 giorni verso una vita digitale più consapevole.

Accedi all'app per iniziare:
${process.env.NODE_ENV === 'production' ? 'https://scrollstop.replit.app' : 'http://localhost:5000'}

Buona trasformazione digitale!

Il team ScrollStop
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Benvenuto in ScrollStop</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">⚡ ScrollStop</h1>
        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Benvenuto nella community</p>
    </div>
    
    <h2 style="color: #667eea;">Ciao ${username}!</h2>
    
    <p>🎉 La tua registrazione è stata completata con successo!</p>
    
    <p>Sei ora parte della community di ScrollStop e puoi iniziare il tuo percorso di trasformazione digitale.</p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NODE_ENV === 'production' ? 'https://scrollstop.replit.app' : 'http://localhost:5000'}" 
           style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            🚀 Inizia la Sfida
        </a>
    </div>
    
    <h3>🎯 Il tuo percorso di 30 giorni include:</h3>
    <ul style="padding-left: 20px;">
        <li>Attività quotidiane per ridurre lo scrolling compulsivo</li>
        <li>Strumenti di emergenza anti-scrolling</li>
        <li>Tracciamento progresso e sistema achievement</li>
        <li>Community di supporto e motivazione</li>
    </ul>
    
    <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #1565c0;">💡 Inizia oggi stesso</h4>
        <p style="margin-bottom: 0;">Il momento migliore per iniziare è adesso. Ogni giorno conta nel tuo percorso verso una relazione più sana con la tecnologia.</p>
    </div>
    
    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #dee2e6;">
        <p style="color: #6c757d; font-size: 14px;">
            Il team ScrollStop<br>
            Trasforma le tue abitudini digitali, un giorno alla volta
        </p>
    </div>
</body>
</html>
    `
  };

  // Gestione invio email (stessa logica di sopra)
  if (process.env.SENDGRID_API_KEY) {
    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@scrollstop.app';
      
      await sgMail.send({
        to: emailData.to,
        from: fromEmail,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html
      });
      
      console.log(`Registration confirmation email sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error('SendGrid email error:', error);
      return false;
    }
  } else {
    console.log('=== EMAIL CONFERMA REGISTRAZIONE ===');
    console.log(`To: ${emailData.to}`);
    console.log(`Subject: ${emailData.subject}`);
    console.log(emailData.text);
    console.log('====================================');
    return true;
  }
}