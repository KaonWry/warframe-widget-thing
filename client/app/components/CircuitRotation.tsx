"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface CircuitData {
    week: number
    rewards: string[]
    next_rewards: string[]
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
            <header className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                <div>
                    <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">The Circuit</h2>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Weekly Rotation</p>
                </div>
                {data && (
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Resets in</span>
                        <span className="text-sm font-black text-indigo-500">{formatTimeLeft(data.time_left)}</span>
                    </div>
                )}
            </header>

            <div className="p-8 flex flex-col gap-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-zinc-500 font-bold">Loading rewards...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-sm text-red-500 font-bold mb-4">{error}</p>
                        <button 
                            onClick={() => { setLoading(true); fetchCircuit(); }}
                            className="text-xs font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-xl"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Current Week */}
                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-center">
                               <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Current Rewards</span>
                               <span className="text-xs font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded uppercase">Week {data?.week}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {data?.rewards.map((reward) => (
                                    <div key={reward} className="flex flex-col items-center gap-3 group">
                                        <div className="relative w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 group-hover:border-indigo-500/50 transition-all group-hover:shadow-lg shadow-inner">
                                            <Image 
                                                src={`/circuit/${reward.toLowerCase()}.png`}
                                                alt={reward}
                                                fill
                                                className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                        <span className="text-sm font-black text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-500 transition-colors text-center">
                                            {reward}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Next Week */}
                        <div className="flex flex-col gap-6 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="flex justify-between items-center">
                               <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Upcoming Next Week</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                {data?.next_rewards.map((reward) => (
                                    <div key={`next-${reward}`} className="flex flex-col items-center gap-2 group">
                                        <div className="relative w-16 h-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800/50">
                                            <Image 
                                                src={`/circuit/${reward.toLowerCase()}.png`}
                                                alt={reward}
                                                fill
                                                className="object-contain p-1"
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-zinc-500 dark:text-zinc-500 text-center">
                                            {reward}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
            
            <footer className="p-4 bg-zinc-50 dark:bg-zinc-900/80 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
                <div className="flex justify-between items-center text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    <span>Steel Path Rotation</span>
                    <span className="text-indigo-500/50 text-xs font-black">DUVIRI</span>
                </div>
            </footer>
        </div>
    )
}
