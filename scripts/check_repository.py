#!/usr/bin/env python3
"""Validate deterministic repository and documentation invariants."""

from __future__ import annotations

import json
import re
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
EXPECTED_CANONICAL = "https://portafolio.orbynexdigital.cl/"
REQUIRED_PATHS = (
    "AGENTS.md",
    "README.md",
    "index.html",
    "css/styles.css",
    "js/main.js",
    "data/data.json",
    "docs/README.md",
    "docs/PROJECT_STATE.md",
    "docs/architecture.md",
)
STALE_TEXT = (
    "guacho175.github.io",
    "portafolio-53ivpmxll-galindez.vercel.app",
)
TASK_NAME = re.compile(r"^\d{4}-\d{2}-\d{2}-\d{4}-[a-z0-9-]+\.md$")
MARKDOWN_LINK = re.compile(r"\[[^\]]+\]\(([^)]+)\)")


class IndexParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.canonical: str | None = None
        self.references: list[str] = []

    def handle_starttag(
        self, tag: str, attrs: list[tuple[str, str | None]]
    ) -> None:
        values = dict(attrs)
        if tag == "link" and values.get("rel") == "canonical":
            self.canonical = values.get("href")
        attribute = "href" if tag in {"a", "link"} else "src"
        if tag in {"a", "link", "script", "img"} and values.get(attribute):
            self.references.append(values[attribute] or "")


def repository_existing_files() -> list[Path]:
    result = subprocess.run(
        ["git", "ls-files", "-z", "--cached", "--others", "--exclude-standard"],
        cwd=ROOT,
        check=True,
        capture_output=True,
    )
    return [
        ROOT / raw.decode("utf-8")
        for raw in result.stdout.split(b"\0")
        if raw and (ROOT / raw.decode("utf-8")).exists()
    ]


def is_forbidden(path: Path) -> bool:
    relative = path.relative_to(ROOT)
    lowered = relative.as_posix().lower()
    parts = {part.lower() for part in relative.parts}
    name = relative.name.lower()
    return (
        name == ".env"
        or (name.startswith(".env.") and name != ".env.example")
        or name.endswith(".log")
        or "node_modules" in parts
        or "dist" in parts
        or "coverage" in parts
        or "ideaparaportafolio" in parts
        or "curriculum" in lowered
        or re.search(r"(^|[-_])cv([._ -]|$)", lowered) is not None
    )


def local_reference(value: str) -> Path | None:
    parsed = urlparse(value)
    if parsed.scheme or parsed.netloc or value.startswith(("#", "mailto:", "tel:")):
        return None
    clean = parsed.path.lstrip("/")
    return ROOT / clean if clean else None


def validate() -> list[str]:
    errors: list[str] = []

    for relative in REQUIRED_PATHS:
        if not (ROOT / relative).is_file():
            errors.append(f"Falta el archivo requerido: {relative}")

    try:
        with (ROOT / "data/data.json").open(encoding="utf-8") as handle:
            json.load(handle)
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(f"data/data.json no es válido: {exc}")

    parser = IndexParser()
    parser.feed((ROOT / "index.html").read_text(encoding="utf-8"))
    if parser.canonical != EXPECTED_CANONICAL:
        errors.append(
            f"Canonical inesperado: {parser.canonical!r}; esperado {EXPECTED_CANONICAL!r}"
        )
    for reference in parser.references:
        target = local_reference(reference)
        if target is not None and not target.is_file():
            errors.append(f"Referencia local inexistente en index.html: {reference}")

    repository_files = repository_existing_files()
    for path in repository_files:
        if is_forbidden(path):
            errors.append(f"Archivo prohibido versionado: {path.relative_to(ROOT)}")

    text_suffixes = {
        ".html",
        ".css",
        ".js",
        ".json",
        ".md",
        ".py",
        ".ps1",
        ".bat",
        ".yml",
        ".yaml",
    }
    validator_path = Path(__file__).resolve()
    for path in repository_files:
        if path.resolve() == validator_path or path.suffix.lower() not in text_suffixes:
            continue
        content = path.read_text(encoding="utf-8", errors="replace")
        for stale in STALE_TEXT:
            if stale.lower() in content.lower():
                errors.append(f"Referencia obsoleta {stale!r} en {path.relative_to(ROOT)}")

    docs_index = ROOT / "docs/README.md"
    indexed_docs: set[Path] = set()
    for link in MARKDOWN_LINK.findall(docs_index.read_text(encoding="utf-8")):
        if urlparse(link).scheme or link.startswith("#"):
            continue
        target = (docs_index.parent / link.split("#", 1)[0]).resolve()
        if not target.is_file():
            errors.append(f"Enlace documental inexistente: {link}")
        indexed_docs.add(target)

    active_docs = {
        path.resolve()
        for path in (ROOT / "docs").glob("*.md")
        if path.name != "README.md"
    }
    unindexed = active_docs - indexed_docs
    for path in sorted(unindexed):
        errors.append(f"Documento activo no indexado: {path.relative_to(ROOT)}")

    task_dir = ROOT / "docs/tasks"
    for path in task_dir.glob("*.md"):
        if not TASK_NAME.fullmatch(path.name):
            errors.append(f"Nombre de plan inválido: {path.relative_to(ROOT)}")
        task_text = path.read_text(encoding="utf-8")
        if not re.search(
            r"^\*\*Estado:\*\* (EN_IMPLEMENTACIÓN|COMPLETADO|BLOQUEADO|CANCELADO)[ \t]*$",
            task_text,
            flags=re.MULTILINE,
        ):
            errors.append(f"Estado de plan inválido: {path.relative_to(ROOT)}")
    if (ROOT / "PLAN.md").exists():
        errors.append("No se permite un PLAN.md compartido")
    if (ROOT / "doc").exists():
        errors.append("La carpeta obsoleta doc/ todavía existe")

    state = (ROOT / "docs/PROJECT_STATE.md").read_text(encoding="utf-8")
    for marker in ("**Estado:** CANÓNICO", "**Última verificación:**", EXPECTED_CANONICAL):
        if marker not in state:
            errors.append(f"PROJECT_STATE.md no contiene: {marker}")

    return errors


def main() -> int:
    try:
        errors = validate()
    except (OSError, subprocess.CalledProcessError) as exc:
        print(f"ERROR: no se pudo ejecutar la validación: {exc}", file=sys.stderr)
        return 2

    if errors:
        print("Validación fallida:")
        for error in errors:
            print(f"- {error}")
        return 1

    print("Validación correcta: repositorio y documentación consistentes.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
