from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..db import get_db
from ..models import User, UserPreference
from ..schemas import RegisterRequest, LoginRequest, TokenResponse, UserResponse, UpdateProfileRequest
from ..security import hash_password, verify_password, create_access_token, generate_student_id, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.scalar(select(User).where(User.email == req.email.lower()))
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists"
        )

    student_id = generate_student_id(db)
    user = User(
        student_id=student_id,
        name=req.name.strip(),
        email=req.email.lower(),
        password_hash=hash_password(req.password),
        role=req.role or "student"
    )
    db.add(user)
    db.flush()

    # Create default preferences
    pref = UserPreference(user_id=user.id)
    db.add(pref)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == req.email.lower()))
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/me", response_model=UserResponse)
def update_profile(
    req: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if req.name is not None and req.name.strip():
        current_user.name = req.name.strip()
    if req.profile_image is not None:
        current_user.profile_image = req.profile_image
    db.commit()
    db.refresh(current_user)
    return current_user

