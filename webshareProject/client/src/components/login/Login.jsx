import React, { useState, useEffect } from 'react';
import { TextField } from "@mui/material";
import './Login.css';

export function Login() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1);

  const toggleMode = () => setIsSignUpMode((prev) => !prev);

  const moveSlider = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const autoSlide = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex % 3) + 1);
    }, 3000);

    return () => clearInterval(autoSlide);
  }, []);

  return (
    <main className={isSignUpMode ? 'sign-up-mode' : ''}>
      <div className="box">
        <div className="inner-box">
          <div className="forms-wrap">
            {/* Sign In Form */}
            <form action="#" autoComplete="off" className="sign-in-form">
              <div className="logo">
                <img src="./img/Cloud_uploading.gif" alt="WebShare" style={{ width: '100px' }} />
                <h4 style={{ marginLeft: '-30px' }}>WebShare</h4>
              </div>

              <div className="heading">
                <h2>Connectés partout, à tout instant.</h2>
                <h6>Grâce à WebShare, rester en contact avec vos proches n’a jamais été aussi simple</h6>
                <a type="button" className="toggle" onClick={toggleMode}>
                  S'inscrire ?
                </a>
              </div>

              <div className="actual-form">
                <TextField
                  label="Pseudo ou Adresse e-mail"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                />

                <TextField
                  label="Mot de passe"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                />

                <input type="submit" value="Se connecter" className="sign-btn" />

                <p className="text">
                  Mot de passe oublié ? <a href="#">Besoin d'aide ?</a>
                </p>
              </div>
            </form>

            {/* Sign Up Form */}
            <form action="#" autoComplete="off" className="sign-up-form">
              <div className="logo">
                <img src="./img/Cloud_uploading.gif" alt="WebShare" style={{ width: '100px' }} />
                <h4 style={{ marginLeft: '-30px' }}>WebShare</h4>
              </div>

              <div className="heading">
                <h2>Nous rejoindre?</h2>
                <h6>Avez-vous déjà un compte?</h6>
                <a type="button" className="toggle" onClick={toggleMode}>
                  Se connecter
                </a>
              </div>

              <div className="actual-form">
                <TextField
                  label="Pseudo"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                />

                <TextField
                  label="Adresse e-mail"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                />

                <TextField
                  label="Mot de passe"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                />

                <input type="submit" value="S'inscrire" className="sign-btn" />

                <p className="text">
                  En m'inscrivant, j'accepte les <a href="#">conditions d'utilisation</a> et{' '}
                  <a href="#">la politique de confidentialité</a>
                </p>
              </div>
            </form>
          </div>

          {/* Carousel Section */}
          <div className="carousel">
            <div className="images-wrapper">
              <img src="./img/Business_Salesman.gif" className={`image img-1 ${currentIndex === 1 ? 'show' : ''}`} alt="" />
              <img src="./img/Content_Moderation.gif" className={`image img-2 ${currentIndex === 2 ? 'show' : ''}`} alt="" />
              <img src="./img/Business_Team.gif" className={`image img-3 ${currentIndex === 3 ? 'show' : ''}`} alt="" />
            </div>

            <div className="text-slider">
              <div className="text-wrap">
                <div className="text-group" style={{ transform: `translateY(${-(currentIndex - 1) * 2.2}rem)` }}>
                  <h2>Connectez-vous</h2>
                  <h2>Partager vos fichiers de manière simple</h2>
                  <h2>Communiquer avec les autres</h2>
                </div>
              </div>

              <div className="bullets">
                {[1, 2, 3].map((index) => (
                  <span
                    key={index}
                    className={currentIndex === index ? 'active' : ''}
                    data-value={index}
                    onClick={() => moveSlider(index)}
                  ></span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
