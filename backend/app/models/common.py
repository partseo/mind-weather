"""
항구, 문의, 찜하기 모델
"""
import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Integer, Float, Boolean, DateTime, Text, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
import enum


class Port(Base):
    """해상 운임 계산용 항구 정보"""
    __tablename__ = "ports"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    country_code: Mapped[str] = mapped_column(String(5), nullable=False, index=True)
    country_name: Mapped[str] = mapped_column(String(100), nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    port_name: Mapped[str] = mapped_column(String(200), nullable=False)
    port_code: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    region: Mapped[str] = mapped_column(String(50), nullable=False)  # middle_east / central_asia / africa ...
    lat: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    lng: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    # 한국 부산항 기준 예상 운임 (USD) 및 소요일수
    shipping_cost_usd: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    transit_days: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class ContactMethod(str, enum.Enum):
    whatsapp = "whatsapp"
    telegram = "telegram"
    email = "email"


class InquiryStatus(str, enum.Enum):
    pending = "pending"
    replied = "replied"
    closed = "closed"


class Inquiry(Base):
    """바이어 문의"""
    __tablename__ = "inquiries"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    vehicle_id: Mapped[str] = mapped_column(ForeignKey("vehicles.id"), nullable=False)
    buyer_id: Mapped[Optional[str]] = mapped_column(
        ForeignKey("users.id"), nullable=True  # 비회원도 가능
    )
    # 비회원 정보
    guest_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    guest_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    guest_whatsapp: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    guest_country: Mapped[Optional[str]] = mapped_column(String(5), nullable=True)

    message: Mapped[str] = mapped_column(Text, nullable=False)
    contact_method: Mapped[ContactMethod] = mapped_column(
        SAEnum(ContactMethod), default=ContactMethod.whatsapp
    )
    preferred_language: Mapped[str] = mapped_column(String(5), default="en")
    status: Mapped[InquiryStatus] = mapped_column(
        SAEnum(InquiryStatus), default=InquiryStatus.pending, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    vehicle: Mapped["Vehicle"] = relationship("Vehicle", back_populates="inquiries")
    buyer: Mapped[Optional["User"]] = relationship("User", back_populates="inquiries")


class Wishlist(Base):
    """찜하기"""
    __tablename__ = "wishlists"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    vehicle_id: Mapped[str] = mapped_column(ForeignKey("vehicles.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user: Mapped["User"] = relationship("User", back_populates="wishlists")
    vehicle: Mapped["Vehicle"] = relationship("Vehicle", back_populates="wishlists")
