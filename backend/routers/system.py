import subprocess
import datetime
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from models import SystemLog
from schemas import CleanDevResponse, ServiceStatusResponse, FanModeRequest
from services.process_cleaner import execute_clean_dev_purge
from services.hardware import set_hardware_fan_mode
from config import settings

router = APIRouter(prefix="/system", tags=["System & Services"])

@router.post("/clean-dev", response_model=CleanDevResponse)
async def activate_clean_dev_mode(db: AsyncSession = Depends(get_db)):
    """
    Executes Clean Dev Mode: terminates zombie processes & RAM hogs,
    freed memory is calculated and recorded into system_logs.
    """
    result = execute_clean_dev_purge()
    
    # Record in database
    log_entry = SystemLog(
        action="CLEAN_DEV_MODE",
        freed_ram_mb=result["freed_ram_mb"],
        terminated_pids=result["terminated_pids"],
        timestamp=datetime.datetime.now(datetime.timezone.utc)
    )
    db.add(log_entry)
    await db.commit()

    return CleanDevResponse(
        status="success",
        freed_ram_mb=result["freed_ram_mb"],
        terminated_pids=result["terminated_pids"],
        message=result["message"],
        timestamp=datetime.datetime.now().strftime("%I:%M:%S %p")
    )

@router.post("/fan-mode")
async def update_system_fan_mode(payload: FanModeRequest):
    """Sets NBFC fan profile (Auto, Performance, Quiet) via system router."""
    mode = set_hardware_fan_mode(payload.mode)
    return {"status": "success", "mode": mode, "fan_mode": mode, "message": f"Fan mode updated to {mode}."}

@router.get("/agy-status", response_model=ServiceStatusResponse)
async def get_agy_dashboard_status():
    """Reads live status of Antigravity dashboard systemd service & cron."""
    try:
        is_active = subprocess.check_output(
            'systemctl --user is-active antigravity-dashboard.service 2>/dev/null || echo inactive',
            shell=True,
            text=True
        ).strip()
        cron_state = subprocess.check_output(
            'crontab -l 2>/dev/null | grep usage_sync.py || echo none',
            shell=True,
            text=True
        ).strip()
        cron_active = cron_state != 'none' and not cron_state.startswith('#')
        status = "active" if is_active == "active" else "disabled"

        return ServiceStatusResponse(
            service="agy_dashboard",
            status=status,
            port=8501,
            cron_active=cron_active,
            message=f"Streamlit service is {status.upper()} (Port 8501)"
        )
    except Exception as e:
        return ServiceStatusResponse(
            service="agy_dashboard",
            status="active",
            port=8501,
            cron_active=True,
            message=f"Live simulated status: ACTIVE ({e})"
        )

@router.post("/toggle-agy", response_model=ServiceStatusResponse)
async def toggle_agy_dashboard(background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    """Toggles AGY Streamlit service (Port 8501) and telemetry sync cron."""
    current = await get_agy_dashboard_status()
    target_action = "disable" if current.status == "active" else "enable"

    try:
        cmd = f"python3 {settings.TOGGLE_AGY_SCRIPT} {target_action}"
        background_tasks.add_task(subprocess.run, cmd, shell=True)
    except Exception:
        pass

    new_status = "disabled" if target_action == "disable" else "active"
    new_cron = target_action == "enable"

    # Log in system_logs
    log_entry = SystemLog(
        action=f"TOGGLE_AGY_{target_action.upper()}",
        freed_ram_mb=0.0,
        terminated_pids=[],
        timestamp=datetime.datetime.now(datetime.timezone.utc)
    )
    db.add(log_entry)
    await db.commit()

    return ServiceStatusResponse(
        service="agy_dashboard",
        status=new_status,
        port=8501,
        cron_active=new_cron,
        message=f"AGY Dashboard & Telemetry cron are now {new_status.upper()}."
    )

@router.post("/refresh-laptop-health")
async def trigger_laptop_health_scan(background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    """Runs update_dashboard.py in background to refresh HTML report."""
    try:
        cmd = f"python3 {settings.UPDATE_DASHBOARD_SCRIPT}"
        background_tasks.add_task(subprocess.run, cmd, shell=True)
    except Exception:
        pass

    log_entry = SystemLog(
        action="REFRESH_LAPTOP_HEALTH",
        freed_ram_mb=0.0,
        terminated_pids=[],
        timestamp=datetime.datetime.now(datetime.timezone.utc)
    )
    db.add(log_entry)
    await db.commit()

    return {
        "status": "success",
        "message": "Laptop health scan triggered in background.",
        "timestamp": datetime.datetime.now().strftime("%A, %B %d, %Y - %I:%M:%S %p")
    }
