from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSON  # PostgreSQL-safe
from .session import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    path = Column(String, nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

class ChatLog(Base):
    __tablename__ = "chatlogs"

    id = Column(Integer, primary_key=True, index=True)
    user_input = Column(Text, nullable=False)
    ai_response = Column(Text, nullable=False)
    extra_data = Column(JSON)  # ✅ Renamed from 'metadata'
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
