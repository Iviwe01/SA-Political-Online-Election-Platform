
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase app with credentials
cred = credentials.Certificate('config/firebase_key.json')
firebase_admin.initialize_app(cred)

# Get Firestore DB
def get_firestore_db():
    return firestore.client()
	
# MailCheck.ai API Key
MAILCHECK_API_KEY = "xxxxxxxxxxx"  # Replace with your actual MailCheck.ai API key
