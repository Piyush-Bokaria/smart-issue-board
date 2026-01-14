import React from 'react';

const StatusWarningModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            backdropFilter: "blur(2px)"
        }}>
            <div style={{
                backgroundColor: "white",
                padding: "2rem",
                borderRadius: "var(--radius)",
                maxWidth: "400px",
                width: "90%",
                boxShadow: "var(--shadow-lg)",
                textAlign: "center",
                border: "1px solid var(--color-border)"
            }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚫</div>
                <h3 style={{ margin: "0 0 1rem 0", color: "var(--color-text-main)" }}>Action Not Allowed</h3>
                <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>
                    You cannot move an issue directly from <strong>Open</strong> to <strong>Done</strong>.
                    <br /><br />
                    Please move it to <strong>In Progress</strong> first.
                </p>
                <button
                    onClick={onClose}
                    style={{
                        width: "100%",
                        backgroundColor: "var(--color-primary)",
                        color: "white"
                    }}
                >
                    Understood
                </button>
            </div>
        </div>
    );
};

export default StatusWarningModal;
