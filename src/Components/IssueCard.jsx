import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import StatusWarningModal from "./StatusWarningModal";

const IssueCard = ({ issue }) => {
    const { id, title, description, priority, status, assignedTo, createdBy, createdAt } = issue;
    const [currentStatus, setCurrentStatus] = useState(status);
    const [loading, setLoading] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(false);

    // Format Date safely
    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A";
        // Firestore timestamp check
        if (timestamp.toDate) return timestamp.toDate().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
        // JS Date or string fallback
        return new Date(timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;

        // --- STATUS RULE: Prevent 'Open' -> 'Done' ---
        if (currentStatus === "Open" && newStatus === "Done") {
            setShowWarningModal(true);
            return;
        }

        setLoading(true);
        try {
            const issueRef = doc(db, "issues", id);
            await updateDoc(issueRef, { status: newStatus });
            setCurrentStatus(newStatus);
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status.");
        } finally {
            setLoading(false);
        }
    };

    // Styling helpers
    const getPriorityStyle = (p) => {
        switch (p) {
            case "High": return { bg: "#fef2f2", text: "var(--priority-high)", border: "#fecaca" };
            case "Medium": return { bg: "#fff7ed", text: "var(--priority-medium)", border: "#fed7aa" };
            case "Low": return { bg: "#f0fdf4", text: "var(--priority-low)", border: "#bbf7d0" };
            default: return { bg: "#f8fafc", text: "#64748b", border: "#e2e8f0" };
        }
    };

    const getStatusStyle = (s) => {
        switch (s) {
            case "Done": return { bg: "var(--status-done-bg)", text: "var(--status-done-text)" };
            case "In Progress": return { bg: "var(--status-progress-bg)", text: "var(--status-progress-text)" };
            default: return { bg: "var(--status-open-bg)", text: "var(--status-open-text)" };
        }
    };

    const pStyle = getPriorityStyle(priority);
    const sStyle = getStatusStyle(currentStatus);

    return (
        <div style={{
            backgroundColor: "white",
            borderRadius: "var(--radius)",
            padding: "1.5rem",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--color-border)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "default"
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <span className="badge" style={{
                    backgroundColor: sStyle.bg,
                    color: sStyle.text,
                    fontSize: "0.75rem",
                    marginBottom: "0.5rem"
                }}>
                    {currentStatus}
                </span>
                <span className="badge" style={{
                    backgroundColor: pStyle.bg,
                    color: pStyle.text,
                    border: `1px solid ${pStyle.border}`
                }}>
                    {priority}
                </span>
            </div>

            <h3 style={{ fontSize: "1.125rem", marginBottom: "0.5rem", color: "var(--color-text-main)" }}>{title}</h3>

            <p style={{
                color: "var(--color-text-muted)",
                fontSize: "0.9rem",
                flexGrow: 1,
                marginBottom: "1.5rem",
                lineHeight: "1.5"
            }}>
                {description}
            </p>

            <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--color-border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                    <span><strong>Assignee:</strong> {assignedTo}</span>
                    <span>{formatDate(createdAt)}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "1rem" }}>
                    <select
                        value={currentStatus}
                        onChange={handleStatusChange}
                        disabled={loading}
                        style={{
                            padding: "0.4rem",
                            fontSize: "0.85rem",
                            margin: 0,
                            backgroundColor: "var(--color-bg)",
                            border: "1px solid var(--color-border)"
                        }}
                    >
                        <option value="Open">Open</option>
                        <option value="In Progress">Working</option>
                        <option value="Done">Done</option>
                    </select>
                </div>
            </div>
            <StatusWarningModal
                isOpen={showWarningModal}
                onClose={() => setShowWarningModal(false)}
            />
        </div>
    );
};

export default IssueCard;
