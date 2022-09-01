import { translateParamsToQuery } from './helpers/paramsEncoder';
import { sign } from './signature';

export const generateFetcher =
  ({
    fetcher,
    secret,
    algorithm = 'sha512',
    headerName = 'X-Signature',
  }: {
    fetcher: (entry: any, init?: any) => any;
    secret: string;
    algorithm?: string;
    headerName?: string;
  }) =>
  (entry: string, params: any = {}, init?: any) => {
    if (!init) init = {};
    const headers: { [key: string]: string } = { ...init.headers };
    const path = entry.replace(/^(.*\/\/)?[^\/]+/, '');

    params.expiry ||= Math.round(Number(new Date()) / 1000) + 90;

    headers[headerName] = sign({
      secret,
      algorithm,
      params: params,
      verb: init.method?.toLocaleUpperCase() || 'GET',
      path,
    });

    headers['Accept'] ||= 'application/json';

    if (init.method && init.method.toLocaleUpperCase() !== 'GET') {
      headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(params);
    } else {
      entry = `${entry}${translateParamsToQuery(params)}`;
    }

    init.headers = headers;

    return fetcher(entry, init);
  };
