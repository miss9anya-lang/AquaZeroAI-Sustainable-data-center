"""Baseline outlet-temperature estimator. NOT a trained model: a transparent heuristic."""
from datetime import datetime, timezone
from fastapi import FastAPI
from pydantic import BaseModel, Field
app = FastAPI(title="AquaZero inference", version="0.1.0")
class In(BaseModel):
    inlet_c: float = Field(ge=0, le=90)
    gpu_pct: float = Field(ge=0, le=100)
    flow_lpm: float = Field(gt=0, le=5000)
@app.get("/health")
def health(): return {"ok": True}
@app.post("/predict")
def predict(x: In):
    out = x.inlet_c + 4 + 0.12 * x.gpu_pct * (40 / x.flow_lpm)
    return {"model": "rule-baseline-0.1", "trained": False, "predicted_outlet_c": round(out, 2),
            "uncertainty_c": 3.0, "ts": datetime.now(timezone.utc).isoformat()}
