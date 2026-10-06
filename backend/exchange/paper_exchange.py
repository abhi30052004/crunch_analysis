import uuid
from datetime import datetime
from .base import ExchangeAdapter

class PaperExchangeAdapter(ExchangeAdapter):
    def __init__(self, starting_balance=10000.0):
        self.balance = starting_balance
        self.exposure = 0.0
        self.orders = []
        
    def get_balance(self):
        return {
            "status": "SIMULATION MODE",
            "environment": "Paper / Sandbox",
            "balance": self.balance,
            "exposure": self.exposure,
            "available": self.balance - self.exposure
        }
        
    def get_markets(self):
        return []
        
    def get_market(self, market_id):
        return {}
        
    def place_order(self, market_id, selection, side, odds, stake):
        order_id = str(uuid.uuid4())
        order = {
            "id": order_id,
            "market_id": market_id,
            "selection": selection,
            "side": side,
            "odds": odds,
            "stake": stake,
            "status": "MATCHED", # Auto match in simulation
            "timestamp": datetime.now().isoformat(),
            "profit_loss": 0.0
        }
        self.orders.append(order)
        self.exposure += stake
        return order
        
    def cancel_order(self, order_id):
        for o in self.orders:
            if o["id"] == order_id and o["status"] in ["PENDING", "MATCHED"]:
                o["status"] = "CANCELLED"
                self.exposure -= o["stake"]
                return o
        return None
        
    def get_order_status(self, order_id):
        for o in self.orders:
            if o["id"] == order_id:
                return o
        return None
        
    def get_open_orders(self):
        return [o for o in self.orders if o["status"] in ["PENDING", "MATCHED"]]

    def get_all_orders(self):
        return self.orders
        
    def settle_order(self, order_id, is_winner):
        for o in self.orders:
            if o["id"] == order_id and o["status"] == "MATCHED":
                o["status"] = "SETTLED"
                self.exposure -= o["stake"]
                if is_winner:
                    o["profit_loss"] = (o["odds"] - 1) * o["stake"]
                else:
                    o["profit_loss"] = -o["stake"]
                self.balance += o["profit_loss"]
                return o
        return None
