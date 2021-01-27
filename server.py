#!/usr/bin/env python3
"""
Very simple HTTP server in python for logging requests
Usage::
    ./server.py [<port>]
"""
import http
from http.server import BaseHTTPRequestHandler, HTTPServer
import logging
import json
import sqlite3
import hashlib
import sys

conn = sqlite3.connect('db.db')
conn.execute('''CREATE TABLE IF NOT EXISTS SOURCES
         (HASH          TEXT    PRIMARY KEY     NOT NULL,
         TEXT           TEXT                    NOT NULL);''')

conn.close()

class S(http.server.SimpleHTTPRequestHandler):
    def _set_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_GET(self):
        if self.path == '/':
            self.path = 'index.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        # logging.info("POST request,\nPath: %s\nHeaders:\n%s\n\nBody:\n%s\n",
        #         str(self.path), str(self.headers), post_data.decode('utf-8'))
        try:
            j = json.loads(post_data)
            if j["cmd"] == "compile":
                src = j["text"]
                # f = open("dump.hlsl", "wb")
                # f.write(src)
                # f.close()
                hash_object = hashlib.sha1(src.encode('utf-8'))
                hex_dig = hash_object.hexdigest()
                # print("Inserting {} {}".format(hex_dig, src))
                conn = sqlite3.connect('db.db')
                conn.execute("DELETE from SOURCES where HASH = '{}';".format(hex_dig))
                conn.execute("INSERT INTO SOURCES (HASH,TEXT) \
                          VALUES ('{}', '{}')".format(hex_dig, src))
                conn.commit()
                conn.close()
                self._set_response()
                j = json.dumps({
                    "type": "compilation_result",
                    "text": str(src)
                })
                self.wfile.write("{}".format(j).encode('utf-8'))
                return
        except Exception as e:
            # e = sys.exc_info()[0]
            self._set_response()
            j = json.dumps({
                "type": "error",
                "msg": str(e)
            })
            self.wfile.write("{}".format(j).encode('utf-8'))
            return
            # print("[ERROR] {}".format(str(e)))
        self._set_response()
        self.wfile.write("Unknown POST request".encode('utf-8'))

def run(server_class=HTTPServer, handler_class=S, port=8080):
    logging.basicConfig(level=logging.INFO)
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    logging.info('Starting httpd...\n')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        exit()
    httpd.server_close()
    logging.info('Stopping httpd...\n')

if __name__ == '__main__':
    from sys import argv

    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()