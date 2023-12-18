const flyDiv = document.getElementById('fly')
const flyplassVelger = document.querySelector('#flyplass-velger')

//  OPPDATERER TIDEN PÅ SIDEN
const updateTime = () => {
    const timeNow = document.getElementById('time-now')
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    timeNow.innerHTML = `${hours}:${minutes}`
}

updateTime();
setInterval(updateTime, 20000);

// LASTER INN FLYTIDER
const lastInnFlytider = async () => {
    try {
        const valgtFlyplass = flyplassVelger.value;

        let apiurl = '';

        if (valgtFlyplass === 'BGO') {
            apiurl = 'http://localhost:4000/bergenlufthavn'
        } else if (valgtFlyplass === 'OSL') {
            apiurl = 'http://localhost:4000/oslolufthavn'
        } else if (valgtFlyplass === 'SVG') {
            apiurl = 'http://localhost:4000/stavangerlufthavn'
        } else if (valgtFlyplass === 'BOO') {
            apiurl = 'http://localhost:4000/bodolufthavn'
        } else if (valgtFlyplass === 'TRD') {
            apiurl = 'http://localhost:4000/trondheimlufthavn'
        }

        flyDiv.innerHTML = ''; // fjerner eksisterende innhold før jeg laster på nytt.

        const res = await axios.get(apiurl)
        const flights = res.data.flights

        let index = 0; // lager variablen index som kan hjelpe meg å sette ulik bakgrunnsfarge for annenhver rad


        for (let flight of flights) {
            if (!flight.status || flight.status && !flight.status.includes('Avreist')) { // Måtte legge til at den lager flrader for de som ikke har noe flightstatus også. Også grunnen til at jeg putta "har flight status" OG flight status inneholder avreist var at jeg fikk feilmelding hvis jeg prøvde å kjøre include-metoden på de som hadde null på status. Så må bare kjøre metoden på de som har en verdi i status.
                const flyrad = document.createElement('div')
                flyrad.classList.add('flyrad-wrapper');

                if (index % 2 === 1) {
                    flyrad.setAttribute('id', 'light-row')
                }


                flyrad.innerHTML = `
            <div class="flyrad-innholds-wrapper"> 
                <div class="tid-wrapper"> <p> ${flight.scheduledTime}</p> </div>
                <div class="logo-wrapper"> <img src="images/logos/${flight.airlineName} logo.png" alt="${flight.airlineName}-logo"> </div>
                <div class="id-wrapper"> <p> ${flight.flightId}</p> </div>
                <div class="gate-wrapper"> <p> ${flight.gate || ''}</p> </div>
                <div class="destinasjon-wrapper"> <p> ${flight.toAirportName}</p> </div>
                <div class="status-wrapper"> <p> ${flight.status || flight.gateOrBeltStatus || ''} </p> </div>
            </div>
        `;
                flyDiv.append(flyrad)
                index++;
            }
        }
    } catch (error) {
        console.error(error);
    }
}
lastInnFlytider();
setInterval(lastInnFlytider, 200000);

flyplassVelger.addEventListener('change', () => {
    lastInnFlytider()
}
);


