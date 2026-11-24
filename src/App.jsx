
import { useEffect, useState } from 'react'
import './App.css'

function AllNotesIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 3v18M12 8h5M12 12h5M12 16h5" />
    </svg>
  )
}

function ArchiveIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="5" rx="1" />
      <path d="M5 9v11h14V9M10 13h4" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M10 11v6M14 11v6M5 7l1 14h12l1-14M9 7V4h6v3" />
    </svg>
  )
}

function App() {
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('notes')) || []
    } catch {
      return []
    }
  })

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [search, setSearch] = useState('')
  const [activePage, setActivePage] = useState('all')
  const [editId, setEditId] = useState(null)
  const [selectedNote, setSelectedNote] = useState(null)

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  const addNote = () => {
    if (!title.trim() || !content.trim()) {
      alert('Please enter a title and description.')
      return
    }

    if (editId !== null) {
      setNotes(previous =>
        previous.map(note =>
          note.id === editId
            ? { ...note, title: title.trim(), content: content.trim() }
            : note
        )
      )
      setEditId(null)
    } else {
      setNotes(previous => [
        ...previous,
        {
          id: Date.now(),
          title: title.trim(),
          content: content.trim(),
          pinned: false,
          archived: false,
          trashed: false
        }
      ])
    }

    setTitle('')
    setContent('')
  }

  const editNote = note => {
    setTitle(note.title)
    setContent(note.content)
    setEditId(note.id)
    setSelectedNote(null)
    setActivePage('all')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setEditId(null)
    setTitle('')
    setContent('')
  }

  const moveToTrash = id => {
    setNotes(previous =>
      previous.map(note =>
        note.id === id
          ? { ...note, trashed: true, archived: false, pinned: false }
          : note
      )
    )
    setSelectedNote(null)
  }

  const restoreTrash = id => {
    setNotes(previous =>
      previous.map(note =>
        note.id === id ? { ...note, trashed: false } : note
      )
    )
  }

  const permanentDelete = id => {
    if (window.confirm('Permanently delete this note?')) {
      setNotes(previous => previous.filter(note => note.id !== id))
      setSelectedNote(null)
    }
  }

  const togglePin = id => {
    setNotes(previous =>
      previous.map(note =>
        note.id === id ? { ...note, pinned: !note.pinned } : note
      )
    )
  }

  const archiveNote = id => {
    setNotes(previous =>
      previous.map(note =>
        note.id === id
          ? { ...note, archived: true, pinned: false }
          : note
      )
    )
    setSelectedNote(null)
  }

  const restoreArchive = id => {
    setNotes(previous =>
      previous.map(note =>
        note.id === id ? { ...note, archived: false } : note
      )
    )
  }

  const matchesSearch = note =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.content.toLowerCase().includes(search.toLowerCase())

  const allNotes = notes
    .filter(note => !note.archived && !note.trashed && matchesSearch(note))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned))

  const archivedNotes = notes.filter(
    note => note.archived && !note.trashed && matchesSearch(note)
  )

  const trashedNotes = notes.filter(
    note => note.trashed && matchesSearch(note)
  )

  const visibleNotes =
    activePage === 'archive'
      ? archivedNotes
      : activePage === 'trash'
        ? trashedNotes
        : allNotes

  const pageTitle =
    activePage === 'archive'
      ? 'Archived Notes'
      : activePage === 'trash'
        ? 'Trash'
        : 'All notes'

  const currentNote = notes.find(note => note.id === selectedNote)

  const startNewNote = () => {
    setActivePage('all')
    setSelectedNote(null)
    setEditId(null)
    setTitle('')
    setContent('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-layout">

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">N</div>
          <div>
            <h2>My Notes App</h2>
            <p>Your personal notes</p>
          </div>
        </div>

        <button className="create-button" onClick={startNewNote}>
          <span>＋</span> Create a note
        </button>

        <div className="sidebar-heading">NOTES</div>

        <button
          className={`nav-item ${activePage === 'all' ? 'active' : ''}`}
          onClick={() => {
            setActivePage('all')
            setSelectedNote(null)
          }}
        >
          <span className="nav-icon">
            <AllNotesIcon />
          </span>
          <span>All Notes</span>
          <span className="nav-count">
            {notes.filter(n => !n.archived && !n.trashed).length}
          </span>
        </button>

        <button
          className={`nav-item ${activePage === 'archive' ? 'active' : ''}`}
          onClick={() => {
            setActivePage('archive')
            setSelectedNote(null)
          }}
        >
          <span className="nav-icon">
            <ArchiveIcon />
          </span>
          <span>Archived</span>
          <span className="nav-count">
            {notes.filter(n => n.archived && !n.trashed).length}
          </span>
        </button>

        <button
          className={`nav-item ${activePage === 'trash' ? 'active' : ''}`}
          onClick={() => {
            setActivePage('trash')
            setSelectedNote(null)
          }}
        >
          <span className="nav-icon">
            <TrashIcon />
          </span>
          <span>Trash</span>
          <span className="nav-count">
            {notes.filter(n => n.trashed).length}
          </span>
        </button>

      </aside>

      <main className="main-content">

        <div className="topbar">
          <p>My Notes App / {pageTitle}</p>
        </div>

        {currentNote ? (
          <section className="detail-view">
            <button
              className="secondary-button"
              onClick={() => setSelectedNote(null)}
            >
              ← Back to notes
            </button>

            <h1>{currentNote.title}</h1>
            <p className="detail-content">{currentNote.content}</p>

            <div className="action-buttons">
              {!currentNote.trashed && (
                <>
                  {!currentNote.archived && (
                    <button className="edit-button" onClick={() => editNote(currentNote)}>
                      Edit
                    </button>
                  )}
                  <button
                    className="archive-button"
                    onClick={() =>
                      currentNote.archived
                        ? restoreArchive(currentNote.id)
                        : archiveNote(currentNote.id)
                    }
                  >
                    {currentNote.archived ? 'Restore' : 'Archive'}
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => moveToTrash(currentNote.id)}
                  >
                    Move to Trash
                  </button>
                </>
              )}

              {currentNote.trashed && (
                <>
                  <button className="restore-button" onClick={() => restoreTrash(currentNote.id)}>
                    Restore
                  </button>
                  <button className="delete-button" onClick={() => permanentDelete(currentNote.id)}>
                    Permanently Delete
                  </button>
                </>
              )}
            </div>
          </section>
        ) : (
          <>
            <header className="page-header">
              <div>
                <p className="eyebrow">YOUR NOTES</p>
                <h1>{pageTitle}</h1>
                <p className="subtitle">
                  {activePage === 'all'
                    ? 'Capture your thoughts, plans and little ideas.'
                    : activePage === 'archive'
                      ? 'Your notes saved for later.'
                      : 'Notes you have moved to trash.'}
                </p>
              </div>
            </header>

            {activePage === 'all' && (
              <section className="capture-card">
                <p className="card-label">
                  {editId !== null ? 'EDIT NOTE' : 'QUICK CAPTURE'}
                </p>

                <input
                  className="title-input"
                  type="text"
                  placeholder="Give your note a title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />

                <textarea
                  className="content-input"
                  placeholder="What's in your mind?"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />

                <div className="capture-actions">
                  <button className="save-button" onClick={addNote}>
                    {editId !== null ? 'Update Note' : '＋ Save Note'}
                  </button>

                  {editId !== null && (
                    <button className="secondary-button" onClick={cancelEdit}>
                      Cancel
                    </button>
                  )}
                </div>
              </section>
            )}

            <section className="notes-area">
              <div className="notes-toolbar">
                <h2>{activePage === 'all' ? 'Your notes' : pageTitle}</h2>

                <input
                  className="search-input"
                  type="search"
                  placeholder="Search notes..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {visibleNotes.length > 0 ? (
                <div className="notes-grid">
                  {visibleNotes.map(note => (
                    <article className="note-card" key={note.id}>
                      <div className="note-card-top">
                        <span className="note-tag">
                          {note.trashed
                            ? 'TRASH'
                            : note.archived
                              ? 'ARCHIVED'
                              : note.pinned
                                ? 'PINNED'
                                : 'NOTE'}
                        </span>

                        {note.pinned && !note.archived && !note.trashed && (
                          <span className="pin-indicator">📌</span>
                        )}
                      </div>

                      <h3>{note.title}</h3>

                      <p
                        className="note-preview"
                        onClick={() => setSelectedNote(note.id)}
                      >
                        {note.content}
                      </p>

                      <button
                        className="read-button"
                        onClick={() => setSelectedNote(note.id)}
                      >
                        Read full note →
                      </button>

                      <div className="card-actions">
                        {activePage === 'all' && (
                          <>
                            <button className="edit-button" onClick={() => editNote(note)}>
                              Edit
                            </button>
                            <button className="pin-button" onClick={() => togglePin(note.id)}>
                              {note.pinned ? 'Unpin' : 'Pin'}
                            </button>
                            <button className="archive-button" onClick={() => archiveNote(note.id)}>
                              Archive
                            </button>
                            <button className="delete-button" onClick={() => moveToTrash(note.id)}>
                              Trash
                            </button>
                          </>
                        )}

                        {activePage === 'archive' && (
                          <>
                            <button className="restore-button" onClick={() => restoreArchive(note.id)}>
                              Restore
                            </button>
                            <button className="delete-button" onClick={() => moveToTrash(note.id)}>
                              Trash
                            </button>
                          </>
                        )}

                        {activePage === 'trash' && (
                          <>
                            <button className="restore-button" onClick={() => restoreTrash(note.id)}>
                              Restore
                            </button>
                            <button className="delete-button" onClick={() => permanentDelete(note.id)}>
                              Delete permanently
                            </button>
                          </>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    {activePage === 'trash'
                      ? '▤'
                      : activePage === 'archive'
                        ? '▣'
                        : '＋'}
                  </div>
                  <h3>
                    {activePage === 'trash'
                      ? 'Your trash is empty'
                      : activePage === 'archive'
                        ? 'No archived notes yet'
                        : 'A little space for big ideas.'}
                  </h3>
                  <p>
                    {activePage === 'all'
                      ? 'Create your first note and keep your thoughts organised.'
                      : 'Your notes will appear here when you move them to this section.'}
                  </p>
                </div>
              )}
            </section>
          </>
        )}

      </main>
    </div>
  )
}

export default App
