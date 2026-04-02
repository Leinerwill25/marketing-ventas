'use client';

import React, { useState, useEffect } from 'react';

// Global function to track usage from external components
export function trackUsage(usageObj) {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('ashira-usage-update', { detail: usageObj });
    window.dispatchEvent(event);
  }
}

export default function CostTracker() {
  const [data, setData] = useState({
    budget: 5.00,
    total_spent: 0.000,
    analyses_count: 0,
    history: []
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingBudget, setEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState("5.00");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ashira_cost_v1');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing cost data", e);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('ashira_cost_v1', JSON.stringify(data));
  }, [data]);

  // Listen for usage updates
  useEffect(() => {
    const handleUpdate = (e) => {
      const { input_tokens, output_tokens, total_cost } = e.detail;
      setData(prev => ({
        ...prev,
        total_spent: prev.total_spent + total_cost,
        analyses_count: prev.analyses_count + 1,
        history: [
          { 
            timestamp: new Date().toISOString(), 
            input_tokens, 
            output_tokens, 
            cost: total_cost 
          },
          ...prev.history
        ].slice(0, 3)
      }));
    };

    window.addEventListener('ashira-usage-update', handleUpdate);
    return () => window.removeEventListener('ashira-usage-update', handleUpdate);
  }, []);

  const remaining = Math.max(0, data.budget - data.total_spent);
  const progressPercent = Math.min(100, (data.total_spent / data.budget) * 100);

  const getStatusColor = (val) => {
    if (val > 2) return 'text-green-600';
    if (val > 0.5) return 'text-amber-500';
    return 'text-red-600';
  };

  const getProgressColor = (pct) => {
    if (pct > 85) return 'bg-red-500';
    if (pct > 60) return 'bg-amber-500';
    return 'bg-blue-500';
  };

  const resetData = () => {
    if (confirm("¿Estás seguro de que deseas resetear el contador de gasto e historial?")) {
      setData(prev => ({
        ...prev,
        total_spent: 0,
        analyses_count: 0,
        history: []
      }));
    }
  };

  const saveBudget = () => {
    const b = parseFloat(tempBudget);
    if (!isNaN(b) && b >= 0) {
      setData(prev => ({ ...prev, budget: b }));
      setEditingBudget(false);
    }
  };

  // Mobile View
  const MobileChip = () => (
    <div className="md:hidden fixed bottom-6 right-6 z-50 bg-white border border-gray-200 shadow-xl rounded-full px-4 py-2 flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${remaining > 0.5 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
      <span className="text-xs font-bold text-gray-700">${remaining.toFixed(2)}</span>
    </div>
  );

  return (
    <>
      <MobileChip />
      
      <div 
        className="hidden md:block bg-blue-50/50 border border-blue-100 rounded-2xl p-4 mx-4 mb-4 transition-all hover:bg-blue-50 cursor-pointer overflow-hidden"
        onClick={() => !editingBudget && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Créditos API</span>
          {isExpanded && (
            <button 
              onClick={(e) => { e.stopPropagation(); resetData(); }}
              className="text-[9px] font-bold text-blue-400 hover:text-blue-600"
            >
              RESET
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 text-center mb-3">
          <div>
            <div className="text-sm font-bold text-gray-800">{data.analyses_count}</div>
            <div className="text-[9px] text-gray-500 uppercase">Análisis</div>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-800">${data.total_spent.toFixed(3)}</div>
            <div className="text-[9px] text-gray-500 uppercase">Gastado</div>
          </div>
          <div>
            <div className={`text-sm font-bold ${getStatusColor(remaining)}`}>
              ${remaining.toFixed(2)}
            </div>
            <div className="text-[9px] text-gray-500 uppercase">Restante</div>
          </div>
        </div>

        <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${getProgressColor(progressPercent)}`}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-blue-100 space-y-4 animate-in fade-in slide-in-from-top-2">
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">Presupuesto Inicial</div>
              {editingBudget ? (
                <div className="flex gap-2">
                  <input 
                    autoFocus
                    type="text" 
                    value={tempBudget}
                    onChange={(e) => setTempBudget(e.target.value)}
                    className="w-full bg-white border border-blue-200 rounded-lg px-2 py-1 text-sm font-bold"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button onClick={(e) => { e.stopPropagation(); saveBudget(); }} className="bg-blue-600 text-white px-2 py-1 rounded-lg text-[10px] font-bold">OK</button>
                </div>
              ) : (
                <div 
                  className="text-sm font-bold text-blue-700 flex justify-between items-center"
                  onClick={(e) => { e.stopPropagation(); setEditingBudget(true); setTempBudget(data.budget.toString()); }}
                >
                  ${data.budget.toFixed(2)}
                  <span className="text-[10px] font-normal text-blue-400">Editar</span>
                </div>
              )}
            </div>

            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">Historial (3)</div>
              {data.history.length === 0 ? (
                <div className="text-[10px] italic text-gray-400">Sin actividad reciente</div>
              ) : (
                <div className="space-y-2">
                  {data.history.map((h, i) => (
                    <div key={i} className="flex justify-between items-center bg-white/50 p-2 rounded-lg border border-blue-50">
                      <div className="text-[9px] text-gray-500">
                        {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-[10px] font-bold text-gray-700">
                        ${h.cost.toFixed(4)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
