class ExchangeAdapter:
    def get_balance(self):
        pass

    def get_markets(self):
        pass

    def get_market(self, market_id):
        pass

    def place_order(self, market_id, selection, side, odds, stake):
        pass

    def cancel_order(self, order_id):
        pass

    def get_order_status(self, order_id):
        pass

    def get_open_orders(self):
        pass
