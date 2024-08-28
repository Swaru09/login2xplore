const rollNoInput = document.getElementById('rollNo');
const form = document.getElementById('enrollmentForm');
const inputs = form.querySelectorAll('input:not([type="button"]):not([type="reset"])');
const saveBtn = document.getElementById('saveBtn');
const updateBtn = document.getElementById('updateBtn');
const resetBtn = document.getElementById('resetBtn');

rollNoInput.addEventListener('input', function () {
    const rollNo = rollNoInput.value.trim();

    if (rollNo) {
        fetch(`/check_student?rollNo=${rollNo}`)
            .then(response => response.json())
            .then(data => {
                if (data.Roll_No) {
                    // Roll number exists in the database
                    inputs.forEach(input => {
                        input.value = data[input.name] || '';
                        input.disabled = false;
                    });
                    rollNoInput.disabled = true; // Disable Roll No input
                    saveBtn.disabled = true; // Disable Save button
                    updateBtn.disabled = false; // Enable Update button
                } else {
                    // Roll number does not exist, enable all fields except Roll No
                    inputs.forEach(input => {
                        if (input.name !== 'rollNo') {
                            input.disabled = false;
                            input.value = '';
                        }
                    });
                    saveBtn.disabled = false; // Enable Save button
                    updateBtn.disabled = true; // Disable Update button
                }
                resetBtn.disabled = false; // Enable Reset button
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to fetch student data. Please try again.');
            });
    } else {
        // If Roll No is empty, disable everything
        inputs.forEach(input => {
            input.disabled = true;
            input.value = '';
        });
        saveBtn.disabled = true;
        updateBtn.disabled = true;
        resetBtn.disabled = true;
    }
});

saveBtn.addEventListener('click', function () {
    submitForm('/save_student');
});

updateBtn.addEventListener('click', function () {
    submitForm('/update_student');
});

function submitForm(actionUrl) {
    const formData = new FormData(form);
    fetch(actionUrl, {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.text())
    .then(result => alert(result))
    .catch(error => console.error('Error:', error));
}

resetBtn.addEventListener('click', function () {
    form.reset();
    inputs.forEach(input => {
        input.disabled = true;
        input.value = '';
    });
    saveBtn.disabled = true;
    updateBtn.disabled = true;
    rollNoInput.disabled = false;
    rollNoInput.focus();
});
