
import os
import zipfile

root = os.getcwd()
output = os.path.join(root, "..", "skybridge-api-fixed.zip")

items = [
    "index.js",
    "package.json",
    "package-lock.json",
    "createAdmin.js",
    "seedProducts.js",
    "routes",
    "middleware",
    "models",
]

with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as archive:
    for item in items:
        path = os.path.join(root, item)

        if os.path.isfile(path):
            archive.write(path, os.path.relpath(path, root).replace("\\", "/"))
        elif os.path.isdir(path):
            for folder, _, files in os.walk(path):
                for filename in files:
                    full_path = os.path.join(folder, filename)
                    relative_path = os.path.relpath(full_path, root)
                    archive.write(
                        full_path,
                        relative_path.replace("\\", "/")
                    )

print("Created:", os.path.abspath(output))
