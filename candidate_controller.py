# controllers/candidate_controller.py

from models.candidate import Candidate

class CandidateController:
    def __init__(self, db):
        self.db = db

    def createCandidate(self, candidateID, name, party, manifesto):
        candidate = Candidate(candidateID=candidateID, name=name, party=party, manifesto=manifesto)
        candidate.create_candidate()

    def getCandidate(self, candidateID):
        candidate = Candidate(candidateID=candidateID, name=None, party=None, manifesto=None)
        return candidate.get_candidate()

    def updateVoteCount(self, candidateID):
        candidate = Candidate(candidateID=candidateID, name=None, party=None, manifesto=None)
        candidate.update_vote_count()

    def deleteCandidate(self, candidateID):
        candidate = Candidate(candidateID=candidateID, name=None, party=None, manifesto=None)
        candidate.delete_candidate()
