// =============================================================================
// GREY STRATUM — CHARACTER GALLERY
// /src/components/CharacterGallery.jsx
// =============================================================================
// Character creation using Grok-generated portraits.
// Replaces the old SVG-based creator.

import React, { useState, useEffect } from 'react';
import { CLASS_LIBRARY, getClass, getAllClasses, createCharacterFromClass } from '../data/classes/classLibrary.js';

const CharacterGallery = ({ onComplete, onCancel }) => {
  const [selectedClass, setSelectedClass] = useState('sentinel');
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState('');
  const [imageError, setImageError] = useState({});

  // Get current class data
  const currentClass = getClass(selectedClass);
  const allClasses = getAllClasses();

  // Set default image when class changes
  useEffect(() => {
    if (currentClass && currentClass.images.length > 0) {
      setSelectedImage(currentClass.images[0].id);
      setImageError({});
    }
  }, [selectedClass, currentClass]);

  const handleClassSelect = (classId) => {
    setSelectedClass(classId);
  };

  const handleImageSelect = (imageId) => {
    setSelectedImage(imageId);
  };

  const handleImageError = (imageId) => {
    setImageError(prev => ({ ...prev, [imageId]: true }));
  };

  const handleCreate = () => {
    if (!name.trim() || !selectedImage) return;
    
    const character = createCharacterFromClass(selectedClass, name.trim(), selectedImage);
    if (character) {
      onComplete(character);
    }
  };

  const getSelectedImagePath = () => {
    if (!currentClass || !selectedImage) return null;
    const img = currentClass.images.find(i => i.id === selectedImage);
    return img ? img.file : null;
  };

  return (
    <div className="creator">
      <div className="creator-header">
        <h1>CREATE OPERATIVE</h1>
        <button onClick={onCancel} aria-label="Close">✕</button>
      </div>

      <div className="creator-body">
        {/* Preview Panel */}
        <div className="preview-panel">
          <div className="preview-frame">
            {getSelectedImagePath() && !imageError[selectedImage] ? (
              <img 
                src={getSelectedImagePath()} 
                alt={currentClass?.name || 'Character'} 
                onError={() => handleImageError(selectedImage)}
              />
            ) : (
              <div className="portrait-placeholder">
                <span>?</span>
              </div>
            )}
          </div>
          
          {currentClass && (
            <div className="preview-stats">
              <span>PHY {currentClass.baseStats.phy}</span>
              <span>INT {currentClass.baseStats.int}</span>
              <span>DEF {currentClass.baseStats.def}</span>
              <span>HP {currentClass.baseHp}</span>
            </div>
          )}
        </div>

        {/* Options Panel */}
        <div className="options-panel">
          {/* Class Selection */}
          <div className="opt-section">SELECT CLASS</div>
          <div className="class-grid">
            {allClasses.map(cls => (
              <button
                key={cls.id}
                className={`class-btn ${selectedClass === cls.id ? 'selected' : ''}`}
                onClick={() => handleClassSelect(cls.id)}
              >
                <span className="class-name">{cls.name}</span>
                <span className="class-role">{cls.role}</span>
              </button>
            ))}
          </div>

          {/* Class Description */}
          {currentClass && (
            <div className="class-description">
              <p>{currentClass.description}</p>
            </div>
          )}

          {/* Portrait Selection */}
          <div className="opt-section">SELECT PORTRAIT</div>
          <div className="portrait-grid">
            {currentClass?.images.map(img => (
              <button
                key={img.id}
                className={`portrait-btn ${selectedImage === img.id ? 'selected' : ''}`}
                onClick={() => handleImageSelect(img.id)}
                title={img.name}
              >
                {!imageError[img.id] ? (
                  <img 
                    src={img.file} 
                    alt={img.name}
                    onError={() => handleImageError(img.id)}
                  />
                ) : (
                  <span className="img-error">?</span>
                )}
                <span className="portrait-label">{img.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="creator-footer">
        <input 
          type="text" 
          placeholder="Enter operative name..." 
          value={name} 
          onChange={e => setName(e.target.value)}
          maxLength={24}
        />
        <button 
          className="create-btn" 
          onClick={handleCreate} 
          disabled={!name.trim() || !selectedImage}
        >
          CREATE
        </button>
      </div>
    </div>
  );
};

export default CharacterGallery;
