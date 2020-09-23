var initialState = {
    planets: [],
    vehicles: [],
    token: null,
    actual: {
        planets: [],
        vehicles: []
    },
    error: null
}

const sourcesReducer = (state = initialState, action) => {
    var oldState = { ...state };
    switch (action.type) {
        case "addPlanets": {
            oldState = { ...state, planets: oldState.planets.concat(action.value), error: null };
            oldState.actual.planets = oldState.planets.map(planet => {
                return {...planet};
            });
            break;
        }
        case "addVehicles": {
            oldState = { ...state, vehicles: oldState.vehicles.concat(action.value), error: null }
            oldState.actual.vehicles = oldState.vehicles.map(vehicle => {
                return {...vehicle}
            });
            break;
        }
        case "addToken": {
            oldState = { ...state, token: action.value, error: null }
            break;
        }
        case "addError": {
            oldState.error = action.value;
            break;
        }
        case "removePlanets": {
            oldState = { ...state, planets: oldState.planets.splice(0, oldState.planets.length) }
            break;
        }
        case "removeVehicles": {
            oldState = { ...state, vehicles: oldState.vehicles.splice(0, oldState.vehicles.length) }
            break;
        }
        case "removeToken": {
            oldState = { ...state, token: null }
            break;
        }
        case "incVehicle": {
            if (action.value === -1)
                break;
            var vehicles = [...state.vehicles];
            vehicles[action.value].total_no += 1;
            oldState = { ...state, vehicles: vehicles }
            break;
        }
        case "decVehicle": {
            if (action.value === -1)
                break;
            var vehicles = [...state.vehicles];
            vehicles[action.value].total_no -= 1;
            oldState = { ...state, vehicles: vehicles };
            break;
        }
        case "reset": {
            oldState = { ...state, planets: oldState.actual.planets.map(planet => {
                return {...planet}
            }), vehicles: oldState.actual.vehicles.map(vehicle => {
                return {...vehicle}
            })};
            break;
        }
    }
    return oldState;
}


export default sourcesReducer;