
// load films from the server
function loadFilms() {
    // fetch the list of films from the server
    fetch('http://localhost:3000/films')
        .then(response => response.json())
        .then(films => {
            const filmsList = document.getElementById('films');
            filmsList.innerHTML = ''; // did not pass a value so as to clear the existing films

            // created list of items 
            films.forEach(film => {
                const li = document.createElement('li');
                li.className = 'film item';
                // stored the id of the film in the list item of the films
                li.setAttribute('data-id', film.id);
                
                // calculated the available tickets
                const AvailableTickets = film.capacity - film.tickets_sold;
                // did an interpolation of what i wanted to add from the db.json
                li.innerHTML = `
                
                    <h6>${film.title}</h6>
                    <img src="${film.poster}" class="img-fluid" alt="${film.title}" />
                    <p>${film.description}</p>
                    <div class="row">
                        <p class="col">Showtime - ${film.showtime}</p>
                        <p class="col">Runtime - ${film.runtime} minutes</p>
                    </div>
                    <p>Available Tickets - ${AvailableTickets}</p>
                `;

                // created  and added the but ticket button
                const buyButton = document.createElement('button');
                buyButton.innerText = 'Buy Ticket';
                buyButton.className = 'ui red button';
                // added an onclick attribute to specify the anonymous arrow function in order to buy a ticket
                buyButton.onclick = () => buyTicket(film, li);

                // added a button to the film list item
                li.appendChild(buyButton); 

                // created and added a delete button
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete movie';
                deleteButton.className = 'ui blue button';
                deleteButton.onclick = (event) => {
                    // event.stopPropagation(); 
                    //  set a click handler to delete the film
                    deleteFilm(film.id, li);
                };
 
                // added a delete button to the film list item
                li.appendChild(deleteButton);
                filmsList.appendChild(li);
            });
        })
        .catch(error => console.error('Error loading films:', error));
        // used to handle errors
}

// created a function to buy a ticket for the film
function buyTicket(film, li) {
    // calculated  the available tickets that is tickets sold from the capacity
    const availableTickets = film.capacity - film.tickets_sold;

    // used theif function to check if tickets are available
    if (availableTickets > 0) {
        // Updated tickets sold on the server
    
        fetch(`http://localhost:3000/films/${film.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tickets_sold: film.tickets_sold + 1 })
        })
        .then(response => response.json())
        .then(updatedFilm => {
            // Update frontend with a new ticket count
            // increased the local tickets sold count
            film.tickets_sold += 1;
            const availableSpan = li.querySelector('.available-tickets');
            // updated the available tickets displayed
            availableSpan.innerText = film.capacity - film.tickets_sold;

            // Checked if the film is sold out
            if (film.tickets_sold >= film.capacity) {
                li.querySelector('button.ui.orange.button').innerText = 'Sold Out';
                li.querySelector('button.ui.orange.button').disabled = true;
                li.classList.add('sold-out');
            }

            // logged the ticket purchase
            logTicketPurchase(updatedFilm.id, 1);
        })
        .catch(error => console.error('Error purchasing ticket:', error));
    } else {
        // created an alert if no tickets are available
        alert('Sorry, this film is sold out.');
    }
}

// Function to log the ticket purchase
function logTicketPurchase(filmId, numberOfTickets) {
    fetch('http://localhost:3000/tickets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            film_id: filmId,
            number_of_tickets: 1
        })
    })
    .then(response => response.json())
    .then(data => console.log('Ticket logged:', data))
    .catch(error => console.error('Error logging ticket purchase:', error));
}

// created a function to delete a film from the server and the list
function deleteFilm(id, li) {
    fetch(`http://localhost:3000/films/${id}`, {
        method: 'DELETE',
    })
    .then(() => {
        li.remove(); // Removed the film from the list
        console.log('Film deleted successfully');
    })
    .catch(error => console.error('Error deleting film:', error));
}

// Load films when the page loads
loadFilms();


            



        
        

        

       
   
  






  