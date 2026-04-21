import urllib.request
import json
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
import time
from mappings import (
    region,
    mission_type,
    faction,
    node,
    exclusive_weapons,
    sortie_boss,
    fissure_types,
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


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/fissures")
async def get_fissures():
    fissures_raw = world_state_cache.get("data", {}).get("ActiveMissions", [])
    fissures = []
    for fissure in fissures_raw:
        time_start = int(fissure.get("Activation").get("$date").get("$numberLong"))// 1000
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
    return fissures


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
