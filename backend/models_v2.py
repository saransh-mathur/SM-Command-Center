import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Integer, Date, Text, ForeignKey, JSON, Index, UniqueConstraint, Uuid, func
from sqlalchemy.dialects.postgresql import JSONB
from pgvector.sqlalchemy import Vector
from database import Base

class Workspace(Base):
    """
    Workspace model representing a user workspace.
    Stores workspace-specific settings and configuration.
    """
    __tablename__ = 'workspaces'

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    slug = Column(String(128), unique=True, index=True, nullable=False)
    persona_type = Column(String(64), default='custom', index=True)
    config = Column(JSON().with_variant(JSONB, 'postgresql'), default=dict, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert model instance to a dictionary."""
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Entity(Base):
    """
    Entity model representing dynamic data objects within a workspace.
    Handles dynamic data by storing variable fields in a JSON column.
    """
    __tablename__ = 'entities'

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    workspace_id = Column(Uuid, ForeignKey('workspaces.id'), index=True, nullable=False)
    entity_type = Column(String(64), index=True, nullable=False)
    title = Column(String(512), nullable=False)
    data = Column(JSON().with_variant(JSONB, 'postgresql'), default=dict, nullable=False)
    tags = Column(JSON().with_variant(JSONB, 'postgresql'), default=list)
    source = Column(String(64), default='manual')
    status = Column(String(32), default='active', index=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    from sqlalchemy.orm import deferred
    # pgvector embedding column (deferred to avoid SQLite errors)
    embedding = deferred(Column(Vector(1536)))

    __table_args__ = (
        Index('ix_entities_workspace_type', 'workspace_id', 'entity_type'),
        Index('ix_entities_workspace_status', 'workspace_id', 'status'),
    )

    def to_dict(self):
        """Convert model instance to a dictionary."""
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class MetricDefinition(Base):
    """
    MetricDefinition model defining custom metrics tracked in a workspace.
    """
    __tablename__ = 'metric_definitions'

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    workspace_id = Column(Uuid, ForeignKey('workspaces.id'), index=True, nullable=False)
    key = Column(String(128), nullable=False)
    label = Column(String(255), nullable=False)
    metric_type = Column(String(32), default='counter')
    default_target = Column(Integer, default=1)
    icon = Column(String(64), nullable=True)
    color = Column(String(32), nullable=True)
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

    __table_args__ = (
        UniqueConstraint('workspace_id', 'key', name='uq_metric_workspace_key'),
    )

    def to_dict(self):
        """Convert model instance to a dictionary."""
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class DailyTracker(Base):
    """
    DailyTracker model tracking metric values and targets per day.
    """
    __tablename__ = 'daily_trackers'

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    workspace_id = Column(Uuid, ForeignKey('workspaces.id'), nullable=False)
    date = Column(Date, nullable=False)
    metrics = Column(JSON().with_variant(JSONB, 'postgresql'), default=dict, nullable=False)
    targets = Column(JSON().with_variant(JSONB, 'postgresql'), default=dict, nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint('workspace_id', 'date', name='uq_tracker_workspace_date'),
    )

    def to_dict(self):
        """Convert model instance to a dictionary."""
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class IngestionLog(Base):
    """
    IngestionLog model tracking data import operations.
    """
    __tablename__ = 'ingestion_logs'

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    workspace_id = Column(Uuid, ForeignKey('workspaces.id'), index=True, nullable=False)
    source_type = Column(String(64), nullable=False)
    source_name = Column(String(512), nullable=True)
    records_processed = Column(Integer, default=0)
    records_failed = Column(Integer, default=0)
    status = Column(String(32), default='pending')
    error_detail = Column(Text, nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    def to_dict(self):
        """Convert model instance to a dictionary."""
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
