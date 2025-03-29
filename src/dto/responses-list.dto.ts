export class ResponsesListDto<T> {
  result: boolean;
  data: {
    total: number;
    list: Array<T>;
  };

  constructor(list: Array<T> | null, total?: number, result = true) {
    this.result = result;
    this.data = {
      total: total ? total : list ? list.length : 0,
      list: list || [],
    };
  }
}
