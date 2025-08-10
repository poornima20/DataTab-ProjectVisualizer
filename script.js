document.addEventListener('DOMContentLoaded', function() {
    const datatabBtn = document.getElementById('datatabBtn');
    const projectsBanner = document.getElementById('projectsBanner');
    const visualizer = document.getElementById('visualizer');
    const visualizerPlaceholder = document.getElementById('visualizerPlaceholder');
    const visualizerContent = document.getElementById('visualizerContent');
    const visualizerTitle = document.getElementById('visualizerTitle');
    const dragCursor = document.getElementById('dragCursor');
    const newTabBtn = document.getElementById('newTabBtn');
    const closeBtn = document.getElementById('closeBtn');
    const projectCards = document.querySelectorAll('.project-card');
    const heading = document.getElementById("dynamic-heading");
    
    let isDragging = false;
    let draggedCard = null;
    let currentProject = null;
    let currentUrl = null;

    // Initialize default content when page loads
    showDefaultVisualizerContent();

    function showDefaultVisualizerContent() {
    // URL of the external page you want to display by default
    const defaultUrl = 'https://poornima20.github.io/DataTab-Portfolio/';
    
    // Clear previous content
    visualizerPlaceholder.innerHTML = '';
    
    // Create iframe with the same styling as project cards
    const iframe = document.createElement('iframe');
    iframe.src = defaultUrl;
    iframe.style.width = '100%';
    iframe.style.height = '80vh';
    iframe.style.border = 'none';
    iframe.style.pointerEvents = 'none'; // Allow clicks to pass through
    iframe.style.overflow = 'hidden'; // Disable scrollbars

    // ✅ Responsive zoom setting
    if (window.innerWidth <= 768) {
        // Mobile view
        iframe.style.zoom = '75%';
    } else {
        // Desktop / larger screens
        iframe.style.zoom = '90%';
    }

    // Add loading state
    iframe.onload = () => {
        visualizerPlaceholder.style.display = 'flex';
    };
    
    iframe.onerror = () => {
        visualizerPlaceholder.innerHTML = `
            <div class="error">
                <p>Drag to Preview the Projects!</p>
                <small>Failed to load default content</small>
            </div>
        `;
        visualizerPlaceholder.style.display = 'flex';
    };
    
    visualizerPlaceholder.appendChild(iframe);
    visualizerPlaceholder.style.display = 'flex';
}


    
    // For title animation
    const titles = [
        "with Curiosity",
        "for Exploration",
        "by Passion",
        "to Inspire"
    ];
    let index = 0;

    function updateHeading() {
        heading.style.opacity = 0;
        setTimeout(() => {
            heading.textContent = titles[index];
            heading.style.opacity = 1;
            index = (index + 1) % titles.length;
        }, 300);
    }
    
    // Initial run
    updateHeading();
    setInterval(updateHeading, 3000);
    
    /* Toggle Projects Banner */
    function toggleProjectsBanner(show = null) {
        const shouldShow = show !== null ? show : !projectsBanner.classList.contains('show');
        datatabBtn.classList.toggle('active', shouldShow);
        projectsBanner.classList.toggle('show', shouldShow);
    }
    
    datatabBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleProjectsBanner();
    });
    
    // Close projects banner when clicking outside
    document.addEventListener('click', function(e) {
        if (projectsBanner.classList.contains('show')) {
            // Check if click is outside projects banner and not on the datatab button
            if (!projectsBanner.contains(e.target) && e.target !== datatabBtn) {
                toggleProjectsBanner(false);
            }
        }
    });
    
    // Toggle projects banner when clicking visualizer
    visualizer.addEventListener('click', function(e) {
        // Only trigger if clicking on the visualizer itself, not its children
        if (e.target === visualizer && !visualizer.classList.contains('active')) {
            toggleProjectsBanner(true);
        }
    });
    
    /* Project Card Interactions */
    projectCards.forEach(card => {
        // Click to open project
        card.addEventListener('click', function(e) {
            // Only open on click if not dragging (to prevent conflict with drag operations)
            if (!isDragging) {
                openVisualizer(card);
                toggleProjectsBanner(false);
            }
        });
        
        // Drag to open project
        card.addEventListener('dragstart', function(e) {
            isDragging = true;
            draggedCard = card;
            card.classList.add('dragging');
            
            // Show custom cursor
            dragCursor.textContent = card.dataset.project;
            dragCursor.classList.add('active');
            dragCursor.style.left = `${e.clientX}px`;
            dragCursor.style.top = `${e.clientY}px`;
            
            // Set drag data
            e.dataTransfer.setData('text/plain', card.dataset.project);
            e.dataTransfer.effectAllowed = 'copy';
            
            // Highlight drop zone
            visualizerPlaceholder.classList.add('highlight');
        });
        
        card.addEventListener('dragend', function() {
            isDragging = false;
            card.classList.remove('dragging');
            dragCursor.classList.remove('active');
            visualizerPlaceholder.classList.remove('highlight');
        });
    });
    
    /* Visualizer Drop Zone */
    visualizerPlaceholder.addEventListener('dragover', function(e) {
        e.preventDefault();
        visualizerPlaceholder.classList.add('highlight');
    });
    
    visualizerPlaceholder.addEventListener('dragleave', function() {
        visualizerPlaceholder.classList.remove('highlight');
    });
    
    visualizerPlaceholder.addEventListener('drop', function(e) {
        e.preventDefault();
        visualizerPlaceholder.classList.remove('highlight');
        
        if (draggedCard) {
            openVisualizer(draggedCard);
        }
    });
    
    /* Open Visualizer */
    function openVisualizer(card) {
        currentProject = card.dataset.project;
        currentUrl = card.dataset.url;
        
        visualizerTitle.textContent = currentProject;
        
        // Clear previous content
        visualizerContent.innerHTML = '';
        
        // Create and append iframe
        const iframe = document.createElement('iframe');
        iframe.src = currentUrl;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.zoom = '60%';
        
        visualizerContent.appendChild(iframe);
        
        visualizerPlaceholder.style.display = 'none';
        visualizer.classList.add('active');
    }
    
    /* Close Visualizer */
    closeBtn.addEventListener('click', function() {
        closeVisualizer();
    });
    
    function closeVisualizer() {
        visualizer.classList.remove('active');
        visualizerPlaceholder.style.display = 'flex';
        visualizerContent.innerHTML = '';
        showDefaultVisualizerContent();
    }
    
    /* Open in New Tab */
    newTabBtn.addEventListener('click', function() {
        if (currentUrl) {
            window.open(currentUrl, '_blank');
        }
    });
    
    // Close visualizer when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && visualizer.classList.contains('active')) {
            closeVisualizer();
        }
    });
});