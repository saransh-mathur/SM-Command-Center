from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime, date

class WorkspaceCreate(BaseModel):
    name: str
    slug: str
    persona_type: Optional[str] = 'custom'
    config: Optional[Dict[str, Any]] = Field(default_factory=dict)
    is_active: Optional[bool] = True

class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    persona_type: Optional[str] = None
    config: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class WorkspaceResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    persona_type: str
    config: Dict[str, Any]
    is_active: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class EntityCreate(BaseModel):
    workspace_id: UUID
    entity_type: str
    title: str
    data: Optional[Dict[str, Any]] = Field(default_factory=dict)
    tags: Optional[List[str]] = Field(default_factory=list)
    source: Optional[str] = 'manual'
    status: Optional[str] = 'active'

class EntityUpdate(BaseModel):
    title: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None
    source: Optional[str] = None
    status: Optional[str] = None

class EntityResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    entity_type: str
    title: str
    data: Dict[str, Any]
    tags: List[str]
    source: str
    status: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class EntityListResponse(BaseModel):
    items: List[EntityResponse]
    total: int
    page: int = 0
    size: int = 50

class MetricDefinitionCreate(BaseModel):
    workspace_id: UUID
    key: str
    label: str
    metric_type: Optional[str] = 'counter'
    default_target: Optional[int] = 1
    icon: Optional[str] = None
    color: Optional[str] = None
    sort_order: Optional[int] = 0
    is_active: Optional[bool] = True

class MetricDefinitionUpdate(BaseModel):
    label: Optional[str] = None
    metric_type: Optional[str] = None
    default_target: Optional[int] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None

class MetricDefinitionResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    key: str
    label: str
    metric_type: str
    default_target: int
    icon: Optional[str] = None
    color: Optional[str] = None
    sort_order: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class DailyTrackerUpdate(BaseModel):
    workspace_id: UUID
    metrics: Optional[Dict[str, Any]] = None
    targets: Optional[Dict[str, Any]] = None

class DailyTrackerResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    date: date
    metrics: Dict[str, Any]
    targets: Dict[str, Any]
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class IngestionLogResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    source_type: str
    source_name: Optional[str] = None
    records_processed: int
    records_failed: int
    status: str
    error_detail: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
