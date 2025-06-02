import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "default-secret-key")
FIREBASE_CONFIG = os.getenv("FIREBASE_CONFIG", "path/to/firebase/config.json")
