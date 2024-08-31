import vonage

# Replace these with your own API key and secret
api_key = '91434e1a'
api_secret = 'aydzDsBZ0m7adPqR'

client = vonage.Client(key=api_key, secret=api_secret)
sms = vonage.Sms(client)

def sendOtp(phone,otp):
    responseData = sms.send_message(
        {
            "from": "Musify App",  #
            "to": "91"+phone, 
            "text": "Musify Signup Code : "+otp,
        }
    )

    if responseData["messages"][0]["status"] == "0":
        print("Message sent successfully.")
    else:
        print(f"Message failed with error: {responseData['messages'][0]['error-text']}")
