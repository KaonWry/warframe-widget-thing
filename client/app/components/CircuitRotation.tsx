"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface CircuitData {
    week: number
    rewards: string[]
    next_rotation: number
    time_left: number
}

export default function CircuitRotation() {
    const [data, setData] = useState<CircuitData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchCircuit = async () => {
        try {
            const response = await fetch("http://localhost:6969/circuit")
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }
            const circuitData = await response.json()
            setData(circuitData)
            setError(null)
        } catch (err) {
            console.error("Failed to fetch circuit:", err)
            setError("Failed to load circuit rotation.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCircuit()
        const interval = setInterval(fetchCircuit, 60000)
        return () => clearInterval(interval)
    }, [])

    const formatTimeLeft = (seconds: number) => {
        const days = Math.floor(seconds / (24 * 3600))
        const hours = Math.floor((seconds % (24 * 3600)) / 3600)
        return `${days}d ${hours}h`
    }

    return (
        <div className="flex flex-col w-full max-w-md border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden shadow-xl self-start">
            <header className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                <div>
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">The Circuit</h2>
                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">Weekly Rotation</p>
                </div>
                {data && (
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase">Resets in</span>
                        <span className="text-xs font-bold text-indigo-500">{formatTimeLeft(data.time_left)}</span>
                    </div>
                )}
            </header>

            <div className="p-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs text-zinc-500 font-medium">Loading rewards...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-10">
                        <p className="text-xs text-red-500 font-bold mb-2">{error}</p>
                        <button 
                            onClick={() => { setLoading(true); fetchCircuit(); }}
                            className="text-[10px] font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                           {/* <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Week {data?.week} Rewards</span> */}
                           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">This Week Reward</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {data?.rewards.map((reward) => (
                                <div key={reward} className="flex flex-col items-center gap-2 group">
                                    <div className="relative w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 group-hover:border-indigo-500/50 transition-colors shadow-inner">
                                        <Image 
                                            src={`/circuit/${reward.toLowerCase()}.png`}
                                            alt={reward}
                                            fill
                                            className="object-contain p-1 group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-indigo-500 transition-colors">
                                        {reward}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
