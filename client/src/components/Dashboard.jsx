function Dashboard({ incidents, deleteIncident }) {
  const currentUserId = localStorage.getItem("userId");

  return (
    <div className="fixed inset-0 md:inset-auto md:top-20 md:right-5 flex items-center justify-center md:items-start md:justify-start z-[9999] pointer-events-none p-4">
      <div className="bg-zinc-900 text-white p-6 rounded-3xl w-full max-w-[400px] md:w-[350px] max-h-[70vh] md:max-h-[80vh] overflow-y-auto shadow-2xl pointer-events-auto border border-zinc-800 scrollbar-hide">
        <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
          Recent Incidents
          <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400">
            {incidents.length}
          </span>
        </h2>

        <div className="space-y-4">
          {incidents.length === 0 ? (
            <p className="text-zinc-500 text-sm italic">No incidents reported yet.</p>
          ) : (
            incidents.map((incident) => {
              const isOwner = incident.user === currentUserId;
              
              return (
                <div 
                  key={incident._id}
                  className={`bg-zinc-800 p-4 rounded-xl border-l-4 hover:bg-zinc-750 transition ${
                    isOwner ? 'ring-1 ring-red-500/50' : ''
                  }`}
                  style={{ borderLeftColor: 
                    incident.severity === 'high' ? '#ef4444' : 
                    incident.severity === 'medium' ? '#f97316' : '#22c55e' 
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <h3 className="font-bold text-sm uppercase truncate">
                        {incident.title}
                      </h3>
                      {isOwner && (
                        <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">
                          YOURS
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => deleteIncident(incident._id)}
                      className="text-zinc-500 hover:text-red-500 transition shrink-0"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2 mb-2">
                  {incident.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500">
                    {new Date(incident.createdAt).toLocaleTimeString()}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-zinc-400">
                    {incident.type}
                  </span>
                </div>
              </div>
            );
          })
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;