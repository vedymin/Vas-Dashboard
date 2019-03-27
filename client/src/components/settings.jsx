import React, { Component } from "react";
import Axios from "axios";

class Settings extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { settings: [] };
    this.handleExportToExcel = this.handleExportToExcel.bind(this);
    this.handleWageChange = this.handleWageChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    Axios.get("/settings").then(res => {
      // console.log(res);
      // this.setState({ settings: res.data });
      let results = res.data;
      results.forEach(x => (x.disabled = true));
      this.setState({ settings: results });
    });
  }

  async handleSave(e) {
    e.preventDefault();
    const settings = [...this.state.settings];
    const wage = Number(e.target.value);
    const id = Number(e.target.id);
    const newVas = settings.filter(x => x.VasID === id);
    settings.find(x => x.VasID === id).disabled = true;
    console.log(`/settings/${id}/${wage}`);
    await Axios.put(`/settings/${id}/${wage}`, newVas);
    this.setState({ settings });
  }

  handleExportToExcel() {
    console.log("działa");
  }

  handleWageChange(e) {
    const settings = [...this.state.settings];
    const wage = e.target.value;
    const id = Number(e.target.id);
    settings.find(x => x.VasID === id).Wage = wage;
    settings.find(x => x.VasID === id).disabled = false;
    this.setState({ settings });
  }

  render() {
    return (
      <div className="container">
        <h1>Settings</h1>
        <table className="table mx-auto">
          <thead>
            <tr>
              <th scope="col">Vas ID</th>
              <th scope="col">Description</th>
              <th scope="col">Flag</th>
              <th scope="col">Flag Value</th>
              <th scope="col">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {this.state.settings.map(vas => (
              <tr key={vas.VasID}>
                <td>{vas.VasID}</td>
                <td>{vas.Description}</td>
                <td>{vas.Flag}</td>
                <td>{vas.FlagValue}</td>
                <td>
                  {vas.Wage}
                  <input
                    onChange={this.handleWageChange}
                    type="range"
                    className="custom-range"
                    min="0"
                    max="10"
                    id={vas.VasID}
                    value={vas.Wage}
                  />
                </td>
                <td>
                  <button
                    id={vas.VasID}
                    disabled={vas.disabled}
                    className="btn btn-primary"
                    onClick={this.handleSave}
                    value={vas.Wage}
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Settings;
