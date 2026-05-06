import { Link, useLocation } from "react-router-dom";

const linkStyle = (active) => ({
    padding: "6px 10px",
    borderRadius: 6,
    textDecoration: "none",
    border: "1px solid #ddd",
    background: active ? "#f2f7ff" : "#fff",
    color: "#111"
});

export default function NavBar() {
    const location = useLocation();

    return (
        <div
            style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
                padding: "10px 0",
                marginBottom: 16,
                borderBottom: "1px solid #eee"
            }}
        >
            <Link to="/houses" style={linkStyle(location.pathname === "/" || location.pathname === "/houses")}>
                Houses
            </Link>
            <Link
                to="/flowerList"
                style={linkStyle(location.pathname === "/flowerList" || location.pathname === "/flowers")}
            >
                Flowers
            </Link>
            <Link to="/roomStats" style={linkStyle(location.pathname === "/roomStats")}>
                Room Stats
            </Link>
        </div>
    );
}
