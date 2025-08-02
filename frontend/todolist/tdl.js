// script.js

// Alamat API backend kita
const API_URL = 'http://localhost:3000/tugas';

// Mendapatkan elemen-elemen dari DOM
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Fungsi untuk mengambil dan menampilkan semua tugas dari backend
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        const tugas = await response.json();

        // Kosongkan list sebelum menampilkan yang baru
        taskList.innerHTML = '';

        tugas.forEach(tugas => {
            const li = document.createElement('li');
            li.className = 'task-item';
            if (tugas.is_completed) {
                li.classList.add('completed');
            }
            li.dataset.No = tugas.No;

            li.innerHTML = `
                <input type="checkbox" ${tugas.is_completed ? 'checked' : ''}>
                <span>${tugas.judul}</span>
                <button class="delete-btn">×</button>
            `;
            taskList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Fungsi untuk menambah tugas baru
async function addTask() {
    const judul = taskInput.value.trim();
    if (judul === '') {
        alert('Judul tugas tidak boleh kosong!');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ judul: judul }),
        });

        if (response.ok) {
            taskInput.value = ''; // Kosongkan input field
            fetchTasks(); // Muat ulang daftar tugas
        }
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

// Fungsi untuk menangani klik pada daftar tugas (update atau delete)
async function handleTaskClick(event) {
    const target = event.target;
    const taskItem = target.closest('.task-item');
    const taskId = taskItem.dataset.No;

    // Jika tombol delete yang di-klik
    if (target.classList.contains('delete-btn')) {
        try {
            const response = await fetch(`${API_URL}/${taskId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchTasks(); // Muat ulang daftar tugas
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    // Jika checkbox yang di-klik
    if (target.type === 'checkbox') {
        const isCompleted = target.checked;
        try {
            const response = await fetch(`${API_URL}/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ is_completed: isCompleted }),
            });
            if (response.ok) {
                fetchTasks(); // Muat ulang daftar tugas
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }
}

// Menambahkan Event Listeners
addTaskBtn.addEventListener('click', addTask);
taskList.addEventListener('click', handleTaskClick);

// Event listener untuk tombol Enter di input field
taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

// Memuat tugas saat halaman pertama kali dibuka
document.addEventListener('DOMContentLoaded', fetchTasks);