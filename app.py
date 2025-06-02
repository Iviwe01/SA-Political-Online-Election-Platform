import os
import secrets
import logging
from flask import Flask, jsonify, request, session, render_template, send_from_directory
from flask_cors import CORS
from collections import defaultdict
from models.user import User
from models.vote import Vote
from config.db_config import get_firestore_db
from utils.auth import hash_password, check_password
from utils.email_service import send_verification_email
from utils.id_validator import validate_sa_id
import openai



app = Flask(__name__, template_folder='views', static_folder='views')

# Securely generated secret key
app.secret_key = secrets.token_hex(24)

# Enable CORS
CORS(app)

# Initialize Firestore
db = get_firestore_db()

# Logging setup for debugging
logging.basicConfig(level=logging.DEBUG)


# Routes for Static Files and Home
@app.route('/')
def home():
    return render_template('index.html')


@app.route('/styles.css')
def styles():
    return send_from_directory('views', 'styles.css')
    
@app.route('/styles2.css')
def styles2():
    return send_from_directory('views', 'styles2.css')


@app.route('/manifesto.js')
def manifesto():
    return send_from_directory('views', 'manifesto.js')


@app.route('/images/<filename>')
def images(filename):
    return send_from_directory('views/images', filename)


# User Registration
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        logging.debug(f"Registration data received: {data}")

        # Extract and validate data
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        province = data.get('province')
        idnumber = data.get('idnumber')

        if not name or not email or not password or not province or not idnumber:
            logging.error("Missing required fields for registration.")
            return jsonify({"status": "error", "message": "Missing required fields."}), 400

        hashed_password = hash_password(password)
        user_instance = User(name=name, email=email, password=hashed_password, province=province, idnumber=idnumber, db=db)
        result = user_instance.create_user()

        if result:
            return jsonify({"status": "success", "message": "Registration successful."}), 201
        else:
            logging.warning(f"User registration failed: Email {email} may already be registered.")
            return jsonify({"status": "error", "message": "Registration failed. Email may already be registered."}), 400
    except Exception as e:
        logging.error(f"Unexpected error during registration: {str(e)}")
        return jsonify({"status": "error", "message": f"Registration failed: {str(e)}"}), 500


# User Login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"status": "error", "message": "Missing email or password."}), 400

    user_instance = User()
    user_data = user_instance.get_user_by_email(email)

    if user_data and check_password(password, user_data['password']):
        session['user_id'] = user_data['email']  # Store user session
        return jsonify({"status": "success", "message": "Login successful.", "userID": user_data['email']}), 200
    else:
        return jsonify({"status": "error", "message": "Invalid email or password."}), 401
        


# Fetch Candidates
@app.route('/candidates', methods=['GET'])
def get_candidates():
    try:
        candidates_ref = db.collection("candidates").get()
        candidates = []

        for candidate_doc in candidates_ref:
            candidate_data = candidate_doc.to_dict()
            candidates.append({
                "candidateID": candidate_doc.id,  # Use the document ID as candidateID
                "name": candidate_data['name'],
                "party": candidate_data['party'],
                "manifesto": candidate_data.get('manifesto', ''),  # Default to empty string if not found
                "voteCount": candidate_data.get('voteCount', '0')  # Default voteCount to '0' if not available
            })

        return jsonify({"candidates": candidates}), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error fetching candidates: {str(e)}"
        }), 500



# Cast Vote
@app.route('/votes', methods=['POST'])
def cast_vote():
    data = request.get_json()
    user_id = data.get('userID')
    candidate_id = data.get('candidateID')

    if not user_id or not candidate_id:
        return jsonify({"status": "error", "message": "Missing user ID or candidate ID."}), 400

    vote_instance = Vote(userID=user_id, candidateID=candidate_id)
    result = vote_instance.cast_vote()

    if result['status'] == 'success':
        return jsonify(result), 200
    else:
        return jsonify(result), 400


# Poll Results
@app.route('/poll-results', methods=['GET'])
def get_poll_results():
    try:
        candidates_ref = db.collection("candidates").get()
        candidates = []
        total_votes = 0

        for candidate_doc in candidates_ref:
            candidate_data = candidate_doc.to_dict()
            vote_count = int(candidate_data.get('voteCount', 0))
            total_votes += vote_count
            candidates.append({
                "name": candidate_data['name'],
                "party": candidate_data['party'],
                "voteCount": vote_count
            })

        return jsonify({
            "status": "success",
            "totalVotes": total_votes,
            "candidates": candidates
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": f"Error fetching poll results: {str(e)}"}), 500


# Get Provincial Votes
@app.route('/get-provinces-votes', methods=['GET'])
def get_provinces_votes():
    try:
        votes_ref = db.collection("votes").get()
        province_votes = defaultdict(int)

        for vote in votes_ref:
            vote_data = vote.to_dict()
            user_email = vote_data.get("userID")

            user_ref = db.collection("users").where("email", "==", user_email).get()
            if user_ref:
                user_province = user_ref[0].to_dict().get("province")
                province_votes[user_province] += 1

        return jsonify(province_votes), 200
    except Exception as e:
        return jsonify({"status": "error", "message": f"Error fetching provincial vote data: {str(e)}"}), 500


# Logout
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"status": "success", "message": "Logged out successfully."}), 200


if __name__ == '__main__':
    app.run(debug=True)
