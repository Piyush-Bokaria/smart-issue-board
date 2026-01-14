import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navbar = ({ user }) => {
    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <nav style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--color-border)",
            padding: "0.75rem 0",
            marginBottom: "2rem"
        }}>
            <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Link to="/" style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    color: "var(--color-primary)",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>
                    <span style={{ fontSize: "1.5rem" }}>⚡</span> Smart Issue Board
                </Link>

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
                        {user.email}
                    </span>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: "0.5rem 1rem",
                            fontSize: "0.9rem",
                            backgroundColor: "transparent",
                            color: "var(--color-text-main)",
                            border: "1px solid var(--color-border)",
                            boxShadow: "none"
                        }}
                    >
                        Logout
                    </button>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
