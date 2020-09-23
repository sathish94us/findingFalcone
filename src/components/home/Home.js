import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actionCreators from '../../store/actions';
import './Home.css';

import Paper from '@material-ui/core/Paper';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

class Home extends Component {

    constructor() {
        super();
        this.state = {
            selectedPlanets: [-1, -1, -1, -1],
            selectedVehicles: [-1, -1, -1, -1]
        };
    }

    componentDidMount() {
        this.getInitialData();
    }

    // Loads initial data
    getInitialData() {
        this.props.getToken();
        this.props.getPlanets();
        this.props.getVehicles();
    }

    // Changes state and updates store on planet change
    onPlanetChange(event, index, planet) {
        var planetIndex = this.props.planets.findIndex(pl => pl.name === planet);
        if (this.state.selectedPlanets[index] >= 0) {
            this.setState(prevState => {
                var planets = [...prevState.selectedPlanets];
                planets[index] = planetIndex;
                if (planetIndex === -1) {
                    this.props.removeDestination(index);
                    this.props.incVehicle(this.state.selectedVehicles[index]);
                    this.setState(prevState => {
                        var vehicles = [...prevState.selectedVehicles];
                        vehicles[index] = -1;
                    })
                }
                return { selectedPlanets: planets };
            })
        }
        else {
            this.setState(prevState => {
                var planets = [...prevState.selectedPlanets];
                planets[index] = planetIndex;
                return { selectedPlanets: planets };
            })
        }
    }

    // Handles autocomplete dropdown
    onPlanetInputChange(event, index, planet) {
        if (planet.length > 0)
            return;
        this.onPlanetChange(event, index, planet);
    }

    // Changes state and updates store on vehicle change
    onVehicleChange(index, event) {
        var vehicle = event.target.value;
        var vehicleIndex = this.props.vehicles.findIndex(veh => veh.name === vehicle);
        if (this.state.selectedVehicles[index] >= 0) {
            this.setState(prevState => {
                var vehicles = [...prevState.selectedVehicles];
                if(vehicles[index] !== vehicleIndex)
                    this.props.incVehicle(this.state.selectedVehicles[index]);
                vehicles[index] = vehicleIndex;
                this.props.decVehicle(vehicleIndex);
                this.props.removeDestination(index);
                this.props.addDestination({ planet: this.state.selectedPlanets[index], vehicle: vehicleIndex });
                return { selectedVehicles: vehicles };
            })
        }
        else {
            this.setState(prevState => {
                var vehicles = [...prevState.selectedVehicles];
                vehicles[index] = vehicleIndex;
                this.props.decVehicle(vehicleIndex);
                this.props.addDestination({ planet: this.state.selectedPlanets[index], vehicle: vehicleIndex });
                return { selectedVehicles: vehicles };
            })
        }
    }

    // on reset button click
    onResetClick() {
        this.setState({
            selectedPlanets: [-1, -1, -1, -1],
            selectedVehicles: [-1, -1, -1, -1]
        });
        for(let i = 0; i < this.props.limit; i++) {
            this.refs[`autocomplete-${i+1}`].getElementsByClassName('MuiAutocomplete-clearIndicator')[0].click();
        }
        this.props.reset();
    }

    onReload() {
        window.location.href = "/home";
    }

