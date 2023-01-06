from http.server import BaseHTTPRequestHandler, HTTPServer
from requests import get as rget

hostname = "localhost"
server_port = 8080

threat_fox_api = "https://threatfox.abuse.ch/export/json/recent"

class Cache():
    def __init__(self, name, creation_time, expiration_time, data):
        self.name = name
        self._creation_time = creation_time
        self._expiration_time = expiration_time
        self._data = data


class FoxyProxy(BaseHTTPRequestHandler):
    def do_GET(self):
        print("↓" * 30)
        print("↓ Related to the query below ↓")
        event_data = [f"Received request: {self.requestline}",
        f"Client IP: {self.client_address[0]}",
        f"Request Path: {self.path}",
        f"{self.headers}"]
        for item in event_data:
            print(item)
        print("↓" * 30)

        foxy_resp = rget(threat_fox_api)

        self.send_response(foxy_resp.status_code)
        self.send_header("Access-Control-Allow-Origin", "app://obsidian.md")
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(bytes(foxy_resp.content))
        

if __name__ == "__main__":
    web_server = HTTPServer((hostname, server_port), FoxyProxy)
    
    print("Server started http://%s:%s" % (hostname, server_port))

    try:
        web_server.serve_forever()
    except KeyboardInterrupt:
        pass
    
    web_server.server_close()
    print("Server stopped.")