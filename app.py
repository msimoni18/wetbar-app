import sys
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
app_config = {"host": "0.0.0.0", "port": sys.argv[1]}

# Set global object to store files and data
data = sys.modules[__name__]
data.DATA = {}

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


"""
--------------------------- REST CALLS -----------------------------
"""
@app.route("/modify-data", methods=['POST'])
def modify_data():
  if request.method == 'POST':

    # Add data if it has not been loaded
    for row in request.json:
      if row['path'] not in data.DATA:
        df = pd.read_csv(row['path'])
        df = df.loc[:, ~df.columns.str.contains('^Unnamed')]
        data.DATA[row['path']] = {
          'data': df.to_dict(orient='list'), 
          'parameters': df.columns.tolist()
        }
    
    # Remove loaded data if file exists in loaded
    # data and not in request
    data.DATA = {row['path']: data.DATA[row['path']] for row in request.json}

  return jsonify(data.DATA)


"""
-------------------------- APP SERVICES ----------------------------
"""
# Quits Flask on Electron exit
@app.route("/quit")
def quit():
  shutdown = request.environ.get("werkzeug.server.shutdown")
  shutdown()

  return


if __name__ == "__main__":
  app.run(**app_config)
