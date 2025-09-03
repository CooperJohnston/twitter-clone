export class DataPage<T> {

    values: T[];
    hasMore: boolean;

    constructor(values: T[], hasMore: boolean) {
        this.values = values;
        this.hasMore = hasMore;
    }
  
}