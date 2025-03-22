function search(destinationUrl) {

  document.addEventListener('DOMContentLoaded', () => {
    // Create search modal elements
    let isSearchActive = false;
    const searchModal = document.createElement('div');
    searchModal.className = 'search-modal';
    searchModal.innerHTML = `
        <div class="search-container" style="color:black">
          <div class="search-header">
            <div class="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input type="text" class="search-input" placeholder="Search pages..." />
            <div class="search-shortcut">ESC to close</div>
          </div>
          <div class="search-results"></div>
        </div>
      `;
    document.body.appendChild(searchModal);

    // Get elements
    const input = searchModal.querySelector('.search-input');
    const resultsContainer = searchModal.querySelector('.search-results');

    // Define available pages
    const pages = [
      { title: 'Home', url: '/', description: 'Main page', keywords: 'start welcome main atelier ateliergroupe groupe' },
      { title: 'About', url: '/about', description: 'Learn about us', keywords: 'team company info alexander wegener frederik dahlkvist albin memethi' },
      { title: 'Contact', url: '/contact', description: 'Get in touch', keywords: 'support help phone email' },
      { title: 'Notes From Architecture', url: '/notes-from', description: 'Collection of notes', keywords: 'design building art' }
    ];


    // Function to show search modal
    function showSearchModal() {
      searchModal.classList.add('active');
      input.value = '';
      document.body.style.overflow = 'hidden';
      renderResults(pages);
      isSearchActive = true;
      setTimeout(() => {
        input.focus();
      }, 50);
    }

    // Function to hide search modal
    function hideSearchModal() {
      searchModal.classList.remove('active');
      document.body.style.overflow = '';
      isSearchActive = false;
    }

    // Function to filter pages based on input
    function filterPages(query) {
      if (!query) return pages;
      const lowerQuery = query.toLowerCase();
      return pages.filter(page =>
        page.title.toLowerCase().includes(lowerQuery) ||
        page.description.toLowerCase().includes(lowerQuery) ||
        page.keywords.toLowerCase().includes(lowerQuery)
      );
    }

    // Function to render search results
    function renderResults(results) {
      resultsContainer.innerHTML = '';
      results.forEach(page => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
            <div class="result-title">${page.title}</div>
            <div class="result-description">${page.description}</div>
          `;
        resultItem.addEventListener('click', () => {
          window.location.href = page.url;
        });
        resultsContainer.appendChild(resultItem);
      });
    }

    // Event listener for keydown events
    document.addEventListener('keydown', (e) => {
      // Handle Ctrl+K or Cmd+K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        showSearchModal();
        return; // exit so we don't process further
      }

      // Only handle Escape key events here
      if (e.key === 'Escape' || e.keyCode === 27) {
        e.preventDefault();
        if (isSearchActive) {
          hideSearchModal();
          e.stopImmediatePropagation(); // Prevent the global ESC handler from firing
        } else {
          window.location.href = destinationUrl;
        }
        return; // exit after handling Escape
      }
    });

    // Event listener for search input
    input.addEventListener('input', () => {
      const filteredPages = filterPages(input.value);
      renderResults(filteredPages);
    });

    // Event listener for Enter key on input
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const filteredPages = filterPages(input.value);
        if (filteredPages.length > 0) {
          window.location.href = filteredPages[0].url;
        }
      }
    });

    // Close when clicking outside the search container
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        hideSearchModal();
      }
    });
  });
}

// Make the function available globally
window.setupEscNavigation = setupEscNavigation;
