"""찜하기 API"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.common import Wishlist

router = APIRouter()


@router.post("/{vehicle_id}", status_code=status.HTTP_201_CREATED)
async def add_wishlist(vehicle_id: str, db: AsyncSession = Depends(get_db)):
    w = Wishlist(user_id="temp-user-id", vehicle_id=vehicle_id)
    db.add(w)
    await db.commit()
    return {"message": "찜하기 완료"}


@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_wishlist(vehicle_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Wishlist).where(Wishlist.vehicle_id == vehicle_id, Wishlist.user_id == "temp-user-id")
    )
    w = result.scalar_one_or_none()
    if w:
        await db.delete(w)
        await db.commit()
