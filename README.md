Router initially loades Home.js and there it fetches vehicles and planets data

On click of Find Falcone button it goes to Result.js to show the final output

## Redux stores
destionations.js - to store user selected information
sources.js - to store data fetched through api calls
actions.js - to perform operations such as getting vehicles, planets

## Handling api request
axios.js - interecepts all requests and attaches token to header if needed.

Just unzip and perform npm install