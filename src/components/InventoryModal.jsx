// =============================================================================
// GREY STRATUM — INVENTORY MODAL
// /src/components/InventoryModal.jsx
// =============================================================================
// Displays inventory items, marks, and debt.

import React, { useState } from 'react';
import { getItem } from '../data/content/items.js';

const InventoryModal = ({ 
  inventory = [], 
  marks = 0, 
  debt = 0, 
  onClose, 
  onUseItem,
  onCombineItems 
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [combineMode, setCombineMode] = useState(false);
  const [combineFirst, setCombineFirst] = useState(null);
  const [examineText, setExamineText] = useState(null);

  const handleItemClick = (invItem) => {
    const itemData = getItem(invItem.itemId);
    
    if (combineMode) {
      if (!combineFirst) {
        setCombineFirst(invItem.itemId);
      } else if (combineFirst !== invItem.itemId) {
        // Try to combine
        onCombineItems(combineFirst, invItem.itemId);
        setCombineMode(false);
        setCombineFirst(null);
      }
    } else {
      setSelectedItem(invItem);
      setExamineText(itemData?.examineText || itemData?.description || 'No description.');
    }
  };

  const handleUse = () => {
    if (selectedItem) {
      onUseItem(selectedItem.itemId);
      setSelectedItem(null);
      setExamineText(null);
    }
  };

  const toggleCombineMode = () => {
    setCombineMode(!combineMode);
    setCombineFirst(null);
    setSelectedItem(null);
    setExamineText(null);
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal inventory-modal">
        <div className="modal-header">
          <h2>INVENTORY</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-content">
          {/* Currency Section */}
          <div className="inventory-currency">
            <div className="currency-item">
              <span className="currency-label">MARKS</span>
              <span className="currency-value marks">{marks}</span>
            </div>
            <div className="currency-item">
              <span className="currency-label">DEBT</span>
              <span className="currency-value debt">{debt}</span>
            </div>
          </div>
          
          {/* Combine Mode Indicator */}
          {combineMode && (
            <div className="combine-indicator">
              {combineFirst 
                ? `Select second item to combine with ${getItem(combineFirst)?.name || combineFirst}...`
                : 'Select first item to combine...'}
            </div>
          )}
          
          {/* Items Grid */}
          <div className="inventory-grid">
            {inventory.length === 0 ? (
              <div className="inventory-empty">No items</div>
            ) : (
              inventory.map((invItem, index) => {
                const itemData = getItem(invItem.itemId);
                const isSelected = selectedItem?.itemId === invItem.itemId;
                const isCombineFirst = combineFirst === invItem.itemId;
                
                return (
                  <button
                    key={`${invItem.itemId}-${index}`}
                    className={`inventory-item ${isSelected ? 'selected' : ''} ${isCombineFirst ? 'combine-first' : ''}`}
                    onClick={() => handleItemClick(invItem)}
                  >
                    <span className="item-name">{itemData?.name || invItem.itemId}</span>
                    {invItem.quantity > 1 && (
                      <span className="item-qty">×{invItem.quantity}</span>
                    )}
                    <span className="item-category">{itemData?.category || 'misc'}</span>
                  </button>
                );
              })
            )}
          </div>
          
          {/* Examine Section */}
          {examineText && (
            <div className="inventory-examine">
              <div className="examine-header">{getItem(selectedItem?.itemId)?.name}</div>
              <div className="examine-text">{examineText}</div>
            </div>
          )}
          
          {/* Actions */}
          <div className="inventory-actions">
            <button 
              onClick={toggleCombineMode}
              className={combineMode ? 'active' : ''}
            >
              {combineMode ? 'CANCEL COMBINE' : 'COMBINE'}
            </button>
            {selectedItem && getItem(selectedItem.itemId)?.category === 'consumable' && (
              <button onClick={handleUse}>USE</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryModal;
