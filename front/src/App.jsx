import { useEffect, useState } from "react";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  async function loadNotes() {
    setError("");
    const res = await fetch("/api/notes");
    if (!res.ok) {
      setError("Impossible de charger les notes.");
      return;
    }
    const data = await res.json();
    setNotes(data);
  }

  async function addNote(e) {
    e.preventDefault();
    setError("");

    const value = parseInt(content);
    if (isNaN(value) || value < 0 || value > 100) {
      setError("La note doit être un nombre entre 0 et 100.");
      return;
    }

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: value.toString() }),
    });

    if (!res.ok) {
      setError("Impossible d'ajouter la note.");
      return;
    }

    setContent("");
    await loadNotes();
  }

  async function deleteNote(id) {
    setError("");

    const res = await fetch(`/api/notes/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      setError("Impossible de supprimer la note.");
      return;
    }

    await loadNotes();
  }

  function startEdit(note) {
    setEditingId(note.id);
    setEditContent(note.content);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditContent("");
  }

  async function saveEdit(id) {
    setError("");

    const value = parseInt(editContent);
    if (isNaN(value) || value < 0 || value > 100) {
      setError("La note doit être un nombre entre 0 et 100.");
      return;
    }

    const res = await fetch(`/api/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: value.toString() }),
    });

    if (!res.ok) {
      setError("Impossible de modifier la note.");
      return;
    }

    setEditingId(null);
    setEditContent("");
    await loadNotes();
  }

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div className="page">
      <header className="header">
        <h1>Mini Notes</h1>
        <p>Projet React + API + PostgreSQL via Docker Compose</p>
      </header>

      <main className="card">
        <form onSubmit={addNote} className="form">
          <input
            type="number"
            className="input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Note (0-100)..."
            min="0"
            max="100"
          />
          <button className="button" type="submit">
            Ajouter
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        <ul className="list">
          {notes.map((n) => (
            <li key={n.id} className="item">
              {editingId === n.id ? (
                <div className="edit-form">
                  <input
                    type="number"
                    className="input"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    min="0"
                    max="100"
                    autoFocus
                  />
                  <div className="edit-buttons">
                    <button
                      className="button button-save"
                      onClick={() => saveEdit(n.id)}
                    >
                      Sauvegarder
                    </button>
                    <button
                      className="button button-cancel"
                      onClick={cancelEdit}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="note-header">
                    <div className="content">{n.content}</div>
                    <div className="actions">
                      <button
                        className="button button-edit"
                        onClick={() => startEdit(n)}
                      >
                        ✏️
                      </button>
                      <button
                        className="button button-delete"
                        onClick={() => deleteNote(n.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="date">
                    {new Date(n.created_at).toLocaleString("fr-FR")}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
