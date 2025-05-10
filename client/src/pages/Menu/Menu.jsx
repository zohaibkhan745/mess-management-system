import React from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';
import Navbar from '../../components/Navbar';

export default function Menu() {
    // Weekly menu data
    const menuData = [
        {
            day: 'Monday',
            breakfast: 'Paratha, Tea',
            lunch: 'Chicken Curry, Rice',
            dinner: 'Lentils, Chapati'
        },
        {
            day: 'Tuesday',
            breakfast: 'Bread, Egg, Tea',
            lunch: 'Daal, Roti',
            dinner: 'Mixed Vegetables'
        },
        {
            day: 'Wednesday',
            breakfast: 'Paratha, Yogurt, Tea',
            lunch: 'Chicken Biryani',
            dinner: 'Aloo (Potato) Curry'
        },
        {
            day: 'Thursday',
            breakfast: 'Omelet, Tea',
            lunch: 'Chana (Chickpeas), Rice',
            dinner: 'Chicken Karahi'
        },
        {
            day: 'Friday',
            breakfast: 'Bread, Jam, Tea',
            lunch: 'Vegetable Pulao',
            dinner: 'Daal, Chapati'
        },
        {
            day: 'Saturday',
            breakfast: 'Paratha, Tea',
            lunch: 'Chicken Qorma, Roti',
            dinner: 'Mix Sabzi (Vegetables)'
        },
        {
            day: 'Sunday',
            breakfast: 'Halwa Puri, Tea',
            lunch: 'Beef Curry, Rice',
            dinner: 'Chicken Handi'
        }
    ]; return (
        <div className="menu-container">
            <Navbar />

            <div className="menu-content">
                <div className="menu-card">
                    <Link to="/dashboard" className="back-button">
                        <span>←</span>
                    </Link>

                    <h1 className="card-title">Mess Menu</h1>

                    <div className="menu-table-container">
                        <table className="menu-table">
                            <thead>
                                <tr>
                                    <th>Days</th>
                                    <th>Breakfast</th>
                                    <th>Lunch</th>
                                    <th>Dinner</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menuData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.day}</td>
                                        <td>{item.breakfast}</td>
                                        <td>{item.lunch}</td>
                                        <td>{item.dinner}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}