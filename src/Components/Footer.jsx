import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            textAlign: "center",
            padding: "2rem 0",
            marginTop: "3rem",
            color: "var(--color-text-muted)",
            fontSize: "0.9rem",
            borderTop: "1px solid var(--color-border)",
            backgroundColor: "white",
            width: "100%",
            position: "fixed",
            bottom: "0"
        }}>
            <p style={{ margin: 0 }}>
                &copy; {new Date().getFullYear()} Smart Issue Board. Created by <strong>Piyush Bokaria</strong>.
            </p>
        </footer>
    );
};

export default Footer;
