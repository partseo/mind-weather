"""어드민 API — 통계/차량 승인/사용자 관리"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.models.vehicle import Vehicle, VehicleStatus
from app.models.user import User
from app.models.common import Inquiry

router = APIRouter()


@router.get("/stats")
async def get_stats(db: AsyncSession = Depends(get_db)):
    total_vehicles = (await db.execute(select(func.count()).select_from(Vehicle))).scalar_one()
    available = (await db.execute(select(func.count()).select_from(Vehicle).where(Vehicle.status == VehicleStatus.available))).scalar_one()
    pending = (await db.execute(select(func.count()).select_from(Vehicle).where(Vehicle.status == VehicleStatus.pending))).scalar_one()
    total_users = (await db.execute(select(func.count()).select_from(User))).scalar_one()
    total_inquiries = (await db.execute(select(func.count()).select_from(Inquiry))).scalar_one()
    return {
        "vehicles": {"total": total_vehicles, "available": available, "pending": pending},
        "users": {"total": total_users},
        "inquiries": {"total": total_inquiries},
    }


@router.put("/vehicles/{vehicle_id}/approve")
async def approve_vehicle(vehicle_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vehicle).where(Vehicle.id == vehicle_id))
    vehicle = result.scalar_one_or_none()
    if not vehicle:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="차량을 찾을 수 없습니다.")
    vehicle.status = VehicleStatus.available
    await db.commit()
    return {"message": "차량이 승인되었습니다.", "id": vehicle_id}


@router.put("/vehicles/{vehicle_id}/reject")
async def reject_vehicle(vehicle_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vehicle).where(Vehicle.id == vehicle_id))
    vehicle = result.scalar_one_or_none()
    if not vehicle:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="차량을 찾을 수 없습니다.")
    vehicle.status = VehicleStatus.rejected
    await db.commit()
    return {"message": "차량이 반려되었습니다.", "id": vehicle_id}
