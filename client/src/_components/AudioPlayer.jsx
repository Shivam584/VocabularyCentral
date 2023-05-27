import React from 'react';
import ReactPlayer from 'react-player';

const AudioPlayer = ({file_url}) => {
  const audioUrl = file_url;

  return (
    <div>
      <ReactPlayer url={audioUrl} 
        controls
        width="100%"
        height="50px"
        style={{ maxWidth: '600px' }}
        />
    </div>
  );
};

export default AudioPlayer;
