export default function Footer() {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "15px 0",
        borderTop: "1px solid #eee",
        color: "#666",
        fontSize: "20px",
        marginTop: "40px",
      }}
    >
      © {new Date().getFullYear()}{" "}
      <strong style={{ color: "#ef2590" }}>elmus DevOps Solution</strong>
    </footer>
  );
}