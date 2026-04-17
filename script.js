document.body.classList.add('js');

const yearTarget = document.getElementById('year');

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

const revealItems = document.querySelectorAll('[data-reveal]');

if (revealItems.length > 0 && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const modeModal = document.getElementById('modeModal');
const modeModalTitle = document.getElementById('modeModalTitle');
const modeModalSummary = document.getElementById('modeModalSummary');
const modeSummaryButtons = document.querySelectorAll('[data-mode-summary]');
const modeModalCloseControls = document.querySelectorAll('[data-close-mode-modal]');

const closeModeModal = () => {
  if (!modeModal) {
    return;
  }

  modeModal.hidden = true;
};

if (modeModal && modeModalTitle && modeModalSummary && modeSummaryButtons.length > 0) {
  modeSummaryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const { modeTitle, modeSummary } = button.dataset;

      modeModalTitle.textContent = modeTitle ?? 'Game mode';
      modeModalSummary.textContent = modeSummary ?? '';
      modeModal.hidden = false;
    });
  });

  modeModalCloseControls.forEach((control) => {
    control.addEventListener('click', closeModeModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modeModal.hidden) {
      closeModeModal();
    }
  });
}

const legalTabButtons = document.querySelectorAll('[data-legal-tab-button]');
const legalTabPanels = document.querySelectorAll('[data-legal-tab-panel]');

if (legalTabButtons.length > 0 && legalTabPanels.length > 0) {
  const showLegalTab = (tabName) => {
    legalTabButtons.forEach((button) => {
      const isActive = button.dataset.legalTabButton === tabName;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', String(isActive));
    });

    legalTabPanels.forEach((panel) => {
      panel.hidden = panel.dataset.legalTabPanel !== tabName;
    });

    const nextHash = tabName === 'eula' ? '#eula' : '#privacy';
    window.history.replaceState(null, '', nextHash);
  };

  const initialLegalTab = window.location.hash === '#eula' ? 'eula' : 'privacy';
  showLegalTab(initialLegalTab);

  legalTabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      showLegalTab(button.dataset.legalTabButton ?? 'privacy');
    });
  });
}

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const topic = document.getElementById('topic');
    const status = document.getElementById('formStatus');
    const subjectField = document.getElementById('web3Subject');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const topicValue = topic && 'value' in topic ? topic.value.trim() : 'Support';

    if (subjectField && 'value' in subjectField) {
      subjectField.value = `WordGuesser ${topicValue}`;
    }

    if (status) {
      status.textContent = 'Sending your message...';
    }

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Could not send your message. Please try again.');
      }

      contactForm.reset();

      if (subjectField && 'value' in subjectField) {
        subjectField.value = 'WordGuesser Support';
      }

      if (status) {
        status.textContent = 'Message sent successfully.';
      }
    } catch (error) {
      if (status) {
        status.textContent = error instanceof Error
          ? error.message
          : 'Could not send your message. Please try again.';
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}
