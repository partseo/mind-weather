"""
차량 모델 — 글로벌 수출 특화 필드 포함
지역 태그: 실제 수출 데이터 기반 (libya/uae/kyrgyzstan/kazakhstan/jordan)
"""
import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Integer, Float, Boolean, DateTime, Text, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
import enum


class FuelType(str, enum.Enum):
    diesel = "diesel"
    petrol = "petrol"
    hybrid = "hybrid"
    electric = "electric"
    lpg = "lpg"


class TransmissionType(str, enum.Enum):
    automatic = "automatic"
    manual = "manual"


class DriveType(str, enum.Enum):
    fwd = "2WD"
    awd = "4WD"
    rwd = "RWD"


class VehicleCondition(str, enum.Enum):
    excellent = "excellent"
    good = "good"
    fair = "fair"


class VehicleStatus(str, enum.Enum):
    pending = "pending"      # 승인 대기
    available = "available"  # 판매 중
    sold = "sold"            # 판매 완료
    rejected = "rejected"    # 반려


class RegionTag(str, enum.Enum):
    """실제 수출 TOP 5 국가 기반 지역 태그"""
    libya = "libya"               # 🥇 대수 기준 1위
    kyrgyzstan = "kyrgyzstan"     # 🥈 금액 기준 1위
    uae = "uae"                   # 🥉 중동 핵심
    kazakhstan = "kazakhstan"      # 4위
    jordan = "jordan"             # 5위
    southeast_asia = "southeast_asia"
    south_america = "south_america"
    africa = "africa"
    all_regions = "all"


class Vehicle(Base):
    __tablename__ = "vehicles"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    seller_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)

    # 기본 정보
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    make: Mapped[str] = mapped_column(String(50), nullable=False, index=True)     # 제조사
    model: Mapped[str] = mapped_column(String(100), nullable=False, index=True)   # 모델명
    year: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    mileage_km: Mapped[int] = mapped_column(Integer, nullable=False)

    # 사양
    fuel_type: Mapped[FuelType] = mapped_column(SAEnum(FuelType), nullable=False, index=True)
    transmission: Mapped[TransmissionType] = mapped_column(SAEnum(TransmissionType), nullable=False)
    drive_type: Mapped[DriveType] = mapped_column(SAEnum(DriveType), default=DriveType.fwd)
    engine_cc: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    seats: Mapped[int] = mapped_column(Integer, default=5)
    color: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    vin: Mapped[Optional[str]] = mapped_column(String(17), nullable=True, unique=True)

    # 가격 (USD 기준)
    price_usd: Mapped[float] = mapped_column(Float, nullable=False, index=True)
    is_negotiable: Mapped[bool] = mapped_column(Boolean, default=True)

    # 상태
    condition: Mapped[VehicleCondition] = mapped_column(
        SAEnum(VehicleCondition), default=VehicleCondition.good
    )
    status: Mapped[VehicleStatus] = mapped_column(
        SAEnum(VehicleStatus), default=VehicleStatus.pending, index=True
    )

    # 수출 정보
    origin_country: Mapped[str] = mapped_column(String(5), default="KR")
    export_ready: Mapped[bool] = mapped_column(Boolean, default=True)
    inspection_report_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    # 지역 타겟 태그 (실제 수출국 기반)
    region_tag: Mapped[RegionTag] = mapped_column(
        SAEnum(RegionTag), default=RegionTag.all_regions, index=True
    )

    # 설명 (다국어)
    description_en: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    description_ar: Mapped[Optional[str]] = mapped_column(Text, nullable=True)   # 아랍어
    description_ru: Mapped[Optional[str]] = mapped_column(Text, nullable=True)   # 러시아어
    description_es: Mapped[Optional[str]] = mapped_column(Text, nullable=True)   # 스페인어
    description_fr: Mapped[Optional[str]] = mapped_column(Text, nullable=True)   # 프랑스어

    # 조회수
    view_count: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # 관계
    seller: Mapped["User"] = relationship("User", back_populates="vehicles")
    images: Mapped[list["VehicleImage"]] = relationship(
        "VehicleImage", back_populates="vehicle", cascade="all, delete-orphan"
    )
    wishlists: Mapped[list["Wishlist"]] = relationship("Wishlist", back_populates="vehicle")
    inquiries: Mapped[list["Inquiry"]] = relationship("Inquiry", back_populates="vehicle")


class VehicleImage(Base):
    __tablename__ = "vehicle_images"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    vehicle_id: Mapped[str] = mapped_column(ForeignKey("vehicles.id"), nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False)
    order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    vehicle: Mapped["Vehicle"] = relationship("Vehicle", back_populates="images")
