# **📧 Kofi Solutions — Email Sending Setup Guide**
**How to send email from your @kofisolutions.com address**

Welcome to the Kofi Solutions email system.  
Our company uses Amazon SES (Simple Email Service) to send email securely and reliably.  
This guide walks you through how to set up your mailbox so you can **compose and send emails** from your Kofi Solutions address.

You only need to do this setup **once**.

---

## **1. Your Email Address**
You have been assigned a Kofi Solutions email identity:

```
<yourname>@kofisolutions.com
```

You will continue receiving mail in your normal Gmail inbox (or whichever inbox you use).  
This guide enables you to **send** from your Kofi address as well.

---

## **2. Your SMTP Login (Provided by Admin)**
You will receive a message from Jason with:

- **SMTP Username**
- **SMTP Password**

These are unique to you.  
They are used only for sending email — not for logging into AWS.

Keep them private.

---

## **3. SMTP Server Settings**
When your email client asks for outgoing mail settings, enter the following:

| Setting | Value |
|--------|-------|
| **SMTP Server** | `email-smtp.us-east-1.amazonaws.com` |
| **Port** | 587 |
| **Encryption** | STARTTLS |
| **Username** | (your SMTP username) |
| **Password** | (your SMTP password) |
| **From Address** | your @kofisolutions.com email |

These settings work for Gmail, Outlook, Apple Mail, mobile apps, and desktop clients.

---

## **4. Setting Up “Send Mail As” in Gmail (Recommended)**
If you use Gmail, follow these steps:

1. Open Gmail  
2. Click the **gear icon → See all settings**  
3. Go to **Accounts and Import**  
4. Find **Send mail as**  
5. Click **Add another email address**  
6. Enter your name and your Kofi email  
7. When asked for SMTP settings, enter the values above  
8. Gmail will send a verification code  
9. Check your inbox (your Kofi mail forwards there)  
10. Enter the code to complete setup

You can now choose your Kofi address when composing emails.

---

## **5. Sending Email**
After setup:

- In Gmail: choose your Kofi address in the “From” dropdown  
- In Outlook/Apple Mail: select your Kofi account when composing  
- All messages will be delivered through our secure SES mail server

---

## **6. Support**
If you need help with setup or lose your SMTP credentials, contact:

```
support@kofisolutions.com
```

Or reach out directly to Jason.
