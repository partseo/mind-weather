"""
차량 API — 목록 조회(필터/정렬/페이지), 상세, 등록, 수정, 삭제
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from pydantic import BaseModel

from app.core.database import get_db
from app.models.vehicle import (
    Vehicle, VehicleImage, FuelType, TransmissionType,
    DriveType, VehicleCondition, VehicleStatus, RegionTag
)

router = APIRouter()


# ── Response Schemas ──────────────────────────────────────
class VehicleImageOut(BaseModel):
    id: str
    url: str
    thumbnail_url: Optional[str]
    is_primary: bool
    order: int

    class Config:
        from_attributes = True


class VehicleListItem(BaseModel):
    id: str
    title: str
    make: str
    model: str
    year: int
    mileage_km: int
    fuel_type: str
    transmission: str
    drive_type: str
    price_usd: float
    is_negotiable: bool
    condition: str
    status: str
    region_tag: str
    color: Optional[str]
    view_count: int
    primary_image_url: Optional[str] = None

    class Config:
        from_attributes = True


class VehicleDetail(VehicleListItem):
    engine_cc: Optional[int]
    seats: int
    vin: Optional[str]
    origin_country: str
    export_ready: bool
    inspection_report_url: Optional[str]
    description_en: Optional[str]
    description_ar: Optional[str]
    description_ru: Optional[str]
    description_es: Optional[str]
    description_fr: Optional[str]
    images: List[VehicleImageOut] = []


class VehicleCreate(BaseModel):
    title: str
    make: str
    model: str
    year: int
    mileage_km: int
    fuel_type: FuelType
    transmission: TransmissionType
    drive_type: DriveType = DriveType.fwd
    engine_cc: Optional[int] = None
    seats: int = 5
    color: Optional[str] = None
    price_usd: float
    is_negotiable: bool = True
    condition: VehicleCondition = VehicleCondition.good
    region_tag: RegionTag = RegionTag.all_regions
    description_en: Optional[str] = None
    description_ar: Optional[str] = None
    description_ru: Optional[str] = None


class PaginatedVehicles(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[VehicleListItem]


# ── Endpoints ─────────────────────────────────────────────
@router.get("", response_model=PaginatedVehicles)
async def list_vehicles(
    # 필터
    make: Optional[str] = Query(None, description="제조사"),
    model: Optional[str] = Query(None, description="모델명"),
    year_min: Optional[int] = Query(None, description="최소 연식"),
    year_max: Optional[int] = Query(None, description="최대 연식"),
    price_min: Optional[float] = Query(None, description="최소 가격(USD)"),
    price_max: Optional[float] = Query(None, description="최대 가격(USD)"),
    fuel_type: Optional[FuelType] = Query(None, description="연료 타입"),
    transmission: Optional[TransmissionType] = Query(None, description="변속기"),
    drive_type: Optional[DriveType] = Query(None, description="구동방식"),
    region_tag: Optional[RegionTag] = Query(None, description="타겟 지역"),
    color: Optional[str] = Query(None, description="색상"),
    # 정렬
    sort_by: str = Query("created_at", description="정렬 기준: price_usd | year | mileage_km | created_at"),
    sort_order: str = Query("desc", description="asc | desc"),
    # 페이지네이션
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """차량 목록 — 필터/정렬/페이지네이션"""
    conditions = [Vehicle.status == VehicleStatus.available]

    if make:
        conditions.append(Vehicle.make.ilike(f"%{make}%"))
    if model:
        conditions.append(Vehicle.model.ilike(f"%{model}%"))
    if year_min:
        conditions.append(Vehicle.year >= year_min)
    if year_max:
        conditions.append(Vehicle.year <= year_max)
    if price_min is not None:
        conditions.append(Vehicle.price_usd >= price_min)
    if price_max is not None:
        conditions.append(Vehicle.price_usd <= price_max)
    if fuel_type:
        conditions.append(Vehicle.fuel_type == fuel_type)
    if transmission:
        conditions.append(Vehicle.transmission == transmission)
    if drive_type:
        conditions.append(Vehicle.drive_type == drive_type)
    if region_tag:
        conditions.append(
            (Vehicle.region_tag == region_tag) | (Vehicle.region_tag == RegionTag.all_regions)
        )
    if color:
        conditions.append(Vehicle.color.ilike(f"%{color}%"))

    # 정렬 컬럼 매핑
    sort_column = {
        "price_usd": Vehicle.price_usd,
        "year": Vehicle.year,
        "mileage_km": Vehicle.mileage_km,
        "created_at": Vehicle.created_at,
        "view_count": Vehicle.view_count,
    }.get(sort_by, Vehicle.created_at)

    order = sort_column.asc() if sort_order == "asc" else sort_column.desc()

    # 전체 개수
    count_q = select(func.count()).select_from(Vehicle).where(and_(*conditions))
    total = (await db.execute(count_q)).scalar_one()

    # 데이터 조회
    offset = (page - 1) * page_size
    result = await db.execute(
        select(Vehicle)
        .where(and_(*conditions))
        .order_by(order)
        .offset(offset)
        .limit(page_size)
    )
    vehicles = result.scalars().all()

    items = []
    for v in vehicles:
        primary_img = next(
            (img.thumbnail_url or img.url for img in v.images if img.is_primary),
            None,
        )
        items.append(VehicleListItem(
            **{k: getattr(v, k) for k in VehicleListItem.model_fields if hasattr(v, k)},
            primary_image_url=primary_img,
        ))

    return PaginatedVehicles(total=total, page=page, page_size=page_size, items=items)


@router.get("/{vehicle_id}", response_model=VehicleDetail)
async def get_vehicle(vehicle_id: str, db: AsyncSession = Depends(get_db)):
    """차량 상세 + 조회수 증가"""
    result = await db.execute(select(Vehicle).where(Vehicle.id == vehicle_id))
    vehicle = result.scalar_one_or_none()
    if not vehicle:
        raise HTTPException(status_code=404, detail="차량을 찾을 수 없습니다.")

    # 조회수 증가
    vehicle.view_count += 1
    await db.commit()

    primary_img = next(
        (img.thumbnail_url or img.url for img in vehicle.images if img.is_primary), None
    )
    return VehicleDetail(
        **{k: getattr(vehicle, k) for k in VehicleDetail.model_fields if hasattr(vehicle, k)},
        primary_image_url=primary_img,
        images=[VehicleImageOut.model_validate(img) for img in vehicle.images],
    )


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_vehicle(data: VehicleCreate, db: AsyncSession = Depends(get_db)):
    """차량 등록 (판매자) — 승인 대기 상태로 저장"""
    # TODO: 실제 서비스에서는 현재 로그인 사용자 seller_id 주입
    vehicle = Vehicle(**data.model_dump(), seller_id="temp-seller-id")
    db.add(vehicle)
    await db.commit()
    await db.refresh(vehicle)
    return {"id": vehicle.id, "status": vehicle.status, "message": "차량이 등록되어 검토 중입니다."}
