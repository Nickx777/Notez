let quill;

// Function to save note
function saveNote() {
    const title = document.getElementById('note-title').value;
    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    if (title) {
        notes.push({ title: title, content: '' });
        localStorage.setItem('notes', JSON.stringify(notes));
        alert('Note saved!');
        window.location.href = 'index.html';
    } else {
        alert('Please fill out the title.');
    }
}

// Function to load notes
function loadNotes() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = ''; // Clear the notes list first
    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    notes.forEach((note, index) => {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note';
        noteDiv.innerHTML = `
            <h2>${note.title}</h2>
            <p>${note.content.substring(0, 100)}...</p>
            <button class="delete-button" onclick="deleteNote(${index})">X</button>
        `;
        noteDiv.onclick = () => openEditor(index);
        noteDiv.querySelector('.delete-button').onclick = (event) => {
            event.stopPropagation(); // Prevent the click from triggering the openEditor function
            deleteNote(index);
        };
        notesList.appendChild(noteDiv);
    });
}

// Function to open the full-page editor for editing a note
function openEditor(index) {
    localStorage.setItem('editIndex', index);
    window.location.href = 'edit.html';
}

// Function to load note into the editor
function loadNoteForEdit() {
    const noteIndex = localStorage.getItem('editIndex');
    if (noteIndex !== null) {
        const notes = JSON.parse(localStorage.getItem('notes'));
        const note = notes[noteIndex];
        document.getElementById('note-title-display').innerText = note.title;
        quill.root.innerHTML = note.content;  // Load the note content into Quill editor
    }
}

// Function to save the edited note
function saveEditedNote() {
    const noteIndex = localStorage.getItem('editIndex');
    const updatedContent = quill.root.innerHTML;  // Get the content from Quill editor
    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    if (noteIndex !== null) {
        notes[noteIndex].content = updatedContent;
        localStorage.setItem('notes', JSON.stringify(notes));
        alert('Note updated!');
        localStorage.removeItem('editIndex');
        window.location.href = 'index.html';
    } else {
        alert('Error saving the note.');
    }
}

// Function to delete a note
function deleteNote(index) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.splice(index, 1); // Remove the note at the specified index
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes(); // Reload the notes list to reflect the deletion
}

// Initialize Quill editor with toolbar options including text alignment
document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById('editor-container')) {
        quill = new Quill('#editor-container', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'align': [] }],
                    ['link', 'image']
                ]
            }
        });

        // Load note for editing if on the edit page
        loadNoteForEdit();

        // Set up the save button event listener
        document.getElementById('save-button').addEventListener('click', saveEditedNote);
    } else if (document.getElementById('notes-list')) {
        loadNotes();
    }
});
