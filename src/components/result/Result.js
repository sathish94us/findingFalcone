import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import instance from '../../axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import './Result.css';

class Result extends Component {

    constructor() {
        super();
        this.state = {
            loading: true,
            planetName: "",
            found: null,
            error: ""
        }
    }

    componentDidMount() {
        // Calls api
        if (this.props.destinations.length === 0 || this.props.token === null || this.props.token === undefined) {
            return;
        }
        var find = {
            token: this.props.token,
            planet_names: this.props.destinations.map(dest => this.props.planets[dest.planet].name),
            vehicle_names: this.props.destinations.map(dest => this.props.vehicles[dest.vehicle].name)
        }
        instance.post("/find", find).then(response => {
            var data = response.data;
            if (data.status === "success") {
                this.setState({
                    planetName: data.planet_name,
                    found: true,
                    loading: false
                })
            }
            else {
                this.setState({
                    planetName: "",
                    found: false,
                    loading: false
                })
            }
        }).catch(err => {
            this.setState({
                error: "Failed Please try again"
            })
        })
    }

    onStartAgain() {
        // Redirect to home page
        window.location.href = "/home";
    }

    render() {
        if (this.props.token === null || this.props.token === undefined) {
            return <Redirect from="/" to="/home" />
        }
        var find = null;
        if (this.state.loading) {
            find = (<Backdrop open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>);
        }
        else {
            // Prints response
            if (this.state.found && this.state.error === "") {
                var timeTaken = 0;
                for (let i = 0; i < this.props.destinations.length; i++) {
                    var planetDistance = this.props.planets[this.props.destinations[i].planet].distance;
                    var vehicleSpeed = this.props.vehicles[this.props.destinations[i].vehicle].speed;
                    timeTaken += planetDistance / vehicleSpeed;
                }
                find = <div className="cl-response-container">
                    <h3 >Success! Congratulation on Finding Falcone. King Shan is mighty pleased.</h3>
                    <Grid color="primary" className="cl-paper" item>
                        <Paper className="cl-paper-bg" variant="outlined">
                            <h4>Time taken: {timeTaken}</h4>
                            <h4>Planet found: {this.state.planetName}</h4>
                        </Paper>
                    </Grid>
                    <Button color="primary" onClick={this.onStartAgain.bind(this)} variant="contained">Start Again</Button>
                </div>
            }
            else if (this.state.error === "") {
                find = <h3>Falcone is hiding in another planet. Click on <Button color="primary" onClick={this.onStartAgain.bind(this)} variant="contained">Start Again</Button></h3>
            }
            else if (this.state.error.length > 0) {
                find = <h3>{this.state.error}. <Button color="primary" onClick={this.onStartAgain.bind(this)} variant="contained">Start Again</Button></h3>
            }
        }
        return (<div className="cl-find-container cl-perfect-center">
            {find}
        </div>)
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.sources.token,
        destinations: state.destinations.destinations,
        planets: state.sources.planets,
        vehicles: state.sources.vehicles
    }
}

export default connect(mapStateToProps, null)(Result);