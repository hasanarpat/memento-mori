import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

// Read .env manually since we might not have dotenv CLI
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');

const envs = {};
envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
        let value = valueParts.join('=')?.trim();
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
        }
        envs[key.trim()] = value;
    }
});

const apiKey = envs.RESEND_API_KEY;

if (!apiKey) {
    console.error('❌ RESEND_API_KEY not found in .env file');
    process.exit(1);
}

console.log(`🔑 Using API Key: ${apiKey.slice(0, 5)}...${apiKey.slice(-5)}`);

const resend = new Resend(apiKey);

(async () => {
    try {
        console.log('📨 Sending test email...');
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'delivered@resend.dev', // Default test address
            subject: 'Memento Mori Test Ritual',
            html: '<h1>Ritual Successful</h1><p>The veil has been pierced. Email sending is working.</p>',
        });

        if (data.error) {
            console.error('❌ Failed to send email:', data.error);
        } else {
            console.log('✅ Email sent successfully!');
            console.log('🆔 ID:', data.data?.id);
            console.log('Check your Resend dashboard or delivered@resend.dev inbox.');
        }
    } catch (error) {
        console.error('❌ Exception:', error);
    }
})();
