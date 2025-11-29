import { Brackets } from "typeorm";
import { AdminLog } from "../../entity/AdminLog";
import { User } from "../../entity/User";
import { advancedResult } from "../../utils/pagination";
import { LogDto } from "./log.dto";

export const findAdminLog = async (id: number) => {
  let adminLog = await AdminLog.findOneByOrFail({
    id: id,
  });

  return adminLog;
};

export const findAllAdminLog = async (
  page = 1,
  limit = 15,
  sortField = "id",
  sortDesc = false,
  adminId: number
) => {
  if (adminId && !isNaN(adminId)) {
    await User.findOneByOrFail({
      id: adminId,
    });
  }
  let adminLogs = await advancedResult(
    AdminLog,
    page,
    limit,
    "createdAt",
    sortDesc,
    isNaN(adminId)
      ? undefined
      : new Brackets((qb) => {
          qb.where("entity.adminId = :adminId", { adminId: adminId });
        })
  );

  return adminLogs;
};

export const createAdminLog = async (logDto: LogDto) => {
  let { adminId, action } = logDto;

  const admin = await User.findOneByOrFail({
    id: adminId,
  });

  let adminLog = new AdminLog();
  adminLog.adminId = admin.id;
  adminLog.action = action;

  return await AdminLog.save(adminLog);
};

export const createSystemLog = async (message: string) => {
  try {
    let adminLog = new AdminLog();
    adminLog.adminId = -1;
    // trim message to max value of varchar in postgres
    if (message.length > 10000000) {
      message = message.substring(0, 10000000);
    }
    adminLog.action = message;
    return await AdminLog.save(adminLog);
  } catch (error) {
    console.error('error while creating system log');
  }
};

export const createBackupLog = async (message: string) => {
  try {
    let adminLog = new AdminLog();
    adminLog.adminId = -99;
    adminLog.action = message;
    return await AdminLog.save(adminLog);
  } catch (error) {
    console.error('error while creating system log');
  }
};

export const deleteAdminLog = async (id: number) => {
  const adminLog = await AdminLog.findOneByOrFail({ id: id });
  await AdminLog.delete(adminLog.id);
};
