document.addEventListener('DOMContentLoaded', () => {
    const partyList = document.getElementById('party-list');

    // Fetches parties and RSVPs from the API as required :)
    fetchParties();

    async function fetchParties() {
        try {
            const response = await fetch('https://fsa-crud-2aa9294fe819.herokuapp.com/api/2109-CPU-RM-WEB-PT/events');
            const partiesData = await response.json();

            const rsvpsResponse = await fetch('https://fsa-crud-2aa9294fe819.herokuapp.com/api/2109-CPU-RM-WEB-PT/rsvps');
            const rsvpsData = await rsvpsResponse.json();

            renderParties(partiesData.data, rsvpsData.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function renderParties(parties, rsvps) {
        partyList.innerHTML = ''; // this right here will clear existing party list :)

        parties.forEach(party => {
            const partyItem = document.createElement('div');
            partyItem.classList.add('party-item');

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteParty(party.id));

            const rsvpList = document.createElement('ul');
            rsvpList.innerHTML = '<strong>RSVPs:</strong>';

            const partyRsvps = rsvps.filter(rsvp => rsvp.eventId === party.id);
            partyRsvps.forEach(rsvp => {
                const rsvpItem = document.createElement('li');
                rsvpItem.textContent = `${rsvp.name} (${rsvp.email}, ${rsvp.phone})`;
                rsvpList.appendChild(rsvpItem);
            });

            partyItem.innerHTML = `
                <h2>${party.name}</h2>
                <p><strong>Date:</strong> ${party.date}</p>
                <p><strong>Time:</strong> ${formatTime(party.date)}</p>
                <p><strong>Location:</strong> ${party.location}</p>
                <p><strong>Description:</strong> ${party.description}</p>
            `;

            partyItem.appendChild(rsvpList);
            partyItem.appendChild(deleteButton);
            partyList.appendChild(partyItem);
        });
    }

    async function deleteParty(partyId) {
        try {
            const response = await fetch(`https://fsa-crud-2aa9294fe819.herokuapp.com/api/2109-CPU-RM-WEB-PT/events/${partyId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
              
                fetchParties();
            } else {
                console.error('Failed to delete party:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting party:', error);
        }
    }

    function formatTime(dateTimeString) {
        const dateTime = new Date(dateTimeString);
        return dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
});

// some mock data to test my code 

const mockParties = [
    {
        id: 1,
        name: "Birthday Party",
        date: "2024-05-25T18:00:00.000Z",
        location: "123 Main Street",
        description: "A fun birthday celebration"
    },
    {
        id: 2,
        name: "Summer BBQ",
        date: "2024-06-15T15:00:00.000Z",
        location: "456 Oak Avenue",
        description: "Enjoy some grilled food and good company"
    }
];

const mockRsvps = [
    {
        id: 1,
        eventId: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890"
    },
    {
        id: 2,
        eventId: 1,
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "987-654-3210"
    },
    {
        id: 3,
        eventId: 2,
        name: "Alice Johnson",
        email: "alice@example.com",
        phone: "555-555-5555"
    }
];
