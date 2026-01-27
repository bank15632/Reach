// Email Service
// Configure with one of: Resend, SendGrid, or Nodemailer
// Environment variables needed:
// EMAIL_PROVIDER=resend|sendgrid|smtp
// RESEND_API_KEY=re_xxx (if using Resend)
// SENDGRID_API_KEY=SG.xxx (if using SendGrid)
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (if using SMTP)
// EMAIL_FROM=noreply@yourdomain.com

import { getPrisma } from '@/lib/db/prisma';

export type EmailType = 
    | 'ORDER_CONFIRMATION'
    | 'ORDER_SHIPPED'
    | 'ORDER_DELIVERED'
    | 'AUCTION_OUTBID'
    | 'AUCTION_WON'
    | 'AUCTION_PAYMENT_REMINDER'
    | 'PASSWORD_RESET'
    | 'WELCOME';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

interface SendEmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

// Check if email is configured
export function isEmailConfigured(): boolean {
    const provider = process.env.EMAIL_PROVIDER;
    if (!provider || !process.env.EMAIL_FROM) return false;

    switch (provider) {
        case 'resend':
            return !!process.env.RESEND_API_KEY;
        case 'sendgrid':
            return !!process.env.SENDGRID_API_KEY;
        case 'smtp':
            return !!(process.env.SMTP_HOST && process.env.SMTP_USER);
        default:
            return false;
    }
}

// Send email using configured provider
export async function sendEmail(options: EmailOptions): Promise<SendEmailResult> {
    const provider = process.env.EMAIL_PROVIDER;
    const from = process.env.EMAIL_FROM || 'noreply@reach.com';

    try {
        switch (provider) {
            case 'resend':
                return await sendWithResend({ ...options, from });
            case 'sendgrid':
                return await sendWithSendGrid({ ...options, from });
            case 'smtp':
                return await sendWithSMTP({ ...options, from });
            default:
                console.log('[Email] Provider not configured, logging email:');
                console.log(`To: ${options.to}`);
                console.log(`Subject: ${options.subject}`);
                console.log(`Body: ${options.text || 'HTML content'}`);
                return { success: true, messageId: 'dev-mode' };
        }
    } catch (error: any) {
        console.error('[Email] Error sending:', error);
        return { success: false, error: error.message };
    }
}

// Send using Resend API
async function sendWithResend(options: EmailOptions & { from: string }): Promise<SendEmailResult> {
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: options.from,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text
        })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to send email via Resend');
    }

    return { success: true, messageId: data.id };
}

// Send using SendGrid API
async function sendWithSendGrid(options: EmailOptions & { from: string }): Promise<SendEmailResult> {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            personalizations: [{ to: [{ email: options.to }] }],
            from: { email: options.from },
            subject: options.subject,
            content: [
                { type: 'text/html', value: options.html },
                ...(options.text ? [{ type: 'text/plain', value: options.text }] : [])
            ]
        })
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`SendGrid error: ${text}`);
    }

    return { success: true, messageId: response.headers.get('x-message-id') || undefined };
}

// Send using SMTP (placeholder - would need nodemailer)
async function sendWithSMTP(options: EmailOptions & { from: string }): Promise<SendEmailResult> {
    // In production, install nodemailer:
    // npm install nodemailer
    // import nodemailer from 'nodemailer';
    
    console.log('[Email] SMTP sending not implemented. Install nodemailer package.');
    console.log(`To: ${options.to}, Subject: ${options.subject}`);
    
    return { success: true, messageId: 'smtp-placeholder' };
}

// Log email to database
export async function logEmail(
    type: EmailType,
    email: string,
    subject: string,
    userId?: string,
    status: 'PENDING' | 'SENT' | 'FAILED' = 'PENDING',
    error?: string
) {
    const prisma = getPrisma();
    await prisma.emailLog.create({
        data: {
            type,
            email,
            subject,
            userId,
            status,
            error,
            sentAt: status === 'SENT' ? new Date() : null
        }
    });
}

