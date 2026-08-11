from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


OUT = r"D:\Main Project\Telkom\Hadid\Mutualizm-BE\outputs\Analisis_Penguatan_MOOTS_KIJB_2026.pdf"
DOCX_OUT = r"D:\Main Project\Telkom\Hadid\Mutualizm-BE\outputs\Analisis_Penguatan_MOOTS_KIJB_2026.docx"


BLUE = "2E74B5"
DARK_BLUE = "1F4D78"
LIGHT_BLUE = "E8EEF5"
LIGHT_GRAY = "F4F6F9"
MID_GRAY = "D9E2EC"


def set_cell_shading(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_width(cell, width):
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_w = tc_pr.find(qn("w:tcW"))
    if tc_w is None:
        tc_w = OxmlElement("w:tcW")
        tc_pr.append(tc_w)
    tc_w.set(qn("w:w"), str(width))
    tc_w.set(qn("w:type"), "dxa")


def set_cell_margins(cell, top=80, start=120, bottom=80, end=120):
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for margin_name, value in [("top", top), ("start", start), ("bottom", bottom), ("end", end)]:
        node = tc_mar.find(qn(f"w:{margin_name}"))
        if node is None:
            node = OxmlElement(f"w:{margin_name}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")


def set_table_borders(table, color="B7C4D3", size="4"):
    tbl_pr = table._tbl.tblPr
    borders = tbl_pr.first_child_found_in("w:tblBorders")
    if borders is None:
        borders = OxmlElement("w:tblBorders")
        tbl_pr.append(borders)
    for edge in ["top", "left", "bottom", "right", "insideH", "insideV"]:
        tag = f"w:{edge}"
        element = borders.find(qn(tag))
        if element is None:
            element = OxmlElement(tag)
            borders.append(element)
        element.set(qn("w:val"), "single")
        element.set(qn("w:sz"), size)
        element.set(qn("w:space"), "0")
        element.set(qn("w:color"), color)


def set_table_grid(table, widths):
    tbl = table._tbl
    tbl_grid = tbl.tblGrid
    if tbl_grid is None:
        tbl_grid = OxmlElement("w:tblGrid")
        tbl.insert(0, tbl_grid)
    for child in list(tbl_grid):
        tbl_grid.remove(child)
    for width in widths:
        grid_col = OxmlElement("w:gridCol")
        grid_col.set(qn("w:w"), str(width))
        tbl_grid.append(grid_col)
    tbl_pr = tbl.tblPr
    tbl_w = tbl_pr.find(qn("w:tblW"))
    if tbl_w is None:
        tbl_w = OxmlElement("w:tblW")
        tbl_pr.append(tbl_w)
    tbl_w.set(qn("w:w"), str(sum(widths)))
    tbl_w.set(qn("w:type"), "dxa")
    tbl_ind = tbl_pr.find(qn("w:tblInd"))
    if tbl_ind is None:
        tbl_ind = OxmlElement("w:tblInd")
        tbl_pr.append(tbl_ind)
    tbl_ind.set(qn("w:w"), "120")
    tbl_ind.set(qn("w:type"), "dxa")


def paragraph_format(paragraph, after=8, before=0, line=1.25, align=None):
    pf = paragraph.paragraph_format
    pf.space_after = Pt(after)
    pf.space_before = Pt(before)
    pf.line_spacing = line
    if align is not None:
        paragraph.alignment = align


def add_run(paragraph, text, bold=False, color=None, size=None):
    run = paragraph.add_run(text)
    run.bold = bold
    if color:
        run.font.color.rgb = RGBColor.from_string(color)
    if size:
        run.font.size = Pt(size)
    return run


def add_body(doc, text, bold_label=None):
    p = doc.add_paragraph()
    paragraph_format(p)
    if bold_label:
        add_run(p, bold_label + " ", bold=True, color=DARK_BLUE)
    add_run(p, text)
    return p


def add_bullet(doc, text, level=0):
    p = doc.add_paragraph(style="List Bullet")
    paragraph_format(p, after=4, line=1.208)
    p.paragraph_format.left_indent = Inches(0.375 + (0.25 * level))
    p.paragraph_format.first_line_indent = Inches(-0.194)
    add_run(p, text)
    return p


def add_number(doc, text):
    p = doc.add_paragraph(style="List Number")
    paragraph_format(p, after=4, line=1.208)
    p.paragraph_format.left_indent = Inches(0.375)
    p.paragraph_format.first_line_indent = Inches(-0.194)
    add_run(p, text)
    return p


def add_heading(doc, text, level=1):
    p = doc.add_heading(text, level=level)
    if level == 1:
        paragraph_format(p, before=16, after=8, line=1.25)
    elif level == 2:
        paragraph_format(p, before=12, after=6, line=1.25)
    else:
        paragraph_format(p, before=8, after=4, line=1.25)
    return p


def add_callout(doc, title, body):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_grid(table, [9360])
    set_table_borders(table, color=MID_GRAY, size="4")
    cell = table.cell(0, 0)
    set_cell_shading(cell, LIGHT_GRAY)
    set_cell_margins(cell, top=120, bottom=120, start=160, end=160)
    p = cell.paragraphs[0]
    paragraph_format(p, after=4, line=1.25)
    add_run(p, title, bold=True, color=DARK_BLUE)
    p2 = cell.add_paragraph()
    paragraph_format(p2, after=0, line=1.25)
    add_run(p2, body)
    doc.add_paragraph()


def add_table(doc, headers, rows, widths):
    table = doc.add_table(rows=1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.allow_autofit = False
    set_table_grid(table, widths)
    set_table_borders(table)
    hdr = table.rows[0].cells
    for i, header in enumerate(headers):
        set_cell_width(hdr[i], widths[i])
        set_cell_shading(hdr[i], LIGHT_BLUE)
        set_cell_margins(hdr[i])
        hdr[i].vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        p = hdr[i].paragraphs[0]
        paragraph_format(p, after=0, line=1.15)
        add_run(p, header, bold=True, color=DARK_BLUE)
    for row in rows:
        cells = table.add_row().cells
        for i, value in enumerate(row):
            set_cell_width(cells[i], widths[i])
            set_cell_margins(cells[i])
            cells[i].vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            p = cells[i].paragraphs[0]
            paragraph_format(p, after=0, line=1.15)
            add_run(p, value)
    doc.add_paragraph()
    return table


def setup_styles(doc):
    section = doc.sections[0]
    section.page_width = Inches(8.5)
    section.page_height = Inches(11)
    section.top_margin = Inches(1)
    section.bottom_margin = Inches(1)
    section.left_margin = Inches(1)
    section.right_margin = Inches(1)
    section.header_distance = Inches(0.492)
    section.footer_distance = Inches(0.492)

    normal = doc.styles["Normal"]
    normal.font.name = "Calibri"
    normal._element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")
    normal.font.size = Pt(11)
    normal.paragraph_format.space_after = Pt(8)
    normal.paragraph_format.line_spacing = 1.333

    for style_name, size, color in [
        ("Heading 1", 16, BLUE),
        ("Heading 2", 13, BLUE),
        ("Heading 3", 12, DARK_BLUE),
    ]:
        style = doc.styles[style_name]
        style.font.name = "Calibri"
        style._element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")
        style.font.size = Pt(size)
        style.font.color.rgb = RGBColor.from_string(color)
        style.font.bold = True


def build():
    doc = Document()
    setup_styles(doc)

    # Header and footer
    header_p = doc.sections[0].header.paragraphs[0]
    paragraph_format(header_p, after=0, line=1)
    add_run(header_p, "MOOTS x KIJB 2026 | Analisis Penguatan Inovasi", color=DARK_BLUE, size=9)
    footer_p = doc.sections[0].footer.paragraphs[0]
    paragraph_format(footer_p, after=0, line=1)
    footer_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_run(footer_p, "Disusun sebagai bahan analisis dan pengembangan proposal, bukan proposal final.", size=9)

    title = doc.add_paragraph()
    paragraph_format(title, after=6, line=1.1)
    add_run(title, "Analisis Penguatan Inovasi MOOTS untuk KIJB 2026", bold=True, color=DARK_BLUE, size=22)
    subtitle = doc.add_paragraph()
    paragraph_format(subtitle, after=14, line=1.25)
    add_run(subtitle, "Fokus kategori Kepemudaan, Olahraga dan Lingkungan Hidup - Subtopik Penumbuhan Wirausahawan Muda", color=BLUE, size=12)

    add_callout(
        doc,
        "Arah utama",
        "MOOTS perlu diposisikan sebagai ekosistem digital pembentukan wirausahawan muda: dari pencarian tim, validasi ide, pembagian peran, mentoring, inkubasi, hingga bukti dampak usaha. Dengan begitu, MOOTS tidak berhenti sebagai aplikasi pencari partner, tetapi menjadi kanal yang mengubah ide mahasiswa menjadi proyek rintisan yang terukur."
    )

    add_heading(doc, "1. Ringkasan Konteks", 1)
    add_body(doc, "MOOTS adalah platform kolaborasi kampus berbasis skill-matching untuk membantu mahasiswa menemukan co-founder, anggota tim, mentor, dan kolaborator proyek atau startup. Inti layanannya adalah profil kompetensi, discovery kandidat, mutual match, chat real-time, project board, dan AI assistant untuk rekomendasi rekan, analisis skill-fit, serta ide peran. Dalam konteks Telkom University, MOOTS menjawab masalah umum mahasiswa yang memiliki ide bisnis atau proyek tetapi kesulitan menemukan komposisi tim yang tepat.")
    add_body(doc, "Relevansi MOOTS dengan penumbuhan wirausahawan muda di Jawa Barat terletak pada kemampuannya membangun jalur awal kewirausahaan: mahasiswa bertemu tim, memvalidasi ide, membagi peran, membangun prototipe, lalu mengembangkan proyek menjadi usaha rintisan. Jika diperluas lintas kampus dan dihubungkan dengan mentor, inkubator, komunitas bisnis, serta data dampak, MOOTS dapat menjadi infrastruktur digital bagi ekosistem pemuda produktif di Jawa Barat.")

    add_heading(doc, "2. Analisis Fit", 1)
    add_body(doc, "MOOTS sudah memiliki kecocokan kuat dengan subtopik Penumbuhan Wirausahawan Muda karena masalah yang diatasi berada di fase paling awal kewirausahaan: pembentukan tim, pencarian skill komplementer, dan aktivasi ide menjadi proyek. Pada KIJB, nilai inovasi tidak cukup berhenti pada gagasan; tagline from Ideas to Impact menuntut bukti bahwa ide tersebut diimplementasikan dan menghasilkan manfaat nyata. MOOTS cocok dengan arah ini karena desainnya memang menghubungkan ide, orang, proyek, komunikasi, dan asistensi AI dalam satu siklus.")
    add_table(
        doc,
        ["Aspek KIJB", "Kesesuaian MOOTS", "Penguatan yang Perlu Ditonjolkan"],
        [
            ["Kebaruan", "Skill-based discovery dan mutual match untuk kolaborasi kampus.", "Tekankan perbedaan dengan grup chat, forum biasa, atau database mahasiswa pasif."],
            ["Manfaat", "Mempercepat pembentukan tim proyek, startup, kompetisi, dan riset.", "Ukur manfaat dengan waktu pembentukan tim, jumlah match, dan proyek yang berjalan."],
            ["Kolaborasi", "Fitur match, chat, project board, dan AI assistant mendorong kerja tim.", "Tambahkan peran mentor, inkubator, dosen pembina, komunitas startup, dan mitra daerah."],
            ["Integrasi", "Profil, skill, match, percakapan, proyek, dan AI berada dalam satu platform.", "Tunjukkan alur terpadu dari ide sampai output usaha/prototipe."],
            ["Replikasi", "Model dapat diterapkan lintas fakultas, kampus, sekolah vokasi, dan komunitas pemuda.", "Buat paket replikasi: template onboarding, dashboard indikator, SOP, dan modul mentoring."],
            ["Keberlanjutan", "Platform digital dapat dikembangkan bertahap dan memiliki model komunitas.", "Jelaskan skema operasional: admin kampus, mentor, program batch, sponsor, atau kemitraan inkubator."],
        ],
        [1800, 3700, 3860],
    )
    add_body(doc, "Aspek paling kuat dari MOOTS adalah integrasi. Banyak program kewirausahaan muda berhenti pada pelatihan atau kompetisi ide, sementara masalah lanjutan peserta adalah kehilangan tim, kurang akses mentor, atau tidak punya ruang tindak lanjut. MOOTS dapat mengisi ruang tersebut sebagai lapisan digital yang menjaga keberlanjutan kolaborasi setelah workshop, kelas, atau program inkubasi selesai.")

    add_heading(doc, "3. Analisis Gap", 1)
    add_body(doc, "Gap utama MOOTS bukan pada konsep, tetapi pada pembuktian implementasi, dampak, dan keterhubungan eksplisit dengan agenda daerah. Panduan KIJB menekankan bahwa inovasi harus selaras tema, relevan kategori, telah diimplementasikan sekurang-kurangnya sejak 31 Desember 2025, memiliki bukti pendukung, video maksimal lima menit, dan dapat dipertanggungjawabkan secara administratif maupun substantif.")
    add_table(
        doc,
        ["Area Gap", "Risiko Penilaian", "Tindakan Perbaikan"],
        [
            ["Implementasi minimal", "Jika MOOTS belum berjalan sebelum 31 Desember 2025, statusnya bisa dianggap belum memenuhi syarat implementasi.", "Siapkan kronologi pengembangan, bukti uji coba, pilot internal, log pengguna, atau nyatakan secara jujur sebagai pengembangan lanjutan dari kegiatan yang sudah berjalan bila ada dasarnya."],
            ["Data dampak", "Proposal dapat terlihat konseptual tanpa outcome.", "Kumpulkan data pengguna, match, proyek, tim terbentuk, sesi chat/proyek aktif, dan testimoni."],
            ["Bukti penerima manfaat", "Manfaat sulit diverifikasi.", "Buat daftar penerima manfaat anonim/terbatas, dokumentasi kegiatan, screenshot fitur, dan cerita pengguna."],
            ["Video 5 substansi", "Video tidak lolos substansi jika hanya demo aplikasi.", "Susun video: latar belakang, penjaringan ide, pemilihan ide, manfaat, dampak."],
            ["Indikator keberhasilan", "Juri sulit menilai capaian.", "Gunakan indikator kuantitatif dan kualitatif dengan baseline, target, dan realisasi."],
            ["Replikasi", "Terlihat hanya cocok untuk Telkom University.", "Tulis model replikasi lintas kampus/sekolah vokasi/komunitas pemuda di Jawa Barat."],
            ["Keterkaitan daerah", "Terlihat sebagai produk internal kampus, bukan inovasi berdampak daerah.", "Hubungkan dengan isu pengangguran muda, ekonomi kreatif, UMKM digital, startup mahasiswa, dan peningkatan daya saing Jawa Barat."],
            ["Risiko AI-generated", "Panduan menyebut pemeriksaan proposal bukan hasil generative text AI.", "Gunakan data nyata, gaya tim sendiri, pengalaman lapangan, foto, dokumen, dan kalimat yang spesifik."],
        ],
        [1900, 2900, 4560],
    )

    add_heading(doc, "4. Rekomendasi Penguatan Inovasi", 1)
    recommendations = [
        ("Startup Team Builder", "Tambahkan mode khusus pembentukan tim startup. Pengguna memilih ide, kebutuhan peran, tahap proyek, target pasar, dan komitmen waktu. Fitur ini langsung relevan dengan penumbuhan wirausahawan muda karena mengubah pencarian partner menjadi proses pembentukan unit usaha rintisan."),
        ("Idea Validation Sprint", "Sediakan modul validasi ide 7-14 hari berisi kanvas masalah, segmentasi pengguna, hipotesis solusi, eksperimen sederhana, dan hasil wawancara calon pengguna. Ini memperkuat aspek from Ideas to Impact karena ada metode pembaharuan dan bukti sebelum-sesudah."),
        ("Mentor Match", "Perluas skill-matching dari sesama mahasiswa ke mentor dosen, alumni founder, praktisi UMKM, inkubator kampus, dan komunitas startup. Ini menjawab aspek kolaborasi pemangku kepentingan dan keberlanjutan."),
        ("Founder Readiness Score", "Buat skor kesiapan founder berbasis kelengkapan tim, validasi pasar, prototipe, aktivitas proyek, dan komitmen anggota. Skor ini dapat menjadi indikator kuantitatif yang mudah dipahami juri."),
        ("Project-to-Business Pipeline", "Tambahkan tahapan proyek: ide, tim terbentuk, validasi, prototype, pilot customer, omzet awal, inkubasi, dan pendanaan. Ini membantu MOOTS terlihat sebagai ekosistem pembentukan wirausahawan, bukan sekadar aplikasi sosial."),
        ("Dashboard Dampak Wirausaha Muda", "Bangun dashboard admin yang menampilkan jumlah pengguna, match, tim startup, proyek aktif, mentor terlibat, ide tervalidasi, dan output usaha. Dashboard menjadi bukti kuat untuk manfaat dan hasil inovasi."),
        ("MOOTS Batch Program", "Jalankan program periodik, misalnya MOOTS Startup Matchmaking Batch 1, dengan kurikulum singkat dan target tim terbentuk. Program ini memberi bentuk implementasi nyata yang bisa didokumentasikan."),
        ("Paket Replikasi Kampus/Sekolah", "Siapkan SOP replikasi untuk kampus, SMK, komunitas pemuda, atau dinas terkait: onboarding, role admin, indikator, template kegiatan, dan mekanisme monitoring. Ini langsung menjawab kriteria dapat direplikasi."),
        ("Marketplace Kolaborasi UMKM", "Hubungkan mahasiswa dengan UMKM lokal yang membutuhkan digitalisasi, desain, pemasaran, atau sistem informasi. Mahasiswa mendapat proyek bisnis nyata, UMKM mendapat solusi, dan dampak daerah lebih terasa."),
        ("Portfolio dan Trust Layer", "Perkuat profil dengan portofolio, pengalaman, verifikasi kampus, rekomendasi mentor, dan rekam kontribusi proyek. Ini meningkatkan kualitas match dan mengurangi risiko tim tidak berlanjut."),
    ]
    for title_text, body in recommendations:
        add_bullet(doc, f"{title_text}: {body}")

    add_heading(doc, "5. Positioning Proposal", 1)
    add_callout(
        doc,
        "Positioning yang disarankan",
        "MOOTS adalah ekosistem digital pembentukan wirausahawan muda Jawa Barat yang menghubungkan mahasiswa, pelajar, mentor, komunitas, dan mitra usaha melalui pencocokan keahlian, pembentukan tim, validasi ide, pendampingan, dan pengukuran dampak proyek rintisan."
    )
    add_body(doc, "Narasi utama yang perlu dibangun adalah bahwa banyak ide bisnis muda gagal bukan karena idenya buruk, tetapi karena tidak memiliki tim yang tepat, akses mentor, pembagian peran, validasi pasar, dan jalur tindak lanjut. MOOTS menjawab masalah tersebut dengan sistem yang terstruktur: mengenali potensi individu, mempertemukan skill komplementer, memfasilitasi komunikasi, mengelola proyek, dan membantu pengambilan keputusan melalui AI assistant.")
    add_body(doc, "Dengan positioning ini, MOOTS tidak terlihat sebagai aplikasi pencari teman tim, melainkan sebagai infrastruktur penggerak kewirausahaan muda. Bahasa proposal sebaiknya memakai kata kunci: pembentukan tim startup, validasi ide, kolaborasi lintas kampus, ekosistem mentor, pipeline proyek rintisan, dampak ekonomi muda, dan replikasi daerah.")

    add_heading(doc, "6. Usulan Judul Inovasi", 1)
    titles = [
        "MOOTS: Ekosistem Digital Pembentukan Wirausahawan Muda Berbasis Skill-Matching",
        "MOOTS Startup Matchmaking: Platform Kolaborasi Pemuda untuk Mengubah Ide Menjadi Usaha",
        "MOOTS Founder Hub: Inovasi Pencocokan Talenta dan Ide Bisnis Mahasiswa Jawa Barat",
        "MOOTS Entrepreneurial Match: Sistem Pembentukan Tim Startup Muda Berbasis Kompetensi",
        "MOOTS Impact Pipeline: Dari Ide Mahasiswa Menuju Startup Berdampak",
        "MOOTS Kolaborasi Muda: Platform Digital Penumbuhan Wirausahawan Berbasis Kampus",
        "MOOTS Wirausaha Muda: Integrasi Skill, Tim, Mentor, dan Proyek Rintisan",
        "MOOTS Campus Founder Network: Jejaring Digital Pembentuk Startup Mahasiswa",
        "MOOTS Venture Match: Inovasi Kolaborasi Lintas Kampus untuk Wirausaha Muda",
        "MOOTS Idea-to-Impact Hub: Platform Penumbuhan Wirausahawan Muda Jawa Barat",
    ]
    for t in titles:
        add_number(doc, t)

    add_heading(doc, "7. Kerangka Proposal KIJB", 1)
    proposal_rows = [
        ["Deskripsi inovasi", "Jelaskan MOOTS sebagai platform digital yang mengintegrasikan profil skill, match, chat, project board, mentor, dan AI assistant untuk membentuk tim wirausaha muda.", "Masalah utama: ide bisnis mahasiswa tidak berlanjut karena sulit menemukan tim, mentor, dan jalur eksekusi."],
        ["Ide inovatif", "Tekankan kebaruan berupa skill-matching dan pipeline ide-ke-usaha dalam satu platform.", "Bandingkan kondisi sebelum MOOTS: pencarian manual lewat grup, relasi terbatas, tim tidak terstruktur."],
        ["Signifikansi/metode pembaharuan", "Uraikan alur implementasi: onboarding, pemetaan skill, match, diskusi, proyek, validasi, mentoring, dashboard dampak.", "Gunakan before-after dan bukti penggunaan platform."],
        ["Kontribusi isu strategis", "Hubungkan dengan kepemudaan, kewirausahaan, ekonomi kreatif, pengurangan mismatch skill, dan daya saing talenta Jawa Barat.", "Masukkan kaitan SDGs pekerjaan layak dan pertumbuhan ekonomi bila relevan."],
        ["Adaptabilitas dan keberlanjutan", "Jelaskan model replikasi ke kampus, SMK, komunitas pemuda, inkubator, dan dinas.", "Sertakan SOP, modul batch, dashboard, dan skema operasional."],
        ["Kolaborasi pemangku kepentingan", "Peta peran mahasiswa, dosen, alumni, inkubator, komunitas startup, UMKM, dan pemerintah daerah.", "Tunjukkan kontribusi tiap pihak dalam desain, implementasi, evaluasi, dan keberlanjutan."],
        ["Integrasi", "Jelaskan integrasi profil, skill, match, chat, project board, AI assistant, dan dashboard dampak.", "Tekankan satu siklus berkelanjutan dari ide, tim, validasi, hingga output."],
        ["Tujuan", "Tuliskan target terukur: mempercepat pembentukan tim startup, meningkatkan ide tervalidasi, dan memperluas akses mentor.", "Pisahkan tujuan jangka pendek, menengah, dan panjang."],
        ["Manfaat", "Manfaat untuk mahasiswa, kampus, mentor, UMKM, dan daerah.", "Gunakan data penerima manfaat dan testimoni."],
        ["Hasil inovasi", "Output kuantitatif: platform, jumlah pengguna, match, tim, proyek, mentor, ide tervalidasi, dan startup/prototipe.", "Lampirkan screenshot, video, laporan, dan dashboard."],
    ]
    add_table(doc, ["Aspek", "Arah Isi", "Catatan Penguatan"], proposal_rows, [1800, 3860, 3700])

    add_heading(doc, "8. Indikator Dampak", 1)
    add_body(doc, "Indikator perlu dibuat sebagai kombinasi antara output, outcome, dan bukti kualitas proses. Gunakan baseline, target, dan realisasi agar juri dapat melihat perubahan yang terjadi setelah MOOTS diimplementasikan.")
    add_table(
        doc,
        ["Jenis Indikator", "Contoh Ukuran", "Cara Pembuktian"],
        [
            ["Kuantitatif - pengguna", "Jumlah pengguna aktif, mahasiswa terverifikasi, program studi/fakultas terlibat.", "Dashboard aplikasi, export data, screenshot analytics."],
            ["Kuantitatif - match", "Jumlah match, rasio match terhadap swipe/interest, jumlah chat aktif setelah match.", "Log sistem, tabel ringkasan bulanan."],
            ["Kuantitatif - tim startup", "Jumlah tim terbentuk, jumlah tim lintas program studi, jumlah tim yang bertahan lebih dari 30/60/90 hari.", "Data project board, daftar tim, bukti aktivitas."],
            ["Kuantitatif - proyek bisnis", "Jumlah proyek aktif, prototype dibuat, pilot customer, pitch deck, MVP, atau usaha berjalan.", "Dokumentasi proyek, link demo, laporan milestone."],
            ["Kuantitatif - mentor", "Jumlah mentor, sesi mentoring, rekomendasi mentor yang ditindaklanjuti.", "Absensi, notulen, jadwal mentoring, testimoni."],
            ["Kuantitatif - ekonomi", "Potensi omzet, transaksi awal, pendanaan, sponsorship, atau efisiensi biaya pembentukan tim.", "Laporan keuangan sederhana, bukti invoice/LoI, survei."],
            ["Kualitatif - pengalaman pengguna", "Kemudahan menemukan tim, rasa percaya, kualitas kolaborasi, kejelasan peran.", "Survei, wawancara, testimoni video."],
            ["Kualitatif - perubahan perilaku", "Mahasiswa lebih aktif membuat proyek, mengikuti inkubasi, dan mencari pasar.", "Cerita dampak, dokumentasi kegiatan, observasi mentor."],
            ["Replikasi", "Jumlah unit/kampus/komunitas yang berminat atau menguji coba MOOTS.", "MoU, surat dukungan, laporan pilot, dokumentasi sosialisasi."],
        ],
        [2100, 4060, 3200],
    )

    add_heading(doc, "9. Rekomendasi Bukti Pendukung", 1)
    evidence = [
        "Dokumen kronologi pengembangan dan implementasi MOOTS, termasuk tanggal uji coba, rilis fitur, dan milestone.",
        "Screenshot fitur utama: onboarding, profil skill, discovery, match, chat, project board, AI assistant, dan dashboard.",
        "Data ringkasan pengguna, match, proyek, tim terbentuk, dan aktivitas platform.",
        "Daftar penerima manfaat yang aman secara privasi, misalnya nama inisial, program studi, peran, dan manfaat yang dirasakan.",
        "Testimoni mahasiswa, calon founder, mentor, dosen pembina, atau komunitas yang pernah menggunakan/menguji MOOTS.",
        "Dokumentasi kegiatan: foto, notulen, daftar hadir, materi sosialisasi, workshop, atau program batch.",
        "Surat keterangan penggagas inovasi dan surat dukungan dari kampus/unit terkait bila memungkinkan.",
        "SOP pelaksanaan MOOTS: alur onboarding, matching, pembentukan proyek, mentoring, evaluasi, dan perlindungan data.",
        "Laporan manfaat dan dampak, termasuk before-after cara pembentukan tim sebelum dan sesudah MOOTS.",
        "Video maksimal lima menit yang memuat latar belakang inovasi, penjaringan ide, pemilihan ide, manfaat inovasi, dan dampak inovasi.",
        "Dokumen rencana replikasi untuk kampus lain, SMK, komunitas pemuda, inkubator, atau mitra daerah.",
        "Dokumen keamanan dan privasi data, terutama karena MOOTS mengelola profil, chat, dan informasi pengguna.",
    ]
    for item in evidence:
        add_bullet(doc, item)

    add_heading(doc, "10. Catatan Risiko", 1)
    add_body(doc, "Risiko pertama adalah proposal terlihat terlalu generik. Jika narasi hanya berbicara tentang platform, AI, match, atau kolaborasi tanpa data lapangan, juri dapat menilai MOOTS sebagai ide aplikasi biasa. Untuk menghindarinya, setiap klaim harus dikaitkan dengan bukti: siapa pengguna awalnya, masalah apa yang mereka alami, fitur apa yang dipakai, perubahan apa yang terjadi, dan indikator apa yang meningkat.")
    add_body(doc, "Risiko kedua adalah proposal terlalu terlihat seperti hasil AI. Panduan KIJB menyebut adanya pemeriksaan agar proposal bukan hasil generative text kecerdasan buatan. Karena itu, gunakan AI hanya sebagai alat bantu struktur dan perbaikan bahasa, bukan sebagai suara utama proposal. Masukkan pengalaman tim, foto kegiatan, kutipan testimoni asli, data internal, kendala pengembangan, keputusan desain, dan pembelajaran lapangan.")
    add_body(doc, "Risiko ketiga adalah ketidaksesuaian administratif, terutama terkait tanggal implementasi minimal 31 Desember 2025. Jika belum memenuhi syarat ini, jangan memaksa klaim. Lebih baik menyiapkan bukti pengembangan/pilot yang benar atau mengevaluasi kategori, tahun pengajuan, dan strategi narasi agar tidak bermasalah saat seleksi administrasi.")
    add_body(doc, "Risiko keempat adalah MOOTS dipersepsikan hanya bermanfaat untuk Telkom University. Proposal perlu menyatakan jalur replikasi yang realistis ke kampus lain, sekolah vokasi, komunitas pemuda, dan program inkubasi. Dengan demikian, MOOTS terlihat sebagai model yang dapat diadaptasi oleh ekosistem Jawa Barat, bukan sekadar proyek internal.")

    add_heading(doc, "Kesimpulan Arah", 1)
    add_body(doc, "Arah paling kuat untuk MOOTS adalah menjadikannya platform penumbuhan wirausahawan muda berbasis kolaborasi kompetensi. Fokus proposal sebaiknya bukan pada teknologi semata, tetapi pada perubahan yang dihasilkan: ide yang mendapat tim, tim yang mendapat mentor, proyek yang tervalidasi, dan usaha muda yang mulai berjalan. Untuk KIJB 2026, kekuatan MOOTS akan sangat ditentukan oleh bukti implementasi, indikator dampak, narasi replikasi, dan kesesuaian eksplisit dengan subtopik Penumbuhan Wirausahawan Muda.")

    doc.save(DOCX_OUT)


if __name__ == "__main__":
    build()
