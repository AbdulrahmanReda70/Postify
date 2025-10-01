import api from "../../api/axios";

export default class NotificationService {
  async getNotifications() {
    try {
      const response = await api.get("notifications");
      return response.data;
    } catch (err) {
      const error = new Error(
        err.response?.data?.message || "Something went wrong"
      );
      error.status = err.response?.status;
      throw error;
    }
  }

  async markAsRead(id) {
    try {
      const response = await api.patch(`notifications/${id}`);
      return response.data;
    } catch (err) {
      const error = new Error(
        err.response?.data?.message || "Something went wrong"
      );
      error.status = err.response?.status;
      throw error;
    }
  }

  async unReadCount() {
    try {
      const response = await api.get(`notifications/unread-count`);
      return response.data.unreadCount;
    } catch (err) {
      const error = new Error(
        err.response?.data?.message || "Something went wrong"
      );
      error.status = err.response?.status;
      throw error;
    }
  }

  async deleteNotification(id) {
    try {
      const res = (await api.delete(`notifications/${id}`)).data;
      return res;
    } catch (err) {
      const error = new Error(
        err.response?.data?.message || "Something went wrong"
      );
      error.status = err.response?.status;
      throw error;
    }
  }
}
