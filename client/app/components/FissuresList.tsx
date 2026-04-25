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
        <div className="flex flex-col h-[600px] w-full max-w-md border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden shadow-xl">
            <header className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                <div>
                    <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">Void Fissures</h2>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Active Missions</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-mono font-bold text-zinc-400">LIVE</span>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="p-8 flex flex-col items-center justify-center h-full gap-4">
                        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-zinc-500 font-bold">Scanning Void...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center h-full flex flex-col items-center justify-center">
                        <p className="text-sm text-red-500 font-bold mb-4">{error}</p>
                        <button 
                            onClick={() => { setLoading(true); fetchFissures(); }}
                            className="text-xs font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-xl transition-all active:scale-95"
                        >
                            Retry Connection
                        </button>
                    </div>
                ) : fissures.length === 0 ? (
                    <div className="p-12 text-center text-zinc-500 text-sm font-bold h-full flex items-center justify-center">
                        No active fissures detected.
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
                        {fissures.map((fissure, idx) => {
                            const timeLeft = Math.max(0, fissure.End - Math.floor(Date.now() / 1000))
                            const minutes = Math.floor(timeLeft / 60)
                            
                            return (
                                <div key={`${fissure.Node}-${idx}`} className="p-5 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-xs font-black px-2 py-1 rounded-md ${
                                            fissure.Type === 'Lith' ? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' :
                                            fissure.Type === 'Meso' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                            fissure.Type === 'Neo' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                                            fissure.Type === 'Axi' ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                            'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                                        }`}>
                                            {fissure.Type.toUpperCase()}
                                        </span>
                                        <span className={`text-xs font-mono font-bold ${
                                            minutes < 10 ? 'text-red-500 underline decoration-2 underline-offset-4' : 'text-zinc-400'
                                        }`}>
                                            {minutes}m
                                        </span>
                                    </div>
                                    <h3 className="text-base font-black text-zinc-800 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {fissure.MissionType}
                                    </h3>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-bold">
                                            {fissure.Node}
                                        </p>
                                        <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-black">
                                            {fissure.Region}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
            
            <footer className="p-4 bg-zinc-50 dark:bg-zinc-900/80 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex justify-between items-center text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    <span>Source: WorldState</span>
                    <span>v1.0</span>
                </div>
            </footer>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
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
