const form = document.querySelector('#memory-form');
const statusBox = document.querySelector('#status');
const button = document.querySelector('#submit');
const card = document.querySelector('#keepsake');
const actions = document.querySelector('#actions');
const storageKey = 'memory-lantern-drafts-v1';

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = document.querySelector('#name').value.trim();
  const memory = document.querySelector('#memory').value.trim();
  const favorites = document.querySelector('#favorites').value.trim();
  const tone = document.querySelector('#tone').value;
  const model = document.querySelector('#model').value;
  if (!name || !memory) return;
  button.disabled = true;
  button.innerHTML = '<span>✳</span> Gathering the light…';
  statusBox.className = 'status';
  statusBox.textContent = 'Writing with your local model. This can take a minute the first time.';
  const prompt = `Write a ${tone} remembering ${name}. Use only these details and do not add biographical facts. Moment: ${memory}\nThings they loved: ${favorites || 'not provided'}. Make it personal, grounded, and suitable to keep or read aloud.`;
  try {
    const response = await fetch('/api/write', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({model,prompt})});
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'The local model could not write this keepsake.');
    showStory(name, data.text);
    statusBox.textContent = 'Your keepsake is ready. Edit it in your own words whenever you like.';
  } catch (error) {
    statusBox.className = 'status error';
    statusBox.textContent = `${error.message} Try: ollama pull ${model}`;
  } finally {
    button.disabled = false;
    button.innerHTML = '<span>✳</span> Light the lantern';
  }
});

function showStory(name, text) {
  card.className = 'keepsake has-text';
  card.innerHTML = `<div class="candle" aria-hidden="true"><span></span></div><div class="placeholder-title">For ${escapeHtml(name)}</div><p id="story" contenteditable="true" aria-label="Editable remembrance">${escapeHtml(text)}</p><div class="divider">✳</div><span class="card-note">MADE WITH YOUR MEMORIES</span>`;
  actions.hidden = false;
}
function escapeHtml(value) { const el = document.createElement('span'); el.textContent = value; return el.innerHTML; }
function getDrafts() { try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return []; } }
document.querySelector('#save').addEventListener('click', () => {
  const story = document.querySelector('#story')?.innerText.trim();
  if (!story) return;
  const drafts = getDrafts();
  drafts.unshift({name:document.querySelector('#name').value.trim(), story, date:new Date().toLocaleDateString()});
  localStorage.setItem(storageKey, JSON.stringify(drafts.slice(0,20)));
  statusBox.className = 'status'; statusBox.textContent = 'Saved in this browser on this device.';
  document.querySelector('#saved-toggle').hidden = false;
});
document.querySelector('#saved-toggle').addEventListener('click', () => {
  const box = document.querySelector('#drafts');
  const drafts = getDrafts();
  box.innerHTML = drafts.length ? drafts.map((d,i)=>`<div class="draft-item" data-index="${i}"><strong>${escapeHtml(d.name)}</strong> · ${escapeHtml(d.date)}</div>`).join('') : '<span>No saved drafts yet.</span>';
  box.hidden = !box.hidden;
  box.querySelectorAll('.draft-item').forEach(item=>item.addEventListener('click',()=>{const d=drafts[Number(item.dataset.index)];document.querySelector('#name').value=d.name;showStory(d.name,d.story);box.hidden=true;}));
});
document.querySelector('#print').addEventListener('click', () => window.print());
if (getDrafts().length) document.querySelector('#saved-toggle').hidden = false;
