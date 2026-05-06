"""
해상 운임 계산 API + 항구 목록
실제 수출 TOP 5 국가 항구 데이터 사전 탑재
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from pydantic import BaseModel

from app.core.database import get_db
from app.models.common import Port

router = APIRouter()

# ── 사전 탑재 항구 데이터 (부산항 기준 실제 운임 참고값) ────
SEED_PORTS = [
    # 리비아 (🥇 대수 기준 1위)
    {"country_code": "LY", "country_name": "Libya", "city": "Misrata", "port_name": "Port of Misrata", "port_code": "LY MRA", "region": "africa", "shipping_cost_usd": 1800, "transit_days": 25},
    {"country_code": "LY", "country_name": "Libya", "city": "Tripoli", "port_name": "Port of Tripoli", "port_code": "LY TIP", "region": "africa", "shipping_cost_usd": 1900, "transit_days": 26},
    {"country_code": "LY", "country_name": "Libya", "city": "Benghazi", "port_name": "Port of Benghazi", "port_code": "LY BEN", "region": "africa", "shipping_cost_usd": 2000, "transit_days": 27},
    # UAE (🥉 중동 핵심)
    {"country_code": "AE", "country_name": "UAE", "city": "Dubai", "port_name": "Port of Jebel Ali", "port_code": "AE JEA", "region": "middle_east", "shipping_cost_usd": 1200, "transit_days": 18},
    {"country_code": "AE", "country_name": "UAE", "city": "Abu Dhabi", "port_name": "Port of Abu Dhabi (Zayed)", "port_code": "AE AUH", "region": "middle_east", "shipping_cost_usd": 1250, "transit_days": 19},
    # 요르단 (5위)
    {"country_code": "JO", "country_name": "Jordan", "city": "Aqaba", "port_name": "Port of Aqaba", "port_code": "JO AQJ", "region": "middle_east", "shipping_cost_usd": 1400, "transit_days": 21},
    # 키르기스스탄 (🥈 금액 기준 1위 — 육로 경유 중국/카자흐스탄)
    {"country_code": "KG", "country_name": "Kyrgyzstan", "city": "Bishkek", "port_name": "(육로) Dostyk → Bishkek", "port_code": "KG BIK", "region": "central_asia", "shipping_cost_usd": 2500, "transit_days": 35},
    # 카자흐스탄 (4위)
    {"country_code": "KZ", "country_name": "Kazakhstan", "city": "Almaty", "port_name": "Almaty Dry Port (철도)", "port_code": "KZ ALA", "region": "central_asia", "shipping_cost_usd": 2200, "transit_days": 30},
    {"country_code": "KZ", "country_name": "Kazakhstan", "city": "Aktau", "port_name": "Port of Aktau (카스피해)", "port_code": "KZ SCO", "region": "central_asia", "shipping_cost_usd": 2400, "transit_days": 32},
    # 기타 중동
    {"country_code": "SA", "country_name": "Saudi Arabia", "city": "Jeddah", "port_name": "Jeddah Islamic Port", "port_code": "SA JED", "region": "middle_east", "shipping_cost_usd": 1300, "transit_days": 20},
    # 동남아
    {"country_code": "PH", "country_name": "Philippines", "city": "Manila", "port_name": "Port of Manila", "port_code": "PH MNL", "region": "southeast_asia", "shipping_cost_usd": 900, "transit_days": 7},
    {"country_code": "KH", "country_name": "Cambodia", "city": "Phnom Penh", "port_name": "Sihanoukville Port", "port_code": "KH PNH", "region": "southeast_asia", "shipping_cost_usd": 1000, "transit_days": 8},
    # 남미
    {"country_code": "CL", "country_name": "Chile", "city": "Iquique", "port_name": "Puerto de Iquique", "port_code": "CL IQQ", "region": "south_america", "shipping_cost_usd": 3500, "transit_days": 45},
    {"country_code": "PE", "country_name": "Peru", "city": "Callao", "port_name": "Puerto del Callao", "port_code": "PE CLO", "region": "south_america", "shipping_cost_usd": 3600, "transit_days": 46},
]


class PortOut(BaseModel):
    id: str
    country_code: str
    country_name: str
    city: str
    port_name: str
    region: str
    shipping_cost_usd: Optional[float]
    transit_days: Optional[int]

    class Config:
        from_attributes = True


class ShippingQuote(BaseModel):
    origin: str = "Busan, Korea (부산항)"
    destination_port: str
    destination_country: str
    estimated_cost_usd: float
    estimated_days: int
    note: str = "예상 운임이며 실제 비용은 차량 크기/중량에 따라 달라질 수 있습니다."


@router.get("/ports", response_model=List[PortOut])
async def list_ports(
    region: Optional[str] = Query(None, description="지역 필터: middle_east|central_asia|africa|southeast_asia|south_america"),
    db: AsyncSession = Depends(get_db),
):
    """항구 목록 조회"""
    q = select(Port).where(Port.is_active == True)
    if region:
        q = q.where(Port.region == region)
    result = await db.execute(q)
    return result.scalars().all()


@router.get("/quote", response_model=ShippingQuote)
async def get_shipping_quote(
    port_id: str = Query(..., description="항구 ID"),
    db: AsyncSession = Depends(get_db),
):
    """해상 운임 견적 — 부산항 기준"""
    result = await db.execute(select(Port).where(Port.id == port_id))
    port = result.scalar_one_or_none()
    if not port:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="항구를 찾을 수 없습니다.")

    return ShippingQuote(
        destination_port=port.port_name,
        destination_country=port.country_name,
        estimated_cost_usd=port.shipping_cost_usd or 0,
        estimated_days=port.transit_days or 0,
    )


@router.post("/seed-ports")
async def seed_ports(db: AsyncSession = Depends(get_db)):
    """개발용 항구 데이터 초기 삽입"""
    for p in SEED_PORTS:
        existing = await db.execute(
            select(Port).where(Port.port_name == p["port_name"])
        )
        if not existing.scalar_one_or_none():
            db.add(Port(**p))
    await db.commit()
    return {"message": f"{len(SEED_PORTS)}개 항구 데이터 삽입 완료"}
