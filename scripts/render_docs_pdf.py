"""
Renders docs/BLOG.md and docs/ONE_PAGE_SUMMARY.md to PDF.

Not part of the app's core reproducible pipeline (that's npm test / npm run
precompute / the browser) — this is a documentation-build convenience script.
Requires Windows with Georgia, Arial, and Consolas installed (the standard
Microsoft core fonts), since it embeds them directly for full Unicode
coverage (Greek letters, arrows, em dashes) rather than relying on
reportlab's built-in base-14 fonts, which do not cover those glyphs.

Usage:
    pip install reportlab
    python scripts/render_docs_pdf.py
"""

import re
import sys
from pathlib import Path
import xml.sax.saxutils as sx

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable

FONT_DIR = "C:/Windows/Fonts/"
pdfmetrics.registerFont(TTFont("Body", FONT_DIR + "georgia.ttf"))
pdfmetrics.registerFont(TTFont("Body-Bold", FONT_DIR + "georgiab.ttf"))
pdfmetrics.registerFont(TTFont("Body-Italic", FONT_DIR + "georgiai.ttf"))
pdfmetrics.registerFont(TTFont("Head", FONT_DIR + "arial.ttf"))
pdfmetrics.registerFont(TTFont("Head-Bold", FONT_DIR + "arialbd.ttf"))
pdfmetrics.registerFont(TTFont("Head-Italic", FONT_DIR + "ariali.ttf"))
pdfmetrics.registerFont(TTFont("MonoUnicode", FONT_DIR + "consola.ttf"))
pdfmetrics.registerFontFamily("Body", normal="Body", bold="Body-Bold", italic="Body-Italic")
pdfmetrics.registerFontFamily("Head", normal="Head", bold="Head-Bold", italic="Head-Italic")

INK = HexColor("#1F1C19")
MUTED = HexColor("#5C534A")
ACCENT = HexColor("#2F5D50")
BORDER = HexColor("#E5DFD6")
SURFACE2 = HexColor("#F1EDE7")


def make_styles(compact):
    if compact:
        return {
            "h1": ParagraphStyle("h1", fontName="Head-Bold", fontSize=16, leading=18.5, textColor=INK, spaceAfter=1),
            "h3sub": ParagraphStyle("h3sub", fontName="Head-Italic", fontSize=10, leading=12, textColor=MUTED, spaceAfter=8),
            "h2": ParagraphStyle("h2", fontName="Head-Bold", fontSize=11, leading=13, textColor=ACCENT, spaceBefore=7, spaceAfter=3),
            "body": ParagraphStyle("body", fontName="Body", fontSize=9, leading=12.1, textColor=INK, alignment=TA_JUSTIFY, spaceAfter=5),
            "quote": ParagraphStyle("quote", fontName="Body-Italic", fontSize=9, leading=12.1, textColor=INK,
                                     leftIndent=12, spaceBefore=4, spaceAfter=6, backColor=SURFACE2),
            "li": ParagraphStyle("li", fontName="Body", fontSize=9, leading=12.1, textColor=INK, spaceAfter=3,
                                  leftIndent=13, firstLineIndent=-13),
        }
    return {
        "h1": ParagraphStyle("h1", fontName="Head-Bold", fontSize=20, leading=24, textColor=INK, spaceAfter=2),
        "h3sub": ParagraphStyle("h3sub", fontName="Head-Italic", fontSize=12, leading=16, textColor=MUTED, spaceAfter=16),
        "h2": ParagraphStyle("h2", fontName="Head-Bold", fontSize=13.5, leading=17, textColor=ACCENT, spaceBefore=18, spaceAfter=8),
        "body": ParagraphStyle("body", fontName="Body", fontSize=10.3, leading=15.5, textColor=INK, alignment=TA_JUSTIFY, spaceAfter=9),
        "quote": ParagraphStyle("quote", fontName="Body-Italic", fontSize=10.3, leading=15.5, textColor=INK,
                                 leftIndent=14, spaceBefore=8, spaceAfter=10, backColor=SURFACE2),
        "li": ParagraphStyle("li", fontName="Body", fontSize=10.3, leading=15, textColor=INK, spaceAfter=6,
                              leftIndent=14, firstLineIndent=-14),
    }


