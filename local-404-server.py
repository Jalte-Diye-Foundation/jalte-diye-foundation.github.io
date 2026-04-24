from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

PORT = 8000


class Custom404Handler(SimpleHTTPRequestHandler):
    def send_error(self, code, message=None, explain=None):
        if code == 404:
            custom_404 = Path("404.html")
            if custom_404.exists():
                self.send_response(404)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.end_headers()
                self.wfile.write(custom_404.read_bytes())
                return
        super().send_error(code, message, explain)


if __name__ == "__main__":
    print(f"Serving on http://localhost:{PORT} with custom 404 support")
    HTTPServer(("", PORT), Custom404Handler).serve_forever()
