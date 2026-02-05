import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content
from src.core.config import settings

sg = sendgrid.SendGridAPIClient(api_key=settings.SENDGRID_API_KEY)


def send_email(to_email: str, subject: str, content: str):
    from_email = Email(settings.EMAIL_FROM)  # Change to your verified sender
    to_email = To(to_email)  # Change to your recipient
    subject = subject
    content = Content("text/plain", content)
    mail = Mail(from_email, to_email, subject, content)

    # Get a JSON-ready representation of the Mail object
    mail_json = mail.get()

    # Send an HTTP POST request to /mail/send
    response = sg.client.mail.send.post(request_body=mail_json)
    print(response.status_code)
    print(response.headers)


# import httpx
# from src.core.config import settings
#
# SENDGRID_API_URL = "https://api.sendgrid.com/v3/mail/send"
#
#
# class EmailClient:
#     async def send(
#         self,
#         *,
#         to: str,
#         subject: str,
#         html: str,
#     ) -> None:
#         if not settings.EMAIL_ENABLED:
#             print("EMAIL DISABLED")
#             print(f"To: {to}")
#             print(f"Subject: {subject}")
#             print(html)
#             return
#
#         payload = {
#             "personalizations": [
#                 {
#                     "to": [{"email": to}],
#                     "subject": subject,
#                 }
#             ],
#             "from": {"email": settings.EMAIL_FROM},
#             "content": [
#                 {"type": "text/html", "value": html},
#             ],
#         }
#
#         headers = {
#             "Authorization": f"Bearer {settings.SENDGRID_API_KEY}",
#             "Content-Type": "application/json",
#         }
#
#         async with httpx.AsyncClient(timeout=10) as client:
#             response = await client.post(
#                 SENDGRID_API_URL,
#                 json=payload,
#                 headers=headers,
#             )
#
#         if response.status_code != 202:
#             raise RuntimeError(
#                 f"SendGrid error {response.status_code}: {response.text}"
#             )