def inline_to_xml(text):
    text = sx.escape(text)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<link href="\2" color="#2F5D50">\1</link>', text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", text)
    # Inline code uses a Unicode-capable monospace font, not reportlab's built-in
    # Courier (a base-14 font limited to WinAnsi that mangles Greek letters/arrows).
    text = re.sub(r"`([^`]+)`", r'<font face="MonoUnicode">\1</font>', text)
    return text


def parse_blocks(md_text):
    lines = md_text.split("\n")
    blocks, para_buf, list_buf = [], [], []

    def flush_para():
        if para_buf:
            blocks.append(("p", " ".join(para_buf).strip()))
            para_buf.clear()

    def flush_list():
        if list_buf:
            blocks.append(("ul", list_buf[:]))
            list_buf.clear()

    for raw_line in lines:
        line = raw_line.rstrip()
        if line.startswith("### "):
            flush_para(); flush_list(); blocks.append(("h3sub", line[4:].strip()))
        elif line.startswith("## "):
            flush_para(); flush_list(); blocks.append(("h2", line[3:].strip()))
        elif line.startswith("# "):
            flush_para(); flush_list(); blocks.append(("h1", line[2:].strip()))
        elif line.startswith("> "):
            flush_para(); flush_list(); blocks.append(("quote", line[2:].strip()))
        elif line.startswith("- "):
            flush_para(); list_buf.append(line[2:].strip())
        elif line.strip() == "":
            flush_para(); flush_list()
        else:
            para_buf.append(line.strip())
    flush_para(); flush_list()
    return blocks


def build_pdf(md_path, pdf_path, footer_text, compact=False):
    styles = make_styles(compact)
    md_text = Path(md_path).read_text(encoding="utf-8")
    blocks = parse_blocks(md_text)
    story = []
    hr_space = 6 if compact else 14

    style_for = {"h1": "h1", "h3sub": "h3sub", "quote": "quote", "p": "body"}
    for kind, content in blocks:
        if kind in style_for:
            story.append(Paragraph(inline_to_xml(content), styles[style_for[kind]]))
        elif kind == "h2":
            story.append(HRFlowable(width="100%", thickness=0.6, color=BORDER, spaceBefore=hr_space, spaceAfter=0))
            story.append(Paragraph(inline_to_xml(content), styles["h2"]))
        elif kind == "ul":
            for item in content:
                story.append(Paragraph("&#8226;&nbsp;&nbsp;" + inline_to_xml(item), styles["li"]))
            story.append(Spacer(1, 4 if compact else 6))

    def footer(canvas, _doc):
        canvas.saveState()
        canvas.setFont("Head", 8)
        canvas.setFillColor(MUTED)
        canvas.drawCentredString(A4[0] / 2, 1.2 * cm, footer_text)
        canvas.restoreState()

    margin = (1.6 if compact else 2.4) * cm
    top_margin = (1.4 if compact else 2.2) * cm
    doc = SimpleDocTemplate(
        str(pdf_path), pagesize=A4,
        leftMargin=margin, rightMargin=margin, topMargin=top_margin, bottomMargin=top_margin,
        title=footer_text,
    )
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print(f"Wrote {pdf_path}")


if __name__ == "__main__":
    docs_dir = Path(__file__).resolve().parent.parent / "docs"
    build_pdf(docs_dir / "BLOG.md", docs_dir / "BLOG.pdf",
              "Synaptic Memory Lab · Blog · DataForge 2026, Pathway Track")
    build_pdf(docs_dir / "ONE_PAGE_SUMMARY.md", docs_dir / "ONE_PAGE_SUMMARY.pdf",
              "Synaptic Memory Lab · One-Page Concept Summary · DataForge 2026", compact=True)
