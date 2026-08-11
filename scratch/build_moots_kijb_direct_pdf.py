from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


PDF_OUT = r"D:\Main Project\Telkom\Hadid\Mutualizm-BE\outputs\Analisis_Penguatan_MOOTS_KIJB_2026.pdf"


BLUE = colors.HexColor("#2E74B5")
DARK_BLUE = colors.HexColor("#1F4D78")
LIGHT_BLUE = colors.HexColor("#E8EEF5")
LIGHT_GRAY = colors.HexColor("#F4F6F9")
GRID = colors.HexColor("#B7C4D3")
INK = colors.HexColor("#1F2933")


def p(text):
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def make_styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "TitleCustom",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=21,
            leading=25,
            textColor=DARK_BLUE,
            alignment=TA_LEFT,
            spaceAfter=7,
        ),
        "subtitle": ParagraphStyle(
            "SubtitleCustom",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10.5,
            leading=14,
            textColor=BLUE,
            spaceAfter=15,
        ),
        "h1": ParagraphStyle(
            "H1Custom",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=14.5,
            leading=18,
            textColor=BLUE,
            spaceBefore=14,
            spaceAfter=7,
        ),
        "h2": ParagraphStyle(
            "H2Custom",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=11.5,
            leading=15,
            textColor=DARK_BLUE,
            spaceBefore=9,
            spaceAfter=5,
        ),
        "body": ParagraphStyle(
            "BodyCustom",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=13.2,
            textColor=INK,
            alignment=TA_JUSTIFY,
            spaceAfter=7,
        ),
        "body_left": ParagraphStyle(
            "BodyLeft",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=13.2,
            textColor=INK,
            alignment=TA_LEFT,
            spaceAfter=7,
        ),
        "bullet": ParagraphStyle(
            "BulletCustom",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.2,
            leading=12.5,
            textColor=INK,
            alignment=TA_LEFT,
            leftIndent=13,
            firstLineIndent=0,
            spaceAfter=3,
        ),
        "table": ParagraphStyle(
            "TableText",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8,
            leading=10.2,
            textColor=INK,
            alignment=TA_LEFT,
        ),
        "table_header": ParagraphStyle(
            "TableHeader",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=8.2,
            leading=10.5,
            textColor=DARK_BLUE,
            alignment=TA_LEFT,
        ),
        "callout_title": ParagraphStyle(
            "CalloutTitle",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=9.5,
            leading=12.5,
            textColor=DARK_BLUE,
            spaceAfter=3,
        ),
        "callout": ParagraphStyle(
            "CalloutBody",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.2,
            leading=12.5,
            textColor=INK,
            alignment=TA_JUSTIFY,
        ),
        "footer": ParagraphStyle(
            "Footer",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=7.5,
            leading=9,
            textColor=colors.HexColor("#687385"),
            alignment=TA_CENTER,
        ),
    }


styles = make_styles()


def para(text, style="body"):
    return Paragraph(p(text), styles[style])


def heading(text, level=1):
    return Paragraph(p(text), styles["h1" if level == 1 else "h2"])


def bullet_list(items):
    return ListFlowable(
        [ListItem(para(item, "bullet"), leftIndent=10) for item in items],
        bulletType="bullet",
        start="circle",
        leftIndent=14,
        bulletFontSize=7,
        bulletOffsetY=2,
    )


def numbered_list(items):
    return ListFlowable(
        [ListItem(para(item, "bullet"), leftIndent=12) for item in items],
        bulletType="1",
        leftIndent=18,
        bulletFontSize=8,
    )


def callout(title, body):
    table = Table(
        [[Paragraph(p(title), styles["callout_title"]), Paragraph(p(body), styles["callout"])]],
        colWidths=[1.25 * inch, 5.0 * inch],
        hAlign="LEFT",
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), LIGHT_GRAY),
                ("BOX", (0, 0), (-1, -1), 0.6, GRID),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 9),
                ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return KeepTogether([table, Spacer(1, 8)])


