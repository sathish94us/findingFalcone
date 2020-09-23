import instance from '../axios';

export const getPlanets = () => {
    return (dispatch) => {
        instance.get("/planets").then(planets => {
            dispatch({
                type: "addPlanets",
                value: planets.data
            });
        }).catch(err => {
            dispatch({
                type: "addError",
                value: "Could not fetch planets data due to network issue. Please try again"
            });
        })
    }
}

export const getVehicles = () => {
    return (dispatch) => {
        instance.get("/vehicles").then(vehicles => {
            dispatch({
                type: "addVehicles",
                value: vehicles.data
            });
        }).catch(err => {
            dispatch({
                type: "addError",
                value: "Could not fetch vehicles data due to network issue. Please try again"
            });
        })
    }
}

export const getToken = () => {
    return (dispatch) => {
        instance.post("/token", {}).then(token => {
            dispatch({
                type: "addToken",
                value: token.data.token
            });
        }).catch(err => {
            dispatch({
                type: "addError",
                value: "Could not fetch data due to network issue. Please try again"
            });
        })
    }
}