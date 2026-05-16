# CORS-enabled local server for PDF.js testing
# Usage: pip install flask flask-cors
#        python cors-server.py

from flask import Flask, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path:path>')
def serve_file(path):
    if os.path.isdir(path):
        # Serve index.html for directories
        return send_from_directory(path, 'index.html')
    return send_from_directory('.', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
