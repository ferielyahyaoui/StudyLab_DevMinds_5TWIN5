import hashlib

def hash_password(password: str) -> str:
    """
    Hash simple SHA-256. Retourne l'hex digest.
    (Pour dev / apprentissage. En production, utilisez bcrypt.)
    """
    if password is None:
        password = ""
    # option: tronquer si très long (ici on accepte tout)
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if plain_password is None:
        plain_password = ""
    return hash_password(plain_password) == (hashed_password or "")
