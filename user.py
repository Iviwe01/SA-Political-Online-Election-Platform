import bcrypt
import requests
from config.db_config import get_firestore_db  # Import Firestore setup



class User:
    def __init__(self, name=None, email=None, password=None, province=None, idnumber=None, db=None):
        self.name = name
        self.email = email
        self.password = password
        self.province = province
        self.idnumber = idnumber
        self.db = db or get_firestore_db()  # Use passed db or get a new instance

    def __hash_password(self, password):
        """Hashes the user's password."""
        return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    def verify_password(self, stored_password, provided_password):
        """Verifies if the provided password matches the stored password."""
        return bcrypt.checkpw(provided_password.encode(), stored_password.encode())

    def verify_email(self, email):
        """Verifies if the email is valid and not disposable."""
        api_url = f"https://api.mailcheck.ai/email/{email}"
        headers = {
            "Authorization": "Bearer YOUR_MAILCHECK_API_KEY"
        }
        response = requests.get(api_url, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            return not data.get("disposable")
        return False

    def create_user(self):
        # Check if user email already exists
        user_ref = self.db.collection('users').where('email', '==', self.email).get()

        if user_ref:  # If email already exists
            return False

        # Add user to Firestore
        user_data = {
            "name": self.name,
            "email": self.email,
            "password": self.password,  # Ensure password is hashed before this step
            "province": self.province,
            "idnumber": self.idnumber
        }

        self.db.collection('users').document().set(user_data)
        return True

    def get_user_by_email(self, email):
        """Fetches user data by email."""
        user_ref = self.db.collection("users").where("email", "==", email).get()
        if user_ref:
            return user_ref[0].to_dict()  # Return the user data
        return None

    def update_voting_status(self, email):
        """Marks the user as having voted."""
        user_ref = self.db.collection("users").where("email", "==", email).get()
        if user_ref:
            user_ref[0].reference.update({"has_voted": True})
            return True
        return False
