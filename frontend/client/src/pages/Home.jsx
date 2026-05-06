import { Link } from "react-router-dom";

function Home() {
    return (
        <div>
            <h1>Flower IoT App</h1>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to="/houses">Houses</Link>
                <Link to="/flowerList">Flowers</Link>
                <Link to="/houseDetail">House Detail</Link>
                <Link to="/roomStats">Room Stats</Link>
            </div>
        </div>
    );
}

export default Home;