from apscheduler.schedulers.background import BackgroundScheduler
from pandascore import PandaScoreAPI
import logging

logger = logging.getLogger(__name__)

# Note: In a full production app, the database and model instances would be injected
# We'll import a global model reference from main when needed or pass it.

def fetch_and_update_results(model_instance):
    """
    Scheduled job to fetch new match results from PandaScore,
    save them to the database, and trigger a model retrain.
    """
    logger.info("Running scheduled job: fetch_and_update_results")
    api = PandaScoreAPI()
    past_matches = api.get_past_matches(limit=10)
    
    if isinstance(past_matches, list):
        for match in past_matches:
            # Here we would typically write the result to the DB
            # e.g., db.save_match(match)
            
            # Then retrain the model
            model_instance.retrain(match)
            
        logger.info(f"Successfully processed {len(past_matches)} recent matches and updated model.")
    else:
        logger.error("Failed to fetch past matches during scheduled update.")

def start_scheduler(model_instance):
    scheduler = BackgroundScheduler()
    # Run the update job every hour
    scheduler.add_job(fetch_and_update_results, 'interval', hours=1, args=[model_instance])
    scheduler.start()
    logger.info("Background scheduler started.")
    return scheduler
