import datetime
from sqlalchemy import Column, Integer, String, Float, Text, Date, DateTime, JSON
from database import Base

class DailyInput(Base):
    __tablename__ = "daily_inputs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    date = Column(Date, unique=True, index=True, default=datetime.date.today, nullable=False)
    applications_sent = Column(Integer, default=0, nullable=False)
    deep_coding_solved = Column(Integer, default=0, nullable=False)
    deep_dev_blocks = Column(Integer, default=0, nullable=False)
    updated_at = Column(
        DateTime, 
        default=datetime.datetime.utcnow, 
        onupdate=datetime.datetime.utcnow, 
        nullable=False
    )

    def to_dict(self):
        return {
            "id": self.id,
            "date": str(self.date),
            "applications_sent": self.applications_sent,
            "deep_coding_solved": self.deep_coding_solved,
            "deep_dev_blocks": self.deep_dev_blocks,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

class DrillLog(Base):
    __tablename__ = "drill_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category = Column(String(64), index=True, nullable=False) # 'DSA', 'PREP_INTERVIEW', 'MBA_QUANT'
    topic = Column(String(255), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "category": self.category,
            "topic": self.topic,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class SystemLog(Base):
    __tablename__ = "system_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    action = Column(String(64), index=True, nullable=False) # e.g. 'CLEAN_DEV_MODE', 'TOGGLE_AGY'
    freed_ram_mb = Column(Float, default=0.0, nullable=False)
    terminated_pids = Column(JSON, default=list, nullable=False) # JSON array of terminated PIDs
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "action": self.action,
            "freed_ram_mb": self.freed_ram_mb,
            "terminated_pids": self.terminated_pids,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None
        }
