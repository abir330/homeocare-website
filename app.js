/**
 * Dr. Abir Lal Ghosh - Homeopathy Website JS Logic
 * Contains navigation behaviors, FAQ accordion, booking form validation & simulation
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. Sticky Header & Active Nav Links
       ========================================== */
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function handleScroll() {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Nav Link highlighting based on scroll position
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200; // Offset for header height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once initially

    /* ==========================================
       2. Mobile Navigation Toggle
       ========================================== */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });

        // Close menu when clicking the CTA button in mobile menu
        const navBookBtn = document.getElementById('nav-book-btn');
        if (navBookBtn) {
            navBookBtn.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        }
    }

    /* ==========================================
       3. FAQ Accordion
       ========================================== */
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = question.nextElementSibling;
            const isCurrentlyActive = item.classList.contains('active');

            // Close all other FAQ items first
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
                otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // If it wasn't active, open it
            if (!isCurrentlyActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ==========================================
       4. Appointment Form Validation & Submission
       ========================================== */
    const form = document.getElementById('appointment-form');
    const bookingSuccess = document.getElementById('booking-success');
    const submitBtn = document.getElementById('submit-btn');
    const spinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
    
    // Set minimum date to today to prevent past bookings
    const dateInput = document.getElementById('form-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // Validation helper functions
    function validatePhone(phone) {
        // Simple 10-digit check
        return /^[6-9]\d{9}$/.test(phone);
    }

    function validateEmail(email) {
        if (!email) return true; // Optional field
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    if (form && bookingSuccess && submitBtn) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Reset validation errors
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => input.classList.remove('invalid'));

            let isValid = true;

            const nameInput = document.getElementById('form-name');
            const phoneInput = document.getElementById('form-phone');
            const emailInput = document.getElementById('form-email');
            const dateInput = document.getElementById('form-date');
            const chamberInput = document.getElementById('form-chamber');

            // 1. Name validation
            if (!nameInput.value.trim()) {
                nameInput.classList.add('invalid');
                isValid = false;
            }

            // 2. Phone validation (10 digits starting with 6-9)
            if (!validatePhone(phoneInput.value.trim())) {
                phoneInput.classList.add('invalid');
                isValid = false;
            }

            // 3. Email validation (if not empty)
            if (emailInput.value.trim() && !validateEmail(emailInput.value.trim())) {
                emailInput.classList.add('invalid');
                isValid = false;
            }

            // 4. Chamber validation
            if (!chamberInput.value) {
                chamberInput.classList.add('invalid');
                isValid = false;
            }

            // 5. Date validation
            if (!dateInput.value) {
                dateInput.classList.add('invalid');
                isValid = false;
            } else {
                const selectedDate = new Date(dateInput.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selectedDate < today) {
                    dateInput.classList.add('invalid');
                    isValid = false;
                }
            }

            if (isValid) {
                // Show loading state
                submitBtn.disabled = true;
                if (spinner) spinner.classList.remove('hidden');
                if (btnText) btnText.textContent = 'Processing request...';

                // Simulate API call
                setTimeout(() => {
                    // Populate success card details
                    document.getElementById('success-patient-name').textContent = nameInput.value.trim();
                    document.getElementById('success-patient-phone').textContent = phoneInput.value.trim();
                    document.getElementById('success-booking-chamber').textContent = chamberInput.value;
                    
                    // Format date to local readable format
                    const formattedDate = new Date(dateInput.value).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    document.getElementById('success-booking-date').textContent = formattedDate;

                    // Set up WhatsApp Confirmation Link
                    const whatsappBtn = document.getElementById('whatsapp-confirm-btn');
                    if (whatsappBtn) {
                        const whatsappNumber = "918768512462";
                        const ailmentSelect = document.getElementById('form-ailment');
                        const chosenAilment = ailmentSelect.options[ailmentSelect.selectedIndex]?.text || 'Not specified';
                        const messageText = `Hello Dr. Abir Lal Ghosh,\n\nI would like to book an appointment with the following details:\n\n` +
                            `• *Patient Name*: ${nameInput.value.trim()}\n` +
                            `• *Phone Number*: ${phoneInput.value.trim()}\n` +
                            `• *Selected Chamber*: ${chamberInput.value}\n` +
                            `• *Requested Date*: ${formattedDate}\n` +
                            `• *Health Concern*: ${chosenAilment}\n` +
                            `• *Symptoms*: ${document.getElementById('form-message').value.trim() || 'None'}`;
                        
                        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;
                        whatsappBtn.setAttribute('href', whatsappUrl);
                    }

                    // Show success block, hide form
                    form.classList.add('hidden');
                    bookingSuccess.classList.remove('hidden');

                    // Reset button states
                    submitBtn.disabled = false;
                    if (spinner) spinner.classList.add('hidden');
                    if (btnText) btnText.textContent = 'Submit Appointment Request';
                    
                    // Scroll to top of appointment section
                    document.getElementById('appointment').scrollIntoView({ behavior: 'smooth' });
                }, 1500);
            } else {
                // Focus on first invalid input
                const firstInvalid = form.querySelector('.invalid');
                if (firstInvalid) firstInvalid.focus();
            }
        });

        // Reset Booking Form Button
        const resetBtn = document.getElementById('reset-form-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                form.reset();
                bookingSuccess.classList.add('hidden');
                form.classList.remove('hidden');
            });
        }
    }
});
