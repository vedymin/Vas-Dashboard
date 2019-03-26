import React, { Component } from "react";
import Axios from "axios";

class ScoreTable extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { scores: [] };
    this.handleExportToExcel = this.handleExportToExcel.bind(this);
  }

  handleExportToExcel() {
    console.log("działa");
  }

  componentDidMount() {
    Axios.get("/score").then(res => {
      console.log(res);
      this.setState({ scores: res.data });
    });
  }

  state = {};
  render() {
    return (
      <div className="ScoreTable">
        <button
          className="btn btn-primary mb-2"
          onClick={this.handleExportToExcel}
        >
          Export to excel
        </button>
        <h2>Scores</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Pack Station</th>
              <th scope="col">Score</th>
              <th scope="col">Quantity</th>
              <th scope="col">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {this.state.scores.map(score => (
              <tr key={score.PackStationName}>
                <td>{score.PackStationName}</td>
                <td>{score.Score}</td>
                <td>{score.Quantity}</td>
                <td>{score.Difficulty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ScoreTable;
