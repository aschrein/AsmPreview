#!/usr/bin/env python3
"""
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
         REQUEST        TEXT                    NOT NULL,
         RESPONSE       TEXT                    NOT NULL
         );''')
conn.commit()
conn.close()

from pathlib import Path

def rmdir(directory):
    directory = Path(directory)
    for item in directory.iterdir():
        if item.is_dir():
            rmdir(item)
        else:
            item.unlink()
    directory.rmdir()

def launch_process(args):
    import subprocess
    process = subprocess.Popen(args,
                               stdout=subprocess.PIPE,
                               stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    return (stdout, stderr, process.returncode)


class S(http.server.SimpleHTTPRequestHandler):
    def setup(self):
        http.server.SimpleHTTPRequestHandler.setup(self)
        self.request.settimeout(60)
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
        raw_post_data = self.rfile.read(content_length)
        post_data = raw_post_data.decode('utf-8')

        # logging.info("POST request,\nPath: %s\nHeaders:\n%s\n\nBody:\n%s\n",
        #         str(self.path), str(self.headers), post_data.decode('utf-8'))
        try:
            j = json.loads(raw_post_data)
            """
            compile command:
                {
                    "cmd" : "compile",
                    "text" : "void main() {}",
                    "config" : { "option" : "value", ... }
                }
                response:
                {
                    "type" : "compilation_result",
                    ["stderr" : "Failed due to..",]
                    ["spirv" : "%int = OpTypeInt 32 1",]
                    ["asm" : "s_getpc_b64   s[0:1]",]
                    ["dxil" : "s_getpc_b64   s[0:1]",]
                }
            save command:
                {
                    "cmd" : "save",
                    "text" : "void main() {}",
                    "config" : { "option" : "value", ... }
                }
                response:
                {
                    "type" : "saved",
                    "token" : "agegdsg08325jdxjga[,dg"
                }
            """
            stderr = ""
            if j["cmd"] == "compile":
                src = j["text"]
                config = {}
                if "config" in j:
                    config = j["config"]
                hash_object = hashlib.sha1(post_data.encode('utf-8'))
                hex_dig = hash_object.hexdigest()
                import os
                if not os.path.exists("cache"):
                    os.makedirs("cache")
                cache_dir = "cache/" + hex_dig[:4]
                if not os.path.exists(cache_dir):
                    os.makedirs(cache_dir)
                this_path = cache_dir + "/" + hex_dig
                f = open(this_path + ".hlsl", "wb")
                f.write(src.encode('utf-8'))
                f.close()
                stdout, stderr0, retcode = launch_process(["dxc.exe", "-T", "cs_6_5", "-E", "main", this_path + ".hlsl", "-spirv",
                                                           "-Fo", this_path + ".spv.o"])
                stdout, stderr1, retcode = launch_process(["dxc.exe", "-T", "cs_6_5", "-E", "main", this_path + ".hlsl", "-spirv",
                                                           "-Fc", this_path + ".spv.txt"])
                stdout, stderr2, retcode = launch_process(["dxc.exe", "-T", "cs_6_5", "-E", "main", this_path + ".hlsl",
                                                           "-Fc", this_path + ".dxil.txt"])
                # os.remove("cache/" + hex_dig + ".hlsl")

                spirv = ""
                asm = ""
                dxil = ""

                if retcode == 0:
                    try:
                        f = open(this_path + ".spv.txt")
                        spirv = f.read()
                        f.close()
                        f = open(this_path + ".dxil.txt")
                        dxil = f.read()
                        f.close()
                    except:
                        pass

                # TODO: DX12 root signature
                # ./rga -s dx12 -c gfx1030 --cs cache/16380c5043/16380c50438b073ededa4577f540f134b4c78068.hlsl --cs-entry main --cs-mode cs_6_5 --isa isa.txt

                stdout, stderr3, retcode = launch_process(
                    ("rga -h -s vk-spv-offline --asic gfx1030 --isa " + this_path + ".txt --comp " + this_path + ".spv.o").split())
                if retcode == 0:
                    try:
                        f = open(this_path.replace(
                            hex_dig, "gfx1030_" + hex_dig+"_comp") + ".txt")
                        asm = f.read()
                        f.close()
                    except:
                        pass
                try:
                    rmdir(cache_dir)
                except:
                    pass
                
                self._set_response()
                j = json.dumps({
                    "type": "compilation_result",
                    "spirv": spirv,
                    "dxil": dxil,
                    "asm": asm,
                    "stderr": stderr0.decode('ascii') + stderr3.decode('ascii')
                })
                self.wfile.write("{}".format(j).encode('utf-8'))
                return

            if j["cmd"] == "save":
                src = j["text"]

                hash_object = hashlib.sha1(post_data.encode('utf-8'))
                hex_dig = hash_object.hexdigest()
                # print("Inserting {} {}".format(hex_dig, src))
                # 2c8214b03d80760aa480abea0248a4b395206d97
                conn = sqlite3.connect('db.db')
                conn.execute('''CREATE TABLE IF NOT EXISTS SOURCES
                        (HASH          TEXT    PRIMARY KEY     NOT NULL,
                        REQUEST        TEXT                    NOT NULL,
                        RESPONSE       TEXT                    NOT NULL
                        );''')
                conn.execute(
                    "DELETE from SOURCES where HASH = '{}';".format(hex_dig))
                conn.execute("INSERT INTO SOURCES (HASH,REQUEST,RESPONSE) \
                          VALUES ('{}', '{}', '{}')".format(hex_dig, post_data, post_data))
                conn.commit()
                conn.close()
                self._set_response()
                j = json.dumps({
                    "type": "saved",
                    "token": str(hex_dig)
                })
                self.wfile.write("{}".format(j).encode('utf-8'))
                return
            if j["cmd"] == "load":
                token = j["token"]
                conn = sqlite3.connect('db.db')
                conn.execute('''CREATE TABLE IF NOT EXISTS SOURCES
                        (HASH          TEXT    PRIMARY KEY     NOT NULL,
                        REQUEST        TEXT                    NOT NULL,
                        RESPONSE       TEXT                    NOT NULL
                        );''')
                conn.commit()
                cur = conn.cursor()
                print("TOKEN:", str(token))
                cur.execute("SELECT * FROM SOURCES WHERE HASH='{}'".format(token))
                rows = cur.fetchall()
                text = ""
                if len(rows) > 0:
                    text = json.loads(rows[0][1])["text"]

                self._set_response()
                j = json.dumps({
                    "type": "loaded",
                    "text": text
                })
                self.wfile.write("{}".format(j).encode('utf-8'))
                conn.close()
                return
        except Exception as e:
            # e = sys.exc_info()[0]
            self._set_response()
            j = json.dumps({
                "type": "error",
                "stderr": str(e) + stderr.decode('ascii')
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
