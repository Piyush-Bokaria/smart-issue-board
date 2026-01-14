import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // Navigate handled by App.jsx useEffect
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <h2 style={{ fontSize: "1.75rem", color: "var(--color-primary)" }}>Create Account</h2>
                    <p style={{ color: "var(--color-text-muted)" }}>Get started with Smart Issue Board</p>
                </div>

                <form onSubmit={handleSignup}>
                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Password</label>
                        <input
                            type="password"
                            placeholder="Choose a password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                    </div>

                    <button type="submit" style={{ width: "100%" }}>Sign Up</button>

                    <p style={{ marginTop: "1.5rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                        Already have an account? <Link to="/login" style={{ color: "var(--color-primary)" }}>Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Signup;
