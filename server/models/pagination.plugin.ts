import { Model } from 'mongoose';

interface PaginationOptions {
  limit?: number;
  select?: any;
  sort?: any;
  page?: number,
  offset?: number
}

async function _paginate(query = {}, options: PaginationOptions= { limit: 10 }) {
  const { select, sort, limit, page, offset } = options;
  let skip = 0;
  if (options.offset) {
    skip = offset;
  } else if (page) {
    skip = (page - 1) * limit;
  } 

  const docsQuery = this.find(query).select(select).sort(sort).skip(skip).limit(limit);
  const promises = [
    docsQuery.exec(),
    this.countDocuments(query).exec()
  ];
  const [docs, total] = await Promise.all(promises);
  return {
    docs,
    total,
    offset: skip,
    limit
  };
}

const paginate = function (schema) {
  schema.statics.paginate = _paginate;
};

interface IPaginationModel extends Model<any>{
	paginate:(query, options: PaginationOptions) => Promise<any>
}
export {
  paginate,
  IPaginationModel
};