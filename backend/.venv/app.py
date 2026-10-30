from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import random

app = FastAPI(title="AI Petri Dish Simulation")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mutation_pool = [
    "traces a hidden pattern",
    "reframes the signal under a new lens",
    "converts noise into structure",
    "mutates toward vivid abstraction",
    "finds a promising contradiction",
    "amplifies the signal with a new heuristic",
]

class Colony(BaseModel):
    id: int
    name: str
    prompt: str
    energy: float = Field(ge=0, le=100)
    mutationRate: float = Field(ge=0, le=1)
    health: float = Field(ge=0, le=100)
    focus: float = Field(ge=0, le=100)

class Environment(BaseModel):
    nutrients: float = Field(ge=0, le=100)
    chaos: float = Field(ge=0, le=100)
    attention: float = Field(ge=0, le=100)
    temperature: float = Field(ge=0, le=100)

class SimulationRequest(BaseModel):
    colonies: list[Colony]
    environment: Environment

def clamp(value: float, low: float = 0, high: float = 100) -> float:
    return max(low, min(high, value))

@app.post("/api/simulate")
def simulate(request: SimulationRequest):
    colonies = []
    log = []

    for colony in request.colonies:
        nutrient_factor = (request.environment.nutrients - 50) * 0.22
        attention_factor = (request.environment.attention - 50) * 0.18
        chaos_factor = (request.environment.chaos - 50) * 0.16
        thermal_factor = (request.environment.temperature - 50) * 0.1
        focus_factor = (colony.focus - 50) * 0.12

        delta_energy = nutrient_factor + attention_factor + focus_factor - chaos_factor
        delta_health = thermal_factor + nutrient_factor * 0.4 + (colony.energy - 50) * 0.08

        updated = Colony(
            id=colony.id,
            name=colony.name,
            prompt=colony.prompt,
            energy=clamp(colony.energy + delta_energy),
            mutationRate=colony.mutationRate,
            health=clamp(colony.health + delta_health),
            focus=colony.focus,
        )

        if random.random() < updated.mutationRate:
            phrase = random.choice(mutation_pool)
            updated.prompt = f"{updated.prompt} {phrase}"
            log.append(f"{updated.name} mutated: {phrase}")
        else:
            log.append(f"{updated.name} stabilized and emitted a coherent signal.")

        colonies.append(updated)

    return {
        "colonies": [colony.model_dump() for colony in colonies],
        "log": log
    }

@app.get("/health")
def health():
    return {"status": "ok"}