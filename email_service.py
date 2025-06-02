import smtplib
from email.mime.text import MIMEText

def send_verification_email(email, code):
    sender = "your-email@example.com"  # Replace with your sender email
    smtp_server = "smtp.example.com"  # Replace with your SMTP server
    smtp_port = 587  # Replace with your SMTP port (587 for TLS, 465 for SSL)
    smtp_username = "your-email@example.com"  # Replace with SMTP username
    smtp_password = "your-password"  # Replace with SMTP password

    message = MIMEText(f"Your verification code is: {code}")
    message['Subject'] = "Email Verification"
    message['From'] = sender
    message['To'] = email

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()  # Enable TLS encryption
            server.login(smtp_username, smtp_password)
            server.send_message(message)
            print(f"Verification email sent to {email}")
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