def data_table(headers, rows, widths):
    data = [[Paragraph(p(h), styles["table_header"]) for h in headers]]
    for row in rows:
        data.append([Paragraph(p(cell), styles["table"]) for cell in row])
    table = Table(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), LIGHT_BLUE),
                ("BOX", (0, 0), (-1, -1), 0.45, GRID),
                ("INNERGRID", (0, 0), (-1, -1), 0.35, GRID),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return [table, Spacer(1, 8)]


def page_canvas(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(colors.HexColor("#687385"))
    canvas.drawString(inch, 0.55 * inch, "MOOTS x KIJB 2026 | Analisis Penguatan Inovasi")
    canvas.drawRightString(7.5 * inch, 0.55 * inch, f"Halaman {doc.page}")
    canvas.restoreState()


def build_story():
    story = []
    story.append(Paragraph("Analisis Penguatan Inovasi MOOTS untuk KIJB 2026", styles["title"]))
    story.append(
        Paragraph(
            "Fokus kategori Kepemudaan, Olahraga dan Lingkungan Hidup - Subtopik Penumbuhan Wirausahawan Muda",
            styles["subtitle"],
        )
    )
    story.append(
        callout(
            "Arah utama",
            "MOOTS perlu diposisikan sebagai ekosistem digital pembentukan wirausahawan muda: dari pencarian tim, validasi ide, pembagian peran, mentoring, inkubasi, hingga bukti dampak usaha. Dengan begitu, MOOTS tidak berhenti sebagai aplikasi pencari partner, tetapi menjadi kanal yang mengubah ide mahasiswa menjadi proyek rintisan yang terukur.",
        )
    )

    story.append(heading("1. Ringkasan Konteks"))
    story.append(
        para(
            "MOOTS adalah platform kolaborasi kampus berbasis skill-matching untuk membantu mahasiswa menemukan co-founder, anggota tim, mentor, dan kolaborator proyek atau startup. Inti layanannya adalah profil kompetensi, discovery kandidat, mutual match, chat real-time, project board, dan AI assistant untuk rekomendasi rekan, analisis skill-fit, serta ide peran. Dalam konteks Telkom University, MOOTS menjawab masalah umum mahasiswa yang memiliki ide bisnis atau proyek tetapi kesulitan menemukan komposisi tim yang tepat."
        )
    )
    story.append(
        para(
            "Relevansi MOOTS dengan penumbuhan wirausahawan muda di Jawa Barat terletak pada kemampuannya membangun jalur awal kewirausahaan: mahasiswa bertemu tim, memvalidasi ide, membagi peran, membangun prototipe, lalu mengembangkan proyek menjadi usaha rintisan. Jika diperluas lintas kampus dan dihubungkan dengan mentor, inkubator, komunitas bisnis, serta data dampak, MOOTS dapat menjadi infrastruktur digital bagi ekosistem pemuda produktif di Jawa Barat."
        )
    )

    story.append(heading("2. Analisis Fit"))
    story.append(
        para(
            "MOOTS sudah memiliki kecocokan kuat dengan subtopik Penumbuhan Wirausahawan Muda karena masalah yang diatasi berada di fase paling awal kewirausahaan: pembentukan tim, pencarian skill komplementer, dan aktivasi ide menjadi proyek. Pada KIJB, nilai inovasi tidak cukup berhenti pada gagasan; tagline from Ideas to Impact menuntut bukti bahwa ide tersebut diimplementasikan dan menghasilkan manfaat nyata. MOOTS cocok dengan arah ini karena desainnya menghubungkan ide, orang, proyek, komunikasi, dan asistensi AI dalam satu siklus."
        )
    )
    story += data_table(
        ["Aspek KIJB", "Kesesuaian MOOTS", "Penguatan yang Perlu Ditonjolkan"],
        [
            ["Kebaruan", "Skill-based discovery dan mutual match untuk kolaborasi kampus.", "Tekankan perbedaan dengan grup chat, forum biasa, atau database mahasiswa pasif."],
            ["Manfaat", "Mempercepat pembentukan tim proyek, startup, kompetisi, dan riset.", "Ukur manfaat dengan waktu pembentukan tim, jumlah match, dan proyek yang berjalan."],
            ["Kolaborasi", "Fitur match, chat, project board, dan AI assistant mendorong kerja tim.", "Tambahkan peran mentor, inkubator, dosen pembina, komunitas startup, dan mitra daerah."],
            ["Integrasi", "Profil, skill, match, percakapan, proyek, dan AI berada dalam satu platform.", "Tunjukkan alur terpadu dari ide sampai output usaha/prototipe."],
            ["Replikasi", "Model dapat diterapkan lintas fakultas, kampus, sekolah vokasi, dan komunitas pemuda.", "Buat paket replikasi: template onboarding, dashboard indikator, SOP, dan modul mentoring."],
            ["Keberlanjutan", "Platform digital dapat dikembangkan bertahap dan memiliki model komunitas.", "Jelaskan skema operasional: admin kampus, mentor, program batch, sponsor, atau kemitraan inkubator."],
        ],
        [1.35 * inch, 2.55 * inch, 2.35 * inch],
    )
    story.append(
        para(
            "Aspek paling kuat dari MOOTS adalah integrasi. Banyak program kewirausahaan muda berhenti pada pelatihan atau kompetisi ide, sementara masalah lanjutan peserta adalah kehilangan tim, kurang akses mentor, atau tidak punya ruang tindak lanjut. MOOTS dapat mengisi ruang tersebut sebagai lapisan digital yang menjaga keberlanjutan kolaborasi setelah workshop, kelas, atau program inkubasi selesai."
        )
    )

    story.append(heading("3. Analisis Gap"))
    story.append(
        para(
            "Gap utama MOOTS bukan pada konsep, tetapi pada pembuktian implementasi, dampak, dan keterhubungan eksplisit dengan agenda daerah. Panduan KIJB menekankan bahwa inovasi harus selaras tema, relevan kategori, telah diimplementasikan sekurang-kurangnya sejak 31 Desember 2025, memiliki bukti pendukung, video maksimal lima menit, dan dapat dipertanggungjawabkan secara administratif maupun substantif."
        )
    )
    story += data_table(
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
        [1.35 * inch, 2.0 * inch, 2.9 * inch],
    )

    story.append(heading("4. Rekomendasi Penguatan Inovasi"))
    recommendations = [
        "Startup Team Builder: Tambahkan mode khusus pembentukan tim startup. Pengguna memilih ide, kebutuhan peran, tahap proyek, target pasar, dan komitmen waktu. Fitur ini relevan dengan penumbuhan wirausahawan muda karena mengubah pencarian partner menjadi proses pembentukan unit usaha rintisan.",
        "Idea Validation Sprint: Sediakan modul validasi ide 7-14 hari berisi kanvas masalah, segmentasi pengguna, hipotesis solusi, eksperimen sederhana, dan hasil wawancara calon pengguna. Ini memperkuat aspek from Ideas to Impact karena ada metode pembaharuan dan bukti sebelum-sesudah.",
        "Mentor Match: Perluas skill-matching dari sesama mahasiswa ke mentor dosen, alumni founder, praktisi UMKM, inkubator kampus, dan komunitas startup. Ini menjawab aspek kolaborasi pemangku kepentingan dan keberlanjutan.",
        "Founder Readiness Score: Buat skor kesiapan founder berbasis kelengkapan tim, validasi pasar, prototipe, aktivitas proyek, dan komitmen anggota. Skor ini dapat menjadi indikator kuantitatif yang mudah dipahami juri.",
        "Project-to-Business Pipeline: Tambahkan tahapan proyek: ide, tim terbentuk, validasi, prototype, pilot customer, omzet awal, inkubasi, dan pendanaan. Ini membantu MOOTS terlihat sebagai ekosistem pembentukan wirausahawan, bukan sekadar aplikasi sosial.",
        "Dashboard Dampak Wirausaha Muda: Bangun dashboard admin yang menampilkan jumlah pengguna, match, tim startup, proyek aktif, mentor terlibat, ide tervalidasi, dan output usaha. Dashboard menjadi bukti kuat untuk manfaat dan hasil inovasi.",
        "MOOTS Batch Program: Jalankan program periodik, misalnya MOOTS Startup Matchmaking Batch 1, dengan kurikulum singkat dan target tim terbentuk. Program ini memberi bentuk implementasi nyata yang bisa didokumentasikan.",
        "Paket Replikasi Kampus/Sekolah: Siapkan SOP replikasi untuk kampus, SMK, komunitas pemuda, atau dinas terkait: onboarding, role admin, indikator, template kegiatan, dan mekanisme monitoring. Ini langsung menjawab kriteria dapat direplikasi.",
        "Marketplace Kolaborasi UMKM: Hubungkan mahasiswa dengan UMKM lokal yang membutuhkan digitalisasi, desain, pemasaran, atau sistem informasi. Mahasiswa mendapat proyek bisnis nyata, UMKM mendapat solusi, dan dampak daerah lebih terasa.",
        "Portfolio dan Trust Layer: Perkuat profil dengan portofolio, pengalaman, verifikasi kampus, rekomendasi mentor, dan rekam kontribusi proyek. Ini meningkatkan kualitas match dan mengurangi risiko tim tidak berlanjut.",
    ]
    story.append(bullet_list(recommendations))

    story.append(heading("5. Positioning Proposal"))
    story.append(
        callout(
            "Positioning",
            "MOOTS adalah ekosistem digital pembentukan wirausahawan muda Jawa Barat yang menghubungkan mahasiswa, pelajar, mentor, komunitas, dan mitra usaha melalui pencocokan keahlian, pembentukan tim, validasi ide, pendampingan, dan pengukuran dampak proyek rintisan.",
        )
    )
    story.append(
        para(
            "Narasi utama yang perlu dibangun adalah bahwa banyak ide bisnis muda gagal bukan karena idenya buruk, tetapi karena tidak memiliki tim yang tepat, akses mentor, pembagian peran, validasi pasar, dan jalur tindak lanjut. MOOTS menjawab masalah tersebut dengan sistem yang terstruktur: mengenali potensi individu, mempertemukan skill komplementer, memfasilitasi komunikasi, mengelola proyek, dan membantu pengambilan keputusan melalui AI assistant."
        )
    )
    story.append(
        para(
            "Dengan positioning ini, MOOTS tidak terlihat sebagai aplikasi pencari teman tim, melainkan sebagai infrastruktur penggerak kewirausahaan muda. Bahasa proposal sebaiknya memakai kata kunci: pembentukan tim startup, validasi ide, kolaborasi lintas kampus, ekosistem mentor, pipeline proyek rintisan, dampak ekonomi muda, dan replikasi daerah."
        )
    )

    story.append(heading("6. Usulan Judul Inovasi"))
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
    story.append(numbered_list(titles))

    story.append(PageBreak())
    story.append(heading("7. Kerangka Proposal KIJB"))
    story += data_table(
        ["Aspek", "Arah Isi", "Catatan Penguatan"],
        [
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
        ],
        [1.32 * inch, 2.55 * inch, 2.38 * inch],
    )

    story.append(heading("8. Indikator Dampak"))
    story.append(
        para(
            "Indikator perlu dibuat sebagai kombinasi antara output, outcome, dan bukti kualitas proses. Gunakan baseline, target, dan realisasi agar juri dapat melihat perubahan yang terjadi setelah MOOTS diimplementasikan."
        )
    )
    story += data_table(
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
        [1.45 * inch, 2.85 * inch, 1.95 * inch],
    )

    story.append(heading("9. Rekomendasi Bukti Pendukung"))
    evidence = [
        "Dokumen kronologi pengembangan dan implementasi MOOTS, termasuk tanggal uji coba, rilis fitur, dan milestone.",
        "Screenshot fitur utama: onboarding, profil skill, discovery, match, chat, project board, AI assistant, dan dashboard.",
        "Data ringkasan pengguna, match, proyek, tim terbentuk, dan aktivitas platform.",
        "Daftar penerima manfaat yang aman secara privasi, misalnya nama inisial, program studi, peran, dan manfaat yang dirasakan.",
        "Testimoni mahasiswa, calon founder, mentor, dosen pembina, atau komunitas yang pernah menggunakan atau menguji MOOTS.",
        "Dokumentasi kegiatan: foto, notulen, daftar hadir, materi sosialisasi, workshop, atau program batch.",
        "Surat keterangan penggagas inovasi dan surat dukungan dari kampus/unit terkait bila memungkinkan.",
        "SOP pelaksanaan MOOTS: alur onboarding, matching, pembentukan proyek, mentoring, evaluasi, dan perlindungan data.",
        "Laporan manfaat dan dampak, termasuk before-after cara pembentukan tim sebelum dan sesudah MOOTS.",
        "Video maksimal lima menit yang memuat latar belakang inovasi, penjaringan ide, pemilihan ide, manfaat inovasi, dan dampak inovasi.",
        "Dokumen rencana replikasi untuk kampus lain, SMK, komunitas pemuda, inkubator, atau mitra daerah.",
        "Dokumen keamanan dan privasi data, terutama karena MOOTS mengelola profil, chat, dan informasi pengguna.",
    ]
    story.append(bullet_list(evidence))

    story.append(heading("10. Catatan Risiko"))
    story.append(
        para(
            "Risiko pertama adalah proposal terlihat terlalu generik. Jika narasi hanya berbicara tentang platform, AI, match, atau kolaborasi tanpa data lapangan, juri dapat menilai MOOTS sebagai ide aplikasi biasa. Untuk menghindarinya, setiap klaim harus dikaitkan dengan bukti: siapa pengguna awalnya, masalah apa yang mereka alami, fitur apa yang dipakai, perubahan apa yang terjadi, dan indikator apa yang meningkat."
        )
    )
    story.append(
        para(
            "Risiko kedua adalah proposal terlalu terlihat seperti hasil AI. Panduan KIJB menyebut adanya pemeriksaan agar proposal bukan hasil generative text kecerdasan buatan. Karena itu, gunakan AI hanya sebagai alat bantu struktur dan perbaikan bahasa, bukan sebagai suara utama proposal. Masukkan pengalaman tim, foto kegiatan, kutipan testimoni asli, data internal, kendala pengembangan, keputusan desain, dan pembelajaran lapangan."
        )
    )
    story.append(
        para(
            "Risiko ketiga adalah ketidaksesuaian administratif, terutama terkait tanggal implementasi minimal 31 Desember 2025. Jika belum memenuhi syarat ini, jangan memaksa klaim. Lebih baik menyiapkan bukti pengembangan/pilot yang benar atau mengevaluasi kategori, tahun pengajuan, dan strategi narasi agar tidak bermasalah saat seleksi administrasi."
        )
    )
    story.append(
        para(
            "Risiko keempat adalah MOOTS dipersepsikan hanya bermanfaat untuk Telkom University. Proposal perlu menyatakan jalur replikasi yang realistis ke kampus lain, sekolah vokasi, komunitas pemuda, dan program inkubasi. Dengan demikian, MOOTS terlihat sebagai model yang dapat diadaptasi oleh ekosistem Jawa Barat, bukan sekadar proyek internal."
        )
    )

    story.append(heading("Kesimpulan Arah"))
    story.append(
        para(
            "Arah paling kuat untuk MOOTS adalah menjadikannya platform penumbuhan wirausahawan muda berbasis kolaborasi kompetensi. Fokus proposal sebaiknya bukan pada teknologi semata, tetapi pada perubahan yang dihasilkan: ide yang mendapat tim, tim yang mendapat mentor, proyek yang tervalidasi, dan usaha muda yang mulai berjalan. Untuk KIJB 2026, kekuatan MOOTS akan sangat ditentukan oleh bukti implementasi, indikator dampak, narasi replikasi, dan kesesuaian eksplisit dengan subtopik Penumbuhan Wirausahawan Muda."
        )
    )
    return story


def build():
    doc = BaseDocTemplate(
        PDF_OUT,
        pagesize=letter,
        leftMargin=0.85 * inch,
        rightMargin=0.85 * inch,
        topMargin=0.78 * inch,
        bottomMargin=0.78 * inch,
        title="Analisis Penguatan MOOTS untuk KIJB 2026",
        author="Codex",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=page_canvas)])
    doc.build(build_story())


if __name__ == "__main__":
    build()
