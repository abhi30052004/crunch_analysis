from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from exchange import PaperExchangeAdapter

app = FastAPI(title="Horse Racing AI Demo")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = "data/predictions/demo_predictions.csv"

# Exchange adapter instance
exchange = PaperExchangeAdapter()

# Automation configuration state
automation_config = {
    "staking_plan": "fixed", # fixed, percentage, capped_percentage
    "fixed_stake": 10.0,
    "bankroll_percentage": 1.0,
    "max_stake": 100.0,
    "min_value_edge": 5.0,
    "min_probability": 10.0,
    "min_odds": 2.0,
    "max_odds": 25.0,
    "max_daily_loss": 500.0,
    "max_race_exposure": 250.0,
    "max_total_exposure": 1000.0,
    "max_open_bets": 20,
    "automation_enabled": False,
    "emergency_stop": False
}

class OrderRequest(BaseModel):
    market_id: str
    selection: str
    side: str
    odds: float
    stake: float

class AutomationConfigUpdate(BaseModel):
    staking_plan: str = None
    fixed_stake: float = None
    bankroll_percentage: float = None
    max_stake: float = None
    min_value_edge: float = None
    min_probability: float = None
    min_odds: float = None
    max_odds: float = None
    max_daily_loss: float = None
    max_race_exposure: float = None
    max_total_exposure: float = None
    max_open_bets: int = None
    automation_enabled: bool = None
    emergency_stop: bool = None

@app.get("/")
def home():
    return {
        "message": "Horse Racing AI Demo API",
        "status": "running"
    }


@app.get("/api/predictions")
def predictions():
    df = pd.read_csv(DATA_FILE)

    df = df[
        [
            "race_ID",
            "horse_name",
            "dec",
            "market_probability",
            "demo_probability",
            "value_edge",
            "recommendation",
            "target",
        ]
    ]

    return df.to_dict(orient="records")

# Exchange Endpoints
@app.get("/api/exchange/status")
def get_exchange_status():
    return {
        "status": "Connected",
        "mode": "SIMULATION MODE",
        "environment": "Paper / Sandbox",
        "last_sync": "Just now"
    }

@app.get("/api/exchange/balance")
def get_exchange_balance():
    return exchange.get_balance()

@app.get("/api/exchange/markets")
def get_exchange_markets():
    return exchange.get_markets()

@app.get("/api/exchange/orders")
def get_exchange_orders():
    return exchange.get_all_orders()

@app.post("/api/exchange/orders")
def place_exchange_order(order: OrderRequest):
    if automation_config["emergency_stop"]:
        raise HTTPException(status_code=400, detail="EMERGENCY STOP is active. Orders are blocked.")
    placed_order = exchange.place_order(order.market_id, order.selection, order.side, order.odds, order.stake)
    return placed_order

@app.post("/api/exchange/orders/{order_id}/cancel")
def cancel_exchange_order(order_id: str):
    cancelled = exchange.cancel_order(order_id)
    if not cancelled:
        raise HTTPException(status_code=404, detail="Order not found or cannot be cancelled")
    return cancelled

@app.get("/api/exchange/exposure")
def get_exchange_exposure():
    return {"total_exposure": exchange.exposure}

# Automation Endpoints
@app.get("/api/automation/config")
def get_automation_config():
    return automation_config

@app.post("/api/automation/config")
def update_automation_config(config: AutomationConfigUpdate):
    for key, value in config.dict(exclude_unset=True).items():
        if key in automation_config:
            automation_config[key] = value
            
    if automation_config["emergency_stop"]:
        automation_config["automation_enabled"] = False
        
    return automation_config