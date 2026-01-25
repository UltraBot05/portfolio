import './CloseMessage.css';

function CloseMessage() {
  const handleLeavePage = () => {
    window.close();
    // Fallback if window.close() doesn't work
    setTimeout(() => {
      window.location.href = 'about:blank';
    }, 100);
  };

  return (
    <div className="close-message-container">
      <div className="close-message-content">
        <div className="close-title">Leaving already?</div>
        <div className="close-text">
          Thanks for checking out my portfolio!
        </div>
        <button className="leave-button" onClick={handleLeavePage}>
          Leave Page
        </button>
        <div className="close-subtext">
          Or refresh to explore more!
        </div>
        <div className="close-footer">
          Hope to hear from you soon!
        </div>
      </div>
    </div>
  );
}

export default CloseMessage;
