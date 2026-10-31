# Memory Lantern

**A private, local-first remembrance writer for Día de los Muertos.** Gather a few memories, favorite things, and stories about someone you miss; a model running on your own computer helps shape them into a gentle remembrance. It does not pretend to contact the dead.

## Why open AI

Family memories are intimate. Memory Lantern sends the notes only to an Ollama server on `127.0.0.1`, keeps saved drafts in this browser's local storage, and has no cloud account or analytics. An open-weight model can be inspected, swapped, and run offline after download. That local control is more useful here than a hosted model's convenience.

## Run it

1. Install [Ollama](https://ollama.com/) and download a model, for example `ollama pull gemma3:4b`.
2. Start Ollama (`ollama serve` if it is not already running).
3. From this directory run `python server.py`.
4. Open <http://127.0.0.1:8000>.

The app uses Ollama's local chat API at `http://127.0.0.1:11434`. Choose another installed model in the dropdown. No API key is used. If your Ollama installation does not allow browser requests from this app, the included Python server proxies generation locally.

## Demo

**Hosted UI preview:** https://wafulaeliah373-jpg.github.io/memory-lantern/ (static fictional sample; it does not call a model). For the working AI demo, run the steps above, enter memories, and choose **Light the lantern**. The generated text appears as a keepsake card; use **Save draft** to store it in this browser or **Print / save PDF** to keep a copy. Nothing is uploaded.

## Built with

- Gemma 3 (open-weight; served locally by Ollama)
- Python standard library for the local web server and Ollama proxy
- Plain HTML, CSS, and JavaScript

## Limitations

This is a small prototype. The model may invent details, so review every line before sharing. Saved drafts live in this browser profile and are not encrypted. The model must already be downloaded; generation works offline once it is.

## License

MIT. See [LICENSE](LICENSE).
