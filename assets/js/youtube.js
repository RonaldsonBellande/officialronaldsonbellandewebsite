document.addEventListener('DOMContentLoaded', function() {
  // YouTube video IDs and titles
  const videos = [
    {
      id: '4YAen7L4MMQ'
    },
    {
      id: '_lSJgsBu4jI'
    },
    {
      id: 'Q3I4LI4Ph68'
    },
    {
      id: 'kBZ-3JnPWcU'
    },
    {
      id: 'txqtH_vAeOY'
    },
    {
      id: 'dILattzDt2w'
    },
    {
      id: '2pmgWVHPQ5I'
    },
    {
      id: 'Cu60VOqLMkg'
    },
    {
      id: 'Pr5VdH4Af5o'
    },
    {
      id: 'Zo7sg52TWU4'
    },
    {
      id: 'XnCvPYVqDpE'
    },
    {
      id: 'aZUc6JiCSaE'
    },
    {
      id: 't2Fxxco8G_M'
    },
    {
      id: 'qWHoJCkH0Uk'
    },
    {
      id: 'IFkQ6h1o01I'
    }
  ];

  // DOM elements
  const youtubePlayer = document.getElementById('youtube-player');
  const currentIndex = document.getElementById('current-index');
  const totalVideos = document.getElementById('total-videos');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  // Set total videos count
  totalVideos.textContent = videos.length;

  // Current video index
  let currentVideoIndex = 0;

  // Function to load a video
  function loadVideo(index) {
    // Update current index display (1-based for user display)
    currentIndex.textContent = index + 1;

    // Update video src
    const videoId = videos[index].id;
    youtubePlayer.src = `https://www.youtube.com/embed/${videoId}?rel=0`;

  }

  // Load initial video
  loadVideo(currentVideoIndex);

  // Event listeners for navigation buttons
  prevBtn.addEventListener('click', function() {
    currentVideoIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
    loadVideo(currentVideoIndex);
  });

  nextBtn.addEventListener('click', function() {
    currentVideoIndex = (currentVideoIndex + 1) % videos.length;
    loadVideo(currentVideoIndex);
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
      // Left arrow key
      prevBtn.click();
    } else if (event.key === 'ArrowRight') {
      // Right arrow key
      nextBtn.click();
    }
  });

  // Function to extract video ID from YouTube URL
  function getYouTubeVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  // Helper function to add a new video (could be connected to a form)
  window.addVideo = function(url, title) {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      videos.push({
        id: videoId,
        title: title || `YouTube Video ${videos.length + 1}`
      });

      // Update total count
      totalVideos.textContent = videos.length;

      // Switch to the newly added video
      currentVideoIndex = videos.length - 1;
      loadVideo(currentVideoIndex);

      return true;
    }
    return false;
  };
});
