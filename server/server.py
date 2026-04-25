import urllib.request
import json
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
import time
from fastapi.middleware.cors import CORSMiddleware
from mappings import (
    region,
    mission_type,
    faction,
    node,
    exclusive_weapons,
    sortie_boss,
    fissure_types,
    circuit,
)

url = "https://api.warframe.com/cdn/worldState.php"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})

# In-memory cache for the data
world_state_cache = {"data": {}}


def fetch_world_state():
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
        world_state_cache["data"] = data
    except Exception as e:
        print(f"Failed to fetch world state: {e}")


async def periodic_world_state_fetcher():
    while True:
        # Run blocking HTTP request in a separate thread
        await asyncio.to_thread(fetch_world_state)
        await asyncio.sleep(1)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start the background task
    task = asyncio.create_task(periodic_world_state_fetcher())
    yield
    # Shutdown: Cancel the background task
    task.cancel()


app = FastAPI(title="Warframe Stuff", lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all origins. Adjust for production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/fissures")
async def get_fissures():
    fissures_raw = world_state_cache.get("data", {}).get("ActiveMissions", [])
    # storms_raw = world_state_cache.get("data", {}).get("VoidStorms", [])
    
    # Sort by tier before parsing
    fissures_raw.sort(key=lambda x: x.get("ActiveMissionTier") or x.get("Modifier") or "")
    
    fissures = []
    for fissure in fissures_raw:
        time_start = (
            int(fissure.get("Activation").get("$date").get("$numberLong")) // 1000
        )
        time_end = int(fissure.get("Expiry").get("$date").get("$numberLong")) // 1000
        time_now = int(time.time())
        open_until = time_end - time_now
        fissures.append(
            {
                "Region": region.get(str(fissure.get("Region", "0")), "Unknown"),
                "Node": node.get(str(fissure.get("Node", "0")), "Unknown"),
                "MissionType": mission_type.get(
                    str(fissure.get("MissionType", "0")), "Unknown"
                ),
                "Type": fissure_types.get(str(fissure.get("Modifier", "0")), "Unknown"),
                "Start": time_start,
                "End": time_end,
                "Duration": open_until,
            }
        )
    # for storm in storms_raw:
    #     time_start = (
    #         int(storm.get("Activation").get("$date").get("$numberLong")) // 1000
    #     )
    #     time_end = int(storm.get("Expiry").get("$date").get("$numberLong")) // 1000
    #     time_now = int(time.time())
    #     open_until = time_end - time_now
    #     fissures.append(
    #         {
    #             "Region": region.get(str(storm.get("Region", "0")), "Unknown"),
    #             "Node": node.get(str(storm.get("Node", "0")), "Unknown"),
    #             "MissionType": "Void Storm",
    #             "Type": storm.get("Modifier", "Unknown"),
    #             "Start": time_start,
    #             "End": time_end,
    #             "Duration": open_until,
    #         }
    #     )
    return fissures


@app.get("/circuit")
async def get_circuit():
    circuit_start_time = 1776038400 # Monday, 20 April 2026 00:00 GMT
    seconds_in_week = 3600 * 24 * 7
    current_time = int(time.time())
    weeks_since_start = (current_time - circuit_start_time) // seconds_in_week
    circuit_index = (weeks_since_start % len(circuit)) + 1
    current_rewards = circuit.get(str(circuit_index), [])
    next_rotation = circuit_start_time + (weeks_since_start + 1) * seconds_in_week
    time_left = next_rotation - current_time
    return {
        "week": circuit_index,
        "rewards": current_rewards,
        "next_rotation": next_rotation,
        "time_left": time_left,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server:app", host="0.0.0.0", port=6969, reload=True)
