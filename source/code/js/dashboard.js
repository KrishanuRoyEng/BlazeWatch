// Modal Logic
const modal = document.getElementById('appModal');
const addAppBtn = document.getElementById('addAppBtn');
const closeModal = document.getElementsByClassName('close')[0];

// Open Modal for Adding Application
addAppBtn.onclick = () => {
    modal.style.display = 'block';
};

// Close Modal for Adding Application
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
    fetch('/api/applications') // API endpoint for fetching applications
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
                    <td><button class="open-btn" data-id="${app.id}">Open</button></td>
                `;

                applicationTable.appendChild(row);

                if (app.status === 'Pending') pendingCount++;
                else resolvedCount++;
            });

            document.getElementById('pending-count').innerText = pendingCount;
            document.getElementById('resolved-count').innerText = resolvedCount;

            // Attach event listeners for the "Open" buttons
            document.querySelectorAll('.open-btn').forEach((button) => {
                button.addEventListener('click', openApplicationDetails);
            });
        })
        .catch((error) => {
            console.error('Error fetching applications:', error);
        });
}

// Open Modal and Show Application Details
const viewAppModal = document.getElementById('viewAppModal');
const appDetailsDiv = document.getElementById('appDetails');
const closeViewModal = document.getElementsByClassName('close-view')[0];

// Open application details in modal
function openApplicationDetails(event) {
    const appId = event.target.getAttribute('data-id');

    // Fetch application details and inspection items from the server
    fetch(`/api/applicant-details/${appId}`)
        .then((response) => response.json())
        .then((app) => {
            appDetailsDiv.innerHTML = `
                <p><strong>ID:</strong> ${app.id}</p>
                <p><strong>Name:</strong> ${app.name}</p>
                <p><strong>Address:</strong> ${app.address}</p>
                <p><strong>Status:</strong> ${app.status}</p>
            `;

            // Fetch and display related inspection items
            fetch(`/api/inspection_items/${appId}`)
                .then((response) => response.json())
                .then((inspectionItems) => {
                    const inspectionList = document.createElement('ul');
                    inspectionItems.forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = item.description;  // Assuming `description` is an inspection detail
                        inspectionList.appendChild(li);
                    });
                    appDetailsDiv.appendChild(inspectionList);
                });

            viewAppModal.style.display = 'block'; // Show modal
        })
        .catch((error) => {
            console.error('Error fetching application details:', error);
        });
}

// Close View Application Modal
closeViewModal.onclick = () => {
    viewAppModal.style.display = 'none';
};

// Close View Modal when clicking outside
window.onclick = (event) => {
    if (event.target === viewAppModal) {
        viewAppModal.style.display = 'none';
    }
};

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
