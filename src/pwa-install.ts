interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export const setupPWAInstall = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    showInstallButton();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    hideInstallButton();
  });
};

const showInstallButton = () => {
  if (document.getElementById('pwa-install-button')) return;
  
  const button = document.createElement('button');
  button.id = 'pwa-install-button';
  button.innerHTML = '📱 Install App';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #000;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    cursor: pointer;
    z-index: 9999;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
  `;
  
  button.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installation accepted');
    } else {
      console.log('PWA installation dismissed');
    }
    
    deferredPrompt = null;
    hideInstallButton();
  });
  
  document.body.appendChild(button);
};

const hideInstallButton = () => {
  const button = document.getElementById('pwa-install-button');
  if (button) {
    button.remove();
  }
};
