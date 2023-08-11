import React, { useState } from 'react';
import axios from 'axios';
import './App.css'

function youtube_parser(url) {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return (match&&match[7].length==11)? match[7] : false;
}

function App() {
  const [videoLink, setVideoLink] = useState('');
  const [downloadLink, setDownloadLink] = useState('');

  const handleDownload = async () => {
    const videoId = youtube_parser(videoLink);
  
    if (!videoId) {
      console.error('Invalid YouTube URL');
      return;
    }
  
    const options = {
      method: 'GET',
      url: 'https://youtube-video-download-info.p.rapidapi.com/dl',
      params: { id: videoId },
      headers: {
        'X-RapidAPI-Key': '9d6c330451mshc84e813d461c062p1180fcjsnc9d39de448ba',
        'X-RapidAPI-Host': 'youtube-video-download-info.p.rapidapi.com'
      }
    };
  
    try {
      const response = await axios.request(options);
      const downloadLinks = response.data.link;
  
      // Check if there are download links available for the desired formats
      if (downloadLinks && downloadLinks[22]) {
        const hdDownloadLink = downloadLinks[22][0];
  
        //A temporary anchor element to trigger download
        const downloadAnchor = document.createElement('a');
        downloadAnchor.href = hdDownloadLink;
        downloadAnchor.target = '_blank'; // Open link in a new tab/window
        downloadAnchor.download = 'video.mp4'; // File name to be saved as
        downloadAnchor.click();
      } else {
        console.error('No suitable download link found');
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  

  return (
    <div className="App">
      <header className="App-header">
        <h1>YouTube Video Downloader</h1>
        <input
          type="text"
          placeholder="Enter YouTube video URL"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
        />
        <button onClick={handleDownload}>Download Video</button>
        {downloadLink && (
          <a href={downloadLink} download>
            Click here to download the video
          </a>
        )}
      </header>
    </div>
  );
}

export default App;
