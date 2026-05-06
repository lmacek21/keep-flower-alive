import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function FlowerDetail() {
    const { id } = useParams();
    const [flower, setFlower] = useState(null);

    useEffect(() => {
        api.get(`/flower/${id}`)
            .then(res => setFlower(res.data))
            .catch(err => console.error(err));
    }, [id]);

    if (!flower) return <p>Loading...</p>;

    return (
        <div>
            <h1>{flower.name}</h1>
            <p>{flower.description}</p>
            <p>{flower.minTemp}°C - {flower.maxTemp}°C</p>

            <button onClick={() => alert("Add flower later")}>
                Add Flower
            </button>
        </div>
    );
}

export default FlowerDetail;