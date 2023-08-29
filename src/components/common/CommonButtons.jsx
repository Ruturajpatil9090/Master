import React from 'react';

function FormButtons({
  isAdding,
  isEditing,
  isEditSaveMode,
  handleAddOne,
  handleSaveOrUpdate,
  handleEdit,
  handleCancel,
  handleBack,
  handleDelete,
  handleFirst,
  handlePrevious,
  handleNext,
  handleLast,
  currentIndex,
  recordData,
}) {
  const disableNavButtons = recordData.length < 2;

  return (
    <div>
      <button onClick={handleAddOne} disabled={isAdding || isEditing}>
        Add One
      </button>
      <button onClick={handleSaveOrUpdate} disabled={!isAdding && !isEditing}>
        {!isEditing || !isEditSaveMode ? 'Save' : 'Update'}
      </button>
      <button onClick={handleEdit} disabled={isAdding || isEditing}>
        Edit
      </button>
      <button onClick={handleCancel} disabled={!isAdding && !isEditing}>
        Cancel
      </button>
      <button onClick={handleBack} disabled={isAdding || isEditing}>
        Back
      </button>
      <button onClick={handleDelete} disabled={isAdding || isEditing}>
        Delete
      </button>
      <br />
      <br />
      <button
        onClick={handleFirst}
        disabled={disableNavButtons || isAdding || isEditing || currentIndex === 0}
      >
        &lt;&lt; First
      </button>
      <button
        onClick={handlePrevious}
        disabled={disableNavButtons || isAdding || isEditing || currentIndex === 0}
      >
        &lt; Previous
      </button>
      <button
        onClick={handleNext}
        disabled={disableNavButtons || isAdding || isEditing || currentIndex === recordData.length - 1}
      >
        Next &gt;
      </button>
      <button
        onClick={handleLast}
        disabled={disableNavButtons || isAdding || isEditing || currentIndex === recordData.length - 1}
      >
        &gt;&gt; Last
      </button>
    </div>
  );
}

export default FormButtons;


