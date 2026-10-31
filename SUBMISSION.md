---
title: "Memory Lantern: a private remembrance writer with local open AI"
published: false
tags: devchallenge, hf26challenge
---

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 4: Ghost in the Machine](https://dev.to/challenges/hacktoberfest-week4-2026-10-26)*

## What I Built

Memory Lantern is a small, local-first remembrance writer for Día de los Muertos. You add a name, one memory, and (if you like) a few things they loved. A model on your own machine helps shape those notes into a gentle letter, a short poem, or words to read aloud. The keepsake stays editable, printable, and saved only in your browser.

I wanted a tool for keeping someone's stories close without pretending that software can speak for the person who died. Memory Lantern asks the model to use only details the writer supplied and reminds them to check the result.

## Demo

**Hosted UI preview:** https://wafulaeliah373-jpg.github.io/memory-lantern/ (static fictional sample, clearly labeled; it does not call a model).

To try the live local demo: install Ollama, run `ollama pull gemma3:4b`, start Ollama, then run `python server.py` from the project folder and open `http://127.0.0.1:8000`. The app's demo is local by design; notes are sent only to Ollama on the same computer. A short screen recording should show the fictional sample below, generation, editing, and print/save controls.

Suggested fictional demo input: name “Nana”; memory “She hummed old songs while making breakfast on rainy Sundays”; favorites “marigolds, mango sweets, and jazz”. Please use fictional details in a public recording.

## Code

**Repository:** https://github.com/wafulaeliah373-jpg/memory-lantern

## How I Built It

The interface is plain HTML, CSS, and JavaScript. A tiny Python standard-library server serves the page and forwards a prompt to Ollama's local chat endpoint. The app is designed around Gemma 3 (`gemma3:4b`), an open-weight model that can be downloaded once and run on the user's machine. Drafts are stored in browser local storage; there is no cloud service, account, or analytics.

## Why Does Open Innovation Matter?

These notes can be deeply personal. Running an open-weight model locally means the family story does not need to be sent to a hosted AI provider. After downloading the model, the writing flow can work without internet, and the writer can change models or inspect how the app sends prompts. For this particular use, control over where memories go matters more than the convenience of a closed API.

## The Spirit of It

The project takes “Ghost in the Machine” as a prompt to remember, not to simulate a dead person. The person supplies the memories; the model only helps arrange them. The page leaves room for an imperfect first draft, because the best remembrance is the one the family edits until it sounds like their own.

