import { fetchApi } from '../fetchApi';

export async function getNotificationsCount(userId: string) {
  try {
    const response = await fetchApi(`/api/notifications/count?userId=${userId}`);
    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error fetching notifications count:', error);
    return 0;
  }
}
