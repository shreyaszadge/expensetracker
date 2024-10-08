import React, { useState, useEffect } from "react";
import { db } from "../config/firebase"; // Ensure this imports your Firebase configuration
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import {
  TextField,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const Dashboard = () => {
  const auth = getAuth(); // Get the current user authentication
  const userId = auth.currentUser?.uid; // Get the current user's UID
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ category: "", amount: "", comments: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [filter, setFilter] = useState("");

  // Fetch expenses from Firebase
  useEffect(() => {
    if (userId) {
      fetchExpenses();
    }
  }, [userId]);

  const fetchExpenses = async () => {
    const querySnapshot = await getDocs(collection(db, "users", userId, "expenses")); // Update to fetch from user's expenses collection
    setExpenses(
      querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(), // Convert Firebase Timestamp to Date
        updatedAt: doc.data().updatedAt?.toDate(), // Convert Firebase Timestamp to Date
      }))
    );
  };

  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const openAddDialog = () => {
    resetForm();
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const expensesRef = collection(db, "users", userId, "expenses"); // Reference to the user's expenses collection

    if (isEditing) {
      const expenseDoc = doc(expensesRef, editingId);
      await updateDoc(expenseDoc, {
        ...form,
        updatedAt: serverTimestamp(), // Update timestamp when editing
      });
    } else {
      await addDoc(expensesRef, {
        ...form,
        createdAt: serverTimestamp(), // Add created timestamp when adding new
        updatedAt: serverTimestamp(), // Also set updated timestamp on creation
      });
    }
    fetchExpenses();
    resetForm();
    closeDialog();
  };

  const resetForm = () => {
    setForm({ category: "", amount: "", comments: "" });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (expense) => {
    setForm({
      category: expense.category,
      amount: expense.amount,
      comments: expense.comments,
    });
    setIsEditing(true);
    setEditingId(expense.id);
    setShowDialog(true);
  };

  const handleDelete = async (id) => {
    const expenseDoc = doc(db, "users", userId, "expenses", id); // Reference to the specific expense document
    await deleteDoc(expenseDoc);
    fetchExpenses();
  };

  const handleSearch = (e) => {
    setFilter(e.target.value);
  };

  const filteredExpenses = expenses.filter((expense) =>
    expense.category.toLowerCase().includes(filter.toLowerCase())
  );

  // Function to format date using JavaScript's toLocaleString
  const formatDate = (date) => {
    return date ? date.toLocaleString() : "N/A";
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Expense Tracker
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Button variant="contained" onClick={openAddDialog}>
          Add Expense
        </Button>
        <TextField
          variant="outlined"
          placeholder="Search by Category"
          value={filter}
          onChange={handleSearch}
        />
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Comments</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.amount}</TableCell>
                <TableCell>{expense.comments}</TableCell>
                <TableCell>{formatDate(expense.createdAt)}</TableCell>
                <TableCell>{formatDate(expense.updatedAt)}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleEdit(expense)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(expense.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Adding/Editing Expenses */}
      <Dialog open={showDialog} onClose={closeDialog}>
        <DialogTitle>{isEditing ? "Edit Expense" : "Add Expense"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="category"
            label="Category"
            type="text"
            fullWidth
            value={form.category}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="amount"
            label="Amount"
            type="number"
            fullWidth
            value={form.amount}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="comments"
            label="Comments"
            type="text"
            fullWidth
            value={form.comments}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
