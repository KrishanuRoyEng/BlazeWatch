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