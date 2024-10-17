// dashboard.js

// Modal Logic
const modal = document.getElementById('appModal');
const addAppBtn = document.getElementById('addAppBtn');
const closeModal = document.getElementsByClassName('close')[0];

// Open Modal
addAppBtn.onclick = () => {
    modal.style.display = 'block';
};

// Close Modal
closeModal.onclick = () => {
    modal.style.display = 'none';
};

// Close Modal when clicking outside
window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Fetch applications from server and populate table
const applicationTable = document.querySelector('#application-table tbody');

function fetchApplications() {
    fetch('/api/applications') // Change this line
        .then((response) => response.json())
        .then((data) => {
            applicationTable.innerHTML = '';
            let pendingCount = 0;
            let resolvedCount = 0;

            data.forEach((app) => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td><input type="checkbox" class="app-checkbox" value="${app.id}"></td>
                    <td>${app.id}</td>
                    <td>${app.name}</td>
                    <td>${app.address}</td>
                    <td>${app.status}</td>
                    <td><button class="open-btn">Open</button></td>
                `;

                applicationTable.appendChild(row);

                if (app.status === 'Pending') pendingCount++;
                else resolvedCount++;
            });

            document.getElementById('pending-count').innerText = pendingCount;
            document.getElementById('resolved-count').innerText = resolvedCount;
        })
        .catch((error) => {
            console.error('Error fetching applications:', error);
        });
}

// Form Submission for Adding New Application
const applicationForm = document.getElementById('applicationForm');

applicationForm.onsubmit = (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const status = document.getElementById('status').value;

    fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address, status }),
    })
        .then((response) => response.json())
        .then(() => {
            fetchApplications(); // Refresh the table
            modal.style.display = 'none'; // Close modal
            applicationForm.reset(); // Reset form
        });
};

// Delete Selected Applications
const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');

deleteSelectedBtn.onclick = () => {
    const selectedIds = Array.from(document.querySelectorAll('.app-checkbox:checked')).map((checkbox) => checkbox.value);

    if (selectedIds.length > 0) {
        fetch('/api/applications', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: selectedIds }),
        })
            .then(() => fetchApplications())  // Refresh the table
            .catch((error) => console.error('Error:', error));
    } else {
        alert('No applications selected for deletion.');
    }
};

// Initial fetch
fetchApplications();

document.addEventListener('DOMContentLoaded', () => {
    fetchApplications(); // Fetch applications when the DOM is fully loaded
});