    render() {
        var dest = null;
        if(!!this.props.error) {
            dest = <h3>{this.props.error} &nbsp;<Button color="primary" onClick={this.onReload.bind(this)} variant="contained">Reload</Button></h3>
        }
        else if (this.props.planets.length > 0 && this.props.vehicles.length > 0) {
            var destinations = [];
            for (let i = 0; i < this.props.limit; i++) {
                // Creates dropdowns
                var paper = (<Grid className="cl-paper" key={`paper_${i + 1}`} item>
                    <Paper variant="outlined">
                        <ListItemText primary={`Destination ${i + 1}`} />
                        <Autocomplete
                            ref={`autocomplete-${i+1}`}
                            id={`combo-box-demo-${i + 1}`}
                            options={this.props.planets}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => <TextField {...params} label="Planets" variant="outlined" />}
                            onChange={(event, newInputValue) => {
                                if (!!newInputValue)
                                    this.onPlanetChange(event, i, newInputValue.name);
                            }}

                            onInputChange={(event, newInputValue) => {
                                this.onPlanetInputChange(event, i, newInputValue);
                            }}
                        />

                        {(this.state.selectedPlanets[i] >= 0) && <FormControl className="cl-radio-group" component="fieldset">
                            <FormLabel style={{paddingTop: '10px'}} component="legend">Vehicles</FormLabel>
                            <RadioGroup name="vehicles" onChange={(event) => this.onVehicleChange(i, event)}>
                                {this.props.vehicles.filter(ve => {
                                    return (ve.max_distance >= this.props.planets[this.state.selectedPlanets[i]].distance)
                                }).map(veh => <FormControlLabel disabled={veh.total_no < 1} key={`vehicle-dest-${i}-${veh.name}`} value={veh.name} control={<Radio />} label={`${veh.name}`} />)}
                            </RadioGroup>
                        </FormControl>}
                    </Paper>
                </Grid>);
                destinations.push(paper);
            }

            // Calculates total time
            var timeTaken = 0;
            for (let i = 0; i < this.props.destinations.length; i++) {
                var planetDistance = this.props.planets[this.props.destinations[i].planet].distance;
                var vehicleSpeed = this.props.vehicles[this.props.destinations[i].vehicle].speed;
                timeTaken += planetDistance / vehicleSpeed;
            }

            // Creates remaining availables resources and time taken
            dest = <div>
                <h3 className="cl-title">Lets find Falcone</h3>
                <div className="cl-chip-group">
                <div className="cl-rem-chip">{this.props.vehicles.map(veh => <Chip avatar={<Avatar>{veh.total_no}</Avatar>} key={`vehicle-${veh.name}`} style={{ margin: '10px' }} color={veh.total_no < 1 ? 'secondary' : 'primary'} label={`${veh.name}`} component="a" variant="outlined" />)}</div>
                    <Chip className="cl-time-chip" label={`Time taken: ${timeTaken}`} />
                </div>
                <Grid container justify="center" spacing={5}>
                    {destinations}
                </Grid>
                <div className="cl-options-button">
                    <Button onClick={() => this.onResetClick()} variant="contained">Reset</Button>
                    <Link className={this.props.destinations.length < 4 ? 'cl-disabled cl-link' : 'cl-link'} to="find" color="primary" disabled={this.props.destinations.length < 4}>
                        <Button variant="contained" color="primary">Find Falcone</Button>
                    </Link>
                </div>
            </div>
        }
        else {
            dest = <Backdrop open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>
        }
        return (<React.Fragment>
            <div ref={(elem) => this.parentElement = elem} className="cl-home-conatiner cl-perfect-center">
                {dest}
            </div>
        </React.Fragment>)
    }
}

const mapStateToProps = (state) => {
    return {
        planets: state.sources.planets,
        vehicles: state.sources.vehicles,
        token: state.sources.token,
        error: state.sources.error,
        limit: state.destinations.limit,
        destinations: state.destinations.destinations,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getPlanets: () => {
            return dispatch(actionCreators.getPlanets());
        },
        getVehicles: () => {
            return dispatch(actionCreators.getVehicles())
        },
        getToken: () => {
            return dispatch(actionCreators.getToken())
        },
        calculateTimeTaken: () => {
            return dispatch({ type: "addTime" })
        },
        addDestination: (dest) => {
            return dispatch({ type: "addDestination", value: dest })
        },
        incVehicle: (index) => {
            return dispatch({ type: "incVehicle", value: index })
        },
        decVehicle: (index) => {
            return dispatch({ type: "decVehicle", value: index })
        },
        reset: () => {
            return dispatch({ type: "reset" })
        },
        removeDestination: (index) => {
            return dispatch({ type: "removeDestination", value: index });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);