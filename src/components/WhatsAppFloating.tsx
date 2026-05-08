import { MessageCircle } from "lucide-react";

const PHONE = "523324339881";
const MESSAGE =
  "Hola Gonzalo estoy interesado en cotizar un evento, capacitación, mentoria o cursos.";

export const WhatsAppFloating = () => {
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Cotizar por WhatsApp"
      className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-medium text-white shadow-[0_10px_30px_-10px_rgba(37,211,102,0.6)] transition-transform hover:scale-105 md:bottom-6 md:right-6"
    >
      <MessageCircle className="h-5 w-5" strokeWidth={2.2} />
      <span className="hidden sm:inline">Cotizar evento</span>
    </a>
  );
};

export default WhatsAppFloating;