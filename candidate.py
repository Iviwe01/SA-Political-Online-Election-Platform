# models/candidate.py

from config.db_config import get_firestore_db

class Candidate:
    def __init__(self, candidateID, name, party, manifesto, voteCount="0"):
        self.candidateID = candidateID
        self.name = name
        self.party = party
        self.manifesto = manifesto
        self.voteCount = voteCount
        self.db = get_firestore_db()

    def create_candidate(self):
        candidate_data = {
            "candidateID": self.candidateID,
            "name": self.name,
            "party": self.party,
            "manifesto": self.manifesto,
            "voteCount": self.voteCount,
        }
        self.db.collection("candidates").document(self.candidateID).set(candidate_data)

    def get_candidate(self):
        candidate_ref = self.db.collection("candidates").document(self.candidateID).get()
        return candidate_ref.to_dict() if candidate_ref.exists else None

    def update_vote_count(self):
        candidate_ref = self.db.collection("candidates").document(self.candidateID)
        candidate = candidate_ref.get()
        if candidate.exists:
            vote_count = int(candidate.to_dict().get("voteCount", "0")) + 1
            candidate_ref.update({"voteCount": str(vote_count)})

    def delete_candidate(self):
        self.db.collection("candidates").document(self.candidateID).delete()
