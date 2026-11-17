import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes')
    return savedNotes ? JSON.parse(savedNotes) : []
  })

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [search, setSearch] = useState('')
  const [editId, setEditId] = useState(null)
  const [selectedNote, setSelectedNote] = useState(null)

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  const addNote = () => {
    if (!title.trim() || !content.trim()) {
      alert('Please enter title and description')
      return
    }

    if (editId !== null) {
      setNotes(notes.map(note =>
        note.id === editId
          ? { ...note, title, content }
          : note
      ))
      setEditId(null)
    } else {
      const newNote = {
        id: Date.now(),
        title,
        content,
        pinned: false,
        archived: false,
        trashed: false
      }

      setNotes([...notes, newNote])
    }

    setTitle('')
    setContent('')
  }

  const editNote = (note) => {
    setTitle(note.title)
    setContent(note.content)
    setEditId(note.id)
    setSelectedNote(null)
    window.scrollTo(0, 0)
  }

  const cancelEdit = () => {
    setEditId(null)
    setTitle('')
    setContent('')
  }

  const deleteNote = (id) => {
    setNotes(notes.map(note =>
      note.id === id
        ? { ...note, trashed: true, archived: false, pinned: false }
        : note
    ))
  }

  const restoreTrash = (id) => {
    setNotes(notes.map(note =>
      note.id === id
        ? { ...note, trashed: false }
        : note
    ))
  }

  const permanentDelete = (id) => {
    if (window.confirm('Permanently delete this note?')) {
      setNotes(notes.filter(note => note.id !== id))
    }
  }

  const togglePin = (id) => {
    setNotes(notes.map(note =>
      note.id === id
        ? { ...note, pinned: !note.pinned }
        : note
    ))
  }

  const archiveNote = (id) => {
    setNotes(notes.map(note =>
      note.id === id
        ? { ...note, archived: true, pinned: false }
        : note
    ))
  }

  const restoreNote = (id) => {
    setNotes(notes.map(note =>
      note.id === id
        ? { ...note, archived: false }
        : note
    ))
  }

  const filteredNotes = notes.filter(note =>
    !note.archived &&
    !note.trashed &&
    (
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
    )
  )

  const activeNotes = filteredNotes.sort(
    (a, b) => Number(b.pinned) - Number(a.pinned)
  )

  const archivedNotes = notes.filter(note =>
    note.archived && !note.trashed &&
    (
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
    )
  )

  const trashedNotes = notes.filter(note => note.trashed)

  if (selectedNote) {
    const currentNote = notes.find(
      note => note.id === selectedNote
    )

    if (currentNote) {
      return (
        <div className="app">
          <div className="full-note">
            <button
              className="close-btn"
              onClick={() => setSelectedNote(null)}
            >
              Close
            </button>

            <h1>{currentNote.title}</h1>

            <p className="full-description">
              {currentNote.content}
            </p>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="app">

      <h1>My Notes App</h1>

      {/* Add Note Form */}

      <div className="note-form">

        <input
          type="text"
          placeholder="Enter note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Write your note description..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="button-group">
          <button className="add-btn" onClick={addNote}>
            {editId !== null ? 'Update Note' : 'Add Note'}
          </button>

          {editId !== null && (
            <button className="cancel-btn" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>

      </div>

      {/* Search */}

      <div className="search-section">
        <h2>Search Notes</h2>

        <input
          type="text"
          placeholder="Search by title or content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* My Notes */}

      <section className="notes-section">

        <h2>My Notes</h2>

        <div className="notes-container">

          {activeNotes.map(note => (

            <div className="note" key={note.id}>

              <h3>
                {note.pinned ? '📌 ' : ''}
                {note.title}
              </h3>

              <p
                className="note-preview"
                onClick={() => setSelectedNote(note.id)}
                title="Click to read full description"
              >
                {note.content}
              </p>

              <p
                className="read-more"
                onClick={() => setSelectedNote(note.id)}
              >
                Read full note
              </p>

              <div className="button-group">

                <button className="edit-btn"
                  onClick={() => editNote(note)}>
                  Edit
                </button>

                <button className="pin-btn"
                  onClick={() => togglePin(note.id)}>
                  {note.pinned ? 'Unpin' : 'Pin'}
                </button>

                <button className="archive-btn"
                  onClick={() => archiveNote(note.id)}>
                  Archive
                </button>

                <button className="trash-btn"
                  onClick={() => deleteNote(note.id)}>
                  Trash
                </button>

              </div>

            </div>

          ))}

        </div>

        {activeNotes.length === 0 && <p>No notes found</p>}

      </section>

      {/* Archived Notes */}

      <section className="archive-section">

        <h2>Archived Notes</h2>

        {archivedNotes.map(note => (

          <div className="note" key={note.id}>

            <h3>{note.title}</h3>

            <p
              className="note-preview"
              onClick={() => setSelectedNote(note.id)}
            >
              {note.content}
            </p>

            <p
              className="read-more"
              onClick={() => setSelectedNote(note.id)}
            >
              Read full note
            </p>

            <div className="button-group">

              <button className="restore-btn"
                onClick={() => restoreNote(note.id)}>
                Restore
              </button>

              <button className="trash-btn"
                onClick={() => deleteNote(note.id)}>
                Trash
              </button>

            </div>

          </div>

        ))}

        {archivedNotes.length === 0 && <p>No archived notes</p>}

      </section>

      {/* Trash Section */}

      <section className="trash-section">

        <h2>Trash</h2>

        {trashedNotes.map(note => (

          <div className="note" key={note.id}>

            <h3>{note.title}</h3>

            <p
              className="note-preview"
              onClick={() => setSelectedNote(note.id)}
            >
              {note.content}
            </p>

            <p
              className="read-more"
              onClick={() => setSelectedNote(note.id)}
            >
              Read full note
            </p>

            <div className="button-group">

              <button className="restore-btn"
                onClick={() => restoreTrash(note.id)}>
                Restore
              </button>

              <button className="trash-btn"
                onClick={() => permanentDelete(note.id)}>
                Permanently Delete
              </button>

            </div>

          </div>

        ))}

        {trashedNotes.length === 0 && <p>Trash is empty</p>}

      </section>

    </div>
  )
}

export default App
