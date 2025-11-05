import os
import requests
from dotenv import load_dotenv

load_dotenv()

FUSEKI_URL = os.getenv("FUSEKI_SPARQL_URL")
FUSEKI_UPDATE_URL = os.getenv("FUSEKI_UPDATE_URL")
HEADERS = {"Accept": "application/sparql-results+json"}

def run_select(query: str, params=None):
    res = requests.post(FUSEKI_URL, data={"query": query}, headers=HEADERS, params=params, timeout=10)
    res.raise_for_status()
    return res.json()

def run_update(update_query: str):
    res = requests.post(FUSEKI_UPDATE_URL, data={"update": update_query})
    res.raise_for_status()
    return res.status_code
