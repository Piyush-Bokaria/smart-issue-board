import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Navigate handled by App.jsx useEffect
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <h2 style={{ fontSize: "1.75rem", color: "var(--color-primary)" }}>Welcome Back</h2>
                    <p style={{ color: "var(--color-text-muted)" }}>Sign in to continue</p>
                </div>

                <form onSubmit={handleLogin}>
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
                            placeholder="Enter your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" style={{ width: "100%" }}>Login</button>

                    <p style={{ marginTop: "1.5rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                        Don't have an account? <Link to="/signup" style={{ color: "var(--color-primary)" }}>Sign up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
