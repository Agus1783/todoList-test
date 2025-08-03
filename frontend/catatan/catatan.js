const { read } = require("fs");

// url backend
const url = "http://localhost:3000/catatan";

const inputJudul = document.getElementById("input-judul");
const inputNote = document.getElementById("input-note");
const noteBtn = document.getElementById("note-btn");
const listNote = document.getElementById("list-note");

// fungsi create membuat daftar catatan baru
async function creatNote() {
    const judul = inputJudul.value.trim();
    const note = inputNote.value.trim();

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ judul: judul }, {note: note})
        });

        if (response.ok) {
            inputJudul.value = '';
            inputNote.value = '';
            readNote();
        };
    } catch (err) {
        console.error(`Error tambahkan note: ${err}`)
    }; 
};

// fungsi read menampilkan daftar catatan
async function readNote() {
    try {
        const response = await fetch(url);
        const catatan = await response.json();

        listNote.innerHTML = '';

        catatan.forEach(catatan => {
            const li = document.createElement('li');
            li.className = 'list-note-item';
            li.dataset.no = catatan.no;

            li.innerHTML = `
                <h3>${catatan.judul}</h3>
                <span>${catatan.note}</span>
                <button class="edit-btn">✏️</button>
                <button class="delete-btn">🗑️</button>
            `;
            listNote.appendChild(li);
        });
    } catch (err) {
        console.error(`Error read note: ${err}`);
    };
};

// fungsi update & delete catatan