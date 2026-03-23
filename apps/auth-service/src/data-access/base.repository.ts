import { EntityRepository, SelectQueryBuilder } from '@mikro-orm/postgresql';
import { BaseEntity } from './base.entity';

export const APP_DEFAULTS = {
  PAGINATION: {
    PAGE_DEFAULT: 1,
    LIMIT_DEFAULT: 10,
  },
};

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    total: number;
    pageSize: number;
    totalPages: number;
    page: number;
  };
}

export abstract class BaseRepository<
  T extends BaseEntity,
> extends EntityRepository<T> {
  async paginate(
    queryBuilder: SelectQueryBuilder<T>,
    page: number = APP_DEFAULTS.PAGINATION.PAGE_DEFAULT,
    pageSize: number = APP_DEFAULTS.PAGINATION.LIMIT_DEFAULT,
  ): Promise<PaginationResult<T>> {
    page = +page;
    pageSize = +pageSize;
    const offset = (page - 1) * pageSize;

    if (offset > 0) queryBuilder.offset(offset);
    if (pageSize > 0) queryBuilder.limit(pageSize);

    const [results, count] = await queryBuilder.getResultAndCount();

    const items = results;
    const totalItems = count;
    const totalPages = pageSize > 0 ? Math.ceil(totalItems / pageSize) : 1;

    return {
      data: items,
      pagination: {
        total: totalItems,
        pageSize,
        totalPages,
        page,
      },
    };
  }
}
