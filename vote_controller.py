from models.vote import Vote
from collections import defaultdict

class VoteController:
    def __init__(self, db):
        self.db = db

    def castVote(self, userID, candidateID):
        vote = Vote(userID, candidateID)
        return vote.cast_vote()

    def get_votes_by_province(self):
        """Aggregates and returns voting data grouped by province."""
        votes = self.db.collection("votes").get()
        province_votes = defaultdict(int)

        for vote in votes:
            vote_data = vote.to_dict()
            user_email = vote_data.get("userID")
            user = self.db.collection("users").where("email", "==", user_email).get()
            if user:
                user_province = user[0].to_dict().get("province")
                province_votes[user_province] += 1
                
        province_votes = dict(province_votes)
        
        return jsonify(province_votes)

        return province_votes
