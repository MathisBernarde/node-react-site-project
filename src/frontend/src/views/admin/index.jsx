import { useState, useEffect } from "react";
import UserService from "../../services/user-service";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await UserService.getAll();
      setUsers(data);
    } catch (e) {
      console.error("Erreur chargement users", e);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const previousUsers = [...users];
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));

    try {
      await UserService.update(userId, { role: newRole });
    } catch (e) {
      alert("Erreur lors du changement de rôle");
      setUsers(previousUsers);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Administration</h1>
      <p>Gérez ici les permissions des utilisateurs.</p>

      <div style={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead style={{ background: "#f3f4f6", borderBottom: "1px solid #ddd" }}>
            <tr>
              <th style={{ padding: "12px", color: "black" }}>ID</th>
              <th style={{ padding: "12px", color: "black" }}>Login</th>
              <th style={{ padding: "12px", color: "black" }}>Email</th>
              <th style={{ padding: "12px", color: "black" }}>Rôle</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>{user.id}</td>
                <td style={{ padding: "12px", fontWeight: "bold" }}>{user.login || user.username}</td>
                <td style={{ padding: "12px", color: "#666" }}>{user.email}</td>
                <td style={{ padding: "12px" }}>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    style={{
                      padding: "6px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontWeight: "bold",
                      cursor: "pointer",
                      backgroundColor: user.role === "ADMIN" ? "#fff7ed" : "#f9fafb",
                      color: user.role === "ADMIN" ? "#c2410c" : "#374151"
                    }}
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}