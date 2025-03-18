document.addEventListener('DOMContentLoaded', function() {
  // Hard-coded repository sources
  const sources = {
    bellandegit: {
      users: ['RonaldsonBellande'],
      organizations: [
        'BRSRI',
        'BAIXRI',
        'BAICVRI',
        'BAMRI',
        'BMEERI'
      ]
    },
    github: {
      users: ['RonaldsonBellande'],
      organizations: [
        'Robotics-Sensors',
        'Application-Interoperability-Xenogen',
        'Artificial-Intelligence-Computer-Vision',
        'Architecture-Mechanism'
      ]
    },
    gitlab: {
      users: ['RonaldsonBellande'],
      groups: [
        'Bellande-Application-Interoperability-Xenogen-Research-Innovations-Center',
        'Bellande-Architecture-Mechanism-Research-Innovations-Center',
        'Bellande-Artificial-Intelligence-Computer-Vision-Research-Inovations-Center',
        'Bellande-Robotics-Sensors-Research-Innovations-Center'
      ]
    },
    bitbucket: {
      workspaces: ['RonaldsonBellande/workspace/projects/RONA']
    }
  };

  // DOM Elements
  const repositoriesGrid = document.getElementById('repositoriesGrid');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const platformButtons = document.querySelectorAll('.platform-btn');
  const repoExplorerDiv = document.getElementById('repo-explorer');
  const repoInfoDiv = document.getElementById('repo-info');
  const fileListDiv = document.getElementById('file-list');
  const contentDisplayDiv = document.getElementById('content-display');
  const fileNameHeading = document.getElementById('file-name');
  const fileContentPre = document.getElementById('file-content');
  const breadcrumbDiv = document.getElementById('breadcrumb');
  const loaderDiv = document.getElementById('loader');
  const errorMessageDiv = document.getElementById('error-message');
  const backToListButton = document.getElementById('back-to-list');

  // State variables
  let allRepositories = [];
  let currentPath = [];
  let repoOwner = '';
  let repoName = '';
  let currentBranch = '';
  let currentPlatform = '';

  // Initialize
  loadAllRepositories();

  // Event listeners
  if (searchButton) {
    searchButton.addEventListener('click', performSearch);
  }

  if (searchInput) {
    searchInput.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }

  if (platformButtons) {
    platformButtons.forEach(button => {
      button.addEventListener('click', function() {
        const platform = this.getAttribute('data-platform');

        // Update active button
        platformButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        // Filter repositories by platform
        filterRepositoriesByPlatform(platform);
      });
    });
  }

  if (backToListButton) {
    backToListButton.addEventListener('click', function() {
      hideRepoExplorer();
      showRepositoriesGrid();
    });
  }

  // Functions to load repositories
  async function loadAllRepositories() {
    if (repositoriesGrid) {
      repositoriesGrid.innerHTML = '<div class="loading">Loading repositories...</div>';
    }

    try {
      // Load BellandeGit repositories
      await loadBellandeGitRepositories();

      // Load GitHub repositories
      await loadGitHubRepositories();

      // Load GitLab repositories
      await loadGitLabRepositories();

      // Load Bitbucket repositories
      await loadBitbucketRepositories();

      // Display all repositories
      displayRepositories(allRepositories);
    } catch (error) {
      console.error('Error loading repositories:', error);
      if (repositoriesGrid) {
        repositoriesGrid.innerHTML = '<div class="error">Error loading repositories. Please try again.</div>';
      }
    }
  }

  async function loadBellandeGitRepositories() {
    // Load user repositories
    for (const user of sources.bellandegit.users) {
      try {
        const response = await fetch(`https://api.git.bellande-technologies.com/users/${user}/repos`);
        const repos = await response.json();

        if (Array.isArray(repos)) {
          repos.forEach(repo => {
            allRepositories.push({
              name: repo.name,
              description: repo.description || 'No description',
              url: repo.html_url,
              platform: 'bellandegit',
              owner: repo.owner.login,
              language: repo.language,
              stars: repo.stargazers_count,
              forks: repo.forks_count
            });
          });
        }
      } catch (error) {
        console.error(`Error loading Bellande Git repos for user ${user}:`, error);
      }
    }

    // Load organization repositories
    for (const org of sources.bellandegit.organizations) {
      try {
        const response = await fetch(`https://api.git.bellande-technologies.com/orgs/${org}/repos`);
        const repos = await response.json();

        if (Array.isArray(repos)) {
          repos.forEach(repo => {
            allRepositories.push({
              name: repo.name,
              description: repo.description || 'No description',
              url: repo.html_url,
              platform: 'bellandegit',
              owner: repo.owner.login,
              language: repo.language,
              stars: repo.stargazers_count,
              forks: repo.forks_count
            });
          });
        }
      } catch (error) {
        console.error(`Error loading bellandegit repos for org ${org}:`, error);
      }
    }
  }

  async function loadGitHubRepositories() {
    // Load user repositories
    for (const user of sources.github.users) {
      try {
        const response = await fetch(`https://api.github.com/users/${user}/repos`);
        const repos = await response.json();

        if (Array.isArray(repos)) {
          repos.forEach(repo => {
            allRepositories.push({
              name: repo.name,
              description: repo.description || 'No description',
              url: repo.html_url,
              platform: 'github',
              owner: repo.owner.login,
              language: repo.language,
              stars: repo.stargazers_count,
              forks: repo.forks_count
            });
          });
        }
      } catch (error) {
        console.error(`Error loading GitHub repos for user ${user}:`, error);
      }
    }

    // Load organization repositories
    for (const org of sources.github.organizations) {
      try {
        const response = await fetch(`https://api.github.com/orgs/${org}/repos`);
        const repos = await response.json();

        if (Array.isArray(repos)) {
          repos.forEach(repo => {
            allRepositories.push({
              name: repo.name,
              description: repo.description || 'No description',
              url: repo.html_url,
              platform: 'github',
              owner: repo.owner.login,
              language: repo.language,
              stars: repo.stargazers_count,
              forks: repo.forks_count
            });
          });
        }
      } catch (error) {
        console.error(`Error loading GitHub repos for org ${org}:`, error);
      }
    }
  }

  async function loadGitLabRepositories() {
    // Load user repositories
    for (const user of sources.gitlab.users) {
      try {
        const response = await fetch(`https://gitlab.com/api/v4/users/${user}/projects`);
        const repos = await response.json();

        if (Array.isArray(repos)) {
          repos.forEach(repo => {
            allRepositories.push({
              name: repo.name,
              description: repo.description || 'No description',
              url: repo.web_url,
              platform: 'gitlab',
              owner: repo.namespace.path,
              language: repo.language,
              stars: repo.star_count,
              forks: repo.forks_count
            });
          });
        }
      } catch (error) {
        console.error(`Error loading GitLab repos for user ${user}:`, error);
      }
    }

    // Load group repositories
    for (const group of sources.gitlab.groups) {
      try {
        const encodedGroup = encodeURIComponent(group);
        const response = await fetch(`https://gitlab.com/api/v4/groups/${encodedGroup}/projects`);
        const repos = await response.json();

        if (Array.isArray(repos)) {
          repos.forEach(repo => {
            allRepositories.push({
              name: repo.name,
              description: repo.description || 'No description',
              url: repo.web_url,
              platform: 'gitlab',
              owner: repo.namespace.path,
              language: repo.language,
              stars: repo.star_count,
              forks: repo.forks_count
            });
          });
        }
      } catch (error) {
        console.error(`Error loading GitLab repos for group ${group}:`, error);
      }
    }
  }

  async function loadBitbucketRepositories() {
    for (const workspace of sources.bitbucket.workspaces) {
      try {
        const [user, workspaceStr, projectsStr, projectKey] = workspace.split('/');
        const response = await fetch(`https://api.bitbucket.org/2.0/repositories/${user}`);
        const data = await response.json();

        if (data && data.values) {
          data.values.forEach(repo => {
            allRepositories.push({
              name: repo.name,
              description: repo.description || 'No description',
              url: repo.links.html.href,
              platform: 'bitbucket',
              owner: repo.owner.display_name,
              language: repo.language || 'Not specified',
              stars: null, // Bitbucket API doesn't provide stars
              forks: null  // Bitbucket API doesn't provide forks count
            });
          });
        }
      } catch (error) {
        console.error(`Error loading Bitbucket repos for workspace ${workspace}:`, error);
      }
    }
  }

  // Display repositories in the grid
  function displayRepositories(repositories) {
    if (!repositoriesGrid) return;

    if (repositories.length === 0) {
      repositoriesGrid.innerHTML = '<div class="no-results">No repositories found</div>';
      return;
    }

    repositoriesGrid.innerHTML = '';

    repositories.forEach(repo => {
      const repoCard = document.createElement('div');
      repoCard.className = `repo-card ${repo.platform}`;

      // Create icon based on platform
      const platformIcon = getPlatformIcon(repo.platform);

      repoCard.innerHTML = `
        <div class="repo-header">
          <span class="platform-icon">${platformIcon}</span>
          <h3 class="repo-name">${repo.name}</h3>
        </div>
        <p class="repo-description">${repo.description}</p>
        <div class="repo-footer">
          <span class="repo-language">${repo.language || 'Not specified'}</span>
          <a href="javascript:void(0)" class="explore-repo-link">Explore Repository</a>
          <a href="${repo.url}" target="_blank" class="repo-link">View on ${capitalizeFirstLetter(repo.platform)}</a>
        </div>
      `;

      // Add event listener for exploring the repository
      const exploreLink = repoCard.querySelector('.explore-repo-link');
      exploreLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (repo.platform === 'github') {
          hideRepositoriesGrid();
          showRepoExplorer();
          loadRepository(repo.owner, repo.name);
        } else {
          // For non-GitHub repos, just open in a new tab
          window.open(repo.url, '_blank');
        }
      });

      repositoriesGrid.appendChild(repoCard);
    });
  }

  // Helper function to capitalize first letter
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Get platform icon
  function getPlatformIcon(platform) {
    switch (platform) {
      case 'github':
        return '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" /></svg>';
      case 'gitlab':
        return '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M3.16,10L12,21.5L2.32,14.3C2.05,14.09 1.94,13.75 2.04,13.44L3.16,10M6.11,3.17L7.95,9H2.32L4.16,3.17C4.3,2.71 4.9,2.71 5.04,3.17L6.11,3.17M8.32,9L12,21.5L15.68,9H8.32M21.96,13.44L20.84,10L12,21.5L21.68,14.3C21.95,14.09 22.06,13.75 21.96,13.44M18.95,3.17L20.79,9H15.16L17,3.17C17.14,2.71 17.74,2.71 17.88,3.17L18.95,3.17Z" /></svg>';
      case 'bitbucket':
        return '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M2.65,3C2.3,3 2,3.3 2,3.65C2,3.69 2,3.73 2,3.77L4.73,20.27C4.8,20.69 5.16,21 5.58,21H18.63C18.94,21 19.22,20.78 19.27,20.46L22,3.77C22.05,3.42 21.81,3.09 21.46,3.04C21.43,3.03 21.39,3.03 21.35,3.03L2.65,3M14.1,14.95H9.94L8.81,9.07H15.11L14.1,14.95Z" /></svg>';
      default:
        return '';
    }
  }

  // Search repositories
  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === '') {
      displayRepositories(allRepositories);
      return;
    }

    const filteredRepos = allRepositories.filter(repo => {
      return repo.name.toLowerCase().includes(searchTerm) ||
        (repo.description && repo.description.toLowerCase().includes(searchTerm)) ||
        repo.owner.toLowerCase().includes(searchTerm);
    });

    displayRepositories(filteredRepos);
  }

  // Filter repositories by platform
  function filterRepositoriesByPlatform(platform) {
    if (platform === 'all') {
      displayRepositories(allRepositories);
      return;
    }

    const filteredRepos = allRepositories.filter(repo => repo.platform === platform);
    displayRepositories(filteredRepos);
  }

  // UI visibility functions
  function hideRepositoriesGrid() {
    if (repositoriesGrid) {
      repositoriesGrid.style.display = 'none';
    }

    // Also hide the search and filters if they exist
    const searchContainer = document.getElementById('search-container');
    const filterContainer = document.getElementById('filter-container');

    if (searchContainer) searchContainer.style.display = 'none';
    if (filterContainer) filterContainer.style.display = 'none';
  }

  function showRepositoriesGrid() {
    if (repositoriesGrid) {
      repositoriesGrid.style.display = 'grid';
    }

    // Also show the search and filters if they exist
    const searchContainer = document.getElementById('search-container');
    const filterContainer = document.getElementById('filter-container');

    if (searchContainer) searchContainer.style.display = 'block';
    if (filterContainer) filterContainer.style.display = 'flex';
  }

  function showRepoExplorer() {
    if (repoExplorerDiv) {
      repoExplorerDiv.style.display = 'block';
    }
  }

  function hideRepoExplorer() {
    if (repoExplorerDiv) {
      repoExplorerDiv.style.display = 'none';
    }
  }

  // Function to load repository
  function loadRepository(owner, name) {
    repoOwner = owner;
    repoName = name;
    currentPath = [];
    currentPlatform = 'github'; // Currently only supporting GitHub exploration

    showLoader();
    clearError();

    // First, get the default branch
    fetch(`https://api.github.com/repos/${repoOwner}/${repoName}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        return response.json();
      })
      .then(repoData => {
        currentBranch = repoData.default_branch;

        if (repoInfoDiv) {
          repoInfoDiv.innerHTML = `
            <h2>${repoData.name}</h2>
            <p>${repoData.description || 'No description available'}</p>
            <p>Default branch: ${currentBranch}</p>
          `;
        }

        // Now load the root directory
        return loadDirectory('');
      })
      .catch(error => {
        hideLoader();
        showError(`Error loading repository: ${error.message}`);
      });
  }

  // Function to load directory contents
  function loadDirectory(path) {
    showLoader();
    if (contentDisplayDiv) {
      contentDisplayDiv.style.display = 'none';
    }

    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}?ref=${currentBranch}`;

    return fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Update breadcrumb
        updateBreadcrumb();

        // Sort directories first, then files
        const sortedData = data.sort((a, b) => {
          if (a.type === 'dir' && b.type !== 'dir') return -1;
          if (a.type !== 'dir' && b.type === 'dir') return 1;
          return a.name.localeCompare(b.name);
        });

        // Render the file list
        if (fileListDiv) {
          fileListDiv.innerHTML = '';
          sortedData.forEach(item => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';

            if (item.type === 'dir') {
              fileItem.innerHTML = `
                <span class="folder-icon"></span>
                <span>${item.name}</span>
              `;
              fileItem.addEventListener('click', () => {
                currentPath.push(item.name);
                loadDirectory(currentPath.join('/'));
              });
            } else {
              // Determine icon based on file extension
              let icon = '';
              const extension = item.name.split('.').pop().toLowerCase();
              if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) {
                icon = '️';
              } else if (['mp3', 'wav', 'ogg'].includes(extension)) {
                icon = '';
              } else if (['mp4', 'webm', 'avi'].includes(extension)) {
                icon = '';
              } else if (['pdf'].includes(extension)) {
                icon = '';
              } else if (['zip', 'rar', 'tar', 'gz'].includes(extension)) {
                icon = '️';
              } else if (['js', 'ts', 'jsx', 'tsx'].includes(extension)) {
                icon = '';
              } else if (['html', 'htm'].includes(extension)) {
                icon = '';
              } else if (['css', 'scss', 'sass'].includes(extension)) {
                icon = '';
              } else if (['md', 'markdown'].includes(extension)) {
                icon = '';
              }

              fileItem.innerHTML = `
                <span class="file-icon">${icon}</span>
                <span>${item.name}</span>
              `;
              fileItem.addEventListener('click', () => {
                loadFileContent(item.path, item.name);
              });
            }

            fileListDiv.appendChild(fileItem);
          });
        }

        hideLoader();
      })
      .catch(error => {
        hideLoader();
        showError(`Error loading directory: ${error.message}`);
      });
  }

  // Function to load file content
  function loadFileContent(path, fileName) {
    showLoader();

    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}?ref=${currentBranch}`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (fileNameHeading) {
          fileNameHeading.textContent = fileName;
        }

        if (fileContentPre) {
          // Check file size and type
          const extension = fileName.split('.').pop().toLowerCase();

          if (data.size > 1000000) { // 1MB
            fileContentPre.textContent = 'File is too large to display. Click the link below to view on GitHub:';
            fileContentPre.innerHTML += `<br><br><a href="${data.html_url}" target="_blank">View on GitHub</a>`;
          } else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) {
            // For images, create an img tag
            fileContentPre.innerHTML = `<img src="data:image/png;base64,${data.content}" alt="${fileName}" style="max-width: 100%;">`;
          } else {
            // For text files, decode the base64 content
            const decodedContent = atob(data.content);
            fileContentPre.textContent = decodedContent;

            // Apply syntax highlighting if available
            if (typeof hljs !== 'undefined') {
              hljs.highlightBlock(fileContentPre);
            }
          }
        }

        if (contentDisplayDiv) {
          contentDisplayDiv.style.display = 'block';
        }

        hideLoader();
      })
      .catch(error => {
        hideLoader();
        showError(`Error loading file: ${error.message}`);
      });
  }

  // Function to update breadcrumb
  function updateBreadcrumb() {
    if (!breadcrumbDiv) return;

    breadcrumbDiv.innerHTML = '';

    // Add repo root
    const rootItem = document.createElement('span');
    rootItem.className = 'breadcrumb-item';
    rootItem.textContent = `${repoOwner}/${repoName}`;
    rootItem.addEventListener('click', () => {
      currentPath = [];
      loadDirectory('');
    });
    breadcrumbDiv.appendChild(rootItem);

    // Add path parts
    let currentPathPart = '';
    currentPath.forEach((part, index) => {
      const separator = document.createElement('span');
      separator.className = 'breadcrumb-separator';
      separator.textContent = ' / ';
      breadcrumbDiv.appendChild(separator);

      currentPathPart += (index > 0 ? '/' : '') + part;
      const pathPart = document.createElement('span');
      pathPart.className = 'breadcrumb-item';
      pathPart.textContent = part;

      // Store the path at this point
      const pathAtThisPoint = currentPath.slice(0, index + 1);
      pathPart.addEventListener('click', () => {
        currentPath = pathAtThisPoint;
        loadDirectory(currentPath.join('/'));
      });

      breadcrumbDiv.appendChild(pathPart);
    });
  }

  // Helper functions for loading indicator
  function showLoader() {
    if (loaderDiv) {
      loaderDiv.style.display = 'block';
    }
  }

  function hideLoader() {
    if (loaderDiv) {
      loaderDiv.style.display = 'none';
    }
  }

  // Helper functions for error handling
  function showError(message) {
    if (errorMessageDiv) {
      errorMessageDiv.textContent = message;
      errorMessageDiv.style.display = 'block';
    } else {
      console.error(message);
    }
  }

  function clearError() {
    if (errorMessageDiv) {
      errorMessageDiv.textContent = '';
      errorMessageDiv.style.display = 'none';
    }
  }

  // Function to open files like PDFs
  function openFile(fileUrl) {
    const fileExtension = fileUrl.split('.').pop().toLowerCase();

    // Check if it's a PDF or other viewable file type
    if (['pdf', 'txt', 'jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      window.open(fileUrl, '_blank');
    } else {
      // For other file types, trigger download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileUrl.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
});
