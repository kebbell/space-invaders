import React, { useEffect, useRef, useState } from 'react';

const SpaceInvaders = () => {
  const canvasRef = useRef(null);
  const [spaceship, setSpaceship] = useState({ x: 375, y: 550, width: 50, height: 20 });
  const [aliens, setAliens] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [keys, setKeys] = useState({ left: false, right: false });

  useEffect(() => {
    // Initialize aliens
    const initialAliens = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 10; col++) {
        initialAliens.push({
          x: 30 + col * 60,
          y: 30 + row * 30,
          width: 40,
          height: 30
        });
      }
    }
    setAliens(initialAliens);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const updateGame = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update spaceship position
      setSpaceship((prev) => ({
        ...prev,
        x: prev.x + (keys.left ? -5 : keys.right ? 5 : 0)
      }));

      // Draw spaceship
      ctx.fillStyle = 'white';
      ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);

      // Update bullets
      setBullets((prev) => {
        const updatedBullets = prev.map(bullet => ({
          ...bullet,
          y: bullet.y - 5
        }));
        return updatedBullets.filter(bullet => bullet.y > 0);
      });

      // Draw bullets
      ctx.fillStyle = 'red';
      bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, 5, 15);
      });

      // Update aliens
      setAliens((prev) => {
        // Move aliens down
        return prev.map(alien => ({
          ...alien,
          y: alien.y + 0.1
        }));
      });

      // Draw aliens
      ctx.fillStyle = 'green';
      aliens.forEach(alien => {
        ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
      });

      // Check for collisions
      setAliens((prevAliens) => {
        return prevAliens.filter((alien) => {
          const isHit = bullets.some(bullet =>
            bullet.x < alien.x + alien.width &&
            bullet.x + 5 > alien.x &&
            bullet.y < alien.y + alien.height &&
            bullet.y + 15 > alien.y
          );
          if (isHit) {
            setBullets(prev => prev.filter(b => !(
              b.x < alien.x + alien.width &&
              b.x + 5 > alien.x &&
              b.y < alien.y + alien.height &&
              b.y + 15 > alien.y
            )));
          }
          return !isHit;
        });
      });

      // Request next frame
      requestAnimationFrame(updateGame);
    };

    updateGame();
  }, [spaceship, bullets, aliens, keys]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') setKeys(prev => ({ ...prev, left: true }));
      if (e.key === 'ArrowRight') setKeys(prev => ({ ...prev, right: true }));
      if (e.key === ' ') {
        setBullets(prev => [...prev, { x: spaceship.x + spaceship.width / 2 - 2.5, y: spaceship.y }]);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft') setKeys(prev => ({ ...prev, left: false }));
      if (e.key === 'ArrowRight') setKeys(prev => ({ ...prev, right: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [spaceship]);

  return <canvas ref={canvasRef} width={800} height={600} style={{ border: '1px solid black' }} />;
};

export default SpaceInvaders;
