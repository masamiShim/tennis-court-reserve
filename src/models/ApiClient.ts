import axios from 'axios';
import qs from "qs";

type ApiResponse = {
  code: string
  status: string
  result: any
}
/*
const EmptyResponse: ApiResponse = {
  code: '404',
  status: 'not found',
  result: []
};
*/
// POINT: fastApiの方でaxiosデフォルトの「params[]=,params[]=」で配列パラメータ受け取れなかったのでこれで
//クエリパラメータのパーサ
const paramsSerializer = (params: any) =>
  qs.stringify(params, { arrayFormat: "repeat" });

//カスタマイズしたaxiosのインスタンスを生成します
const config = {
  paramsSerializer
}
const _axios = axios.create(config);

export const get = async <T>(url: string, params: T): Promise<ApiResponse> => {
  if (params === null) {
    return await _axios.get(url)
                      .then((res) => {
                        return { code: '200', status: 'success', result: res };
                      })
                      .catch(err => {
                        console.log(err);
                        return { code: '500', status: 'error', result: [] };
                      });

  } else {
    return await _axios.get(url, { params: params })
                      .then((res) => {
                        return { code: '200', status: 'success', result: res };
                      })
                      .catch(err => {
                        console.log(err);
                        return { code: '500', status: 'error', result: [] };
                      });

  }
};
