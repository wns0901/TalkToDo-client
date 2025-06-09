  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory("");
    }
  };

  const handleDeleteCategory = (category) => {
    onDeleteCategory(category);
  }; 