from http.server import BaseHTTPRequestHandler, HTTPServer
from requests import get as rget
import time

hostname = "localhost"
server_port = 8080

threat_fox_api = "https://threatfox.abuse.ch/export/json/recent"

class FoxyProxy(BaseHTTPRequestHandler):
    def do_GET(self):
        foxy_resp = rget(threat_fox_api)
        print(foxy_resp.status_code)
        print(foxy_resp.content[0:30])
        if (foxy_resp.status_code != 200):
            self.send_response(foxy_resp.status_code)
            self.send_header("Allow-Control-Allow-Origin", "app://obsidian.md")
            self.end_headers()
            self.wfile.write(bytes(foxy_resp.content))
            return

        self.send_response(200)
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