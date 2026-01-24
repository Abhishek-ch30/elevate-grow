import React from 'react';
import styled from 'styled-components';

interface ModernButtonProps {
  text?: string;
  onClick?: (e?: React.FormEvent) => void;
  className?: string;
  disabled?: boolean;
}

const ModernButton: React.FC<ModernButtonProps> = ({ 
  text = "Get Started", 
  onClick, 
  className = "",
  disabled = false 
}) => {
  return (
    <StyledWrapper className={className}>
      <button 
        className="animated-button"
        onClick={(e) => onClick?.(e)}
        disabled={disabled}
      >
        <svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
        </svg>
        <span className="text">{text}</span>
        <span className="circle" />
        <svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
        </svg>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .animated-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 12px 28px;
    border: 4px solid;
    border-color: transparent;
    font-size: 14px;
    background-color: inherit;
    border-radius: 100px;
    font-weight: 600;
    color: hsl(173 80% 40%);
    box-shadow: 0 0 0 2px hsl(173 80% 40%);
    cursor: pointer;
    overflow: hidden;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .animated-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .animated-button svg {
    position: absolute;
    width: 24px;
    fill: hsl(173 80% 40%);
    z-index: 9;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .animated-button .arr-1 {
    right: 16px;
  }

  .animated-button .arr-2 {
    left: -25%;
  }

  .animated-button .circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background-color: hsl(173 80% 40%);
    border-radius: 50%;
    opacity: 0;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .animated-button .text {
    position: relative;
    z-index: 1;
    transform: translateX(-12px);
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .animated-button:hover:not(:disabled) {
    box-shadow: 0 0 0 12px transparent;
    color: hsl(222 47% 11%);
    border-radius: 12px;
  }

  .animated-button:hover:not(:disabled) .arr-1 {
    right: -25%;
  }

  .animated-button:hover:not(:disabled) .arr-2 {
    left: 16px;
  }

  .animated-button:hover:not(:disabled) .text {
    transform: translateX(12px);
  }

  .animated-button:hover:not(:disabled) svg {
    fill: hsl(222 47% 11%);
  }

  .animated-button:active:not(:disabled) {
    scale: 0.95;
    box-shadow: 0 0 0 4px hsl(173 80% 40%);
  }

  .animated-button:hover:not(:disabled) .circle {
    width: 220px;
    height: 220px;
    opacity: 1;
  }
`;

export default ModernButton;
