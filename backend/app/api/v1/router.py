from fastapi import APIRouter
from app.api.v1.endpoints import auth, vehicles, shipping, inquiries, wishlists, admin

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["인증"])
api_router.include_router(vehicles.router, prefix="/vehicles", tags=["차량"])
api_router.include_router(shipping.router, prefix="/shipping", tags=["해상운임"])
api_router.include_router(inquiries.router, prefix="/inquiries", tags=["문의"])
api_router.include_router(wishlists.router, prefix="/wishlists", tags=["찜하기"])
api_router.include_router(admin.router, prefix="/admin", tags=["어드민"])
