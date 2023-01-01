import { db } from "./fbconfig";
import { collection, addDoc, updateDoc, getDocs, deleteDoc, doc, query } from "firebase/firestore";

async function addFood(uid, { foodId, name, calories, photo, quantity, intakeDate }) {
    const newFood = await addDoc(collection(db, uid + "foods"), {
        foodId, name, calories, photo, quantity, intakeDate
    });
    return { id: newFood.id, foodId, name, calories, photo, quantity, intakeDate };
}

async function updateFood(uid, id, quantity) {
    await updateDoc(doc(db, uid + "foods", id), {
        "quantity": quantity
    });
}

async function getFood(uid) {
    const q = query(collection(db, uid + "foods"));
    const foods = await getDocs(q);
    return foods.docs.map(food => {
        const data = food.data();
        data.intakeDate = data.intakeDate.toDate();
        data.id = food.id;
        return data;
    })
}

async function deleteFood(uid, id) {
    await deleteDoc(doc(db, uid + "foods", id));
}

export {
    addFood,
    getFood,
    deleteFood,
    updateFood
}