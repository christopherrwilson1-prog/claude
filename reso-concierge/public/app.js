document.getElementById('reservationForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector('.submit-btn');
  const successMessage = document.getElementById('successMessage');

  // Disable button during submission
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  // Get form data
  const formData = {
    restaurant: form.restaurant.value,
    date: form.date.value,
    time: form.time.value,
    partySize: form.partySize.value,
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    notes: form.notes.value
  };

  try {
    const response = await fetch('/api/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok) {
      // Show success message
      successMessage.style.display = 'block';
      form.style.display = 'none';

      // Scroll to success message
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      alert('Error: ' + (result.error || 'Something went wrong'));
      submitBtn.disabled = false;
      submitBtn.textContent = 'Find My Reservation';
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to submit request. Please try again.');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Find My Reservation';
  }
});

// Set minimum date to today
document.getElementById('date').min = new Date().toISOString().split('T')[0];
