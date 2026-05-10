import { useLanguage } from "../context/LanguageContext";

function IncidentForm({
    form,
    setForm,
    createIncident,
    onClose
  }) {
    const { t } = useLanguage();

    return (
      <div className="fixed inset-0 md:inset-auto md:top-20 md:left-5 flex items-center justify-center md:items-start md:justify-start z-[9999] pointer-events-none p-4">
        <div className="bg-zinc-900 text-white p-6 rounded-3xl w-full max-w-[400px] md:w-[350px] shadow-2xl pointer-events-auto border border-zinc-800 animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">
              {t.report_incident}
            </h1>
            <button 
                onClick={onClose}
                className="md:hidden text-zinc-500 hover:text-white transition"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
          </div>
  
        <input
          type="text"
          value={form.title || ""}
          placeholder={t.title_placeholder}
          className="w-full p-3 rounded-xl bg-zinc-800 mb-3 border border-zinc-700 focus:border-red-500 transition-colors outline-none text-sm"
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
        />
  
        <textarea
          value={form.description || ""}
          placeholder={t.desc_placeholder}
          className="w-full p-3 rounded-xl bg-zinc-800 mb-3 border border-zinc-700 focus:border-red-500 transition-colors outline-none text-sm min-h-[80px]"
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />
  
        <div className="flex flex-col gap-2 mb-3">
            <select
            className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-sm outline-none"
            value={form.type}
            onChange={(e) =>
                setForm({
                ...form,
                type: e.target.value,
                })
            }
            >
              {Object.keys(t.types).map((type) => (
                <option key={type} value={type}>
                  {t.types[type]}
                </option>
              ))}
            </select>
    
            <select
            className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-sm outline-none"
            value={form.severity}
            onChange={(e) =>
                setForm({
                ...form,
                severity: e.target.value,
                })
            }
            >
              <option value="low">{t.severity.low}</option>
              <option value="medium">{t.severity.medium}</option>
              <option value="high">{t.severity.high}</option>
            </select>
        </div>
  
        <button
          onClick={createIncident}
          disabled={form.submitting}
          className={`w-full p-4 rounded-xl font-bold transition shadow-lg ${
            form.submitting 
            ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' 
            : 'bg-red-500 text-white hover:bg-red-600 active:scale-95'
          }`}
        >
          {form.submitting ? t.reporting : t.submit_report}
        </button>
        </div>
      </div>
    );
  }
  
  export default IncidentForm;