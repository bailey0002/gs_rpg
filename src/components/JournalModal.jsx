// =============================================================================
// GREY STRATUM — JOURNAL MODAL
// /src/components/JournalModal.jsx
// =============================================================================
// Echo Journal with entries and insights tabs.

import React, { useState } from 'react';

const JournalModal = ({ 
  journal = { entries: [], insights: [] }, 
  onClose,
  onMarkInsightRead 
}) => {
  const [activeTab, setActiveTab] = useState('entries');
  
  const unreadInsights = journal.insights?.filter(i => !i.read).length || 0;

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      onClose();
    }
  };

  const handleInsightClick = (insightId) => {
    if (onMarkInsightRead) {
      onMarkInsightRead(insightId);
    }
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'reflection': return '◇';
      case 'character': return '◈';
      case 'event': return '▸';
      case 'discovery': return '★';
      default: return '•';
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal journal-modal">
        <div className="modal-header">
          <h2>ECHO JOURNAL</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        {/* Tabs */}
        <div className="journal-tabs">
          <button 
            className={activeTab === 'entries' ? 'active' : ''}
            onClick={() => setActiveTab('entries')}
          >
            ENTRIES ({journal.entries?.length || 0})
          </button>
          <button 
            className={activeTab === 'insights' ? 'active' : ''}
            onClick={() => setActiveTab('insights')}
          >
            INSIGHTS ({journal.insights?.length || 0})
            {unreadInsights > 0 && (
              <span className="unread-badge">{unreadInsights}</span>
            )}
          </button>
        </div>
        
        <div className="modal-content">
          {/* Entries Tab */}
          {activeTab === 'entries' && (
            <div className="journal-entries-list">
              {(!journal.entries || journal.entries.length === 0) ? (
                <div className="journal-empty">
                  No entries yet. Your journey awaits.
                </div>
              ) : (
                journal.entries.map((entry, index) => (
                  <div key={entry.id || index} className="journal-entry">
                    <div className="entry-header">
                      <span className="entry-icon">{getCategoryIcon(entry.category)}</span>
                      <span className="entry-title">{entry.title}</span>
                      <span className="entry-timestamp">{entry.timestamp}</span>
                    </div>
                    <div className="entry-content">{entry.content}</div>
                    {entry.shadeAtTime !== undefined && (
                      <div className="entry-shade">
                        Shade: {entry.shadeAtTime > 0 ? '+' : ''}{entry.shadeAtTime}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
          
          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="journal-insights-list">
              {(!journal.insights || journal.insights.length === 0) ? (
                <div className="journal-empty">
                  No insights discovered. Examine your world carefully.
                </div>
              ) : (
                journal.insights.map((insight, index) => (
                  <div 
                    key={insight.id || index} 
                    className={`journal-insight ${insight.read ? 'read' : 'unread'}`}
                    onClick={() => !insight.read && handleInsightClick(insight.id)}
                  >
                    <div className="insight-header">
                      <span className="insight-icon">★</span>
                      <span className="insight-title">{insight.title}</span>
                      {!insight.read && <span className="new-badge">NEW</span>}
                    </div>
                    <div className="insight-content">{insight.content}</div>
                    <div className="insight-discovered">Discovered: {insight.discovered}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalModal;
