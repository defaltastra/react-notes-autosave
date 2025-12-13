import React, { Component } from "react";
import "./NotesAutoSave.css";


export default class NotesAutoSave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: "",
      maxLength: 500,
      dernièreSauv: null,
    };
  }
  handleChange = (event) => {
    this.setState({
      note: event.target.value,
    });
  };
handleClear = () => {
  localStorage.removeItem("note");
  localStorage.removeItem("dernièreSauv");
  this.setState({ note: "", dernièreSauv: null });
};

componentDidMount() {
  const note = localStorage.getItem("note");
  const time = localStorage.getItem("dernièreSauv");
  if (note) this.setState({ note: note });
  if (time) this.setState({ dernièreSauv: time });
}


componentDidUpdate() {
    const now = new Date().toLocaleString();
    localStorage.setItem("note", this.state.note);
    localStorage.setItem("dernièreSauv", now);
}

  componentWillUnmount() {
    console.log("Le composant va être démonté");
  }

  render() {
    const ba9ilik  = this.state.maxLength - this.state.note.length;
    return (
      <div className="notes-container">
        <h2>Gestion automatique des notes dans un carnet numérique</h2>
        <textarea
          value={this.state.note}
          onChange={this.handleChange}
          placeholder="ecrire votre note "
        ></textarea>
        <p>Caractères restants : {ba9ilik}</p>
        <p>Dernière sauvegarde : {this.state.dernièreSauv}</p>
        <button onClick={this.handleClear}>Effacer la note </button>
      </div>
    );
  }
}

