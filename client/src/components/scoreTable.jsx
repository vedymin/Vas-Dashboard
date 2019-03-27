import React, { Component } from "react";
import Axios from "axios";
import DatePicker from "react-datepicker";
import dateFormat from "dateformat";
import _ from "lodash";

import "react-datepicker/dist/react-datepicker.css";

var fileDownload = require("js-file-download");
var json2xls = require("json2xls");

class ScoreTable extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { scores: [], startDate: new Date(), endDate: new Date() };
    this.state.endDate.setMinutes(this.state.endDate.getMinutes() + 60);
    this.state.endDate.setMinutes(0);
    this.state.startDate.setHours(6, 0, 0);
    this.handleExportToExcel = this.handleExportToExcel.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.DownloadScores = this.DownloadScores.bind(this);
    this.toCSV = this.toCSV.bind(this);
  }

  toCSV(json) {
    var csv = "";
    var keys = (json[0] && Object.keys(json[0])) || [];
    csv += keys.join(";") + "\n";
    for (var line of json) {
      csv += keys.map(key => line[key]).join(";") + "\n";
    }
    return csv;
  }

  handleExportToExcel() {
    // Axios.get("/export");
    let data = this.toCSV(this.state.scores);
    console.log(data);
    fileDownload(data, "scores.csv");
  }

  handleStartDateChange(startDate) {
    this.setState({ startDate }, () => {
      this.DownloadScores();
    });
  }

  handleEndDateChange(endDate) {
    this.setState({ endDate }, () => {
      this.DownloadScores();
    });
  }

  DownloadScores() {
    Axios.get(
      `/score/${dateFormat(
        this.state.startDate,
        "yyyy-mm-dd HH:MM"
      )}/${dateFormat(this.state.endDate, "yyyy-mm-dd HH:MM")}`
    ).then(res => {
      console.log(res);
      let { data } = res;
      data = _.orderBy(data, "Score", "desc");
      this.setState({ scores: data });
    });
  }

  componentDidMount() {
    this.DownloadScores();
  }

  state = {};
  render() {
    return (
      <div className="container">
        <button
          className="btn btn-primary mb-2"
          onClick={this.handleExportToExcel}
        >
          Export to excel
        </button>
        <h2>Scores</h2>

        <div className="container">
          <div className="row">
            <div className="col-4">
              <form>
                <label>From: </label>
                <DatePicker
                  selected={this.state.startDate}
                  onChange={this.handleStartDateChange}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMM d, HH:mm"
                  timeCaption="time"
                  className="m-2 form-control"
                />
              </form>
            </div>
            <div className="col-4">
              <form>
                <label>To: </label>
                <DatePicker
                  selected={this.state.endDate}
                  onChange={this.handleEndDateChange}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMM d, HH:mm"
                  timeCaption="time"
                  className="m-2 form-control"
                />
              </form>
            </div>
          </div>
          {/* <div class="row">
            <div class="col">1 of 3</div>
            <div class="col">2 of 3</div>
          </div> */}
        </div>

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
