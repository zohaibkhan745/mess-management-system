import React, { useState, useEffect } from "react";
import ReceptionistLayout from "../../components/receptionist/ReceptionistLayout";
import "./ManageMeals.css";

export default function ManageMeals() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [breakfast, setBreakfast] = useState("");
  const [lunch, setLunch] = useState("");
  const [dinner, setDinner] = useState("");
  const [meals, setMeals] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch all meals from the database
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:4000/api/meals");

        if (!response.ok) {
          throw new Error("Failed to fetch meals data");
        }

        const data = await response.json();

        // Convert array to object for easier access
        const mealsObject = {};
        data.forEach((meal) => {
          mealsObject[meal.day] = {
            breakfast: meal.breakfast,
            lunch: meal.lunch,
            dinner: meal.dinner,
          };
        });

        setMeals(mealsObject);

        // Set initial values for selected day
        if (mealsObject[selectedDay]) {
          setBreakfast(mealsObject[selectedDay].breakfast);
          setLunch(mealsObject[selectedDay].lunch);
          setDinner(mealsObject[selectedDay].dinner);
        }
      } catch (err) {
        console.error("Error fetching meals:", err);
        setError("Failed to load meals data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const handleDayChange = (e) => {
    const day = e.target.value;
    setSelectedDay(day);

    if (meals[day]) {
      setBreakfast(meals[day].breakfast);
      setLunch(meals[day].lunch);
      setDinner(meals[day].dinner);
    }
  };

  const handleSaveMenu = async () => {
    if (!breakfast || !lunch || !dinner) {
      setError("All meal fields are required");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch(
        `http://localhost:4000/api/meals/${selectedDay}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ breakfast, lunch, dinner }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update meal");
      }

      const data = await response.json();

      // Update local state
      setMeals((prev) => ({
        ...prev,
        [selectedDay]: {
          breakfast,
          lunch,
          dinner,
        },
      }));

      setSuccessMessage(
        `Menu for ${selectedDay} has been updated successfully!`
      );

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error saving meal:", err);
      setError(err.message || "Failed to save menu. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (meals[selectedDay]) {
      setBreakfast(meals[selectedDay].breakfast);
      setLunch(meals[selectedDay].lunch);
      setDinner(meals[selectedDay].dinner);
    }
  };

  return (
    <ReceptionistLayout activeTab="meals">
      <h1 className="page-title">Manage Weekly Menu</h1>

      {loading ? (
        <div className="loading-indicator">Loading meals data...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          <div className="meal-management-container">
            <div className="meal-filters">
              <div className="day-selector">
                <label htmlFor="daySelect">Select Day:</label>
                <select
                  id="daySelect"
                  value={selectedDay}
                  onChange={handleDayChange}
                >
                  {Object.keys(meals).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="meal-editor">
              <div className="meal-card">
                <div className="meal-header">
                  <h3>Breakfast</h3>
                  <span className="meal-time">7:30 AM - 9:30 AM</span>
                </div>
                <textarea
                  value={breakfast}
                  onChange={(e) => setBreakfast(e.target.value)}
                  placeholder="Enter breakfast menu items"
                ></textarea>
              </div>

              <div className="meal-card">
                <div className="meal-header">
                  <h3>Lunch</h3>
                  <span className="meal-time">12:30 PM - 2:30 PM</span>
                </div>
                <textarea
                  value={lunch}
                  onChange={(e) => setLunch(e.target.value)}
                  placeholder="Enter lunch menu items"
                ></textarea>
              </div>

              <div className="meal-card">
                <div className="meal-header">
                  <h3>Dinner</h3>
                  <span className="meal-time">7:30 PM - 9:30 PM</span>
                </div>
                <textarea
                  value={dinner}
                  onChange={(e) => setDinner(e.target.value)}
                  placeholder="Enter dinner menu items"
                ></textarea>
              </div>
            </div>

            <div className="form-actions">
              <button
                className="btn primary"
                onClick={handleSaveMenu}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Menu"}
              </button>
              <button className="btn secondary" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        </>
      )}
    </ReceptionistLayout>
  );
}
