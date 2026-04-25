"use client"

import { useEffect, useState } from "react"

interface Fissure {
    Region: string
    Node: string
    MissionType: string
    Type: string
    Start: number
    End: number
    Duration: number
}

export default function FissuresList() {
    const [fissures, setFissures] = useState<Fissure[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchFissures = async () => {
        try {
            const response = await fetch("http://localhost:6969/fissures")
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }
            const data = await response.json()
            setFissures(data)
            setError(null)
        } catch (err) {
            console.error("Failed to fetch fissures:", err)
            setError("Failed to load fissures.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFissures()
        const interval = setInterval(fetchFissures, 60000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex flex-col h-[500px] w-full max-w-md border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden shadow-xl">
            <header className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                <div>
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">Void Fissures</h2>
                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">Active Missions</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-mono text-zinc-400">LIVE</span>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="p-8 flex flex-col items-center justify-center h-full gap-3">
                        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs text-zinc-500 font-medium">Scanning Void...</p>
                    </div>
                ) : error ? (
                    <div className="p-6 text-center h-full flex flex-col items-center justify-center">
                        <p className="text-xs text-red-500 font-bold mb-2">{error}</p>
                        <button 
                            onClick={() => { setLoading(true); fetchFissures(); }}
                            className="text-[10px] font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg"
                        >
                            Retry
                        </button>
                    </div>
                ) : fissures.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 text-xs font-medium h-full flex items-center justify-center">
                        No active fissures detected.
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
                        {fissures.map((fissure, idx) => {
                            const timeLeft = Math.max(0, fissure.End - Math.floor(Date.now() / 1000))
                            const minutes = Math.floor(timeLeft / 60)
                            
                            return (
                                <div key={`${fissure.Node}-${idx}`} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors group">
                                    <div className="flex justify-between items-start mb-1.5">
                                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                                            fissure.Type === 'Lith' ? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' :
                                            fissure.Type === 'Meso' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                            fissure.Type === 'Neo' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                                            fissure.Type === 'Axi' ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                            'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                                        }`}>
                                            {fissure.Type.toUpperCase()}
                                        </span>
                                        <span className={`text-[10px] font-mono font-bold ${
                                            minutes < 10 ? 'text-red-500' : 'text-zinc-400'
                                        }`}>
                                            {minutes}m
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {fissure.MissionType}
                                    </h3>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-[11px] text-zinc-500 dark:text-zinc-500 font-medium">
                                            {fissure.Node}
                                        </p>
                                        <span className="text-[9px] uppercase tracking-tighter text-zinc-400 font-bold">
                                            {fissure.Region}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e4e4e7;
                    border-radius: 10px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #27272a;
                }
            `}</style>
        </div>
    )
}
