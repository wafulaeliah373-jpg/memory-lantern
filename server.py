"""Serve Memory Lantern and proxy prompts to a local Ollama instance."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import URLError, HTTPError
from urllib.request import Request, urlopen
import json

ROOT = Path(__file__).resolve().parent


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_POST(self):
        if self.path != "/api/write":
            self.send_error(404)
            return
        try:
            length = min(int(self.headers.get("Content-Length", "0")), 20000)
            data = json.loads(self.rfile.read(length))
            model = str(data.get("model", "gemma3:4b"))[:100]
            prompt = str(data.get("prompt", ""))[:12000]
            payload = json.dumps({
                "model": model,
                "stream": False,
                "messages": [
                    {"role": "system", "content": (
                        "You help people write respectful memorial keepsakes. "
                        "Use only details the user provided. Never claim to contact, "
                        "channel, or speak for the deceased. Do not invent facts. "
                        "Write warmly and simply, in 120-180 words."
                    )},
                    {"role": "user", "content": prompt},
                ],
                "options": {"temperature": 0.7},
            }).encode()
            req = Request("http://127.0.0.1:11434/api/chat", data=payload,
                          headers={"Content-Type": "application/json"})
            with urlopen(req, timeout=180) as response:
                result = json.loads(response.read())
            answer = result.get("message", {}).get("content", "").strip()
            self._json(200, {"text": answer})
        except (URLError, TimeoutError, HTTPError, json.JSONDecodeError, ValueError) as exc:
            self._json(502, {"error": "Could not reach local Ollama. Start Ollama and check that the model is installed.", "detail": str(exc)[:240]})

    def _json(self, status, value):
        body = json.dumps(value).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    print("Memory Lantern is ready at http://127.0.0.1:8000")
    ThreadingHTTPServer(("127.0.0.1", 8000), Handler).serve_forever()
