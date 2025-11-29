import { Brackets } from "typeorm";
import { Notification, NotificationType } from "../../entity/Notification";
import { advancedResult } from "../../utils/pagination";

export interface CreateNotificationDto {
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntityId?: number;
  relatedEntityType?: string;
}

export const createNotification = async (dto: CreateNotificationDto) => {
  const notification = new Notification();
  notification.userId = dto.userId;
  notification.type = dto.type;
  notification.title = dto.title;
  notification.message = dto.message;
  notification.relatedEntityId = dto.relatedEntityId || null;
  notification.relatedEntityType = dto.relatedEntityType || null;
  notification.isRead = false;

  return await Notification.save(notification);
};

export const getNotifications = async (
  userId: number,
  page = 1,
  limit = 10,
  sortField = "createdAt",
  sortDesc = true,
  searchContent?: string,
  isRead?: boolean
) => {
  const whereCondition = new Brackets((qb) => {
    qb.where("entity.userId = :userId", { userId });
    
    if (searchContent && searchContent.length > 0) {
      qb.andWhere(
        new Brackets((subQb) => {
          subQb.where("entity.title ILIKE :searchContent", { searchContent: `%${searchContent}%` });
            // .orWhere("entity.message ILIKE :searchContent", { searchContent: `%${searchContent}%` });
        })
      );
    }
    
    if (isRead !== undefined) {
      qb.andWhere("entity.isRead = :isRead", { isRead });
    }
  });

  return await advancedResult(
    Notification,
    page,
    limit,
    sortField,
    sortDesc,
    whereCondition
  );
};

export const markNotificationsAsRead = async (notificationIds: number[], userId: number) => {
  await Notification.createQueryBuilder()
    .update(Notification)
    .set({ isRead: true })
    .where("id IN (:...ids)", { ids: notificationIds })
    .andWhere("userId = :userId", { userId })
    .execute();
};

export const getUnreadNotificationCount = async (userId: number) => {
  const count = await Notification.count({
    where: {
      userId,
      isRead: false,
    },
  });
  return count;
};

