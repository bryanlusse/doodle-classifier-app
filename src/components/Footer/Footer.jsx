import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {

  return (
    <div className="footer navbar-static-bottom">
      <Container>
        <div className="social-links">
          <a
            key='linkedin'
            href='https://www.linkedin.com/in/bryan-lusse/'
            rel="noopener noreferrer"
            target="_blank"
            aria-label='linkedin'
          >
            <i className={`fa-brands fa-linkedin-in fa`} />
          </a>
          <a
            key='github'
            href='https://github.com/bryanlusse/doodle-classifier-app'
            rel="noopener noreferrer"
            target="_blank"
            aria-label='github'
          >
            <i className={`fa-brands fa-github fa`} />
          </a>
        </div>
        <hr />
        <p className="footer__text">
          © {new Date().getFullYear()} - Website developed by{' '}
          <a href="https://github.com/bryanlusse" target="_blank" rel="noopener noreferrer">
            Bryan Lusse
          </a>
        </p>

      </Container>
    </div>
  );
};

export default Footer;
