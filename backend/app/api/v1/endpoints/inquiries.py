"""
문의 API — WhatsApp/Telegram/이메일 문의 접수
비회원도 문의 가능
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, EmailStr
from typing import Optional

from app.core.database import get_db
from app.models.common import Inquiry, ContactMethod

router = APIRouter()


class InquiryCreate(BaseModel):
    vehicle_id: str
    message: str
    contact_method: ContactMethod = ContactMethod.whatsapp
    preferred_language: str = "en"
    # 비회원 정보
    guest_name: Optional[str] = None
    guest_email: Optional[EmailStr] = None
    guest_whatsapp: Optional[str] = None
    guest_country: Optional[str] = None


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_inquiry(data: InquiryCreate, db: AsyncSession = Depends(get_db)):
    """문의 접수 — 비회원 가능"""
    inquiry = Inquiry(**data.model_dump())
    db.add(inquiry)
    await db.commit()
    await db.refresh(inquiry)
    return {"id": inquiry.id, "message": "문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다."}
