import React, { Component } from "react";
import "./NotesAutoSave.css";

export default class NotesAutoSave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      currentNote: "",
      maxLength: 500,
      darkMode: false,
      dernièreSauv: null,
    };
  }

  componentDidMount() {
    const stored = localStorage.getItem("notes");
    const mode = localStorage.getItem("darkMode");
    const time = localStorage.getItem("dernièreSauv");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.setState({ notes: Array.isArray(parsed) ? parsed : [] });
      } catch (e) {
        this.setState({ notes: [] });
      }
    }
    if (mode === "true") {
      this.setState({ darkMode: true });
      try { document.body.classList.add('dark'); } catch (e) {}
    }
    if (time) this.setState({ dernièreSauv: time });
  }

  handleChange = (e) => {
    const val = e.target.value;
    if (val.length <= this.state.maxLength) this.setState({ currentNote: val });
  };

  addNote = () => {
    const text = this.state.currentNote.trim();
    if (!text) return;
    const now = new Date().toLocaleString();
    const note = { id: Date.now(), text, createdAt: now };
    const next = [note, ...this.state.notes];
    this.setState({ notes: next, currentNote: "", dernièreSauv: now }, () => {
      localStorage.setItem("notes", JSON.stringify(this.state.notes));
      localStorage.setItem("dernièreSauv", this.state.dernièreSauv);
    });
  };

  deleteNote = (id) => {
    const next = this.state.notes.filter((n) => n.id !== id);
    const now = new Date().toLocaleString();
    this.setState({ notes: next, dernièreSauv: now }, () => {
      localStorage.setItem("notes", JSON.stringify(this.state.notes));
      localStorage.setItem("dernièreSauv", this.state.dernièreSauv);
    });
  };

  clearAll = () => {
    localStorage.removeItem("notes");
    localStorage.removeItem("dernièreSauv");
    this.setState({ notes: [], currentNote: "", dernièreSauv: null });
  };

  toggleDark = () => {
    const next = !this.state.darkMode;
    this.setState({ darkMode: next }, () => {
      localStorage.setItem("darkMode", this.state.darkMode);
      try { document.body.classList.toggle('dark', next); } catch (e) {}
    });
  };

  render() {
    const remaining = this.state.maxLength - this.state.currentNote.length;
    const containerClass = this.state.darkMode ? "notes-container dark" : "notes-container";
    return (
      <div className={containerClass}>
        <h2>Gestion des notes</h2>
        <div className="controls">
          <label className="toggle">
            <input type="checkbox" checked={this.state.darkMode} onChange={this.toggleDark} />
            <span>Dark mode</span>
          </label>
        </div>
        <textarea value={this.state.currentNote} onChange={this.handleChange} placeholder="Écrire votre note"></textarea>
        <div className="meta">
          <p>Caractères restants : {remaining}</p>
          <p>Dernière sauvegarde : {this.state.dernièreSauv || "-"}</p>
        </div>
        <div className="actions">
          <button className="add" onClick={this.addNote} disabled={!this.state.currentNote.trim()}>Ajouter la note</button>
          <button className="clear" onClick={this.clearAll}>Effacer tout</button>
        </div>
        <div className="notes-list">
          {this.state.notes.length === 0 ? <p className="empty">Aucune note</p> : null}
          {this.state.notes.map((n) => (
            <div key={n.id} className="note-item">
              <div className="note-text">{n.text}</div>
              <div className="note-footer">
                <small>{n.createdAt}</small>
                <button className="delete" onClick={() => this.deleteNote(n.id)}>Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

