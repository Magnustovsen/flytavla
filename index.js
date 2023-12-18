const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');
app.use(cors());

const formatTime = (date) => {
    return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
};

const getTimes = () => {
    const currentTime = new Date();
    const eightHoursLater = new Date(currentTime.getTime() + 8 * 60 * 60 * 1000);
    const fourHoursEarlier = new Date(currentTime.getTime() - 4 * 60 * 60 * 1000);
    const start = formatTime(fourHoursEarlier);
    const end = formatTime(eightHoursLater);
    return { start, end };
};

let cachedData = {
    bergenlufthavn: null,
    oslolufthavn: null,
    stavangerlufthavn: null,
    bodolufthavn: null,
    trondheimlufthavn: null
}

// Funksjon for å hente flytider. Tar i mot airportkode som argument så man kan hente flytider for de ulike flyplassene
const fetchFlightData = async (airportCode) => {
    try {
        const { start, end } = getTimes();
        const response = await axios.get(`https://www.avinor.no/Api/Flights/Airport/${airportCode}?direction=d&start=${start}&end=${end}&language=no`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Oppdaterer cachedData-variablen ved å bruke fetchFlightData-funksjonen
const updateCachedData = async () => {
    const airports = [{ airportCode: 'BGO', airportName: 'bergenlufthavn' }, { airportCode: 'OSL', airportName: 'oslolufthavn' }, { airportCode: 'SVG', airportName: 'stavangerlufthavn' }, { airportCode: 'BOO', airportName: 'bodolufthavn' }, { airportCode: 'TRD', airportName: 'trondheimlufthavn' }]
    for (const airport of airports) {
        cachedData[airport.airportName] = await fetchFlightData(airport.airportCode);
    }
};

// Update data initially and every 2 minutes (120000 ms)
updateCachedData();
setInterval(updateCachedData, 120000);

app.get('/bergenlufthavn', async (req, res) => {
    try {
        res.json(cachedData.bergenlufthavn);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.get('/oslolufthavn', async (req, res) => {
    try {
        res.json(cachedData.oslolufthavn);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.get('/trondheimlufthavn', async (req, res) => {
    try {
        res.json(cachedData.trondheimlufthavn);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.get('/stavangerlufthavn', async (req, res) => {
    try {
        res.json(cachedData.stavangerlufthavn);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.get('/bodolufthavn', async (req, res) => {
    try {
        res.json(cachedData.bodolufthavn);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(4000, () => {
    console.log('Listening on port 4000');
});


