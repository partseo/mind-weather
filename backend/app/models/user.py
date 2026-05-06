"""
사용자 모델 — buyer / seller / admin 역할 분리
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Boolean, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
import enum


class UserRole(str, enum.Enum):
    buyer = "buyer"
    seller = "seller"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(100), nullable=True)
    role: Mapped[UserRole] = mapped_column(
        SAEnum(UserRole), default=UserRole.buyer, nullable=False
    )
    country: Mapped[str] = mapped_column(String(5), nullable=True)        # ISO 2자리 국가코드
    phone_whatsapp: Mapped[str] = mapped_column(String(30), nullable=True)
    preferred_language: Mapped[str] = mapped_column(String(5), default="en")  # en/ar/ru/es/fr
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # 관계
    vehicles: Mapped[list["Vehicle"]] = relationship("Vehicle", back_populates="seller")
    wishlists: Mapped[list["Wishlist"]] = relationship("Wishlist", back_populates="user")
    inquiries: Mapped[list["Inquiry"]] = relationship("Inquiry", back_populates="buyer")
