document.addEventListener('DOMContentLoaded', function () {
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
  const heading = document.getElementById('dynamic-heading');
  const handle = document.getElementById('dragHandle');

  let isDragging = false;
  let draggedCard = null;
  let currentProject = null;
  let currentUrl = null;

  /* ============================
     🧭 Initial Visualizer Content
  ============================ */
  showDefaultVisualizerContent();

  function showDefaultVisualizerContent() {
    const defaultUrl = 'https://poornima20.github.io/DataTab-Portfolio/';
    visualizerPlaceholder.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.src = defaultUrl;
    iframe.style.width = '100%';
    iframe.style.height = '80vh';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.style.zoom = window.innerWidth <= 768 ? '75%' : '90%';

    iframe.onload = () => (visualizerPlaceholder.style.display = 'flex');
    iframe.onerror = () => {
      visualizerPlaceholder.innerHTML = `
        <div class="error">
          <p>Drag to Preview the Projects!</p>
          <small>Failed to load default content</small>
        </div>`;
      visualizerPlaceholder.style.display = 'flex';
    };

    visualizerPlaceholder.appendChild(iframe);
    visualizerPlaceholder.style.display = 'flex';
  }

  /* ============================
     ✨ Title Animation
  ============================ */
  const titles = ['with Curiosity', 'for Exploration', 'by Passion', 'to Inspire'];
  let index = 0;
  function updateHeading() {
    heading.style.opacity = 0;
    setTimeout(() => {
      heading.textContent = titles[index];
      heading.style.opacity = 1;
      index = (index + 1) % titles.length;
    }, 300);
  }
  updateHeading();
  setInterval(updateHeading, 3000);

  /* ============================
     📱 iOS Style Banner Drag
  ============================ */
  let startY = 0;
  let currentY = 0;
  let isDraggingSheet = false;

  handle.addEventListener('mousedown', startDrag);
  handle.addEventListener('touchstart', startDrag);

  function startDrag(e) {
    isDraggingSheet = true;
    startY = e.touches ? e.touches[0].clientY : e.clientY;
    projectsBanner.style.transition = 'none';

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
  }

  function drag(e) {
    if (!isDraggingSheet) return;
    currentY = e.touches ? e.touches[0].clientY : e.clientY;
    const diff = currentY - startY;
    const bannerHeight = projectsBanner.offsetHeight;
    const newY = Math.max(0, Math.min(bannerHeight, diff));
    const translatePercent = Math.min(100, (newY / bannerHeight) * 100);
    projectsBanner.style.transform = `translateY(${translatePercent}%)`;
  }

  function endDrag() {
    isDraggingSheet = false;
    projectsBanner.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';

    const currentTranslate = parseFloat(projectsBanner.style.transform.match(/-?\d+(\.\d+)?/)[0]);
    const snapThreshold = 50;

    if (currentTranslate <= snapThreshold) openBanner();
    else closeBanner();

    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchend', endDrag);
  }

  function openBanner() {
    projectsBanner.classList.add('show');
    projectsBanner.style.transform = 'translateY(0%)';
    datatabBtn.classList.add('active');
  }

  // ✅ 👇 Peek effect when closed
  function closeBanner() {
    projectsBanner.classList.remove('show');
    projectsBanner.style.transform = 'translateY(calc(100% - 25px))';
    datatabBtn.classList.remove('active');
  }

  /* ============================
     🖱️ DataTab Button Toggle
  ============================ */
  datatabBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (projectsBanner.classList.contains('show')) {
      closeBanner();
    } else {
      openBanner();
    }
  });

  document.addEventListener('click', (e) => {
    if (projectsBanner.classList.contains('show') &&
        !projectsBanner.contains(e.target) &&
        e.target !== datatabBtn) {
      closeBanner();
    }
  });

  /* ============================
     🃏 Project Card Interactions
  ============================ */
  projectCards.forEach((card) => {
    card.addEventListener('click', () => {
      if (!isDragging) {
        openVisualizer(card);
        closeBanner();
      }
    });

    card.addEventListener('dragstart', (e) => {
      isDragging = true;
      draggedCard = card;
      card.classList.add('dragging');
      dragCursor.textContent = card.dataset.project;
      dragCursor.classList.add('active');
      dragCursor.style.left = `${e.clientX}px`;
      dragCursor.style.top = `${e.clientY}px`;
      e.dataTransfer.setData('text/plain', card.dataset.project);
      e.dataTransfer.effectAllowed = 'copy';
      visualizerPlaceholder.classList.add('highlight');
    });

    card.addEventListener('dragend', () => {
      isDragging = false;
      card.classList.remove('dragging');
      dragCursor.classList.remove('active');
      visualizerPlaceholder.classList.remove('highlight');
    });
  });

  /* ============================
     🖼️ Drop Zone
  ============================ */
  visualizerPlaceholder.addEventListener('dragover', (e) => {
    e.preventDefault();
    visualizerPlaceholder.classList.add('highlight');
  });

  visualizerPlaceholder.addEventListener('dragleave', () => {
    visualizerPlaceholder.classList.remove('highlight');
  });

  visualizerPlaceholder.addEventListener('drop', (e) => {
    e.preventDefault();
    visualizerPlaceholder.classList.remove('highlight');
    if (draggedCard) openVisualizer(draggedCard);
  });

  /* ============================
     🌐 Visualizer Logic
  ============================ */
  function openVisualizer(card) {
    currentProject = card.dataset.project;
    currentUrl = card.dataset.url;
    visualizerTitle.textContent = currentProject;
    visualizerContent.innerHTML = '';

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

  closeBtn.addEventListener('click', closeVisualizer);
  function closeVisualizer() {
    visualizer.classList.remove('active');
    visualizerPlaceholder.style.display = 'flex';
    visualizerContent.innerHTML = '';
    showDefaultVisualizerContent();
  }

  newTabBtn.addEventListener('click', () => {
    if (currentUrl) window.open(currentUrl, '_blank');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && visualizer.classList.contains('active')) closeVisualizer();
  });
});
