import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './styles.module.css';

export default function HomepageVideo(): ReactNode {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.log('Video autoplay failed:', error);
          setError(true);
        }
      }
    };

    playVideo();
  }, []);

  const handleLoadedData = () => {
    setIsLoading(false);
    // Try playing again after load
    videoRef.current?.play().catch(console.log);
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  if (error) {
    return (
      <div className={styles.videoContainer}>
        <div className={styles.errorMessage}>
          Video failed to load. Please check that the video file exists at /static/video/hero.mp4
        </div>
      </div>
    );
  }

  return (
    <div className={styles.videoContainer}>
      {isLoading && <div className={styles.loadingMessage}>Loading video...</div>}
      <video
        ref={videoRef}
        className={styles.video}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={handleLoadedData}
        onError={handleError}
        poster="/img/video-poster.png"
      >
        <source src="/video/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
