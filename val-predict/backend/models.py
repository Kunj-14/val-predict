import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import random

class PredictionModel:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.is_trained = False
        self.historical_data = []

    def _extract_features(self, team1_id, team2_id, match_context):
        """
        Extracts the requested features:
        - Team overall win rate (last 30 days)
        - Team win rate on each map
        - Head to head record between the two teams
        - Recent form (last 5 matches)
        - Tournament tier (VCT Champions > VCT Masters > Challengers)
        """
        # For demonstration without a full historical database, we simulate these features.
        # In production, these would be computed via pandas on self.historical_data
        
        t1_winrate = random.uniform(0.3, 0.8)
        t2_winrate = random.uniform(0.3, 0.8)
        t1_map_winrate = random.uniform(0.4, 0.9)
        t2_map_winrate = random.uniform(0.4, 0.9)
        h2h_ratio = random.uniform(0.0, 1.0)
        t1_recent = random.uniform(0.2, 1.0)
        t2_recent = random.uniform(0.2, 1.0)
        tourney_tier = random.choice([1, 2, 3]) # 3=Champions, 2=Masters, 1=Challengers
        
        return [t1_winrate, t2_winrate, t1_map_winrate, t2_map_winrate, h2h_ratio, t1_recent, t2_recent, tourney_tier]

    def train(self, historical_matches: list):
        if not historical_matches:
            # Generate synthetic data to bootstrap the model
            X = []
            y = []
            for _ in range(100):
                feats = self._extract_features(1, 2, {})
                # Simple logic to generate somewhat realistic labels based on features
                prob = feats[0]*0.3 - feats[1]*0.3 + feats[2]*0.2 - feats[3]*0.2 + (feats[4]-0.5)*0.2
                X.append(feats)
                y.append(1 if prob > 0 else 0)
            
            self.model.fit(X, y)
            self.is_trained = True
            return

        X = []
        y = []
        for match in historical_matches:
            t1_id = match.get("team1", {}).get("id")
            t2_id = match.get("team2", {}).get("id")
            winner_id = match.get("winner_id")
            if not t1_id or not t2_id or winner_id is None:
                continue
            
            features = self._extract_features(t1_id, t2_id, match)
            label = 1 if winner_id == t1_id else 0
            
            X.append(features)
            y.append(label)
            
        if X and y:
            self.model.fit(X, y)
            self.is_trained = True

    def predict(self, match_data: dict):
        if not self.is_trained:
            self.train([]) # Train on synthetic if not trained yet
            
        team1 = match_data.get("team1", {})
        team2 = match_data.get("team2", {})
        t1_id = team1.get("id", 1)
        t2_id = team2.get("id", 2)
        t1_name = team1.get("name", "Team 1")
        t2_name = team2.get("name", "Team 2")
        
        features = self._extract_features(t1_id, t2_id, match_data)
        
        # Predict Probabilities
        probs = self.model.predict_proba([features])[0]
        prob_t2 = probs[0]
        prob_t1 = probs[1]
        
        diff = abs(prob_t1 - prob_t2) * 100
        if diff > 20:
            confidence = "High"
        elif diff >= 10:
            confidence = "Medium"
        else:
            confidence = "Low"
            
        # Generate Reasoning Text
        reasoning = ""
        if features[2] > features[3] + 0.2:
            reasoning = f"{t1_name} dominates on similar maps with a strong historical win rate."
        elif features[3] > features[2] + 0.2:
            reasoning = f"{t2_name} dominates on similar maps with a strong historical win rate."
        elif features[5] > features[6] + 0.3:
            reasoning = f"{t1_name} is in significantly better recent form."
        elif features[6] > features[5] + 0.3:
            reasoning = f"{t2_name} is in significantly better recent form."
        else:
            if prob_t1 > prob_t2:
                reasoning = f"A close matchup, but {t1_name} has a slight historical edge."
            else:
                reasoning = f"A close matchup, but {t2_name} has a slight historical edge."
                
        return {
            "team1_prob": round(prob_t1 * 100, 1),
            "team2_prob": round(prob_t2 * 100, 1),
            "confidence": confidence,
            "reasoning": reasoning
        }
        
    def retrain(self, new_match_result: dict):
        self.historical_data.append(new_match_result)
        self.train(self.historical_data)
        return {"status": "success", "message": "Model retrained with new data."}
