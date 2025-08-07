
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
            body: JSON.stringify({ judul: judul, note: note })
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
        
        const daftarObjekNote = Array.isArray(catatan) ? catatan : catatan.data || [];//membuat agar catatan bisa terbaca
        listNote.innerHTML = '';

        daftarObjekNote.forEach(catatan => {
            const li = document.createElement('li');
            li.className = 'list-note-item';
            li.dataset.no = catatan.no;

            li.innerHTML = `
            <div class="note-content">
                <h3>${catatan.judul}</h3>
                <hr>
                <p class="note-text">${catatan.note}</p>
            </div>
            <div class="tombol-updel">
                <button class="edit-btn onclick="">✏️</button>
                <button class="delete-btn">🗑️</button>
            </div>
            `;
            listNote.appendChild(li);
        });
    } catch (err) {
        console.error(`Error read note: ${err}`);
    };
};

// bagian untuk update dan delete note
let editMode = false;
let editId = null;

// fungsi delete catatan
async function upDelNote(event) {
    const targetNote = event.target;
    const itemNote = targetNote.closest('.list-note-item');
    const idNote = itemNote.dataset.no;
    const judul = itemNote.querySelector('h3').innerText;

    if (targetNote.classList.contains('delete-btn')) {
        try {
            const response = await fetch(`${url}/${idNote}`, {
                method: "DELETE",
            });
            if (response.ok) {
                alert(`Catatan dengan judul '${judul}' dihapus`);
                readNote();
            }
        } catch (err) {
            console.error(`Error menghapus note: ${err}`);
        }
    };

    if (targetNote.classList.contains('edit-btn')) {
        inputJudul.value = itemNote.querySelector("h3").innerText;
        inputNote.value = itemNote.querySelector("p").innerText;
        noteBtn.textContent = "Update";
        editMode = true;
        editId = idNote;
    }

}

// fungsi update catatan
async function updateNote() {
    const judul = inputJudul.value.trim();
    const note = inputNote.value.trim();

    // if (!judul || !note) {
    //     alert("Judul dan isi catatan tidak boleh kosong.");
    //     return;
    // }

    try {
        const response = await fetch(`${url}/${editId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ judul, note })
        });

        if (response.ok) {
            inputJudul.value = '';
            inputNote.value = '';
            noteBtn.textContent = '✅';
            editMode = false;
            editId = null;
            readNote();
        } else {
            console.error("Update gagal:", await response.text());
        }
    } catch (err) {
        console.error(`Error edit note: ${err}`);
    }
}



// event listener
noteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (editMode) {
        updateNote();
    } else {
        creatNote();
    }
});
listNote.addEventListener('click', upDelNote);
document.addEventListener('DOMContentLoaded', readNote);