import os
import zipfile

def create_project_zip():
    zip_filename = "CODELAB_IDE_V2_Sinan_Mohammed.zip"
    exclude_dirs = {"node_modules", ".next", ".venv", "__pycache__", ".pytest_cache", ".git", "dist"}
    exclude_files = {zip_filename, "CODEVERSE_LAB_V2_Sinan_Mohammed.zip", "codeverse.db"}

    root_dir = os.path.dirname(os.path.abspath(__file__))
    zip_path = os.path.join(root_dir, zip_filename)

    print(f"Creating {zip_filename}...")
    file_count = 0

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(root_dir):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for file in files:
                if file in exclude_files or file.endswith(".pyc"):
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, root_dir)
                zipf.write(full_path, rel_path)
                file_count += 1

    file_size_mb = os.path.getsize(zip_path) / (1024 * 1024)
    print(f"Successfully created {zip_filename} ({file_count} files, {file_size_mb:.2f} MB)")

if __name__ == "__main__":
    create_project_zip()
