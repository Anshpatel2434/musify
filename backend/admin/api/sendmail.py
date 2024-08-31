import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def sendMail(email,code):
    sender_email = "mann.soni909@gmail.com"
    app_password = "bvly laeh meoo aock" 

    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = email
    message['Subject'] = 'Musify Code Verification'

    body ='<h2>Your Musify Signup Verification Code is : <h1><center>'+str(code)+'</center></h1></h2>'
    message.attach(MIMEText(body, 'html'))

    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login(sender_email, app_password)
        server.sendmail(sender_email,email, message.as_string())

    print("Email sent successfully!")
