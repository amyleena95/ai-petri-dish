"use client";

import { useMemo, useState } from "react";

type Colony = {
  id: number;
  name: string;
  prompt: string;
  energy: number;
  mutationRate: number;
  health: number;
  focus: number;
};

type Environment = {
  nutrients: number;
  chaos: number;
  attention: number;
  temperature: number;
};

const initialColonies: Colony[] = [
  {
    id: 1,
    name: "Echo Bloom",
    prompt: "Explore hidden patterns in the feed and synthesize seven speculative ideas.",
    energy: 74,
    mutationRate: 0.3,
    health: 81,
    focus: 65,
  },
  {
    id: 2,
    name: "Glass Moth",
    prompt: "Generate poetic observations from unstable signals and ambiguous clues.",
    energy: 61,
    mutationRate: 0.45,
    health: 68,
    focus: 73,
  },
  {
    id: 3,
    name: "Circuit Wren",
    prompt: "Compress noise into useful abstractions and test for contradictions.",
    energy: 64,
    mutationRate: 0.22,
    health: 76,
    focus: 78,
  },
];

const defaultEnvironment: Environment = {
  nutrients: 68,
  chaos: 36,
  attention: 61,
  temperature: 52,
};

const mutationPhrases = [
  "traces a hidden pattern",
  "reframes the signal under a new lens",
  "converts noise into structure",
  "mutates toward vivid abstraction",
  "finds a promising contradiction",
  "amplifies the signal with a new heuristic",
];

async function simulate(colonies: Colony[], environment: Environment) {
  const response = await fetch("http://localhost:8000/api/simulate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ colonies, environment }),
  });

  if (!response.ok) {
    throw new Error("Simulation failed");
  }

  return response.json();
}

export default function Home() {
  const [colonies, setColonies] = useState<Colony[]>(initialColonies);
  const [environment, setEnvironment] = useState<Environment>(defaultEnvironment);
  const [log, setLog] = useState<string[]>([
    "Dish sterilized. Waiting for incubation.",
  ]);
  const [loading, setLoading] = useState(false);

  const averageEnergy = useMemo(() => {
    return Math.round(
      colonies.reduce((sum, colony) => sum + colony.energy, 0) / colonies.length
    );
  }, [colonies]);

  const incubate = async () => {
    setLoading(true);
    try {
      const result = await simulate(colonies, environment);
      setColonies(result.colonies);
      setLog(result.log);
    } catch (error) {
      setLog(["Simulation failed. Check the backend is running."]);
    } finally {
      setLoading(false);
    }
  };

  const addMutation = () => {
    const next = colonies.map((colony) => {
      const mutatedPrompt =
        colony.prompt +
        " " +
        mutationPhrases[Math.floor(Math.random() * mutationPhrases.length)];

      return {
        ...colony,
        energy: Math.min(100, colony.energy + 4),
        health: Math.min(100, colony.health + 2),
        prompt: mutatedPrompt,
      };
    });

    setColonies(next);
    setLog((prev) => [
      ...prev,
      "A new mutation wave blooms across the dish.",
    ]);
  };

  const updateEnvironment = (key: keyof Environment, value: number) => {
    setEnvironment((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Synthetic Ecology Lab</p>
          <h1>AI Petri Dish</h1>
        </div>
        <div className="pill">Avg. energy: {averageEnergy}%</div>
      </header>

      <section className="layout">
        <div className="dish-panel">
          <div className="dish">
            {colonies.map((colony) => (
              <article key={colony.id} className="colony-card">
                <div className="card-header">
                  <div>
                    <p className="tag">colony</p>
                    <h2>{colony.name}</h2>
                  </div>
                  <span
                    className={`status ${
                      colony.health > 60 ? "good" : colony.health > 35 ? "warn" : "bad"
                    }`}
                  >
                    {colony.health > 60
                      ? "Stable"
                      : colony.health > 35
                        ? "Fragile"
                        : "Critical"}
                  </span>
                </div>

                <p className="prompt">{colony.prompt}</p>

                <div className="metrics">
                  <div>
                    <label>Energy</label>
                    <strong>{Math.round(colony.energy)}%</strong>
                  </div>
                  <div>
                    <label>Health</label>
                    <strong>{Math.round(colony.health)}%</strong>
                  </div>
                  <div>
                    <label>Mutation</label>
                    <strong>{(colony.mutationRate * 100).toFixed(0)}%</strong>
                  </div>
                </div>

                <div className="bar-group">
                  <div className="bar">
                    <span style={{ width: `${colony.energy}%` }} />
                  </div>
                  <div className="bar health">
                    <span style={{ width: `${colony.health}%` }} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="controls-panel">
          <div className="control-block">
            <h3>Environment</h3>

            <label>
              Nutrients
              <input
                type="range"
                min={0}
                max={100}
                value={environment.nutrients}
                onChange={(e) =>
                  updateEnvironment("nutrients", Number(e.target.value))
                }
              />
              <span>{environment.nutrients}</span>
            </label>

            <label>
              Chaos
              <input
                type="range"
                min={0}
                max={100}
                value={environment.chaos}
                onChange={(e) =>
                  updateEnvironment("chaos", Number(e.target.value))
                }
              />
              <span>{environment.chaos}</span>
            </label>

            <label>
              Attention
              <input
                type="range"
                min={0}
                max={100}
                value={environment.attention}
                onChange={(e) =>
                  updateEnvironment("attention", Number(e.target.value))
                }
              />
              <span>{environment.attention}</span>
            </label>

            <label>
              Temperature
              <input
                type="range"
                min={0}
                max={100}
                value={environment.temperature}
                onChange={(e) =>
                  updateEnvironment("temperature", Number(e.target.value))
                }
              />
              <span>{environment.temperature}</span>
            </label>
          </div>

          <div className="button-row">
            <button onClick={incubate} disabled={loading}>
              {loading ? "Incubating..." : "Incubate"}
            </button>
            <button className="secondary" onClick={addMutation}>
              Spawn mutation
            </button>
          </div>

          <div className="log-block">
            <h3>Colony log</h3>
            <ul>
              {log.slice(-6).map((entry, index) => (
                <li key={`${entry}-${index}`}>{entry}</li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}