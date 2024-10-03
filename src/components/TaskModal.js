import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTask } from '../redux/slices/taskSlice';
import { fetchTaxonomies, createTaxonomy, deleteTaxonomy } from '../redux/slices/taxonomySlice';
import Select from "react-select";

const TaskModal = ({ task, onClose }) => {
  const taxonomiesFromStore = useSelector((state) => state.tasks.taxonomies);
  const [title, setTitle] = useState(task.attributes.title);
  const [date, setDate] = useState(task.attributes.date || "");
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [localTaxonomies, setLocalTaxonomies] = useState([]);
  const [loading, setLoading] = useState(false); // Para el manejo de estado de carga
  const dispatch = useDispatch();

  useEffect(() => {
    setIsVisible(true);
    dispatch(fetchTaxonomies());
  }, [dispatch]);

  useEffect(() => {
    const formattedTaxonomies = taxonomiesFromStore.map((tax) => ({
      value: tax.id,
      label: tax.attributes.name,
    }));
    setLocalTaxonomies(formattedTaxonomies);

    // Establecer las etiquetas seleccionadas inicialmente
    const initialSelectedTags = task.relationships.field_tags.data
      .map((tag) => ({
        value: tag.id,
        label: taxonomiesFromStore.find((t) => t.id === tag.id)?.attributes.name,
      }))
      .filter((tag) => tag.label); // Filtrar etiquetas indefinidas
    setSelectedTags(initialSelectedTags);
  }, [taxonomiesFromStore, task.relationships.field_tags.data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Activar estado de carga

    const resultAction = await dispatch(
      updateTask({
        taskId: task.id,
        updatedData: {
          title,
          date,
          field_tags: selectedTags.map((tag) => ({
            type: "taxonomy_term--tags",
            id: tag.value,
          })),
        },
      })
    );

    if (updateTask.fulfilled.match(resultAction)) {
      handleClose(); // Cerrar el modal si la actualización es exitosa
    } else {
      alert("Failed to update task: " + (resultAction.error.message || "Unknown error")); // Manejo de error
    }

    setLoading(false); // Desactivar estado de carga
  };

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  const handleAddNewTag = async () => {
    if (newTag.trim()) {
      const resultAction = await dispatch(createTaxonomy(newTag));
      if (!resultAction.error) {
        const newTaxonomy = resultAction.payload;
        const newTag = {
          value: newTaxonomy.id,
          label: newTaxonomy.attributes.name,
        };
        setSelectedTags([...selectedTags, newTag]);
        setLocalTaxonomies([...localTaxonomies, newTag]);
        setNewTag("");
      }
    }
  };

  const handleDeleteTag = async (tagToDelete) => {
    if (window.confirm(`Are you sure you want to delete the tag "${tagToDelete.label}"?`)) {
      const resultAction = await dispatch(deleteTaxonomy(tagToDelete.value));
      if (!resultAction.error) {
        setSelectedTags(selectedTags.filter(tag => tag.value !== tagToDelete.value));
        setLocalTaxonomies(localTaxonomies.filter(tag => tag.value !== tagToDelete.value));
      }
    }
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }),
  };

  const CustomOption = ({ innerProps, label, data }) => (
    <div
      {...innerProps}
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "8px",
      }}
    >
      <span>{label}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteTag(data);
        }}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "red",
        }}
      >
        ×
      </button>
    </div>
  );

  return (
    <div
      className={`modal-backdrop ${isVisible ? "show" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`modal-content ${isVisible ? "show" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>
        <h2>Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Select
            isMulti
            options={localTaxonomies}
            value={selectedTags}
            onChange={setSelectedTags}
            styles={customStyles}
            components={{ Option: CustomOption }}
          />
          <div>
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New tag"
            />
            <button type="button" onClick={handleAddNewTag}>
              Add Tag
            </button>
          </div>
          <div>
            <button type="submit" disabled={loading}>Update Task</button>
            <button type="button" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
