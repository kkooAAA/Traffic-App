import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";

function Privacy() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 md:px-20">
      <div className="max-w-3xl mx-auto bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-red-500">{t.privacy_policy}</h1>
          <button 
            onClick={() => navigate(-1)}
            className="text-zinc-500 hover:text-white transition"
          >
            {t.close}
          </button>
        </div>

        <p className="text-zinc-400 mb-10 leading-relaxed">
          {t.privacy_desc}
        </p>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>
              {t.privacy_sections.collection}
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed ml-3.5">
              {t.privacy_sections.collection_desc}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
              {t.privacy_sections.usage}
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed ml-3.5">
              {t.privacy_sections.usage_desc}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-yellow-500 rounded-full"></span>
              {t.privacy_sections.sharing}
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed ml-3.5">
              {t.privacy_sections.sharing_desc}
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 text-center">
          <button 
            onClick={() => navigate("/")}
            className="bg-red-500 px-8 py-3 rounded-xl font-bold hover:bg-red-600 transition"
          >
            {t.home}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Privacy;
