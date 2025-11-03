document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();
    
    // Load all components
    loadComponent('header-container', 'components/header.html');
    loadComponent('hero-container', 'components/hero.html');
    loadComponent('resume-container', 'components/resume.html');
    loadComponent('about-container', 'components/about.html');
    loadComponent('academic-container', 'components/academic.html');
    loadComponent('professional-container', 'components/professional.html');
    loadComponent('lab-container', 'components/lab.html');
    loadComponent('skills-container', 'components/skills.html');
    loadComponent('transferable-skills-container', 'components/transferable-skills.html');
    loadComponent('projects-container', 'components/projects.html');
    loadComponent('publications-container', 'components/publications.html');
    loadComponent('contact-container', 'components/contact.html');
    
    // Create theme toggle button after header is loaded
    setTimeout(createThemeToggle, 100);
});

function loadComponent(containerId, componentUrl) {
    const container = document.getElementById(containerId);
    if (!container) return;

    fetch(componentUrl)
        .then(response => response.text())
        .then(html => {
            container.innerHTML = html;
            
            // Execute any inline scripts in the component
            const scripts = container.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                
                // Copy all attributes
                Array.from(script.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                
                // Copy content
                newScript.textContent = script.textContent;
                
                // Replace old script with new one to execute it
                script.parentNode.replaceChild(newScript, script);
            });
            
            // Initialize component-specific functionality
            initializeComponentFunctionality(containerId);
            
            // Initialize specific functionality after component is loaded
            if (containerId === 'about-container') {
                initImageRotator();
            }
        })
        .catch(error => {
            console.error(`Error loading component ${componentUrl}:`, error);
        });
}

function initializeComponentFunctionality(containerId) {
    // Component-specific initialization based on the container ID
    switch(containerId) {
        case 'header-container':
            initializeHeader();
            break;
        case 'skills-container':
            initializeSkills();
            break;
        case 'about-container':
            initializeAbout();
            break;
        case 'projects-container':
            initializeProjects();
            break;
        // Add more cases as needed
    }
}

// Component-specific initialization functions
function initializeHeader() {
    // Mobile menu toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-links') && !event.target.closest('.menu-btn')) {
                navLinks.classList.remove('active');
            }
        });
        
        // Header scroll effect
        window.addEventListener('scroll', function() {
            const header = document.querySelector('header');
            if (header) {
                if (window.pageYOffset > 50) {
                    header.classList.add('header-scrolled');
                } else {
                    header.classList.remove('header-scrolled');
                }
            }
        });
        
        // Smooth scrolling for navigation links
        const navLinksScroll = document.querySelectorAll('.nav-links a');
        navLinksScroll.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const offsetTop = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu after clicking
                    navLinks.classList.remove('active');
                }
            });
        });
    }
}

function initializeSkills() {
    // Initialize skill bars animation
    const skillItems = document.querySelectorAll('.skill-item');
    
    if (skillItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate skill bars
                    skillItems.forEach(item => {
                        const skillLevel = item.querySelector('.skill-level');
                        if (skillLevel) {
                            // The width is set in the style attribute in the HTML
                            // No need to get data-level attribute
                        }
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        const skillsSection = document.querySelector('.skills-container');
        if (skillsSection) {
            observer.observe(skillsSection);
        }
    }
}

function initializeAbout() {
    // Image rotator functionality
    const images = document.querySelectorAll('.image-rotator img');
    if (images.length > 1) {
        let currentIndex = 0;
        const totalImages = images.length;
        
        function rotateImages() {
            images[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % totalImages;
            images[currentIndex].classList.add('active');
        }
        
        setInterval(rotateImages, 4000); // Change image every 4 seconds
    }
}

function initializeProjects() {
    // Filter projects functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    if (filterBtns.length > 0 && projectItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value
                const filterValue = this.getAttribute('data-filter');
                
                // Filter projects
                projectItems.forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
}

// Image rotator functionality
function initImageRotator() {
    const rotators = document.querySelectorAll('.image-rotator');
    
    rotators.forEach(rotator => {
        const images = rotator.querySelectorAll('img');
        if (images.length <= 1) return; // Skip if only one image
        
        let currentIndex = 0;
        
        // Show first image
        images.forEach((img, index) => {
            if (index === 0) {
                img.style.opacity = '1';
                img.style.position = 'relative';
                img.style.display = 'block';
            } else {
                img.style.opacity = '0';
                img.style.position = 'absolute';
                img.style.display = 'none';
            }
        });
        
        // Set up rotation
        setInterval(() => {
            // Hide current image
            images[currentIndex].style.opacity = '0';
            images[currentIndex].style.position = 'absolute';
            setTimeout(() => {
                images[currentIndex].style.display = 'none';
                
                // Move to next image
                currentIndex = (currentIndex + 1) % images.length;
                
                // Show next image
                images[currentIndex].style.display = 'block';
                setTimeout(() => {
                    images[currentIndex].style.opacity = '1';
                    images[currentIndex].style.position = 'relative';
                }, 50);
            }, 500);
        }, 5000); // Change image every 5 seconds
    });
}

// Theme Management
function initializeTheme() {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeToggleIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggleIcon(newTheme);
}

function updateThemeToggleIcon(theme) {
    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

function createThemeToggle() {
    // Check if toggle already exists
    if (document.querySelector('.theme-toggle')) return;
    
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle theme');
    toggleBtn.setAttribute('title', 'Toggle dark/light mode');
    
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const icon = document.createElement('i');
    icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    toggleBtn.appendChild(icon);
    
    toggleBtn.addEventListener('click', toggleTheme);
    
    document.body.appendChild(toggleBtn);
}
