import Link from "next/link";
import { Phone, Mail, Instagram, Send } from "lucide-react";

export default function Footer({ site }) {
  return (
    <footer id="contacts" className="relative mt-16 bg-gradient-to-br from-[#181310] to-[#2C1608] px-5 md:px-7 pt-14 pb-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 relative z-10">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange to-rust flex items-center justify-center font-extrabold text-white">
              P
            </span>
            <span className="font-extrabold text-lg text-white">
              Padel<span className="text-orange2">Hub</span>
            </span>
          </div>
          <p className="text-sm text-cream/70 leading-relaxed max-w-xs">{site?.aboutText}</p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wide">Контакти</h4>
          <div className="flex flex-col gap-2 text-sm text-cream/80">
            <a href={`tel:${site?.contactPhone}`} className="flex items-center gap-2 hover:text-orange2">
              <Phone size={15} /> {site?.contactPhone}
            </a>
            <a href={`mailto:${site?.contactEmail}`} className="flex items-center gap-2 hover:text-orange2">
              <Mail size={15} /> {site?.contactEmail}
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wide">Ми в соцмережах</h4>
          <div className="flex gap-2">
            {site?.instagram && (
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-orange transition-colors"
              >
                <Instagram size={16} />
              </a>
            )}
            {site?.telegram && (
              <a
                href={site.telegram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-orange transition-colors"
              >
                <Send size={16} />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wide">Керування</h4>
          <Link href="/admin" className="text-sm text-cream/60 hover:text-orange2">
            Панель адміністратора →
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-5 border-t border-white/10 text-xs text-cream/40 relative z-10">
        © {new Date().getFullYear()} Padel Hub. Усі права захищені.
      </div>
    </footer>
  );
}
