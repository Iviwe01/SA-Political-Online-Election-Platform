from google.cloud import firestore
class VotingService:
    def __init__(self, firestore_service):
        self.firestore_service = firestore_service

    def cast_vote(self, user_email, candidate_id):
    try:
        def transaction_function(transaction):
            user_ref = self.firestore_service.db.collection('users').document(user_email)
            candidate_ref = self.firestore_service.db.collection('candidates').document(candidate_id)

            user = transaction.get(user_ref).to_dict()
            if user.get('has_voted', False):
                raise ValueError("User has already voted.")

            # Update candidate vote count
            transaction.update(candidate_ref, {"votes": firestore.Increment(1)})

            # Mark user as voted
            transaction.update(user_ref, {"has_voted": True})

        self.firestore_service.db.run_transaction(transaction_function)
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
