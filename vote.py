from config.db_config import get_firestore_db
from datetime import datetime
from firebase_admin import firestore  # Import Firestore to use Increment

class Vote:
    def __init__(self, userID, candidateID):
        self.userID = userID
        self.candidateID = candidateID
        self.timestamp = datetime.utcnow()
        self.db = get_firestore_db()

    def cast_vote(self):
        try:
            # Check if user has already voted
            existing_vote = self.db.collection("votes").where("userID", "==", self.userID).limit(1).get()
            if existing_vote:
                # User already voted
                # Log the user out by setting has_voted status and clearing session
                self._logout_user()
                return {"status": "error", "message": "You have already voted. You are now logged out."}
            
            # Check if candidate exists
            candidate_ref = self.db.collection("candidates").document(self.candidateID)
            candidate = candidate_ref.get()
            if not candidate.exists:
                return {"status": "error", "message": "Candidate not found."}
            
            # Cast the vote
            vote_data = {
                "userID": self.userID,
                "candidateID": self.candidateID,
                "timestamp": self.timestamp
            }
            self.db.collection("votes").add(vote_data)
            
            # Update candidate's vote count
            candidate_ref.update({"voteCount": firestore.Increment(1)})

            # Update user's voting status and log out
            user_ref = self.db.collection("users").where("email", "==", self.userID).get()
            if user_ref:
                user_ref[0].reference.update({"has_voted": True})
            
            # Log the user out
            self._logout_user()

            return {"status": "success", "message": "Vote cast successfully. You are now logged out."}
        
        except Exception as e:
            return {"status": "error", "message": f"Failed to cast vote: {str(e)}"}

    def _logout_user(self):
        """Helper function to log the user out."""
        # Since this is the backend, you can manage this by removing any session or setting a user flag.
        # In a web application, the session can be cleared using Flask's session.clear()
        # But this is done at the frontend in your Flask app via API response handling.
        pass
