import json
import os
from pathlib import Path
from fastapi import APIRouter
from schemas import SetupConfigModel, SetupStatusResponse

router = APIRouter(prefix="/setup", tags=["Global Configuration & Setup"])

CONFIG_PATH = Path(os.getenv("COMMAND_CENTER_CONFIG_PATH", "command_center.config.json"))

def _load_config() -> SetupConfigModel:
    if not CONFIG_PATH.exists():
        return SetupConfigModel() # Default, uninitialized
    try:
        with open(CONFIG_PATH, "r") as f:
            data = json.load(f)
            return SetupConfigModel(**data)
    except Exception:
        return SetupConfigModel()

def _save_config(config: SetupConfigModel):
    with open(CONFIG_PATH, "w") as f:
        json.dump(config.dict(), f, indent=4)

@router.get("/status", response_model=SetupStatusResponse)
async def get_setup_status():
    """
    Checks if the command center has been configured for the first time.
    """
    config = _load_config()
    
    # Security: Mask the API key if it exists before sending it to the frontend
    safe_config = config.copy()
    if safe_config.llm_api_key:
        safe_config.llm_api_key = "********"

    return SetupStatusResponse(
        is_setup=safe_config.setup_completed,
        config=safe_config
    )

@router.post("/save", response_model=SetupConfigModel)
async def save_setup_config(payload: SetupConfigModel):
    """
    Saves the global configuration from the onboarding wizard.
    Marks setup_completed = True.
    """
    # Security: Do not overwrite the actual API key if the frontend sends the masked version
    if payload.llm_api_key == "********":
        existing_config = _load_config()
        payload.llm_api_key = existing_config.llm_api_key

    payload.setup_completed = True
    _save_config(payload)
    
    # Return masked version to frontend to be safe
    safe_payload = payload.copy()
    if safe_payload.llm_api_key:
        safe_payload.llm_api_key = "********"
    return safe_payload

@router.post("/layout")
async def save_dashboard_layout(payload: dict):
    """
    Patches the dashboard layout grid coordinates.
    """
    config = _load_config()
    config.dashboard_layout = payload
    _save_config(config)
    return {"status": "success"}

@router.post("/reset")
async def reset_setup():
    """
    Development endpoint to delete the config file and trigger the wizard again.
    """
    if CONFIG_PATH.exists():
        os.remove(CONFIG_PATH)
    return {"status": "success", "message": "Configuration reset. Wizard will appear on next load."}
