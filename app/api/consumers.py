import json
from channels.generic.websocket import WebsocketConsumer
import numpy as np
from .qboard import constants as qboard_constants
from .qboard import solver as qboard_solver
from datetime import datetime


class ApiConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json['action']
        if action == "generate-data":
            Q = np.random.rand(30, 30) - 0.5
            solver = qboard_solver(mode="bf")

            def cb(dic):
                if dic["cb_type"] == qboard_constants.CB_TYPE_NEW_SOLUTION:
                    now = datetime.now()
                    dt_string = now.strftime("%d %b, %M:%S")
                    data = {
                            "energy": dic["energy"],
                            "time": str(dt_string)
                        }
                    self.send(text_data=json.dumps(data))
                else:
                    self.close()
            solver.solve_qubo(Q, callback=cb, timeout=10, verbosity=0)

