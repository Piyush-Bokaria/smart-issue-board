import { useEffect, useState } from "react";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

function CreateIssue() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Low");
    const [assignedTo, setAssignedTo] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [similarIssues, setSimilarIssues] = useState([]);
    const navigate = useNavigate();

    // --- SIMILAR ISSUE CHECK ---
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (title.trim().length < 3) {
                setSimilarIssues([]);
                return;
            }

            try {
                const snapshot = await getDocs(collection(db, "issues"));
                const matches = [];

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    if (
                        data.title.toLowerCase().includes(title.toLowerCase()) ||
                        title.toLowerCase().includes(data.title.toLowerCase())
                    ) {
                        matches.push({ id: doc.id, ...data });
                    }
                });

                setSimilarIssues(matches);
            } catch (err) {
                console.error("Error checking similar issues:", err);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [title]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(assignedTo)) {
            alert("Please enter a valid email address for 'Assigned To'");
            return;
        }

        setIsSubmitting(true);

        try {
            await addDoc(collection(db, "issues"), {
                title,
                description,
                priority,
                status: "Open",
                assignedTo,
                createdBy: auth.currentUser.email,
                createdAt: serverTimestamp(),
            });

            // Using simple alert as requested, but could be improved with toast
            alert("Issue created successfully");
            navigate("/");
        } catch (error) {
            console.error(error);
            alert("Error creating issue");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container">
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ marginBottom: "2rem" }}>
                    <h2 style={{ fontSize: "2rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>Create New Issue</h2>
                    <p style={{ color: "var(--color-text-muted)" }}>Fill in the details below to track a new bug or feature.</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: similarIssues.length > 0 ? "1.5fr 1fr" : "1fr", gap: "2rem", alignItems: "start" }}>

                    {/* Create Form */}
                    <div className="card">
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: "1.5rem" }}>
                                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Title</label>
                                <input
                                    placeholder="e.g. Login page crash on Safari"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    style={{ fontSize: "1.1rem" }}
                                />
                            </div>

                            <div style={{ marginBottom: "1.5rem" }}>
                                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Description</label>
                                <textarea
                                    placeholder="Describe the issue in detail..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    rows={5}
                                    style={{ resize: "vertical" }}
                                />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
                                <div>
                                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Priority</label>
                                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Assigned To</label>
                                    <input
                                        type="email"
                                        placeholder="email@example.com"
                                        value={assignedTo}
                                        onChange={(e) => setAssignedTo(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                                <button
                                    type="button"
                                    onClick={() => navigate("/")}
                                    style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text-main)", boxShadow: "none" }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Creating..." : "Create Issue"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Similar Issue Suggestion Panel - improved visual */}
                    {similarIssues.length > 0 && (
                        <div style={{
                            position: "sticky",
                            top: "100px",
                            backgroundColor: "#fffbeb",
                            border: "1px solid #fcd34d",
                            borderRadius: "var(--radius)",
                            padding: "1.5rem",
                            animation: "fadeIn 0.3s ease-in-out" // Assuming keyframes or just standard render
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", color: "#b45309" }}>
                                <span style={{ fontSize: "1.25rem" }}>⚠️</span>
                                <h4 style={{ margin: 0, fontSize: "1rem" }}>Similar Issues Detected</h4>
                            </div>

                            <p style={{ fontSize: "0.9rem", color: "#92400e", marginBottom: "1rem" }}>
                                Before creating this, check if one of these existing issues matches yours:
                            </p>

                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {similarIssues.map((issue) => (
                                    <li key={issue.id} style={{
                                        backgroundColor: "white",
                                        padding: "0.75rem",
                                        borderRadius: "0.5rem",
                                        marginBottom: "0.5rem",
                                        border: "1px solid #fde68a",
                                        fontSize: "0.9rem"
                                    }}>
                                        <div style={{ fontWeight: "600", color: "#1e293b" }}>{issue.title}</div>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem", fontSize: "0.8rem", color: "#64748b" }}>
                                            <span>{issue.status}</span>
                                            <span>{issue.priority}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CreateIssue;
