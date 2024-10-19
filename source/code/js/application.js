// Show or hide conditional fields for residential/commercial options
function showConditionalFields() {
    const residentialOptions = document.getElementById('residential-options');
    const commercialOptions = document.getElementById('commercial-options');

    if (document.getElementById('residential').checked) {
        residentialOptions.style.display = 'block';
        commercialOptions.style.display = 'none';
    } else if (document.getElementById('commercial').checked) {
        residentialOptions.style.display = 'none';
        commercialOptions.style.display = 'block';
    } else {
        residentialOptions.style.display = 'none';
        commercialOptions.style.display = 'none';
    }
}

// Show flat or floor number fields based on selection
document.getElementById('residential').addEventListener('change', showConditionalFields);
document.getElementById('commercial').addEventListener('change', showConditionalFields);

document.querySelectorAll('input[name="residential-option"]').forEach(option => {
    option.addEventListener('change', function() {
        document.getElementById('flat-number-field').style.display = this.value === 'flat' ? 'block' : 'none';
    });
});

document.querySelectorAll('input[name="commercial-option"]').forEach(option => {
    option.addEventListener('change', function() {
        document.getElementById('floor-number-field').style.display = this.value === 'floor' ? 'block' : 'none';
    });
});

// Form submission handling
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const form = event.target;
    const formData = new FormData(form);
    
    const inspectionItems = [];

    // Collect the selected inspection items (checkboxes with name="inspection-items")
    document.querySelectorAll('input[name="inspection_items"]:checked').forEach(item => {
        inspectionItems.push(item.value);
    });

    // Show the data in an array
    console.log("Collected inspection items:", inspectionItems);

    // Prepare the data to send in the request
    const data = {
        full_name: formData.get('full_name'),
        full_address: formData.get('full_address'),
        contact_number: formData.get('contact_number'),
        email: formData.get('email'),
        building_number: formData.get('building_number'),
        property_type: formData.get('property_type'),
        residential_option: formData.get('residential_option') || null,
        flat_number: formData.get('flat_number') || null,
        floor_number: formData.get('floor_number') || null,
        relationship: formData.get('relationship'),
        inspection_items: inspectionItems // Send inspection items as an array
    };

    // Send the data via POST request
    fetch('/api/applicant-details', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result);
        // Optionally show a success message or redirect the user
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
