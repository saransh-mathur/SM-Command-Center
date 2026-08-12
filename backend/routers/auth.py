import hashlib
import secrets
import string
import uuid
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from routers.setup_config import _load_config, _save_config

router = APIRouter(prefix="/auth", tags=["Authentication"])

# In-memory session store (resets on server reboot, which is fine for local desktop app)
ACTIVE_SESSIONS = set()

class LoginRequest(BaseModel):
    password: str

class LoginResponse(BaseModel):
    token: str
    message: str

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def ensure_admin_account_exists():
    """Checks if an admin password exists. If not, generates one, saves it, and prints it."""
    config = _load_config()
    if not config.admin_password_hash:
        # Generate random password
        alphabet = string.ascii_lowercase + string.digits
        random_suffix = ''.join(secrets.choice(alphabet) for i in range(4))
        raw_password = f"sm-admin-{random_suffix}"
        
        # Save hash
        config.admin_password_hash = hash_password(raw_password)
        _save_config(config)

        # Print banner
        print("\n" + "="*70)
        print(" 🔒 NEW SETUP DETECTED: Admin Account Auto-Generated")
        print("="*70)
        print(f" Your Admin Password is: {raw_password}")
        print(" Please save this password. You will need it to log in to the UI.")
        print("="*70 + "\n")

@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest):
    config = _load_config()
    
    if not config.admin_password_hash:
        raise HTTPException(status_code=500, detail="Admin account not initialized.")

    if hash_password(payload.password) != config.admin_password_hash:
        raise HTTPException(status_code=401, detail="Invalid password.")

    # Generate token
    token = str(uuid.uuid4())
    ACTIVE_SESSIONS.add(token)
    
    return LoginResponse(token=token, message="Login successful.")

@router.get("/verify")
async def verify_session(token: str):
    if token in ACTIVE_SESSIONS:
        return {"valid": True}
    return {"valid": False}
