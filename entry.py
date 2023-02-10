import sys
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO


app = Flask(__name__)
app_config = {"host": "0.0.0.0", "port": sys.argv[1]}
app.config['SECRET_KEY'] = 'secret'

"""
---------------------- DEVELOPER MODE CONFIG -----------------------
"""
# Developer mode uses app.py
if "app.py" in sys.argv[0]:
    # Update app config
    app_config["debug"] = True

    # CORS settings
    cors = CORS(
        app,
        resources={r"/*": {"origins": "http://localhost*"}},
    )

    # CORS headers
    app.config["CORS_HEADERS"] = "Content-Type"

socketio = SocketIO(app, cors_allowed_origins='*')
