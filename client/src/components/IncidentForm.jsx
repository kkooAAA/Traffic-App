function IncidentForm({
    form,
    setForm,
    createIncident,
  }) {
    return (
      <div className="fixed inset-0 md:inset-auto md:top-20 md:left-5 flex items-center justify-center md:items-start md:justify-start z-[9999] pointer-events-none p-4">
        <div className="bg-zinc-900 text-white p-6 rounded-2xl w-full max-w-[400px] md:w-[350px] shadow-2xl pointer-events-auto border border-zinc-800">
          <h1 className="text-2xl font-bold mb-4">
            Report Incident
          </h1>
  
        <input
          type="text"
          placeholder="Title"
          className="w-full p-3 rounded-xl bg-zinc-800 mb-3"
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
        />
  
        <textarea
          placeholder="Description"
          className="w-full p-3 rounded-xl bg-zinc-800 mb-3"
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />
  
        <select
          className="w-full p-3 rounded-xl bg-zinc-800 mb-3"
          onChange={(e) =>
            setForm({
              ...form,
              type: e.target.value,
            })
          }
        >
          <option value="accident">
            Accident
          </option>
  
          <option value="traffic">
            Traffic
          </option>
  
          <option value="flood">
            Flood
          </option>
  
          <option value="roadblock">
            Roadblock
          </option>
        </select>
  
        <select
          className="w-full p-3 rounded-xl bg-zinc-800 mb-3"
          onChange={(e) =>
            setForm({
              ...form,
              severity: e.target.value,
            })
          }
        >
          <option value="low">Low</option>
  
          <option value="medium">
            Medium
          </option>
  
          <option value="high">High</option>
        </select>
  
        <button
          onClick={createIncident}
          disabled={form.submitting}
          className={`w-full p-3 rounded-xl font-bold transition ${
            form.submitting 
            ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' 
            : 'bg-red-500 text-white hover:bg-red-600'
          }`}
        >
          {form.submitting ? 'Submitting...' : 'Submit Incident'}
        </button>
        </div>
      </div>
    );
  }
  
  export default IncidentForm;