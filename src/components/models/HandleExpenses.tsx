import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/Expenses.css";
import Navbar from "../Navbar";

interface User {
  id: string;
  userName: string;
  email: string;
  role: string;
}

interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
  addedBy: User;
  lastUpdated: string;
}

interface ExpenseCategory {
  id: string;
  category: string;
  eventId: string;
  items: ExpenseItem[];
}

const HandleExpenses: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [newExpense, setNewExpense] = useState({ description: "", amount: "" });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentExpense, setCurrentExpense] = useState<ExpenseItem | null>(null);
    const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, [eventId]);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get<ExpenseCategory[]>(`/expenses/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (error) {
      console.error(error || "Failed to fetch expenses");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!newCategory) return;
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        `/expenses/add/${eventId}`,
        { category: newCategory, items: [] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCategories([...categories, res.data]);
      setNewCategory("");
      alert("Category added successfully!");
    } catch (error) {
      console.error(error || "Failed to add category");
      alert("Failed to add category. Please try again.");
    }
  };

  const addExpenseItem = async () => {
    if (!selectedCategory || !newExpense.description || !newExpense.amount) return;
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        `/expense-items/add/${selectedCategory}`,
        { description: newExpense.description, amount: parseFloat(newExpense.amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCategories(categories.map(cat =>
        cat.id === selectedCategory ? { ...cat, items: [...(cat.items || []), res.data] } : cat
      ));
      setNewExpense({ description: "", amount: "" });
    } catch (error) {
      console.error(error || "Failed to add expense item");
    }
  };

  const openUpdateModal = (item: ExpenseItem) => {
    setCurrentExpense(item);
    setIsModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsModalOpen(false);
    setCurrentExpense(null);
  };

  const handleUpdateExpense = async () => {
    if (!currentExpense) return;

    try {
      const token = localStorage.getItem("token");
        console.log(currentExpense.id);
        console.log(currentExpense.description);
        console.log(currentExpense.amount);
        const res = await api.put(
            `/expense-items/update/${currentExpense.id}?description=${encodeURIComponent(currentExpense.description)}&amount=${currentExpense.amount}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );


      setCategories(categories.map(category => ({
        ...category,
        items: category.items.map(item =>
          item.id === currentExpense.id ? res.data : item
        ),
      })));

      closeUpdateModal();
    } catch (error) {
      console.error("Failed to update expense item", error);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  return (
    <>
      <Navbar />
      <div className="expenses-container">
        <h2>Manage Expenses for Event {eventId}</h2>

        <button className="back-button" onClick={() => navigate("/userEvents")}>
          Go Back
        </button>
              
        {loading ? (
          <p>Loading expenses...</p>
        ) : (
          <>
            <div className="add-category-form">
              <input
                type="text"
                placeholder="New Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button onClick={addCategory}>Add Category</button>
            </div>

            <div className="add-expense-form">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">Select Category</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.category}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              />
              <input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              />
              <button onClick={addExpenseItem}>Add Expense</button>
            </div>

            {categories?.map((category) => (
              <div key={category.id} className="expense-category">
                <h3>{category.category}</h3>
                <ul className="expense-list">
                  {category.items?.map((item) => (
                    <li key={item.id} className="expense-item">
                      <div className="expense-meta1">
                        <span>{item.description}</span>
                        <span>${item.amount.toFixed(2)}</span>
                      </div>
                      <div className="expense-meta">
                        <span className="added-by">Added by: {item.addedBy?.userName || "Unknown"}</span>
                        <span className="last-updated">Last updated: {formatDate(item.lastUpdated)}</span>
                      </div>
                      <button className="update-button" onClick={() => openUpdateModal(item)}>Update</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </div>

      {isModalOpen && currentExpense && (
        <div className="modal">
          <div className="modal-content">
            <h3>Update Expense</h3>
            <input
              type="text"
              value={currentExpense.description}
              onChange={(e) => setCurrentExpense({ ...currentExpense, description: e.target.value })}
            />
            <input
              type="number"
              value={currentExpense.amount}
              onChange={(e) => setCurrentExpense({ ...currentExpense, amount: parseFloat(e.target.value) || 0 })}
            />
            <button onClick={handleUpdateExpense}>Save</button>
            <button onClick={closeUpdateModal}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default HandleExpenses;
