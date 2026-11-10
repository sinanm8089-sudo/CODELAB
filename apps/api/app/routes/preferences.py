from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..db import get_db
from ..models import User, UserPreference
from ..schemas import UserPreferenceSchema
from ..security import get_current_user

router = APIRouter(prefix="/api/preferences", tags=["Preferences"])

@router.get("", response_model=UserPreferenceSchema)
def get_preferences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pref = db.scalar(select(UserPreference).where(UserPreference.user_id == current_user.id))
    if not pref:
        pref = UserPreference(user_id=current_user.id)
        db.add(pref)
        db.commit()
        db.refresh(pref)

    return {
        "theme": pref.theme,
        "accent_color": pref.accent_color,
        "wallpaper": pref.wallpaper,
        "wallpaper_blur": pref.wallpaper_blur,
        "wallpaper_opacity": pref.wallpaper_opacity,
        "audio_preferences": pref.audio_preferences or {},
        "editor_preferences": pref.editor_preferences or {},
        "learning_preferences": pref.learning_preferences or {},
        "dashboard_layout": pref.dashboard_layout or {}
    }

@router.put("", response_model=UserPreferenceSchema)
def update_preferences(
    req: UserPreferenceSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pref = db.scalar(select(UserPreference).where(UserPreference.user_id == current_user.id))
    if not pref:
        pref = UserPreference(user_id=current_user.id)
        db.add(pref)

    pref.theme = req.theme
    pref.accent_color = req.accent_color
    pref.wallpaper = req.wallpaper
    pref.wallpaper_blur = req.wallpaper_blur
    pref.wallpaper_opacity = req.wallpaper_opacity
    pref.audio_preferences = req.audio_preferences
    pref.editor_preferences = req.editor_preferences
    pref.learning_preferences = req.learning_preferences
    pref.dashboard_layout = req.dashboard_layout

    db.commit()
    db.refresh(pref)
    return req

@router.post("/reset", response_model=UserPreferenceSchema)
def reset_preferences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pref = db.scalar(select(UserPreference).where(UserPreference.user_id == current_user.id))
    default_schema = UserPreferenceSchema()
    if pref:
        pref.theme = default_schema.theme
        pref.accent_color = default_schema.accent_color
        pref.wallpaper = default_schema.wallpaper
        pref.wallpaper_blur = default_schema.wallpaper_blur
        pref.wallpaper_opacity = default_schema.wallpaper_opacity
        pref.audio_preferences = default_schema.audio_preferences
        pref.editor_preferences = default_schema.editor_preferences
        pref.learning_preferences = default_schema.learning_preferences
        pref.dashboard_layout = default_schema.dashboard_layout
        db.commit()
    return default_schema

