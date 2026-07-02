/**
 * DEVELOPER PORTFOLIO JAVASCRIPT ENGINE
 * Author: Ashwani Pandey
 * Contains: Theme toggling, scroll progress, responsive navigation, active section tracking, 
 * typing automation, element scroll reveals, skills bar animation, project filtering, form validation, and toast system.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. PRELOADER & SCROLL INITIALIZATION
    // ==========================================================================
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', () => {
        if (preloader) {
            preloader.classList.add('fade-out');
            document.body.style.overflow = 'visible';
        }
    });

    // Fallback if load event takes too long
    setTimeout(() => {
        if (preloader && !preloader.classList.contains('fade-out')) {
            preloader.classList.add('fade-out');
            document.body.style.overflow = 'visible';
        }
    }, 3000);


    
    // 2. DARK/LIGHT THEME TOGGLE
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        // Default is dark mode as specified
        htmlElement.setAttribute('data-theme', 'dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
            
            showToast(`Theme switched to ${newTheme} mode!`, 'success');
        });
    }


    // ==========================================================================
    // 3. STICKY HEADER & SCROLL BEHAVIORS
    // ==========================================================================
    const header = document.getElementById('header');
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Sticky Header class toggler
        if (header) {
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Scroll Progress Bar percentage
        if (scrollProgressBar && documentHeight > 0) {
            const scrollPercentage = (scrollTop / documentHeight) * 100;
            scrollProgressBar.style.width = `${scrollPercentage}%`;
        }

        // Scroll To Top button visibility
        if (scrollToTopBtn) {
            if (scrollTop > 400) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        }
    });

    // Scroll to Top action
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // ==========================================================================
    // 4. MOBILE DRAWER NAVIGATION MENU
    // ==========================================================================
    const hamburger = document.getElementById('hamburger-menu');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navbar) {
        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.toggle('active');
            navbar.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            
            // Prevent body scrolling when menu is open
            if (isActive) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'visible';
            }
        });

        // Close mobile drawer on clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navbar.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'visible';
            });
        });
    }


    // ==========================================================================
    // 5. HERO TYPING ANIMATION
    // ==========================================================================
    const typingSpan = document.getElementById('typing-text');
    
    if (typingSpan) {
        const words = JSON.parse(typingSpan.getAttribute('data-words'));
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function typeWords() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingSpan.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50; // Deleting is faster
            } else {
                typingSpan.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100; // Normal typing speed
            }

            // Word completely typed out
            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end of word
            } 
            // Word completely deleted
            else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length; // Loop around words
                typeSpeed = 500; // Brief pause before typing next word
            }

            setTimeout(typeWords, typeSpeed);
        }

        // Start typing loop
        setTimeout(typeWords, 1000);
    }


    // ==========================================================================
    // 6. SCROLL REVEAL ANIMATIONS
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');

    // Observer options
    const observerOptions = {
        root: null, // Viewport
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: '0px 0px -50px 0px' // Margins around viewport
    };

    // Scroll reveal observer
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animates only once
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));


    // ==========================================================================
    // 7. ACTIVE NAVIGATION HIGHLIGHT (SCROLLSPY)
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    
    if (sections.length > 0) {
        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            root: null,
            threshold: 0.3, // Trigger when 30% of the section is visible
            rootMargin: '-20% 0px -55% 0px' // Adjust scrollspy window
        });

        sections.forEach(section => spyObserver.observe(section));
    }


    // ==========================================================================
    // 8. PROJECT CATEGORY FILTERING
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Toggle active button styling
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Hide and reveal animation flow
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // Trigger tiny scale reveal animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300); // match standard transitions
                }
            });
        });
    });


    // ==========================================================================
    // 9. CONTACT FORM VALIDATION & SUBMISSION
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateForm()) {
                // Change button state to loading
                const originalBtnContent = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
                
                // Formspree
                const formspreeFormId = "mbdvpywr"; 
                const formspreeEndpoint = `https://formspree.io/f/mbdvpywr`;
                
                if (formspreeFormId === "YOUR_FORMSPREE_FORM_ID") {
                    // Alert the user that they need to insert their form ID
                    setTimeout(() => {
                        showToast('Setup required: Please replace "YOUR_FORMSPREE_FORM_ID" in script.js to activate email delivery.', 'error');
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnContent;
                    }, 1000);
                    return;
                }
                
                fetch(formspreeEndpoint, {
                    method: "POST",
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        showToast('Thank you! Your message has been sent successfully.', 'success');
                        contactForm.reset();
                    } else {
                        showToast('Oops! There was a problem submitting your message.', 'error');
                    }
                })
                .catch(error => {
                    showToast('Oops! Network error. Please try again later.', 'error');
                    console.error('Form submission error:', error);
                })
                .finally(() => {
                    // Restore button state
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                });
            } else {
                showToast('Please correct the validation errors in the form.', 'error');
            }
        });

        // Add real-time input listeners to remove error highlights
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                const formGroup = input.closest('.form-group');
                if (formGroup && formGroup.classList.contains('invalid')) {
                    formGroup.classList.remove('invalid');
                }
            });
        });
    }

    function validateForm() {
        let isValid = true;
        
        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const subjectInput = document.getElementById('form-subject');
        const messageInput = document.getElementById('form-message');
        
        // Name Validation
        if (!nameInput.value.trim()) {
            setError(nameInput);
            isValid = false;
        }
        
        // Email Validation
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
            setError(emailInput);
            isValid = false;
        }
        
        // Subject Validation
        if (!subjectInput.value.trim()) {
            setError(subjectInput);
            isValid = false;
        }
        
        // Message Validation
        if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
            setError(messageInput);
            isValid = false;
        }
        
        return isValid;
    }

    function setError(inputElement) {
        const formGroup = inputElement.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('invalid');
        }
    }


    // ==========================================================================
    // 10. TOAST NOTIFICATION SYSTEM
    // ==========================================================================
    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toast-container');
        
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let iconHtml = '';
        if (type === 'success') {
            iconHtml = '<i class="fa-solid fa-circle-check toast-icon"></i>';
        } else if (type === 'error') {
            iconHtml = '<i class="fa-solid fa-circle-exclamation toast-icon"></i>';
        } else {
            iconHtml = '<i class="fa-solid fa-circle-info toast-icon"></i>';
        }
        
        toast.innerHTML = `
            ${iconHtml}
            <span class="toast-message">${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Dismiss after 4 seconds
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                toast.remove();
            }, 400); // matches fade out opacity delay
        }, 4000);
    }
});
