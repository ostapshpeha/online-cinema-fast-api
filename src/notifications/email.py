from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os


def send_email(to_email: str, subject: str, content: str):
    message = Mail(
        from_email=os.getenv("SENDGRID_FROM_EMAIL"),
        to_emails="dmytro.malyk7@gmail.com",
        subject="subject",
        html_content=content,
    )

    try:
        sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
        sg.send(message)
    except Exception as e:
        raise RuntimeError(f"SendGrid error: {e}")
