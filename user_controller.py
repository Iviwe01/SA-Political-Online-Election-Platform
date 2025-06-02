# controllers/user_controller.py
from flask import Blueprint, request, jsonify, session
from models.user import User
from controllers.vote_controller import VoteController
from config.db_config import get_firestore_db

user_controller = Blueprint('user_controller', __name__)

# User Registration route
@user_controller.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    province = data.get('province')
    idnumber = data.get('idnumber')

    if not name or not email or not password or not province or not idnumber:
        return jsonify({"status": "error", "message": "Missing required fields."}), 400

    user_instance = User(name=name, email=email, password=password, province=province, idnumber=idnumber)
    result = user_instance.create_user()

    if result:
        return jsonify({"status": "success", "message": "Registration successful."}), 201
    else:
        return jsonify({"status": "error", "message": "Registration failed. Email may already be registered or invalid."}), 400

# User Login route
@user_controller.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"status": "error", "message": "Missing email or password."}), 400

    user_instance = User()
    user_data = user_instance.get_user_by_email(email)

    if user_data and user_instance.verify_password(user_data['password'], password):
        session['user_id'] = user_data['email']  # Storing user session
        return jsonify({"status": "success", "message": "Login successful.", "userID": user_data['email']}), 200
    else:
        return jsonify({"status": "error", "message": "Invalid email or password."}), 401

# Provincial results route
@user_controller.route('/provincial-results', methods=['GET'])
def provincial_results():
    vote_controller = VoteController(get_firestore_db())
    data = vote_controller.get_votes_by_province()
    return jsonify({"status": "success", "provincialResults": data}), 200