import React, { Component } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";


export default class Barchart extends Component {
  render() {
    const foodList = this.props.intakeFood;
    const today = new Date();
    today.setDate(today.getDate() - 6);
    const weekAgo = new Date(today.toDateString());
    foodList.forEach(food => {
      food.intakeDate = new Date(food.intakeDate.toDateString());
    });
    const foodByDate = foodList.filter((food) => {
      return food.intakeDate >= weekAgo;
    }).reduce((groups, food) => {
      const dateString = food.intakeDate.toDateString();
      if (!groups[dateString]) {
        groups[dateString] = [];
      }
      groups[dateString].push(food);
      return groups;
    }, {});
    const dailyCalories = Object.getOwnPropertyNames(foodByDate).reduce((calories, date) => {
      const foods = foodByDate[date];
      const calorie = foods.reduce((total, food) => {
        return total + food.calories * food.quantity;
      }, 0);
      calories.push({
        date, calorie
      })
      return calories;
    }, []);
    dailyCalories.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    return (
      <div>
        <ResponsiveContainer width='80%' height={600}>
          <BarChart
            width={300}
            height={200}
            data={dailyCalories}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
            barSize={20}
          >
            <XAxis dataKey="date" tick={{ fontSize: 9 }} angle={-45} textAnchor="end" scale="point" padding={{ left: 10, right: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="calorie" fill="#8884d8" background={{ fill: "#eee" }} ></Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }
}
