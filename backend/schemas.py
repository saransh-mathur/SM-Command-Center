from pydantic import BaseModel, Field
from typing import Optional, List, Any
import datetime

# ==========================================
# Telemetry Schemas
# ==========================================
class TelemetryResponse(BaseModel):
    cpu_temp: float = Field(..., description="CPU Package / Core Temperature in Celsius")
    cpu_usage_pct: float = Field(..., description="CPU Load percentage")
    gpu_temp: float = Field(default=44.0, description="Dedicated GPU Temperature in Celsius")
    ram_usage_pct: float = Field(..., description="RAM utilization percentage")
    ram_used_gb: float = Field(..., description="RAM used in Gigabytes")
    ram_total_gb: float = Field(..., description="Total system RAM in Gigabytes")
    swap_usage_pct: float = Field(..., description="Swap memory utilization percentage")
    swap_used_gb: float = Field(..., description="Swap memory used in Gigabytes")
    swap_total_gb: float = Field(default=8.0, description="Total Swap memory in Gigabytes")
    fan_rpm: int = Field(default=2450, description="Fan RPM from NBFC/hwmon")
    fan_mode: str = Field(default="Auto", description="NBFC Fan Profile (Auto/Performance/Quiet)")
    battery_pct: int = Field(default=96, description="Battery percentage")
    is_charging: bool = Field(default=True, description="Charging status")
    power_draw_watts: float = Field(default=34.0, description="Estimated power draw in Watts")
    system_time: str = Field(..., description="Formatted system local time")

# ==========================================
# Daily Inputs State Schemas
# ==========================================
class DailyInputsBase(BaseModel):
    applications_sent: int = Field(default=0, ge=0)
    deep_coding_solved: int = Field(default=0, ge=0)
    deep_dev_blocks: int = Field(default=0, ge=0)

class DailyInputsUpdate(BaseModel):
    applications_sent: Optional[int] = Field(None, ge=0)
    deep_coding_solved: Optional[int] = Field(None, ge=0)
    deep_dev_blocks: Optional[int] = Field(None, ge=0)

class DailyInputsResponse(BaseModel):
    id: int
    date: str
    applications_sent: int
    deep_coding_solved: int
    deep_dev_blocks: int
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True

# ==========================================
# Drill Logs Schemas
# ==========================================
class DrillLogCreate(BaseModel):
    category: str = Field(..., description="DSA, PREP_INTERVIEW, or MBA_QUANT")
    topic: str = Field(..., description="Topic or problem name")
    notes: Optional[str] = None

class DrillLogResponse(BaseModel):
    id: int
    category: str
    topic: str
    notes: Optional[str]
    created_at: str

    class Config:
        from_attributes = True

# ==========================================
# System & Service Management Schemas
# ==========================================
class CleanDevResponse(BaseModel):
    status: str
    freed_ram_mb: float
    terminated_pids: List[int]
    message: str
    timestamp: str

class ServiceStatusResponse(BaseModel):
    service: str
    status: str
    port: Optional[int] = None
    cron_active: bool = False
    message: str

class FanModeRequest(BaseModel):
    mode: str = Field(..., description="Auto, Performance, or Quiet")

# ==========================================
# Docker Container Schemas
# ==========================================
class ContainerInfo(BaseModel):
    id: str
    name: str
    image: str
    status: str # running, stopped, idle
    port: Optional[str] = None
    memory_usage: Optional[str] = None

class ContainerListResponse(BaseModel):
    total: int
    running: int
    containers: List[ContainerInfo]
