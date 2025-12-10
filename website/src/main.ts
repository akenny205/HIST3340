import './style.css'

// ==========================================================================
// Materiality of the PDF - Interactive Elements
// ==========================================================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initLayerToggle();
  initSmoothScroll();
  initScrollAnimations();
  initAttributeHighlight();
});

// ==========================================================================
// Layer Toggle - Interactive PDF demo
// ==========================================================================

function initLayerToggle(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>('.layer-btn');
  const layers = document.querySelectorAll<HTMLElement>('.layer-content');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetLayer = btn.dataset.layer;
      
      // Update active button
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Show target layer
      layers.forEach(layer => {
        if (layer.id === `layer-${targetLayer}`) {
          layer.classList.remove('hidden');
        } else {
          layer.classList.add('hidden');
        }
      });
    });
  });
}

// ==========================================================================
// Smooth Scroll for navigation
// ==========================================================================

function initSmoothScroll(): void {
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-links a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e: Event) => {
      const targetId = link.getAttribute('href');
      if (!targetId) return;
      
      // Only handle anchor links (starting with #), let regular URLs navigate normally
      if (!targetId.startsWith('#')) return;
      
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const nav = document.querySelector('.main-nav');
        const navHeight = nav instanceof HTMLElement ? nav.offsetHeight : 0;
        const targetPosition = (targetElement as HTMLElement).offsetTop - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ==========================================================================
// Scroll Animations - Fade in elements as they appear
// ==========================================================================

function initScrollAnimations(): void {
  const observerOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe section elements
  const animatableElements = document.querySelectorAll(
    '.section-header, .text-block, .quote-card, .comparison-column, ' +
    '.mechanic-card, .interactive-demo, .ownership-card, .reflection-box'
  );
  
  animatableElements.forEach(el => {
    el.classList.add('animate-target');
    observer.observe(el);
  });
  
  // Add animation styles dynamically
  const style = document.createElement('style');
  style.textContent = `
    .animate-target {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-target.animate-in {
      opacity: 1;
      transform: translateY(0);
    }
    
    .mechanic-card.animate-target {
      transition-delay: calc(var(--card-index, 0) * 0.1s);
    }
  `;
  document.head.appendChild(style);
  
  // Add staggered delay to mechanic cards
  const mechanicCards = document.querySelectorAll<HTMLElement>('.mechanic-card');
  mechanicCards.forEach((card, index) => {
    card.style.setProperty('--card-index', index.toString());
  });
}

// ==========================================================================
// Attribute Highlight - Cross-highlight related concepts
// ==========================================================================

function initAttributeHighlight(): void {
  const printAttributes = document.querySelectorAll<HTMLElement>('#print-attributes .attribute-item');
  const pdfAttributes = document.querySelectorAll<HTMLElement>('#pdf-attributes .attribute-item');
  
  // Define relationships between print and digital attributes
  const relationships: Record<string, string[]> = {
    'material': ['dependency'],
    'marking': ['metadata'],
    'structure': ['compression'],
    'typography': ['dependency'],
    'arrangement': ['links']
  };
  
  const reverseRelationships: Record<string, string[]> = {};
  Object.entries(relationships).forEach(([print, digitals]) => {
    digitals.forEach(digital => {
      if (!reverseRelationships[digital]) {
        reverseRelationships[digital] = [];
      }
      reverseRelationships[digital].push(print);
    });
  });
  
  // Add highlight styles
  const style = document.createElement('style');
  style.textContent = `
    .attribute-item.highlighted {
      background: rgba(96, 165, 250, 0.2) !important;
      border-color: var(--color-digital-glow) !important;
    }
  `;
  document.head.appendChild(style);
  
  // Print attributes hover
  printAttributes.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const attr = item.dataset.attribute;
      if (!attr) return;
      const related = relationships[attr] || [];
      
      pdfAttributes.forEach(pdfItem => {
        if (pdfItem.dataset.attribute && related.includes(pdfItem.dataset.attribute)) {
          pdfItem.classList.add('highlighted');
        }
      });
    });
    
    item.addEventListener('mouseleave', () => {
      pdfAttributes.forEach(pdfItem => {
        pdfItem.classList.remove('highlighted');
      });
    });
  });
  
  // PDF attributes hover
  pdfAttributes.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const attr = item.dataset.attribute;
      if (!attr) return;
      const related = reverseRelationships[attr] || [];
      
      printAttributes.forEach(printItem => {
        if (printItem.dataset.attribute && related.includes(printItem.dataset.attribute)) {
          printItem.classList.add('highlighted');
        }
      });
    });
    
    item.addEventListener('mouseleave', () => {
      printAttributes.forEach(printItem => {
        printItem.classList.remove('highlighted');
      });
    });
  });
}

// ==========================================================================
// Utility: Add nav background on scroll
// ==========================================================================

window.addEventListener('scroll', () => {
  const nav = document.querySelector('.main-nav');
  if (nav instanceof HTMLElement) {
    if (window.scrollY > 100) {
      nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
      nav.style.boxShadow = 'none';
    }
  }
});

