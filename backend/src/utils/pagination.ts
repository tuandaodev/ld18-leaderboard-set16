import {
  Brackets,
  EntityTarget
} from "typeorm";
import { AppDataSource } from "../data-source";
export type PageableRequest = {
  page: number;
  limit: number;
};
export type Pageable = {
  total: number;
  page: number;
  pageSize: number;
  result: any[];
  hasNext: boolean;
};
export const advancedResult = async (
  model: EntityTarget<any>,
  _page: number,
  _limit: number,
  _sortField: string = "createdAt",
  _sortDesc: boolean = false,
  whereClause?: Brackets,
  allowSortField: string[] = ["id", "createdAt"]
): Promise<Pageable> => {

  if (!allowSortField.includes(_sortField)) {
    _sortField = "createdAt";
  }

  // Pagination
  const page = _page || 1;
  const limit = _limit || 15;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const [data, total] = await AppDataSource.getRepository(model)
    .createQueryBuilder("entity")
    .offset(startIndex)
    .where(
      whereClause ??
        new Brackets((qb) => {
          qb.where("1 = 1");
        })
    )
    .orderBy("entity." + _sortField, _sortDesc ? "DESC" : "ASC")
    .limit(limit)
    .getManyAndCount();

  return {
    total: total,
    page: page,
    pageSize: limit,
    result: data,
    hasNext: endIndex < total,
  };
};

export const advancedResultWithRelation = async (
  model: EntityTarget<any>,
  _page: number,
  _limit: number,
  _sortField: string = "createdAt",
  _sortDesc: boolean = false,
  whereClause?: Brackets,
  relations: string[] = [],
  allowSortField: string[] = ["id", "createdAt"]
): Promise<Pageable> => {
  if (!allowSortField.includes(_sortField)) {
    _sortField = "createdAt";
  }
  // Pagination
  const page = _page || 1;
  const limit = _limit || 15;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const queryBuilder = AppDataSource.getRepository(model)
    .createQueryBuilder("entity")
    .offset(startIndex)
    .where(
      whereClause ?? new Brackets((qb) => {
        qb.where("1 = 1");
      })
    )
    .orderBy("entity." + _sortField, _sortDesc ? "DESC" : "ASC")
    .limit(limit);

  // Add relationships to the query
  relations.forEach(relation => {
    queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
  });

  const [data, total] = await queryBuilder.getManyAndCount();

  return {
    total: total,
    page: page,
    pageSize: limit,
    result: data,
    hasNext: endIndex < total,
  };
};