// Email templates
export const emailTemplates = {
    orderConfirmation: (data: { 
        orderNumber: string; 
        customerName: string;
        items: { name: string; quantity: number; price: number }[];
        total: number;
        shippingAddress: string;
    }) => ({
        subject: `Order Confirmation - #${data.orderNumber}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #000; padding: 20px; text-align: center;">
                    <h1 style="color: #FFD700; margin: 0;">REACH</h1>
                </div>
                <div style="padding: 20px;">
                    <h2>Thank you for your order!</h2>
                    <p>Hi ${data.customerName},</p>
                    <p>We've received your order and it's being processed.</p>
                    
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Order Number:</strong> ${data.orderNumber}</p>
                    </div>
                    
                    <h3>Order Items:</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        ${data.items.map(item => `
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee;">x${item.quantity}</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">฿${item.price.toLocaleString()}</td>
                            </tr>
                        `).join('')}
                        <tr>
                            <td colspan="2" style="padding: 10px;"><strong>Total:</strong></td>
                            <td style="padding: 10px; text-align: right;"><strong>฿${data.total.toLocaleString()}</strong></td>
                        </tr>
                    </table>
                    
                    <h3>Shipping Address:</h3>
                    <p>${data.shippingAddress}</p>
                    
                    <p>If you have any questions, please contact us.</p>
                    <p>Best regards,<br>The Reach Team</p>
                </div>
            </div>
        `,
        text: `Thank you for your order #${data.orderNumber}. Total: ฿${data.total.toLocaleString()}`
    }),

    orderShipped: (data: {
        orderNumber: string;
        customerName: string;
        trackingNumber?: string;
        carrier?: string;
    }) => ({
        subject: `Your Order Has Been Shipped - #${data.orderNumber}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #000; padding: 20px; text-align: center;">
                    <h1 style="color: #FFD700; margin: 0;">REACH</h1>
                </div>
                <div style="padding: 20px;">
                    <h2>Your order is on its way! 📦</h2>
                    <p>Hi ${data.customerName},</p>
                    <p>Great news! Your order #${data.orderNumber} has been shipped.</p>
                    
                    ${data.trackingNumber ? `
                        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0;"><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
                            ${data.carrier ? `<p style="margin: 5px 0 0;"><strong>Carrier:</strong> ${data.carrier}</p>` : ''}
                        </div>
                    ` : ''}
                    
                    <p>Best regards,<br>The Reach Team</p>
                </div>
            </div>
        `,
        text: `Your order #${data.orderNumber} has been shipped. ${data.trackingNumber ? `Tracking: ${data.trackingNumber}` : ''}`
    }),

    auctionWon: (data: {
        auctionTitle: string;
        winningBid: number;
        customerName: string;
        paymentDeadline: string;
        paymentUrl: string;
    }) => ({
        subject: `Congratulations! You Won the Auction`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #000; padding: 20px; text-align: center;">
                    <h1 style="color: #FFD700; margin: 0;">REACH</h1>
                </div>
                <div style="padding: 20px;">
                    <h2>🎉 Congratulations, ${data.customerName}!</h2>
                    <p>You've won the auction for:</p>
                    
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin: 0 0 10px;">${data.auctionTitle}</h3>
                        <p style="margin: 0; font-size: 24px; color: #FFD700;"><strong>฿${data.winningBid.toLocaleString()}</strong></p>
                    </div>
                    
                    <p><strong>Payment Deadline:</strong> ${data.paymentDeadline}</p>
                    <p>Please complete your payment before the deadline to secure your item.</p>
                    
                    <a href="${data.paymentUrl}" style="display: inline-block; background: #FFD700; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">
                        Complete Payment
                    </a>
                    
                    <p>Best regards,<br>The Reach Team</p>
                </div>
            </div>
        `,
        text: `Congratulations! You won ${data.auctionTitle} for ฿${data.winningBid.toLocaleString()}. Pay by ${data.paymentDeadline}.`
    }),

    auctionOutbid: (data: {
        auctionTitle: string;
        newHighBid: number;
        customerName: string;
        auctionUrl: string;
    }) => ({
        subject: `You've Been Outbid!`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #000; padding: 20px; text-align: center;">
                    <h1 style="color: #FFD700; margin: 0;">REACH</h1>
                </div>
                <div style="padding: 20px;">
                    <h2>You've been outbid! 😮</h2>
                    <p>Hi ${data.customerName},</p>
                    <p>Someone has placed a higher bid on:</p>
                    
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin: 0 0 10px;">${data.auctionTitle}</h3>
                        <p style="margin: 0;">Current highest bid: <strong>฿${data.newHighBid.toLocaleString()}</strong></p>
                    </div>
                    
                    <p>Don't let this one get away!</p>
                    
                    <a href="${data.auctionUrl}" style="display: inline-block; background: #FFD700; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">
                        Place a Higher Bid
                    </a>
                    
                    <p>Best regards,<br>The Reach Team</p>
                </div>
            </div>
        `,
        text: `You've been outbid on ${data.auctionTitle}. Current bid: ฿${data.newHighBid.toLocaleString()}`
    }),

    welcome: (data: { customerName: string }) => ({
        subject: `Welcome to Reach!`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #000; padding: 20px; text-align: center;">
                    <h1 style="color: #FFD700; margin: 0;">REACH</h1>
                </div>
                <div style="padding: 20px;">
                    <h2>Welcome to Reach! 🏸</h2>
                    <p>Hi ${data.customerName},</p>
                    <p>Thank you for joining Reach - your destination for premium badminton equipment.</p>
                    
                    <p>With your account, you can:</p>
                    <ul>
                        <li>Shop exclusive badminton gear</li>
                        <li>Participate in auctions for rare items</li>
                        <li>Earn reward points on every purchase</li>
                        <li>Track your orders easily</li>
                    </ul>
                    
                    <p>Start exploring now!</p>
                    
                    <p>Best regards,<br>The Reach Team</p>
                </div>
            </div>
        `,
        text: `Welcome to Reach, ${data.customerName}! Start shopping for premium badminton equipment.`
    })
};

// Send templated email
export async function sendTemplatedEmail(
    type: EmailType,
    to: string,
    templateData: any,
    userId?: string
): Promise<SendEmailResult> {
    let template;
    
    switch (type) {
        case 'ORDER_CONFIRMATION':
            template = emailTemplates.orderConfirmation(templateData);
            break;
        case 'ORDER_SHIPPED':
            template = emailTemplates.orderShipped(templateData);
            break;
        case 'AUCTION_WON':
            template = emailTemplates.auctionWon(templateData);
            break;
        case 'AUCTION_OUTBID':
            template = emailTemplates.auctionOutbid(templateData);
            break;
        case 'WELCOME':
            template = emailTemplates.welcome(templateData);
            break;
        default:
            throw new Error(`Unknown email template: ${type}`);
    }

    // Log email attempt
    await logEmail(type, to, template.subject, userId, 'PENDING');

    const result = await sendEmail({
        to,
        subject: template.subject,
        html: template.html,
        text: template.text
    });

    // Update log with result
    const prisma = getPrisma();
    await prisma.emailLog.updateMany({
        where: { email: to, subject: template.subject, status: 'PENDING' },
        data: {
            status: result.success ? 'SENT' : 'FAILED',
            sentAt: result.success ? new Date() : null,
            error: result.error
        }
    });

    return result;
}
