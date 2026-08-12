from fastapi import APIRouter
from schemas import TelemetryResponse, FanModeRequest
from services.hardware import get_hardware_telemetry, set_hardware_fan_mode

router = APIRouter(prefix="/telemetry", tags=["Telemetry"])

@router.get("", response_model=TelemetryResponse)
async def get_telemetry():
    """
    Returns real-time hardware telemetry: CPU/GPU thermals, 
    RAM/Swap load, NBFC fan speeds, battery, and system timestamp.
    """
    data = get_hardware_telemetry()
    return TelemetryResponse(**data)

@router.get("/thermals")
async def get_thermals():
    """Returns focused CPU and GPU thermal metrics."""
    data = get_hardware_telemetry()
    return {
        "cpu_temp": data.get("cpu_temp", 48.0),
        "gpu_temp": data.get("gpu_temp", 42.0),
        "system_time": data.get("system_time")
    }

@router.post("/fan-mode")
async def update_fan_mode(payload: FanModeRequest):
    """
    Sets NBFC fan profile (Auto, Performance, Quiet) via nbfc-linux.
    """
    mode = set_hardware_fan_mode(payload.mode)
    return {"status": "success", "mode": mode, "fan_mode": mode, "message": f"Fan mode updated to {mode}."}
