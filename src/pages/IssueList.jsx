import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import IssueCard from "../Components/IssueCard";
import { Link } from "react-router-dom";

function IssueList() {
    const [issues, setIssues] = useState([]);
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, "issues"),
            orderBy("createdAt", "desc")
        );

        // Real-time listener
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setIssues(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching issues:", error);
            setLoading(false);
        });

        // Cleanup on unmount
        return () => unsubscribe();
    }, []);

    const filteredIssues = issues.filter((issue) => {
        const priorityMatch = priorityFilter === "All" || issue.priority === priorityFilter;
        return priorityMatch;
    });

    const columns = {
        Open: filteredIssues.filter(i => i.status === "Open"),
        "In Progress": filteredIssues.filter(i => i.status === "In Progress"),
        Done: filteredIssues.filter(i => i.status === "Done")
    };

    const getColumnColor = (status) => {
        switch (status) {
            case "Open": return "var(--status-open-text)";
            case "In Progress": return "var(--status-progress-text)";
            case "Done": return "var(--status-done-text)";
            default: return "var(--color-primary)";
        }
    };

    const getColumnBg = (status) => {
        switch (status) {
            case "Open": return "var(--status-open-bg)";
            case "In Progress": return "var(--status-progress-bg)";
            case "Done": return "var(--status-done-bg)";
            default: return "var(--color-bg)";
        }
    };

    return (
        <div className="container" style={{ paddingBottom: "4rem", maxWidth: "1400px" }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem",
                flexWrap: "wrap",
                gap: "1rem"
            }}>
                <h2 style={{ margin: 0, fontSize: "2rem", color: "var(--color-primary)" }}>Issue Board</h2>

                {/* Actions & Filters */}
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <Link to="/create">
                        <button style={{
                            fontSize: "0.9rem",
                            padding: "0.6rem 1.2rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                        }}>
                            <span>+</span> New Issue
                        </button>
                    </Link>

                    <div style={{ width: "1px", height: "24px", backgroundColor: "var(--color-border)" }}></div>

                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        style={{ width: "auto", margin: 0, minWidth: "140px" }}
                    >
                        <option value="All">All Priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "4rem", color: "var(--color-text-muted)" }}>
                    <p>Loading board...</p>
                </div>
            ) : (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                    gap: "1.5rem",
                    alignItems: "start"
                }}>
                    {Object.entries(columns).map(([status, columnIssues]) => (
                        <div key={status} style={{
                            backgroundColor: "var(--color-bg)",
                            borderRadius: "var(--radius)",
                            padding: "1rem",
                            border: "1px solid var(--color-border)",
                            minHeight: "200px"
                        }}>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "1rem",
                                paddingBottom: "0.5rem",
                                borderBottom: `2px solid ${getColumnColor(status)}`
                            }}>
                                <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--color-text-main)" }}>{status}</h3>
                                <span style={{
                                    backgroundColor: getColumnBg(status),
                                    color: getColumnColor(status),
                                    padding: "2px 8px",
                                    borderRadius: "12px",
                                    fontSize: "0.85rem",
                                    fontWeight: "600"
                                }}>
                                    {columnIssues.length}
                                </span>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {columnIssues.map((issue) => (
                                    <IssueCard key={issue.id} issue={issue} />
                                ))}
                                {columnIssues.length === 0 && (
                                    <div style={{
                                        textAlign: "center",
                                        padding: "2rem 1rem",
                                        color: "var(--color-text-muted)",
                                        fontSize: "0.9rem",
                                        fontStyle: "italic",
                                        border: "1px dashed var(--color-border)",
                                        borderRadius: "var(--radius)"
                                    }}>
                                        No items
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default IssueList;
