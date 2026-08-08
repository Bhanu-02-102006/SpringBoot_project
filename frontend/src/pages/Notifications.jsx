import { useEffect, useState } from "react";
import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from "../services/employeeService";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    setLoading(true);
    setError("");
    getMyNotifications()
      .then((res) => {
        setNotifications(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to load notifications.");
        setLoading(false);
      });
  };

  const handleMarkRead = (id) => {
    markNotificationRead(id)
      .then(() => {
        // Toggle read locally
        setNotifications(
          notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      })
      .catch((err) => console.log(err));
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead()
      .then(() => {
        setNotifications(
          notifications.map((n) => ({ ...n, read: true }))
        );
        setSuccess("All notifications marked as read.");
      })
      .catch((err) => console.log(err));
  };

  const formatTimestamp = (tsStr) => {
    if (!tsStr) return "";
    try {
      const d = new Date(tsStr);
      return d.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return tsStr;
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0">
          <i className="bi bi-bell text-primary me-2"></i> Notifications
        </h2>
        {notifications.some((n) => !n.read) && (
          <button className="btn btn-outline-primary btn-sm fw-bold" onClick={handleMarkAllRead}>
            Mark All as Read
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card shadow-sm border-0 bg-white">
        <div className="list-group list-group-flush">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`list-group-item p-3 d-flex justify-content-between align-items-center transition-all ${
                item.read ? "bg-white" : "bg-light border-start border-primary border-3"
              }`}
              style={{ cursor: item.read ? "default" : "pointer" }}
              onClick={() => !item.read && handleMarkRead(item.id)}
            >
              <div className="me-3">
                <p className={`mb-1 ${item.read ? "text-muted" : "fw-bold text-dark"}`}>
                  {item.message}
                </p>
                <small className="text-muted text-xs">
                  <i className="bi bi-clock me-1"></i> {formatTimestamp(item.timestamp)}
                </small>
              </div>
              {!item.read && (
                <span className="badge rounded-pill bg-primary p-2">
                  New
                </span>
              )}
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="p-5 text-center text-muted">
              <i className="bi bi-bell-slash fs-1 mb-3 text-secondary d-block"></i>
              You have no notifications.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
