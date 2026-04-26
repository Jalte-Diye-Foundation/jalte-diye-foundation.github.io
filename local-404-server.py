import socket
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


class DualStackHTTPServer(HTTPServer):
    address_family = socket.AF_INET6

    def server_bind(self):
        if hasattr(socket, "IPPROTO_IPV6") and hasattr(socket, "IPV6_V6ONLY"):
            self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        super().server_bind()


def create_server(port: int) -> HTTPServer:
    try:
        return DualStackHTTPServer(("::", port), Custom404Handler)
    except OSError:
        return HTTPServer(("", port), Custom404Handler)


if __name__ == "__main__":
    print(f"Serving on http://localhost:{PORT} with custom 404 support")
    create_server(PORT).serve_forever()
