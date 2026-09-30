import Link from "next/link";

const footerLinks = [
  {
    heading: "Navigasi",
    links: [
      { label: "Beranda", href: "/" },
      { label: "Kategori Lomba", href: "/kategori" },
      { label: "Timeline", href: "/timeline" },
      { label: "Pendaftaran", href: "/daftar" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    heading: "Kontak",
    links: [
      { label: "WhatsApp Panitia", href: "https://wa.me/62", external: true },
      { label: "Email", href: "mailto:datasphere@darmajaya.ac.id", external: true },
      { label: "Instagram", href: "https://instagram.com/", external: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-liquid-deep mt-auto">
      <div className="page-container py-[80px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[48px]">
          {/* Brand Column */}
          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center gap-[10px]">
              {/* Data Orb mark */}
              <div className="relative w-[28px] h-[28px] rounded-full flex-shrink-0">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "var(--gradient-bioluminescent)",
                    opacity: 0.7,
                  }}
                />
                <div className="absolute inset-[3px] rounded-full bg-liquid-deep" />
                <div
                  className="absolute inset-[6px] rounded-full"
                  style={{
                    background: "var(--gradient-bioluminescent)",
                    opacity: 0.5,
                  }}
                />
              </div>
              <span className="text-platinum text-[18px] font-medium tracking-[0.08em] uppercase">
                DATASPHERE
              </span>
            </div>
            <p className="text-silver-mist text-[14px] leading-[1.5] max-w-[280px]">
              Darmajaya High School Data Science Challenge &amp; Capstone Expo
              2026. Diselenggarakan oleh mahasiswa S1 Sains Data IIB Darmajaya.
            </p>
            <p className="text-silver-mist text-[13px] mt-[8px]">
              Jl. Jend. Ahmad Yani No.12, Bandar Lampung
            </p>
          </div>

          {/* Link Columns */}
          {footerLinks.map((group) => (
            <div key={group.heading} className="flex flex-col gap-[16px]">
              <span className="section-label text-liquid-mist">
                {group.heading}
              </span>
              <div className="flex flex-col gap-[12px]">
                {group.links.map((link) =>
                  "external" in link && link.external ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ghost-nav-link text-[14px] normal-case tracking-normal w-fit"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="ghost-nav-link text-[14px] normal-case tracking-normal w-fit"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-[48px] pt-[24px] border-t border-liquid-tide flex flex-col sm:flex-row justify-between items-center gap-[12px]">
          <p className="text-silver-mist text-[13px]">
            © 2026 DATASPHERE — IIB Darmajaya. All rights reserved.
          </p>
          <p className="text-silver-mist text-[13px]">
            Capstone Project — Program Studi S1 Sains Data
          </p>
        </div>
      </div>
    </footer>
  );
}
