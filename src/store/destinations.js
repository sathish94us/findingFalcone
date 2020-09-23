var initialState = {
    limit: 4,
    destinations: [],
    timeTaken: 0
}

const destionationsReducer = (state = initialState, action) => {
    var oldState = {...state};
    switch (action.type) {
        case "addDestination": {
            oldState = {...state, destinations: oldState.destinations.concat(action.value)};
            break;
        }

        case "removeDestination": {
            var dests = [...oldState.destinations];
            if(action.value === -1)
                return;
            dests.splice(action.value, 1);
            oldState = {...state, destinations: dests};
            break;
        }
        
        case "addTime": {
            oldState = {...state, timeTaken: action.value};
            break;
        }

        case "reset": {
            oldState = {...state, destinations: [], timeTaken: 0};
            break;
        }
    }

    return oldState;
}


export default destionationsReducer;