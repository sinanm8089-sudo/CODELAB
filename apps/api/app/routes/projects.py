import io
import zipfile
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..db import get_db
from ..models import User, Project, ProjectFile
from ..schemas import (
    ProjectCreate, ProjectUpdate, ProjectResponse, ProjectDetailResponse,
    ProjectFileSchema
)
from ..security import get_current_user

router = APIRouter(prefix="/api/projects", tags=["Projects"])

DEFAULT_TEMPLATES = {
    "python": "def main():\n    print('Hello, Codeverse!')\n\nif __name__ == '__main__':\n    main()\n",
    "javascript": "function main() {\n    console.log('Hello, Codeverse!');\n}\n\nmain();\n",
    "c": "#include <stdio.h>\n\nint main() {\n    printf(\"Hello, Codeverse!\\n\");\n    return 0;\n}\n",
    "cpp": "#include <iostream>\n\nint main() {\n    std::cout << \"Hello, Codeverse!\" << std::endl;\n    return 0;\n}\n",
    "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, Codeverse!\");\n    }\n}\n",
    "sql": "-- Write your SQL query below\nSELECT * FROM students WHERE gpa >= 3.5;\n",
    "html": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Codeverse Lab</title>\n    <style>\n        body { font-family: sans-serif; background: #111725; color: #fff; text-align: center; padding: 50px; }\n        h1 { color: #8B7BFF; }\n    </style>\n</head>\n<body>\n    <h1>Welcome to Codeverse Lab</h1>\n    <p>Live interactive browser preview</p>\n</body>\n</html>\n"
}

@router.get("", response_model=List[ProjectResponse])
def list_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    projects = db.scalars(select(Project).where(Project.user_id == current_user.id).order_by(Project.updated_at.desc())).all()
    results = []
    for p in projects:
        file_count = len(p.files)
        results.append({
            "id": p.id,
            "title": p.title,
            "language": p.language,
            "description": p.description,
            "created_at": p.created_at,
            "updated_at": p.updated_at,
            "files_count": file_count
        })
    return results

@router.post("", response_model=ProjectDetailResponse)
def create_project(
    req: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = Project(
        user_id=current_user.id,
        title=req.title,
        language=req.language,
        description=req.description or ""
    )
    db.add(project)
    db.flush()

    ext_map = {"python": ".py", "javascript": ".js", "c": ".c", "cpp": ".cpp", "java": ".java", "sql": ".sql", "html": ".html"}
    ext = ext_map.get(req.language.lower(), ".txt")
    initial_content = req.initial_content or DEFAULT_TEMPLATES.get(req.language.lower(), f"// {req.title}\n")

    main_file = ProjectFile(
        project_id=project.id,
        filename=f"main{ext}",
        content=initial_content,
        language=req.language
    )
    db.add(main_file)
    db.commit()
    db.refresh(project)
    return project

@router.get("/{id}", response_model=ProjectDetailResponse)
def get_project(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.scalar(select(Project).where(Project.id == id, Project.user_id == current_user.id))
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project

@router.put("/{id}", response_model=ProjectResponse)
def update_project(
    id: int,
    req: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.scalar(select(Project).where(Project.id == id, Project.user_id == current_user.id))
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    if req.title:
        project.title = req.title
    if req.description is not None:
        project.description = req.description
    db.commit()
    db.refresh(project)
    return project

@router.delete("/{id}")
def delete_project(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.scalar(select(Project).where(Project.id == id, Project.user_id == current_user.id))
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}

@router.post("/{id}/files", response_model=ProjectFileSchema)
def save_file(
    id: int,
    req: ProjectFileSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.scalar(select(Project).where(Project.id == id, Project.user_id == current_user.id))
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    existing_file = None
    if req.id:
        existing_file = db.scalar(select(ProjectFile).where(ProjectFile.id == req.id, ProjectFile.project_id == id))
    if not existing_file:
        existing_file = db.scalar(select(ProjectFile).where(ProjectFile.filename == req.filename, ProjectFile.project_id == id))

    if existing_file:
        existing_file.content = req.content
        existing_file.filename = req.filename
        existing_file.language = req.language
        file_obj = existing_file
    else:
        file_obj = ProjectFile(
            project_id=id,
            filename=req.filename,
            content=req.content,
            language=req.language
        )
        db.add(file_obj)

    db.commit()
    db.refresh(file_obj)
    return file_obj

@router.delete("/{id}/files/{file_id}")
def delete_file(
    id: int,
    file_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.scalar(select(Project).where(Project.id == id, Project.user_id == current_user.id))
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    file_obj = db.scalar(select(ProjectFile).where(ProjectFile.id == file_id, ProjectFile.project_id == id))
    if not file_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
    db.delete(file_obj)
    db.commit()
    return {"message": "File deleted"}

@router.get("/{id}/download-zip")
def download_project_zip(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.scalar(select(Project).where(Project.id == id, Project.user_id == current_user.id))
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        for f in project.files:
            zf.writestr(f.filename, f.content)
        # Add metadata readme
        zf.writestr("README.md", f"# {project.title}\n\nDeveloper: Sinan Mohammed\nCreated via CODEVERSE LAB\nLanguage: {project.language}\n")

    zip_buffer.seek(0)
    clean_title = "".join(c for c in project.title if c.isalnum() or c in (' ', '_', '-')).strip()
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename={clean_title or 'project'}.zip"}
    )

